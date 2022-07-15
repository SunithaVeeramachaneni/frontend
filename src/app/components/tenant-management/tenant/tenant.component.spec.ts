import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { Tenant } from 'src/app/interfaces';
import { AppMaterialModules } from 'src/app/material.module';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantService } from '../services/tenant.service';
import { tenants } from '../services/tenant.service.mock';
import { cloneDeep } from 'lodash';

import { TenantComponent } from './tenant.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { permissions$ } from 'src/app/shared/services/common.service.mock';
import { HeaderService } from 'src/app/shared/services/header.service';
import { profileImageBase64 } from 'src/app/shared/components/header/header.component.mock';

const [tenant] = tenants;
const { id, isActive, createdBy, createdAt, updatedAt, ...createTenant } =
  cloneDeep(tenant);
createTenant.rdbms.password = 'password';
createTenant.nosql.password = 'password';
createTenant.erps.sap.password = 'password';
createTenant.erps.sap.saml.clientSecret = 'password';
const { tenantId, tenantName, rdbms, nosql, ...rest } = createTenant;
const { database: rdbmsDatabase, ...restRdbms } = rdbms;
const { database: nosqlDatabase, ...restNosql } = nosql;
const updateTenant = {
  ...rest,
  rdbms: restRdbms,
  nosql: restNosql
} as Tenant;
declare const ENCRYPTION_KEY: string;
const regUrl =
  '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.([a-z]{2,5}|[0-9]{1,3})(:[0-9]{1,5})?(/.*)?$';

