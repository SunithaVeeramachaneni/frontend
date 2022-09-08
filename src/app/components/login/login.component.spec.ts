import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { tenantsInfo } from 'src/app/auth-config.service.mock';
import { AppMaterialModules } from 'src/app/material.module';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { TenantService } from '../tenant-management/services/tenant.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let commonServiceSpy: CommonService;
  let tenantServiceSpy: TenantService;
  let loginDe: DebugElement;
  let loginEl: HTMLElement;

  beforeEach(async () => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [
      'authorize'
    ]);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setProtectedResources'
    ]);
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'getTenantsInfo',
      'setTenantInfo'
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, BackgroundComponent],
      imports: [
        ReactiveFormsModule,
        AppMaterialModules,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { returnUrl: '/dashboard' } }
          }
        },
        {
          provide: OidcSecurityService,
          useValue: oidcSecurityServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: TenantService,
          useValue: tenantServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginDe = fixture.debugElement;
    loginEl = loginDe.nativeElement;
    (tenantServiceSpy.getTenantsInfo as jasmine.Spy)
      .withArgs()
      .and.returnValue(tenantsInfo);

    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('companyOrDomainName');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    describe('form validations', () => {
      describe('companyOrDomainName', () => {
        it('should validate require', () => {
          component.loginForm.patchValue({
            companyOrDomainName: ''
          });

          expect(component.loginForm.get('companyOrDomainName').errors).toEqual(
            {
              required: true
            }
          );
        });

        it('should validate whiteSpace', () => {
          component.loginForm.patchValue({
            companyOrDomainName: '   '
          });

          expect(
            component.loginForm.get('companyOrDomainName').errors.whiteSpace
          ).toBeTrue();
        });

        it('should validate company or domain name if not exists in tenant info', () => {
          component.loginForm.patchValue({
            companyOrDomainName: 'innovapptive test'
          });

          expect(component.loginForm.get('companyOrDomainName').errors).toEqual(
            {
              invalidCompanyOrDomaniName: true
            }
          );
        });
      });
    });

    it('should return matched tenantsInfo if company or domain name matches', async () => {
      const companyOrDomainNameElement = loginEl.querySelector('input');
      companyOrDomainNameElement.dispatchEvent(new Event('focusin'));
      companyOrDomainNameElement.value = 'inno';
      companyOrDomainNameElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(document.querySelectorAll('mat-option').length).toBe(2);
    });

    it('should return empty tenantsInfo if company or domain name doesnt match', async () => {
      const companyOrDomainNameElement = loginEl.querySelector('input');
      companyOrDomainNameElement.dispatchEvent(new Event('focusin'));
      companyOrDomainNameElement.value = 'innovation';
      companyOrDomainNameElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(document.querySelectorAll('mat-option').length).toBe(0);
    });

    it('should return empty tenantsInfo if company or domain name is empty', async () => {
      const companyOrDomainNameElement = loginEl.querySelector('input');
      companyOrDomainNameElement.dispatchEvent(new Event('focusin'));
      companyOrDomainNameElement.value = ' ';
      companyOrDomainNameElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(document.querySelectorAll('mat-option').length).toBe(0);
    });

    it('should redirect to tenant idp, if company or domain name exists in session storage', () => {
      sessionStorage.setItem('companyOrDomainName', 'innovapptive');
      const redirectToTenantIdpSpy = spyOn(component, 'redirectToTenantIdp');

      component.ngOnInit();

      expect(component.returnUrl).toEqual('/dashboard');
      expect(component.loginForm.value).toEqual({
        companyOrDomainName: 'innovapptive'
      });
      expect(component.loginForm.dirty).toBeTrue();
      expect(redirectToTenantIdpSpy).toHaveBeenCalled();
    });
  });

  describe('redirectToTenantIdp', () => {
    it('should define function', () => {
      expect(component.redirectToTenantIdp).toBeDefined();
    });

    it('should allow user to redirect to tenant idp, if company or domain name is valid & dirty', () => {
      const [tenantInfo] = tenantsInfo;
      const {
        tenantId,
        protectedResources: { sap, node }
      } = tenantInfo;
      component.loginForm.setValue({
        companyOrDomainName: 'innovapptive'
      });
      component.loginForm.markAsDirty();

      loginDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(commonServiceSpy.setProtectedResources).toHaveBeenCalledWith(node);
      expect(commonServiceSpy.setProtectedResources).toHaveBeenCalledWith(sap);
      expect(tenantServiceSpy.setTenantInfo).toHaveBeenCalledWith(tenantInfo);
      expect(sessionStorage.getItem('companyOrDomainName')).toEqual(
        'innovapptive'
      );
      expect(sessionStorage.getItem('returnUrl')).toEqual('/dashboard');
      expect(oidcSecurityServiceSpy.authorize).toHaveBeenCalledWith(tenantId);
    });

    it('should not allow user to redirect to tenant idp, if company or domain name is not valid', () => {
      const [tenantInfo] = tenantsInfo;
      const {
        tenantId,
        protectedResources: { sap, node }
      } = tenantInfo;
      component.loginForm.setValue({
        companyOrDomainName: 'innovapptivetest'
      });
      component.loginForm.markAsDirty();

      loginDe.query(By.css('form')).triggerEventHandler('submit', null);

      expect(oidcSecurityServiceSpy.authorize).not.toHaveBeenCalled();
    });
  });

  describe('companyOrDomaniNameValidator', () => {
    it('should define function', () => {
      expect(component.companyOrDomaniNameValidator).toBeDefined();
    });

    it('should return null if given field exists', () => {
      component.loginForm.patchValue({
        companyOrDomainName: 'innovapptive'
      });

      expect(component.loginForm.get('companyOrDomainName').errors).toBeNull();
    });

    it('should return invalidCompanyOrDomaniName true if given field not exists', () => {
      component.loginForm.patchValue({
        companyOrDomainName: 'innovapptive1'
      });

      expect(component.loginForm.get('companyOrDomainName').errors).toEqual({
        invalidCompanyOrDomaniName: true
      });
    });
  });

  describe('onEnter', () => {
    it('should define function', () => {
      expect(component.onEnter).toBeDefined();
    });

    it('should set companyOrDomainName to be touched', () => {
      const input = loginEl.querySelector('input');
      input.value = 'innovapptive';
      input.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter'
        })
      );
      fixture.detectChanges();

      expect(component.loginForm.get('companyOrDomainName').touched).toBeTrue();
    });
  });
});
