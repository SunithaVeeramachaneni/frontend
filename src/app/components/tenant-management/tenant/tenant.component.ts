import { TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Buffer } from 'buffer';
import { permissions, products } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { TenantService } from '../services/tenant.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Tenant, ValidationError } from 'src/app/interfaces';
import { cloneDeep } from 'lodash-es';

const regUrl =
  '^(http://www.|https://www.|http://|https://|www.)[a-z0-9]+([-.]{1}[a-z0-9]+)*.([a-z]{2,5}|[0-9]{1,3})(:[0-9]{1,5})?(/.*)?$';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantComponent implements OnInit, AfterViewInit {
  @ViewChild('clientSecret') clientSecret: ElementRef;
  @ViewChild('accessKeyId') accessKeyId: ElementRef;
  @ViewChild('secretAccessKey') secretAccessKey: ElementRef;
  hidePasswordDBMS = true;
  hidePasswordNoSQL = true;
  hidePasswordERPS = true;
  hideBasicCredentialsPassword = true;
  firstButton = true;
  lastButton = false;
  selectedID = new FormControl(0);
  noOfTabs = 7;
  tenantForm: FormGroup;
  slackConfiguration: FormGroup;
  msTeamsConfiguration: FormGroup;
  tenantData: Tenant;
  readonly products = products;
  modules = [
    'Dashboard',
    'Tenant Management',
    'Maintenance Control Center',
    'Spare Parts Control Center',
    'User Management',
    'Forms',
    'Operator Rounds',
    'Master Configuration',
    'Work Instructions'
  ];
  idps = ['azure'];
  mongoDBPrefixes = ['mongodb', 'mongodb+srv'];
  dialects = ['mysql'];
  logDbTypes = ['rdbms', 'nosql'];
  collaborationTypes = ['slack', 'msteams', 'none'];
  logLevels = ['off', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'];
  errors: ValidationError = {};
  tenantHeader = 'Adding Tenant...';
  editTenant = true;
  editQueryParam = true;
  tenantLogo: string | SafeResourceUrl;
  readonly permissions = permissions;

  get sapUrls(): FormArray {
    return this.tenantForm.get('protectedResources.sap.urls') as FormArray;
  }

  get nodeUrls(): FormArray {
    return this.tenantForm.get('protectedResources.node.urls') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private breadcrumbService: BreadcrumbService,
    private tenantService: TenantService,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
    private titleCase: TitleCasePipe,
    private route: ActivatedRoute,
    private cdrf: ChangeDetectorRef,
    private router: Router,
    private imageUtils: ImageUtils,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      id: [''],
      tenantId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ],
        this.validateUnique('tenantId')
      ],
      tenantName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ],
        this.validateUnique('tenantName')
      ],
      tenantIdp: ['', [Validators.required]],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      authority: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      redirectUri: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      tenantDomainName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
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
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.email,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
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
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        port: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
        user: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace
          ]
        ],
        database: [{ value: '', disabled: true }],
        dialect: ['', [Validators.required]]
      }),
      nosql: this.fb.group({
        prefix: ['', [Validators.required]],
        host: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        port: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        user: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace
          ]
        ],
        database: [{ value: '', disabled: true }]
      }),
      collaborationType: ['', [Validators.required]],
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
      logLevel: ['', [Validators.required]],
      s3Details: this.fb.group({
        accessKeyId: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        secretAccessKey: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        bucket: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        region: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ]
      }),
      tenantLogo: [''],
      tenantLogoName: [''],
      slackTeamID: [''],
      amplifyConfig: ['', [Validators.required, this.jsonValidator()]],
      configurations: ['', [Validators.required, this.jsonValidator()]]
    });

    this.slackConfiguration = this.fb.group({
      slackTeamID: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      slackClientID: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      slackClientSecret: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      slackClientSigningSecret: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      slackClientStateSecret: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ]
    });
    this.msTeamsConfiguration = this.fb.group({
      msTeamsTenantID: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      msTeamsClientID: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      msTeamsClientSecret: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      msTeamsSharepointSiteID: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      msTeamsRSAPrivateKey: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      msTeamsRSAPublicKey: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ]
    });

    const headerTitle = this.tenantForm.get('tenantName').value
      ? this.tenantForm.get('tenantName').value
      : `Adding Tenant...`;
    this.headerService.setHeaderTitle(headerTitle);
    this.breadcrumbService.set('@tenantName', {
      label: headerTitle
    });

    this.tenantForm
      .get('collaborationType')
      .valueChanges.subscribe((collabType) => {
        if (collabType === 'slack') {
          if (this.tenantForm.contains('msTeamsConfiguration')) {
            this.tenantForm.removeControl('msTeamsConfiguration');
          }
          if (!this.tenantForm.contains('slackConfiguration')) {
            this.tenantForm.addControl(
              'slackConfiguration',
              this.slackConfiguration
            );
          }
          this.slackConfiguration.patchValue(
            this.tenantData?.slackConfiguration
          );
        } else if (collabType === 'msteams') {
          if (this.tenantForm.contains('slackConfiguration')) {
            this.tenantForm.removeControl('slackConfiguration');
          }
          if (!this.tenantForm.contains('msTeamsConfiguration')) {
            this.tenantForm.addControl(
              'msTeamsConfiguration',
              this.msTeamsConfiguration
            );
          }
          this.msTeamsConfiguration.patchValue(
            this.tenantData?.msTeamsConfiguration
          );
        }
      });

    this.tenantForm.get('nosql.prefix').valueChanges.subscribe((prefix) => {
      if (prefix === 'mongodb+srv') {
        this.tenantForm.get('nosql.port').setValidators([]);
      } else {
        this.tenantForm
          .get('nosql.port')
          .setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
      }
      this.tenantForm.get('nosql.port').updateValueAndValidity();
    });

    this.tenantForm.get('tenantName').valueChanges.subscribe((tenantName) => {
      const displayName = tenantName.trim() ? tenantName : 'Adding Tenant...';
      this.tenantHeader = displayName;
      this.breadcrumbService.set('@tenantName', { label: displayName });
      this.headerService.setHeaderTitle(displayName);
      const database = this.titleCase.transform(tenantName).replace(/\s+/g, '');
      this.tenantForm.patchValue({
        rdbms: { database },
        nosql: { database }
      });
    });

    this.route.data.subscribe(({ tenant }) => {
      this.tenantData = tenant;
      this.setTenantFormData();
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
    this.maskFields();
  }

  maskFields() {
    this.maskField(
      this.tenantForm.get('erps.sap.saml.clientSecret').value,
      'clientSecret'
    );
    this.maskField(
      this.tenantForm.get('s3Details.accessKeyId').value,
      'accessKeyId'
    );
    this.maskField(
      this.tenantForm.get('s3Details.secretAccessKey').value,
      'secretAccessKey'
    );
  }

  setTenantFormData() {
    if (this.tenantData && Object.keys(this.tenantData).length) {
      const tenant = cloneDeep(this.tenantData);
      const { sap, node } = tenant.protectedResources;
      const { urls: sapUrls } = sap;
      const { urls: nodeUrls } = node;

      tenant.erps.sap.scopes = JSON.stringify(
        tenant.erps.sap.scopes,
        null,
        ' '
      );

      if (tenant.tenantLogo) {
        const tenantLogo = Buffer.from(tenant.tenantLogo).toString();
        this.tenantLogo = this.imageUtils.getImageSrc(tenantLogo);
        tenant.tenantLogo = tenantLogo;
      } else {
        this.tenantLogo = '';
      }

      tenant.amplifyConfig =
        tenant?.amplifyConfig && typeof tenant?.amplifyConfig === 'object'
          ? JSON.stringify(tenant?.amplifyConfig, null, ' ')
          : '';
      tenant.configurations =
        tenant?.configurations && typeof tenant?.configurations === 'object'
          ? JSON.stringify(tenant?.configurations, null, ' ')
          : '';
      this.tenantForm.patchValue(tenant);
      (this.tenantForm.get('protectedResources.sap') as FormGroup).setControl(
        'urls',
        this.fb.array(this.setUrls(sapUrls))
      );
      (this.tenantForm.get('protectedResources.node') as FormGroup).setControl(
        'urls',
        this.fb.array(this.setUrls(nodeUrls))
      );
      this.tenantForm.get('tenantId').disable();
      this.tenantForm.get('tenantName').disable();
      this.tenantForm.get('tenantDomainName').disable();
      this.tenantForm.get('tenantAdmin').disable();
    }
  }

  buildErps(): FormGroup {
    return this.fb.group({
      baseUrl: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      oauth2Url: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace
        ]
      ],
      grantType: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      scopes: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace,
          this.scopeValidator()
        ]
      ],
      basicCredentials: this.fb.group({
        username: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace
          ]
        ]
      }),
      saml: this.fb.group({
        oauth2Url: [
          '',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern(regUrl),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        grantType: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        clientSecret: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        resource: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        tokenUse: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]
        ],
        tokenType: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
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
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      issuer: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(regUrl),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      clientId: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      audience: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      scope: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
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
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
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
      if (tenant?.amplifyConfig && typeof tenant?.amplifyConfig === 'string') {
        tenant.amplifyConfig = JSON.parse(tenant.amplifyConfig);
      }
      if (
        tenant?.configurations &&
        typeof tenant?.configurations === 'string'
      ) {
        tenant.configurations = JSON.parse(tenant.configurations);
      }
      tenant.erps.sap.scopes = JSON.parse(tenant.erps.sap.scopes);
      let { slackTeamID = '' } = tenant.slackConfiguration || {};
      if (/dev$/i.test(slackTeamID)) {
        slackTeamID = slackTeamID.slice(0, -3);
      } else if (/qa$/i.test(slackTeamID)) {
        slackTeamID = slackTeamID.slice(0, -2);
      } else if (/demo$/i.test(slackTeamID)) {
        slackTeamID = slackTeamID.slice(0, -4);
      }
      tenant.slackTeamID = slackTeamID;
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
              this.tenantData = { id, ...tenant };
              this.tenantForm.reset(this.tenantForm.getRawValue());
              this.toast.show({
                text: `Tenant '${tenantName}' updated successfully`,
                type: 'success'
              });
              this.maskFields();
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
            this.maskFields();
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

  jsonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        JSON.parse(control.value);
        return null;
      } catch (err) {
        return { isInvalidJSON: true };
      }
    };
  }

  maskField(value: string, fieldId: string) {
    const data =
      value.length > 3
        ? value.slice(0, 3) + 'X'.repeat(value.length - 3)
        : value;
    this[fieldId].nativeElement.value = data;
  }

  unMaskField(value: string, fieldId: string) {
    this[fieldId].nativeElement.value = value;
  }

  cancel() {
    if (this.editQueryParam) {
      this.router.navigate(['/tenant-management']);
    } else {
      this.setTenantFormData();
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
            !json.race.hasOwnProperty('scope') ||
            !json.race.hasOwnProperty('collection') ||
            !json.mWorkOrder.hasOwnProperty('scope') ||
            !json.mWorkOrder.hasOwnProperty('collection') ||
            !json.mInventory.hasOwnProperty('scope') ||
            !json.mInventory.hasOwnProperty('collection')
          ) {
            return { invalidScope: true };
          }

          if (
            json.race.scope.trim() === '' ||
            json.race.collection.trim() === '' ||
            json.mWorkOrder.scope.trim() === '' ||
            json.mWorkOrder.collection.trim() === '' ||
            json.mInventory.scope.trim() === '' ||
            json.mInventory.collection.trim() === ''
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

  onTenantLogoChange(event: any) {
    let base64: string;
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const tenantLogo = base64.split(',')[1];
      this.tenantForm.patchValue({
        tenantLogo,
        tenantLogoName: files[0].name
      });
      this.tenantForm.get('tenantLogo').markAsDirty();
      this.tenantLogo = this.imageUtils.getImageSrc(tenantLogo);
      this.cdrf.markForCheck();
    };
  }

  removeTenantLogo() {
    this.tenantForm.patchValue({
      tenantLogo: null,
      tenantLogoName: null
    });
    this.tenantForm.get('tenantLogo').markAsDirty();
    this.tenantLogo = null;
  }

  showRemoveTenantLogo() {
    return this.tenantForm.get('tenantLogo').value ? true : false;
  }

  getBrowseLogoName() {
    return this.tenantForm.get('tenantLogoName').value
      ? this.tenantForm.get('tenantLogoName').value
      : 'browseLogo';
  }

  resetTenantLogo(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = '';
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.tenantForm.get(controlName).touched;
    const errors = this.tenantForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }
}