fdescribe('TenantComponent', () => {
  let component: TenantComponent;
  let fixture: ComponentFixture<TenantComponent>;
  let breadcrumbServiceSpy: BreadcrumbService;
  let tenantServiceSpy: TenantService;
  let toastServiceSpy: ToastService;
  let spinnerSpy: NgxSpinnerService;
  let activatedRouteSpy: ActivatedRoute;
  let commonServiceSpy: CommonService;
  let headerServiceSpy: HeaderService;
  let router: Router;
  let cdrf: ChangeDetectorRef;
  let tenantDe: DebugElement;
  let tenantEl: HTMLElement;

  beforeEach(async () => {
    breadcrumbServiceSpy = jasmine.createSpyObj('BreadcrumbService', ['set']);
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'createTenant$',
      'updateTenant$',
      'getTenantsCount$'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      data: of({}),
      queryParams: of({})
    });
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['decrypt'], {
      permissionsAction$: permissions$
    });
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TenantComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TitleCasePipe,
        {
          provide: BreadcrumbService,
          useValue: breadcrumbServiceSpy
        },
        {
          provide: TenantService,
          useValue: tenantServiceSpy
        },
        {
          provide: ToastService,
          useValue: toastServiceSpy
        },
        {
          provide: NgxSpinnerService,
          useValue: spinnerSpy
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: HeaderService,
          useValue: headerServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TenantComponent);
    cdrf = fixture.debugElement.injector.get(ChangeDetectorRef);
    component = fixture.componentInstance;
    tenantDe = fixture.debugElement;
    tenantEl = tenantDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    describe('form validations', () => {
      describe('tenantId', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            tenantId: ''
          });

          expect(component.tenantForm.get('tenantId').errors).toEqual({
            required: true
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            tenantId:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
          });

          expect(component.tenantForm.get('tenantId').errors).toEqual({
            maxlength: { requiredLength: 100, actualLength: 103 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            tenantId: '   '
          });

          expect(component.tenantForm.get('tenantId').errors).toEqual({
            noWhiteSpace: true
          });
        });

        it('should validate exists', () => {
          (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
            .withArgs({ tenantId: 'tenantId' })
            .and.returnValue(of({ count: 1 }));
          component.tenantForm.patchValue({
            tenantId: 'tenantId'
          });

          expect(component.tenantForm.get('tenantId').errors).toEqual({
            exists: true
          });
        });
      });

      describe('tenantName', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            tenantName: ''
          });

          expect(component.tenantForm.get('tenantName').errors).toEqual({
            required: true
          });
        });

        it('should validate minlength', () => {
          component.tenantForm.patchValue({
            tenantName: 'Lo'
          });

          expect(component.tenantForm.get('tenantName').errors).toEqual({
            minlength: { requiredLength: 3, actualLength: 2 }
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            tenantName:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
          });

          expect(component.tenantForm.get('tenantName').errors).toEqual({
            maxlength: { requiredLength: 100, actualLength: 103 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            tenantName: '   '
          });

          expect(component.tenantForm.get('tenantName').errors).toEqual({
            noWhiteSpace: true
          });
        });

        it('should validate exists', () => {
          (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
            .withArgs({ tenantName: 'tenantName' })
            .and.returnValue(of({ count: 1 }));
          component.tenantForm.patchValue({
            tenantName: 'tenantName'
          });

          expect(component.tenantForm.get('tenantName').errors).toEqual({
            exists: true
          });
        });
      });

      describe('tenantIdp', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            tenantIdp: ''
          });

          expect(component.tenantForm.get('tenantIdp').errors).toEqual({
            required: true
          });
        });
      });

      describe('clientId', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            clientId: ''
          });

          expect(component.tenantForm.get('clientId').errors).toEqual({
            required: true
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            clientId:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
          });

          expect(component.tenantForm.get('clientId').errors).toEqual({
            maxlength: { requiredLength: 100, actualLength: 103 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            clientId: '   '
          });

          expect(component.tenantForm.get('clientId').errors).toEqual({
            noWhiteSpace: true
          });
        });
      });

      describe('authority', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            authority: ''
          });

          expect(component.tenantForm.get('authority').errors).toEqual({
            required: true
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            authority:
              'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
          });

          expect(component.tenantForm.get('authority').errors).toEqual({
            maxlength: { requiredLength: 255, actualLength: 256 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            authority: '  '
          });

          expect(
            component.tenantForm.get('authority').errors.noWhiteSpace
          ).toBeTrue();
        });

        it('should validate pattern', () => {
          component.tenantForm.patchValue({
            authority: 'authority'
          });

          expect(component.tenantForm.get('authority').errors).toEqual({
            pattern: { requiredPattern: regUrl, actualValue: 'authority' }
          });
        });
      });

      describe('redirectUri', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            redirectUri: ''
          });

          expect(component.tenantForm.get('redirectUri').errors).toEqual({
            required: true
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            redirectUri:
              'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
          });

          expect(component.tenantForm.get('redirectUri').errors).toEqual({
            maxlength: { requiredLength: 100, actualLength: 256 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            redirectUri: '  '
          });

          expect(
            component.tenantForm.get('redirectUri').errors.noWhiteSpace
          ).toBeTrue();
        });

        it('should validate pattern', () => {
          component.tenantForm.patchValue({
            redirectUri: 'redirectUri'
          });

          expect(component.tenantForm.get('redirectUri').errors).toEqual({
            pattern: { requiredPattern: regUrl, actualValue: 'redirectUri' }
          });
        });
      });

      describe('tenantDomainName', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            tenantDomainName: ''
          });

          expect(component.tenantForm.get('tenantDomainName').errors).toEqual({
            required: true
          });
        });

        it('should validate maxlength', () => {
          component.tenantForm.patchValue({
            tenantDomainName:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
          });

          expect(component.tenantForm.get('tenantDomainName').errors).toEqual({
            maxlength: { requiredLength: 100, actualLength: 103 }
          });
        });

        it('should validate noWhiteSpace', () => {
          component.tenantForm.patchValue({
            tenantDomainName: '   '
          });

          expect(component.tenantForm.get('tenantDomainName').errors).toEqual({
            noWhiteSpace: true
          });
        });
      });

      describe('tenantAdmin', () => {
        describe('firstName', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                firstName: ''
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.firstName').errors
            ).toEqual({
              required: true
            });
          });

          it('should validate minlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                firstName: 'Lo'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.firstName').errors
            ).toEqual({
              minlength: { requiredLength: 3, actualLength: 2 }
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                firstName:
                  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.firstName').errors
            ).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                firstName: '   '
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.firstName').errors
            ).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('lastName', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                lastName: ''
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.lastName').errors
            ).toEqual({
              required: true
            });
          });

          it('should validate minlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                lastName: 'Lo'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.lastName').errors
            ).toEqual({
              minlength: { requiredLength: 3, actualLength: 2 }
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                lastName:
                  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.lastName').errors
            ).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                lastName: '   '
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.lastName').errors
            ).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('title', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                title: ''
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.title').errors
            ).toEqual({
              required: true
            });
          });

          it('should validate minlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                title: 'Lo'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.title').errors
            ).toEqual({
              minlength: { requiredLength: 3, actualLength: 2 }
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                title:
                  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.title').errors
            ).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                title: '   '
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.title').errors
            ).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('email', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                email: ''
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.email').errors
            ).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                email:
                  'testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting@test.com'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.email').errors.maxlength
            ).toEqual({ requiredLength: 100, actualLength: 107 });
          });

          it('should validate email', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                email: 'Lo'
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.email').errors
            ).toEqual({
              email: true
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              tenantAdmin: {
                email: '   '
              }
            });

            expect(
              component.tenantForm.get('tenantAdmin.email').errors.noWhiteSpace
            ).toBeTrue();
          });
        });
      });

      describe('erps', () => {
        describe('sap', () => {
          describe('baseUrl', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    baseUrl: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.baseUrl').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    baseUrl:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.baseUrl').errors
              ).toEqual({
                maxlength: { requiredLength: 255, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    baseUrl: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.baseUrl').errors.noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    baseUrl: 'baseUrl'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.baseUrl').errors
              ).toEqual({
                pattern: { requiredPattern: regUrl, actualValue: 'baseUrl' }
              });
            });
          });

          describe('oauth2Url', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    oauth2Url: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.oauth2Url').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    oauth2Url:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.oauth2Url').errors
              ).toEqual({
                maxlength: { requiredLength: 255, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    oauth2Url: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.oauth2Url').errors
                  .noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    oauth2Url: 'oauth2Url'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.oauth2Url').errors
              ).toEqual({
                pattern: { requiredPattern: regUrl, actualValue: 'oauth2Url' }
              });
            });
          });

          describe('username', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    username: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.username').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    username:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.username').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    username: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.username').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('password', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    password: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.password').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    password:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.password').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    password: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.password').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('grantType', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    grantType: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.grantType').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    grantType:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.grantType').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    grantType: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.grantType').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('clientId', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    clientId: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.clientId').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    clientId:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.clientId').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    clientId: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.clientId').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('scope', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    scope: ''
                  }
                }
              });

              expect(component.tenantForm.get('erps.sap.scope').errors).toEqual(
                {
                  required: true
                }
              );
            });

            it('should validate valid scope', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    scope: '{}'
                  }
                }
              });

              expect(component.tenantForm.get('erps.sap.scope').errors).toEqual(
                {
                  invalidScope: true
                }
              );
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                erps: {
                  sap: {
                    scope: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('erps.sap.scope').errors.noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('saml', () => {
            describe('oauth2Url', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        oauth2Url: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.oauth2Url').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        oauth2Url:
                          'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.oauth2Url').errors
                ).toEqual({
                  maxlength: { requiredLength: 255, actualLength: 256 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        oauth2Url: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.oauth2Url').errors
                    .noWhiteSpace
                ).toBeTrue();
              });

              it('should validate pattern', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        oauth2Url: 'oauth2Url'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.oauth2Url').errors
                ).toEqual({
                  pattern: { requiredPattern: regUrl, actualValue: 'oauth2Url' }
                });
              });
            });

            describe('grantType', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        grantType: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.grantType').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        grantType:
                          'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.grantType').errors
                ).toEqual({
                  maxlength: { requiredLength: 100, actualLength: 101 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        grantType: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.grantType').errors
                    .noWhiteSpace
                ).toBeTrue();
              });
            });

            describe('clientSecret', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        clientSecret: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.clientSecret').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        clientSecret:
                          'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.clientSecret').errors
                ).toEqual({
                  maxlength: { requiredLength: 100, actualLength: 101 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        clientSecret: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.clientSecret').errors
                    .noWhiteSpace
                ).toBeTrue();
              });
            });

            describe('resource', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        resource: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.resource').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        resource:
                          'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.resource').errors
                ).toEqual({
                  maxlength: { requiredLength: 100, actualLength: 101 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        resource: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.resource').errors
                    .noWhiteSpace
                ).toBeTrue();
              });
            });

            describe('tokenUse', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenUse: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenUse').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenUse:
                          'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenUse').errors
                ).toEqual({
                  maxlength: { requiredLength: 100, actualLength: 101 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenUse: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenUse').errors
                    .noWhiteSpace
                ).toBeTrue();
              });
            });

            describe('tokenType', () => {
              it('should validate require', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenType: ''
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenType').errors
                ).toEqual({
                  required: true
                });
              });

              it('should validate maxlength', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenType:
                          'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenType').errors
                ).toEqual({
                  maxlength: { requiredLength: 100, actualLength: 101 }
                });
              });

              it('should validate noWhiteSpace', () => {
                component.tenantForm.patchValue({
                  erps: {
                    sap: {
                      saml: {
                        tokenType: '  '
                      }
                    }
                  }
                });

                expect(
                  component.tenantForm.get('erps.sap.saml.tokenType').errors
                    .noWhiteSpace
                ).toBeTrue();
              });
            });
          });
        });
      });

      describe('protectedResources', () => {
        describe('sap', () => {
          describe('identityMetadata', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    identityMetadata: ''
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.sap.identityMetadata'
                ).errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    identityMetadata:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.sap.identityMetadata'
                ).errors
              ).toEqual({
                maxlength: { requiredLength: 255, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    identityMetadata: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.sap.identityMetadata'
                ).errors.noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    identityMetadata: 'identityMetadata'
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.sap.identityMetadata'
                ).errors
              ).toEqual({
                pattern: {
                  requiredPattern: regUrl,
                  actualValue: 'identityMetadata'
                }
              });
            });
          });

          describe('issuer', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    issuer: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.issuer').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    issuer:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.issuer').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    issuer: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.issuer').errors
                  .noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    issuer: 'issuer'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.issuer').errors
              ).toEqual({
                pattern: {
                  requiredPattern: regUrl,
                  actualValue: 'issuer'
                }
              });
            });
          });

          describe('clientId', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    clientId: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.clientId')
                  .errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    clientId:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.clientId')
                  .errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    clientId: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.clientId')
                  .errors.noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('audience', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    audience: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.audience')
                  .errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    audience:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.audience')
                  .errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    audience: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.audience')
                  .errors.noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('scope', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    scope: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.scope').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    scope:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.scope').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  sap: {
                    scope: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.sap.scope').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });
        });

        describe('node', () => {
          describe('identityMetadata', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    identityMetadata: ''
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.node.identityMetadata'
                ).errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    identityMetadata:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.node.identityMetadata'
                ).errors
              ).toEqual({
                maxlength: { requiredLength: 255, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    identityMetadata: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.node.identityMetadata'
                ).errors.noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    identityMetadata: 'identityMetadata'
                  }
                }
              });

              expect(
                component.tenantForm.get(
                  'protectedResources.node.identityMetadata'
                ).errors
              ).toEqual({
                pattern: {
                  requiredPattern: regUrl,
                  actualValue: 'identityMetadata'
                }
              });
            });
          });

          describe('issuer', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    issuer: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.issuer')
                  .errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    issuer:
                      'https://loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroaniminihilquasiutbeataeporroconsequaturdoloreaspernaturisteeadignissimoseiussolutarationeloremipsumdolorsitametconsecteturgdggsggggsgggsggsssgggsss.com'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.issuer')
                  .errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 256 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    issuer: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.issuer')
                  .errors.noWhiteSpace
              ).toBeTrue();
            });

            it('should validate pattern', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    issuer: 'issuer'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.issuer')
                  .errors
              ).toEqual({
                pattern: {
                  requiredPattern: regUrl,
                  actualValue: 'issuer'
                }
              });
            });
          });

          describe('clientId', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    clientId: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.clientId')
                  .errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    clientId:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.clientId')
                  .errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    clientId: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.clientId')
                  .errors.noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('audience', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    audience: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.audience')
                  .errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    audience:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.audience')
                  .errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    audience: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.audience')
                  .errors.noWhiteSpace
              ).toBeTrue();
            });
          });

          describe('scope', () => {
            it('should validate require', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    scope: ''
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.scope').errors
              ).toEqual({
                required: true
              });
            });

            it('should validate maxlength', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    scope:
                      'loremipsumdolorsitametconsecteturadipisicingelitinimpeditaccusantiumreiciendisperferendissuntveroanim'
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.scope').errors
              ).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 }
              });
            });

            it('should validate noWhiteSpace', () => {
              component.tenantForm.patchValue({
                protectedResources: {
                  node: {
                    scope: '  '
                  }
                }
              });

              expect(
                component.tenantForm.get('protectedResources.node.scope').errors
                  .noWhiteSpace
              ).toBeTrue();
            });
          });
        });
      });

      describe('rdbms', () => {
        describe('host', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              rdbms: {
                host: ''
              }
            });

            expect(component.tenantForm.get('rdbms.host').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              rdbms: {
                host: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('rdbms.host').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              rdbms: {
                host: '   '
              }
            });

            expect(component.tenantForm.get('rdbms.host').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('port', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              rdbms: {
                port: ''
              }
            });

            expect(component.tenantForm.get('rdbms.port').errors).toEqual({
              required: true
            });
          });

          it('should validate pattern', () => {
            component.tenantForm.patchValue({
              rdbms: {
                port: 123
              }
            });

            expect(component.tenantForm.get('rdbms.port').errors).toEqual({
              pattern: { requiredPattern: '^[0-9]{4}$', actualValue: 123 }
            });
          });
        });

        describe('user', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              rdbms: {
                user: ''
              }
            });

            expect(component.tenantForm.get('rdbms.user').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              rdbms: {
                user: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('rdbms.user').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              rdbms: {
                user: '   '
              }
            });

            expect(component.tenantForm.get('rdbms.user').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('password', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              rdbms: {
                password: ''
              }
            });

            expect(component.tenantForm.get('rdbms.password').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              rdbms: {
                password:
                  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('rdbms.password').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              rdbms: {
                password: '   '
              }
            });

            expect(component.tenantForm.get('rdbms.password').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('dialect', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              rdbms: {
                dialect: ''
              }
            });

            expect(component.tenantForm.get('rdbms.dialect').errors).toEqual({
              required: true
            });
          });
        });
      });

      describe('nosql', () => {
        describe('host', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              nosql: {
                host: ''
              }
            });

            expect(component.tenantForm.get('nosql.host').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              nosql: {
                host: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('nosql.host').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              nosql: {
                host: '   '
              }
            });

            expect(component.tenantForm.get('nosql.host').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('port', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              nosql: {
                port: ''
              }
            });

            expect(component.tenantForm.get('nosql.port').errors).toEqual({
              required: true
            });
          });

          it('should validate pattern', () => {
            component.tenantForm.patchValue({
              nosql: {
                port: 123
              }
            });

            expect(component.tenantForm.get('nosql.port').errors).toEqual({
              pattern: { requiredPattern: '^[0-9]{5}$', actualValue: 123 }
            });
          });
        });

        describe('user', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              nosql: {
                user: ''
              }
            });

            expect(component.tenantForm.get('nosql.user').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              nosql: {
                user: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('nosql.user').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              nosql: {
                user: '   '
              }
            });

            expect(component.tenantForm.get('nosql.user').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });

        describe('password', () => {
          it('should validate require', () => {
            component.tenantForm.patchValue({
              nosql: {
                password: ''
              }
            });

            expect(component.tenantForm.get('nosql.password').errors).toEqual({
              required: true
            });
          });

          it('should validate maxlength', () => {
            component.tenantForm.patchValue({
              nosql: {
                password:
                  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In impedit accusantium reiciendis perferendis'
              }
            });

            expect(component.tenantForm.get('nosql.password').errors).toEqual({
              maxlength: { requiredLength: 100, actualLength: 103 }
            });
          });

          it('should validate noWhiteSpace', () => {
            component.tenantForm.patchValue({
              nosql: {
                password: '   '
              }
            });

            expect(component.tenantForm.get('nosql.password').errors).toEqual({
              noWhiteSpace: true
            });
          });
        });
      });

      describe('noOfLicenses', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            noOfLicenses: ''
          });

          expect(component.tenantForm.get('noOfLicenses').errors).toEqual({
            required: true
          });
        });

        it('should validate pattern', () => {
          component.tenantForm.patchValue({
            noOfLicenses: '12a'
          });

          expect(component.tenantForm.get('noOfLicenses').errors).toEqual({
            pattern: { requiredPattern: '^[0-9]*$', actualValue: '12a' }
          });
        });

        it('should validate min', () => {
          component.tenantForm.patchValue({
            noOfLicenses: 0
          });

          expect(component.tenantForm.get('noOfLicenses').errors).toEqual({
            min: { min: 1, actual: 0 }
          });
        });

        it('should validate max', () => {
          component.tenantForm.patchValue({
            noOfLicenses: 100001
          });

          expect(component.tenantForm.get('noOfLicenses').errors).toEqual({
            max: { max: 100000, actual: 100001 }
          });
        });
      });

      describe('products', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            products: ''
          });

          expect(component.tenantForm.get('products').errors).toEqual({
            required: true
          });
        });
      });

      describe('modules', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            modules: ''
          });

          expect(component.tenantForm.get('modules').errors).toEqual({
            required: true
          });
        });
      });

      describe('logDBType', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            logDBType: ''
          });

          expect(component.tenantForm.get('logDBType').errors).toEqual({
            required: true
          });
        });
      });

      describe('logLevel', () => {
        it('should validate require', () => {
          component.tenantForm.patchValue({
            logLevel: ''
          });

          expect(component.tenantForm.get('logLevel').errors).toEqual({
            required: true
          });
        });
      });
    });

    it('should disable rdbms, nosql database names', () => {
      expect(component.tenantForm.get('rdbms.database').disabled).toBeTrue();
      expect(component.tenantForm.get('nosql.database').disabled).toBeTrue();
    });

    it('should set header title', () => {
      expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
        'Addding Tenant...'
      );
      expect(breadcrumbServiceSpy.set).toHaveBeenCalledWith('@tenantName', {
        label: 'Addding Tenant...'
      });
    });

    it('should set header title & database names when tenantName changes', () => {
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantName: 'tenant Name' })
        .and.returnValue(of({ count: 0 }));

      component.tenantForm.patchValue({ tenantName: 'tenant Name' });

      expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
        'tenant Name'
      );
      expect(breadcrumbServiceSpy.set).toHaveBeenCalledWith('@tenantName', {
        label: 'tenant Name'
      });
      expect(component.tenantForm.get('rdbms.database').value).toBe(
        'TenantName'
      );
      expect(component.tenantForm.get('nosql.database').value).toBe(
        'TenantName'
      );
    });

    it('should patch form with tenant data', () => {
      const newTenant = cloneDeep(createTenant);
      newTenant.erps.sap.scope = JSON.stringify(
        newTenant.erps.sap.scope,
        null,
        ' '
      );

      newTenant.msTeamsConfiguration = {
        msTeamsTenantID: '',
        msTeamsClientID: '',
        msTeamsClientSecret: '',
        msTeamsSharepointSiteID: '',
        msTeamsRSAPrivateKey: '',
        msTeamsRSAPublicKey: ''
      };

      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantId: 'tenantId' })
        .and.returnValue(of({ count: 0 }));
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantName: 'tenantName' })
        .and.returnValue(of({ count: 0 }));
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantDomainName: 'tenantDomainName' })
        .and.returnValue(of({ count: 0 }));

      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue(of({ tenant }));

      component.ngOnInit();

      expect(component.tenantForm.getRawValue()).toEqual({
        ...newTenant,
        id
      });
      expect(component.tenantForm.get('tenantId').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantName').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantDomainName').disabled).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.firstName').disabled
      ).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.lastName').disabled
      ).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.title').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.email').disabled).toBeTrue();
    });

    it('should not disable from, if edit query param is true', () => {
      const detectChangesSpy = spyOn(
        cdrf.constructor.prototype,
        'detectChanges'
      );
      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParams')
          .get as jasmine.Spy
      ).and.returnValue(of({ edit: 'true' }));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.editTenant).toBeTrue();
      expect(component.editQueryParam).toBeTrue();
      expect(component.tenantForm.enabled).toBeTrue();
      expect(detectChangesSpy).toHaveBeenCalledWith();
    });

    it('should disable from, if edit query param is false', () => {
      const detectChangesSpy = spyOn(
        cdrf.constructor.prototype,
        'detectChanges'
      );
      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParams')
          .get as jasmine.Spy
      ).and.returnValue(of({ edit: 'false' }));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.editTenant).toBeFalse();
      expect(component.editQueryParam).toBeFalse();
      expect(component.tenantForm.disabled).toBeTrue();
      expect(detectChangesSpy).toHaveBeenCalledWith();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should define function', () => {
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });

  describe('buildErps', () => {
    it('should define function', () => {
      expect(component.buildErps).toBeDefined();
    });
  });

  describe('buildProtectedResources', () => {
    it('should define function', () => {
      expect(component.buildProtectedResources).toBeDefined();
    });
  });

  describe('initUrl', () => {
    it('should define function', () => {
      expect(component.initUrl).toBeDefined();
    });
  });

  describe('setUrls', () => {
    it('should define function', () => {
      expect(component.setUrls).toBeDefined();
    });
  });

  describe('addUrl', () => {
    it('should define function', () => {
      expect(component.addUrl).toBeDefined();
    });
  });

  describe('deleteUrl', () => {
    it('should define function', () => {
      expect(component.deleteUrl).toBeDefined();
    });
  });

  describe('setTabIndex', () => {
    it('should define function', () => {
      expect(component.setTabIndex).toBeDefined();
    });

    it('should set tab index', () => {
      const buttons = tenantEl.querySelectorAll('.prevnextbtns');
      (buttons[2] as HTMLElement).click();

      expect(component.selectedID.value).toBe(1);
    });
  });

  describe('onTabsChange', () => {
    it('should define function', () => {
      expect(component.onTabsChange).toBeDefined();
    });

    it('should handle tab change event', () => {
      const tabs = tenantDe.queryAll(By.css('.mat-tab-label'));
      tabs[2].nativeElement.click();
      fixture.detectChanges();

      expect(component.lastButton).toBeFalse();
    });
  });

  describe('saveTenant', () => {
    let newTenant: Tenant;
    beforeEach(() => {
      newTenant = cloneDeep(createTenant);
      newTenant.erps.sap.scope = JSON.stringify(
        newTenant.erps.sap.scope,
        null,
        ' '
      );
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantId: 'tenantId' })
        .and.returnValue(of({ count: 0 }));

      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantName: 'tenantName' })
        .and.returnValue(of({ count: 0 }));

      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantDomainName: 'tenantDomainName' })
        .and.returnValue(of({ count: 0 }));

      (tenantServiceSpy.createTenant$ as jasmine.Spy)
        .withArgs(createTenant)
        .and.returnValue(of(tenant));

      (tenantServiceSpy.updateTenant$ as jasmine.Spy)
        .withArgs(id, updateTenant)
        .and.returnValue(of(updateTenant));
    });

    it('should define function', () => {
      expect(component.saveTenant).toBeDefined();
    });

    xit('should allow user to add a tenant if form is valid & dirty', () => {
      let tenantMock = cloneDeep(newTenant);

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { id, ...rest } = tenantMock;
      tenantMock = rest;
      tenantMock.msTeamsConfiguration = {
        msTeamsTenantID: 'msTeamsTenantIDMock',
        msTeamsClientID: 'msTeamsClientIDMock',
        msTeamsClientSecret: 'msTeamsClientSecretMock',
        msTeamsSharepointSiteID: 'msTeamsSharepointSiteIDMock',
        msTeamsRSAPrivateKey: 'msTeamsRSAPrivateKeyMock',
        msTeamsRSAPublicKey: 'msTeamsRSAPublicKeyMock'
      };

      createTenant.msTeamsConfiguration = {
        msTeamsTenantID: 'msTeamsTenantIDMock',
        msTeamsClientID: 'msTeamsClientIDMock',
        msTeamsClientSecret: 'msTeamsClientSecretMock',
        msTeamsSharepointSiteID: 'msTeamsSharepointSiteIDMock',
        msTeamsRSAPrivateKey: 'msTeamsRSAPrivateKeyMock',
        msTeamsRSAPublicKey: 'msTeamsRSAPublicKeyMock'
      };

      component.tenantForm.patchValue(createTenant);
      component.tenantForm.removeControl('id');
      (tenantServiceSpy.createTenant$ as jasmine.Spy)
        .withArgs(tenantMock)
        .and.returnValue(of(tenantMock));

      component.tenantForm.markAsDirty();

      tenantDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(tenantServiceSpy.createTenant$).toHaveBeenCalledWith(tenantMock);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Tenant '${createTenant.tenantName}' onboarded successfully`,
        type: 'success'
      });
      expect(component.tenantForm.get('id').value).toBe(tenant.id);
      expect(component.tenantForm.get('tenantId').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantName').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantDomainName').disabled).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.firstName').disabled
      ).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.lastName').disabled
      ).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.title').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.email').disabled).toBeTrue();
      expect(component.tenantForm.pristine).toBeTrue();
    });

    it('should not allow user to add a tenant if form is invalid', () => {
      component.tenantForm.patchValue({ ...newTenant, tenantName: '' });
      component.tenantForm.markAsDirty();

      tenantDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(tenantServiceSpy.createTenant$).not.toHaveBeenCalled();
    });

    it('should allow user to update a tenant if form is valid & dirty', () => {
      component.tenantForm.patchValue({
        ...newTenant,
        id: 1
      });
      // eslint-disable-next-line @typescript-eslint/dot-notation
      component.tenantForm.controls['collaborationType'].setValue('msteams');
      // eslint-disable-next-line @typescript-eslint/dot-notation
      component.tenantForm.controls['msTeamsConfiguration'].patchValue({
        msTeamsTenantID: 'msTeamsTenantIDMock',
        msTeamsClientID: 'msTeamsClientIDMock',
        msTeamsClientSecret: 'msTeamsClientSecretMock',
        msTeamsSharepointSiteID: 'msTeamsSharepointSiteIDMock',
        msTeamsRSAPrivateKey: 'msTeamsRSAPrivateKeyMock',
        msTeamsRSAPublicKey: 'msTeamsRSAPublicKeyMock'
      });
      updateTenant.msTeamsConfiguration = {
        msTeamsTenantID: 'msTeamsTenantIDMock',
        msTeamsClientID: 'msTeamsClientIDMock',
        msTeamsClientSecret: 'msTeamsClientSecretMock',
        msTeamsSharepointSiteID: 'msTeamsSharepointSiteIDMock',
        msTeamsRSAPrivateKey: 'msTeamsRSAPrivateKeyMock',
        msTeamsRSAPublicKey: 'msTeamsRSAPublicKeyMock'
      };

      component.tenantForm.markAsDirty();
      const rawValue = component.tenantForm.getRawValue();
      rawValue.erps.sap.scope = JSON.parse(rawValue.erps.sap.scope);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { id, tenantId, tenantName, rdbms, nosql, ...restTenant } =
        rawValue;

      const updateTenantMock = {
        ...restTenant,
        rdbms: restRdbms,
        nosql: restNosql
      };

      (tenantServiceSpy.updateTenant$ as jasmine.Spy)
        .withArgs(id, updateTenantMock)
        .and.returnValue(of(updateTenantMock));

      tenantDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(tenantServiceSpy.updateTenant$).toHaveBeenCalledWith(
        id,
        updateTenantMock
      );
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Tenant '${createTenant.tenantName}' updated successfully`,
        type: 'success'
      });
      expect(component.tenantForm.pristine).toBeTrue();
    });
  });

  describe('getTenantsCount', () => {
    it('should define function', () => {
      expect(component.getTenantsCount).toBeDefined();
    });

    it('should call getTenantsCount from tenant service', () => {
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantId: '' })
        .and.returnValue(of({ count: 0 }));

      component.getTenantsCount('tenantId', '').subscribe((response) => {
        expect(response).toEqual({ count: 0 });
        expect(tenantServiceSpy.getTenantsCount$).toHaveBeenCalledWith({
          tenantId: ''
        });
      });
    });
  });

  describe('validateUnique', () => {
    it('should define function', () => {
      expect(component.validateUnique).toBeDefined();
    });

    it('should return null if given field not exists', () => {
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantId: 'tenantId' })
        .and.returnValue(of({ count: 0 }));

      component.tenantForm.patchValue({
        tenantId: 'tenantId'
      });

      expect(component.tenantForm.get('tenantId').errors).toBeNull();
    });

    it('should return exists true if given field exists', () => {
      (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
        .withArgs({ tenantId: 'tenantId' })
        .and.returnValue(of({ count: 1 }));

      component.tenantForm.patchValue({
        tenantId: 'tenantId'
      });

      expect(component.tenantForm.get('tenantId').errors).toEqual({
        exists: true
      });
    });
  });

  describe('maskClientSecret', () => {
    it('should define function', () => {
      expect(component.maskClientSecret).toBeDefined();
    });
  });

  describe('unMaskClientSecret', () => {
    it('should define function', () => {
      expect(component.unMaskClientSecret).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should define function', () => {
      expect(component.cancel).toBeDefined();
    });

    it('should navigate to tenant management', () => {
      const navigateSpy = spyOn(router, 'navigate');

      tenantDe
        .query(By.css('button.cancel-btn'))
        .triggerEventHandler('click', null);

      expect(navigateSpy).toHaveBeenCalledWith(['/tenant-management']);
    });

    it('should not navigate to tenant management', () => {
      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParams')
          .get as jasmine.Spy
      ).and.returnValue(of({ edit: false }));
      const navigateSpy = spyOn(router, 'navigate');
      component.ngOnInit();
      tenantDe
        .query(By.css('button.edit-btn'))
        ?.triggerEventHandler('click', null);

      tenantDe
        .query(By.css('button.cancel-btn'))
        .triggerEventHandler('click', null);

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.tenantForm.disabled).toBeTrue();
      expect(component.editTenant).toBeFalse();
    });
  });

  describe('editTenantForm', () => {
    it('should define function', () => {
      expect(component.editTenantForm).toBeDefined();
    });

    it('should enable form for editing', () => {
      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParams')
          .get as jasmine.Spy
      ).and.returnValue(of({ edit: false }));
      component.ngOnInit();
      fixture.detectChanges();

      tenantDe
        .query(By.css('button.edit-btn'))
        ?.triggerEventHandler('click', null);

      expect(component.tenantForm.enabled).toBeTrue();
      expect(component.editTenant).toBeTrue();
      expect(component.tenantForm.get('tenantId').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantName').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantDomainName').disabled).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.firstName').disabled
      ).toBeTrue();
      expect(
        component.tenantForm.get('tenantAdmin.lastName').disabled
      ).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.title').disabled).toBeTrue();
      expect(component.tenantForm.get('tenantAdmin.email').disabled).toBeTrue();
      expect(component.tenantForm.get('rdbms.database').disabled).toBeTrue();
      expect(component.tenantForm.get('nosql.database').disabled).toBeTrue();
    });
  });

  describe('scopeValidator', () => {
    it('should define function', () => {
      expect(component.scopeValidator).toBeDefined();
    });

    it('should return null if scope is empty', () => {
      component.tenantForm.patchValue({
        erps: {
          sap: {
            scope: ''
          }
        }
      });

      expect(
        component.tenantForm.get('erps.sap.scope').errors.invalidScope
      ).toBeUndefined();
    });

    it('should return invalidScope true if scope is empty', () => {
      component.tenantForm.patchValue({
        erps: {
          sap: {
            scope: '{}'
          }
        }
      });

      expect(component.tenantForm.get('erps.sap.scope').errors).toEqual({
        invalidScope: true
      });
    });

    it('should return invalidScope true if scopes are empty', () => {
      component.tenantForm.patchValue({
        erps: {
          sap: {
            scope: '{"race": "", "mWorkOrder": "", "mInventory":""}'
          }
        }
      });

      expect(component.tenantForm.get('erps.sap.scope').errors).toEqual({
        invalidScope: true
      });
    });

    it('should return invalidScope true if scope is invalid', () => {
      component.tenantForm.patchValue({
        erps: {
          sap: {
            scope:
              '{"race": "race", "mWorkOrder": "mWorkOrder", "mInventory":"mInventory}'
          }
        }
      });

      expect(component.tenantForm.get('erps.sap.scope').errors).toEqual({
        invalidScope: true
      });
    });

    it('should return null if scope is valid', () => {
      component.tenantForm.patchValue({
        erps: {
          sap: {
            scope:
              '{"race": "race", "mWorkOrder": "mWorkOrder", "mInventory":"mInventory"}'
          }
        }
      });

      expect(component.tenantForm.get('erps.sap.scope').errors).toBeNull();
    });
  });

  fdescribe('onTenantLogoChange', () => {
    it('should define function', () => {
      expect(component.onTenantLogoChange).toBeDefined();
    });

    it('should change tenant logo', () => {
      (
        Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParams')
          .get as jasmine.Spy
      ).and.returnValue(of({ edit: 'true' }));
      component.ngOnInit();
      component.selectedID.setValue(7);
      fixture.detectChanges();
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([''], 'image.png'));

      const inputDebugEl = tenantDe.query(By.css('input[type=file]'));
      inputDebugEl.nativeElement.files = dataTransfer.files;
      inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
      fixture.detectChanges();
    });
  });

  describe('removeTenantLogo', () => {
    it('should define function', () => {
      expect(component.removeTenantLogo).toBeDefined();
    });
  });

  describe('showRemoveTenantLogo', () => {
    it('should define function', () => {
      expect(component.showRemoveTenantLogo).toBeDefined();
    });

    it('should return showRemoveTenantLogo true or false', () => {
      component.tenantForm.patchValue({ tenantLogo: null });

      expect(component.showRemoveTenantLogo()).toBeFalse();

      component.tenantForm.patchValue({ tenantLogo: profileImageBase64 });

      expect(component.showRemoveTenantLogo()).toBeTrue();
    });
  });

  describe('getBrowseLogoName', () => {
    it('should define function', () => {
      expect(component.getBrowseLogoName).toBeDefined();
    });

    it('should retur broowse logo name', () => {
      component.tenantForm.patchValue({ tenantLogoName: null });

      expect(component.getBrowseLogoName()).toBe('browseLogo');

      component.tenantForm.patchValue({ tenantLogoName: 'TenantLogo.png' });

      expect(component.getBrowseLogoName()).toBe('TenantLogo.png');
    });
  });

  describe('resetTenantLogo', () => {
    it('should define function', () => {
      expect(component.resetTenantLogo).toBeDefined();
    });
  });
});
