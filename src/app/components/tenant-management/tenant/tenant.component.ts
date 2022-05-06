import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChildren
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, merge, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { GenericValidator } from 'src/app/shared/validators/genaric-validator';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
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
  validationErrors$: Observable<any>;
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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.genericValidator = new GenericValidator();
    this.tenantForm = this.fb.group({
      id: [''],
      tenantId: ['', [Validators.required, Validators.maxLength(100)]],
      tenantName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
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
        database: ['', [Validators.required, Validators.maxLength(100)]],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        host: ['', [Validators.required, Validators.maxLength(100)]],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        database: ['', [Validators.required, Validators.maxLength(100)]]
      }),
      noOfLicenses: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      products: [[], [Validators.required]],
      modules: [[], [Validators.required]],
      logDBType: ['', [Validators.required]],
      logLevel: ['', [Validators.required]]
    });

    this.commonService.setHeaderTitle(
      this.tenantForm.get('tenantName').value
        ? this.tenantForm.get('tenantName').value
        : `Addding Tenant...`
    );

    this.tenantForm.get('tenantName').valueChanges.subscribe((tenantName) => {
      this.breadcrumbService.set('@tenantName', { label: tenantName });
      this.commonService.setHeaderTitle(tenantName);
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
      tap(console.log),
      shareReplay(1)
    );
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
      urls: this.fb.array([
        new FormControl('', [Validators.required, Validators.maxLength(100)])
      ])
    });
  }

  addUrl(type: string): void {
    if (type === 'sap') {
      this.sapUrls.push(
        new FormControl('', [Validators.required, Validators.maxLength(100)])
      );
    } else {
      this.nodeUrls.push(
        new FormControl('', [Validators.required, Validators.maxLength(100)])
      );
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

  buttonActionsInHeader(noOfSteps) {
    this.selectedID.setValue(0);
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

  buttonActionsInSteps(index, noOfSteps) {
    this.selectedID.setValue(index);
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

  onTabsChange(index: number, noOfSteps) {
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

  get f() {
    return this.tenantForm.controls;
  }

  saveTenant() {
    console.log(this.tenantForm);
    if (this.tenantForm.valid && this.tenantForm.dirty) {
      console.log(this.tenantForm.value);
      const { id, ...tenat } = this.tenantForm.value;
      this.spinner.show();

      if (id) {
      } else {
        this.tenantService.createTenant$(tenat).subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            const { id: createdId, tenantName } = response;
            this.tenantForm.controls.id.setValue(createdId);
            this.toast.show({
              text: `Tenant ${tenantName} successfully`,
              type: 'success'
            });
          }
        });
      }
    }
  }
}
