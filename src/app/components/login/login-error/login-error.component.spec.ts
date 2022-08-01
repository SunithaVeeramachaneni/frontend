import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { tenantsInfo } from 'src/app/auth-config.service.mock';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { LoginErrorModalComponent } from '../login-error-modal/login-error-modal.component';

import { LoginErrorComponent } from './login-error.component';

describe('LoginErrorComponent', () => {
  let component: LoginErrorComponent;
  let fixture: ComponentFixture<LoginErrorComponent>;
  let matDialogSpy: MatDialog;
  let tenantServiceSpy: TenantService;
  let oidcSecurityServiceSpy: OidcSecurityService;

  beforeEach(async () => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getTenantInfo']);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [
      'logoffAndRevokeTokens'
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginErrorComponent, BackgroundComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginErrorComponent);
    component = fixture.componentInstance;
    (matDialogSpy.open as jasmine.Spy)
      .withArgs(LoginErrorModalComponent, {
        disableClose: true
      })
      .and.returnValue({ afterClosed: () => of(true) });
    (tenantServiceSpy.getTenantInfo as jasmine.Spy)
      .withArgs()
      .and.returnValue(tenantsInfo[0]);
    (oidcSecurityServiceSpy.logoffAndRevokeTokens as jasmine.Spy)
      .withArgs(tenantsInfo[0].tenantId)
      .and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should handle open and closing of login error modal component', () => {
      spyOn(sessionStorage, 'clear');
      component.ngOnInit();

      expect(matDialogSpy.open).toHaveBeenCalledWith(LoginErrorModalComponent, {
        disableClose: true
      });
      expect(tenantServiceSpy.getTenantInfo).toHaveBeenCalledWith();
      expect(oidcSecurityServiceSpy.logoffAndRevokeTokens).toHaveBeenCalledWith(
        tenantsInfo[0].tenantId
      );
      expect(sessionStorage.clear).toHaveBeenCalledWith();
    });
  });
});
