import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { of } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';
import { userData$ } from 'src/app/shared/components/header/header.component.mock';

import { RolesComponent } from './roles.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { PermissionsComponent } from '../permissions/permissions.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/shared/services/header.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

fdescribe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let toastSpy: ToastService;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let dialogSpy: MatDialog;
  let headerServiceSpy: HeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let toastServiceSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    rolesPermissionsServiceSpy = jasmine.createSpyObj(
      'RolesPermissionsService',
      ['getRoles$', 'getPermissions$']
    );
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getLogonUserDetails'
    ]);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [RolesComponent, MockComponent(PermissionsComponent)],
      imports: [
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule,
        FormsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: ToastService, useValue: toastSpy },
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    (rolesPermissionsServiceSpy.getRoles$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([]));

    (rolesPermissionsServiceSpy.getPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
