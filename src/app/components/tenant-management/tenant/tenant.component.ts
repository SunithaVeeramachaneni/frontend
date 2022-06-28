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
  ValidatorFn,
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
import { permissions } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantService } from '../services/tenant.service';

declare const ENCRYPTION_KEY: string;
const regUrl =
  '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';

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
  encryptionKey = ENCRYPTION_KEY;
  editTenant = true;
  editQueryParam = true;
  readonly permissions = permissions;
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
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ],
        this.validateUnique('tenantId')
      ],
      tenantName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ],
        this.validateUnique('tenantName')
      ],
      tenantIdp: ['', [Validators.required]],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      authority: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      redirectUri: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      tenantDomainName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ],
        this.validateUnique('tenantDomainName')
      ],
      tenantAdmin: this.fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.email,
            WhiteSpaceValidator.noWhiteSpace
          ]
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
        host: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        database: [{ value: '', disabled: true }],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        host: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        port: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        user: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        database: [{ value: '', disabled: true }]
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
      const displayName = tenantName.trim() ? tenantName : 'Addding Tenant...';
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
        tenant.erps.sap.scope = JSON.stringify(
          tenant.erps.sap.scope,
          null,
          ' '
        );

        this.tenantForm.patchValue(tenant);
        (this.tenantForm.get('protectedResources.sap') as FormGroup).setControl(
          'urls',
          this.fb.array(this.setUrls(sapUrls))
        );
        (
          this.tenantForm.get('protectedResources.node') as FormGroup
        ).setControl('urls', this.fb.array(this.setUrls(nodeUrls)));
        this.tenantForm.get('tenantId').disable();
        this.tenantForm.get('tenantName').disable();
        this.tenantForm.get('tenantDomainName').disable();
        this.tenantForm.get('tenantAdmin').disable();
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        this.editTenant =
          params.edit === 'true' || params.edit === 'false'
            ? JSON.parse(params.edit)
            : false;
        this.editQueryParam = this.editTenant;
        this.cdrf.markForCheck();
        if (!this.editTenant) {
          this.tenantForm.disable();
        } else {
          this.editTenantForm();
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
      baseUrl: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      oauth2Url: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      grantType: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      scope: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.noWhiteSpace,
          this.scopeValidator()
        ]
      ],
      saml: this.fb.group({
        oauth2Url: [
          '',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern(regUrl),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        grantType: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        clientSecret: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        resource: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        tokenUse: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ],
        tokenType: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.noWhiteSpace
          ]
        ]
      })
    });
  }

  buildProtectedResources(): FormGroup {
    return this.fb.group({
      identityMetadata: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      issuer: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      audience: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      scope: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.noWhiteSpace
        ]
      ],
      urls: this.fb.array([this.initUrl()])
    });
  }

  initUrl = (url = '') =>
    this.fb.control(url, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(regUrl),
      WhiteSpaceValidator.noWhiteSpace
    ]);

  setUrls = (urls: string[]) => urls.map((url) => this.initUrl(url));

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

  saveTenant() {
    if (this.tenantForm.valid && this.tenantForm.dirty) {
      const { id, ...tenant } = this.tenantForm.getRawValue();
      tenant.erps.sap.scope = JSON.parse(tenant.erps.sap.scope);
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
            this.tenantForm.get('tenantId').disable();
            this.tenantForm.get('tenantName').disable();
            this.tenantForm.get('tenantDomainName').disable();
            this.tenantForm.get('tenantAdmin').disable();
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
    this.tenantForm.get('tenantDomainName').disable();
    this.tenantForm.get('tenantAdmin').disable();
    this.tenantForm.get('rdbms.database').disable();
    this.tenantForm.get('nosql.database').disable();
  }

  scopeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.trim()) {
        try {
          const json = JSON.parse(control.value);
          if (
            !json.hasOwnProperty('race') ||
            !json.hasOwnProperty('mWorkOrder') ||
            !json.hasOwnProperty('mInventory')
          ) {
            return { invalidScope: true };
          }

          if (
            json.race.trim() === '' ||
            json.mWorkOrder.trim() === '' ||
            json.mInventory.trim() === ''
          ) {
            return { invalidScope: true };
          }
        } catch (e) {
          return { invalidScope: true };
        }
        return null;
      }
      return null;
    };
  }
}
