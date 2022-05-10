import { TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay
} from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit, AfterViewInit {
  @ViewChild('inputClientSecret') inputClientSecret: ElementRef;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  hidePasswordDBMS = true;
  hidePasswordNoSQL = true;
  hidePasswordERPS = true;
  firstButton = true;
  lastButton = false;
  selectedID = new FormControl(0);
  noOfTabs = 5;
  tenantForm: FormGroup;
  products = ['MWORKORDER', 'MINVENTORY'];
  modules = [
    'Dashboard',
    'Tenant Management',
    'Maintenance Control Center',
    'Spare Parts Control Center',
    'User Management',
    'Work Instructions Authoring'
  ];
  idps = ['azure'];
  dialects = ['mysql'];
  logDbTypes = ['rdbms', 'nosql'];
  logLevels = ['off', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'];
  validationErrors$: Observable<{
    [key: string]:
      | { name: string; length: number }
      | { [key: string]: { name: string; length: number } }
      | any;
  }>;
  tenantHeader = 'Adding Tenant...';
  encryptionKey = 'Innovation@5';
  editTenant = true;
  editQueryParam = true;
  private genericValidator: GenericValidator;

  get sapUrls(): FormArray {
    return this.tenantForm.get('protectedResources.sap.urls') as FormArray;
  }

  get nodeUrls(): FormArray {
    return this.tenantForm.get('protectedResources.node.urls') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private tenantService: TenantService,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
    private titleCase: TitleCasePipe,
    private route: ActivatedRoute,
    private cdrf: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.genericValidator = new GenericValidator();
    this.tenantForm = this.fb.group({
      id: [''],
      tenantId: [
        '',
        [Validators.required, Validators.maxLength(100)],
        this.validateUnique.bind(this)('tenantId')
      ],
      tenantName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ],
        this.validateUnique.bind(this)('tenantName')
      ],
      tenantIdp: ['', [Validators.required]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      authority: ['', [Validators.required, Validators.maxLength(255)]],
      redirectUri: ['', [Validators.required, Validators.maxLength(100)]],
      tenantDomainName: ['', [Validators.required, Validators.maxLength(100)]],
      tenantAdmin: this.fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],
        email: [
          '',
          [Validators.required, Validators.maxLength(100), Validators.email]
        ]
      }),
      erps: this.fb.group({
        sap: this.buildErps()
      }),
      protectedResources: this.fb.group({
        sap: this.buildProtectedResources(),
        node: this.buildProtectedResources()
      }),
      rdbms: this.fb.group({
        host: ['', [Validators.required, Validators.maxLength(100)]],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        database: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(100)]
        ],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        host: ['', [Validators.required, Validators.maxLength(100)]],
        port: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        user: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        database: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(100)]
        ]
      }),
      noOfLicenses: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
          Validators.max(100000)
        ]
      ],
      products: [[], [Validators.required]],
      modules: [[], [Validators.required]],
      logDBType: ['', [Validators.required]],
      logLevel: ['', [Validators.required]]
    });

    const headerTitle = this.tenantForm.get('tenantName').value
      ? this.tenantForm.get('tenantName').value
      : `Addding Tenant...`;
    this.commonService.setHeaderTitle(headerTitle);
    this.breadcrumbService.set('@tenantName', {
      label: headerTitle
    });

    this.tenantForm.get('tenantName').valueChanges.subscribe((tenantName) => {
      const displayName = tenantName ? tenantName : 'Addding Tenant...';
      this.tenantHeader = displayName;
      this.breadcrumbService.set('@tenantName', { label: displayName });
      this.commonService.setHeaderTitle(displayName);
      const database = this.titleCase.transform(tenantName).replace(/\s+/g, '');
      this.tenantForm.patchValue({
        rdbms: { database },
        nosql: { database }
      });
    });

    this.route.data.subscribe(({ tenant }) => {
      if (tenant && Object.keys(tenant).length) {
        const { sap, node } = tenant.protectedResources;
        const { urls: sapUrls } = sap;
        const { urls: nodeUrls } = node;

        tenant.rdbms.password = this.commonService.decrypt(
          tenant.rdbms.password,
          this.encryptionKey
        );
        tenant.nosql.password = this.commonService.decrypt(
          tenant.nosql.password,
          this.encryptionKey
        );
        tenant.erps.sap.password = this.commonService.decrypt(
          tenant.erps.sap.password,
          this.encryptionKey
        );
        tenant.erps.sap.saml.clientSecret = this.commonService.decrypt(
          tenant.erps.sap.saml.clientSecret,
          this.encryptionKey
        );

        this.tenantForm.patchValue(tenant);
        (this.tenantForm.get('protectedResources.sap') as FormGroup).setControl(
          'urls',
          this.fb.array(sapUrls)
        );
        (
          this.tenantForm.get('protectedResources.node') as FormGroup
        ).setControl('urls', this.fb.array(nodeUrls));
        this.tenantForm.get('tenantId').disable();
        this.tenantForm.get('tenantName').disable();
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        this.editTenant =
          params.edit === 'true' || params.edit === 'false'
            ? JSON.parse(params.edit)
            : params.edit;
        this.editQueryParam = this.editTenant;
        this.cdrf.markForCheck();
        if (!this.editTenant) {
          this.tenantForm.disable();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    this.validationErrors$ = merge(
      this.tenantForm.valueChanges,
      ...controlBlurs
    ).pipe(
      map(() => this.genericValidator.processValidations(this.tenantForm)),
      shareReplay(1)
    );
    this.maskClientSecret();
  }

  buildErps(): FormGroup {
    return this.fb.group({
      baseUrl: ['', [Validators.required, Validators.maxLength(255)]],
      oauth2Url: ['', [Validators.required, Validators.maxLength(255)]],
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      grantType: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      scope: ['', [Validators.required, Validators.maxLength(100)]],
      saml: this.fb.group({
        oauth2Url: ['', [Validators.required, Validators.maxLength(255)]],
        grantType: ['', [Validators.required, Validators.maxLength(100)]],
        clientSecret: ['', [Validators.required, Validators.maxLength(100)]],
        resource: ['', [Validators.required, Validators.maxLength(100)]],
        tokenUse: ['', [Validators.required, Validators.maxLength(100)]],
        tokenType: ['', [Validators.required, Validators.maxLength(100)]]
      })
    });
  }

  buildProtectedResources(): FormGroup {
    return this.fb.group({
      identityMetadata: ['', [Validators.required, Validators.maxLength(255)]],
      issuer: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: ['', [Validators.required, Validators.maxLength(100)]],
      audience: ['', [Validators.required, Validators.maxLength(100)]],
      scope: ['', [Validators.required, Validators.maxLength(100)]],
      urls: this.fb.array([this.initUrl()])
    });
  }

  initUrl = () =>
    this.fb.control('', [Validators.required, Validators.maxLength(100)]);

  addUrl(type: string): void {
    if (type === 'sap') {
      this.sapUrls.push(this.initUrl());
    } else {
      this.nodeUrls.push(this.initUrl());
    }
  }

  deleteUrl(index: number, type: string): void {
    if (type === 'sap') {
      this.sapUrls.removeAt(index);
      this.sapUrls.markAsDirty();
    } else {
      this.nodeUrls.removeAt(index);
      this.nodeUrls.markAsDirty();
    }
  }

  setTabIndex(index: number) {
    this.selectedID.setValue(index);
  }

  onTabsChange(noOfSteps: number) {
    if (this.selectedID.value === 0) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  moveNext(selectedID) {
    this.selectedID.setValue(selectedID.value + 1);
  }

  saveTenant() {
    if (this.tenantForm.valid && this.tenantForm.dirty) {
      const { id, ...tenant } = this.tenantForm.getRawValue();
      this.spinner.show();

      if (id) {
        const { tenantId, tenantName, rdbms, nosql, ...rest } = tenant;
        const { database: rdbmsDatabase, ...restRdbms } = rdbms;
        const { database: nosqlDatabase, ...restNosql } = nosql;
        this.tenantService
          .updateTenant$(id, { ...rest, rdbms: restRdbms, nosql: restNosql })
          .subscribe((response) => {
            this.spinner.hide();
            if (Object.keys(response).length) {
              this.tenantForm.reset(this.tenantForm.getRawValue());
              this.toast.show({
                text: `Tenant '${tenantName}' updated successfully`,
                type: 'success'
              });
            }
          });
      } else {
        this.tenantService.createTenant$(tenant).subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            const { id: createdId, tenantName } = response;
            this.tenantForm.patchValue({ id: createdId });
            this.tenantForm.reset(this.tenantForm.getRawValue());
            this.toast.show({
              text: `Tenant '${tenantName}' onboarded successfully`,
              type: 'success'
            });
          }
        });
      }
    }
  }

  getTenantsCount = (key: string, value: string) =>
    this.tenantService.getTenantsCount$({
      [key]: value
    });

  validateUnique(field: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.getTenantsCount(field, control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((tenants) => {
          if (tenants.count) {
            return { exists: true };
          }
          return null;
        })
      );
  }

  maskClientSecret() {
    const maskedValue = this.tenantForm.get('erps.sap.saml.clientSecret').value;
    if (maskedValue.length > 3) {
      const data =
        maskedValue.substr(0, 3) + 'X'.repeat(maskedValue.length - 3);
      this.inputClientSecret.nativeElement.value = data;
    }
  }

  unMaskClientSecret() {
    this.inputClientSecret.nativeElement.value = this.tenantForm.get(
      'erps.sap.saml.clientSecret'
    ).value;
  }

  cancel() {
    if (this.editQueryParam) {
      this.router.navigate(['/tenant-management']);
    } else {
      this.tenantForm.disable();
      this.editTenant = false;
    }
  }

  editTenantForm() {
    this.tenantForm.enable();
    this.editTenant = true;
    this.tenantForm.get('tenantId').disable();
    this.tenantForm.get('tenantName').disable();
    this.tenantForm.get('rdbms.database').disable();
    this.tenantForm.get('nosql.database').disable();
  }
}
