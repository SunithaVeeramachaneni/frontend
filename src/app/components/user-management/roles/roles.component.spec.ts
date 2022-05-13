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
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let dialogSpy: MatDialog;
  let headerServiceSpy: HeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let toastServiceSpy: ToastService;

  const role = {
    id: '1',
    name: 'New Role',
    description: 'New Role Description',
    permissionIds: [1, 2]
  };

  const permissions = [
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Create Report',
      id: '1',
      moduleName: 'Reports',
      name: 'CREATE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    },
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Edit Report',
      id: '2',
      moduleName: 'Reports',
      name: 'UPDATE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    },
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Delete Report',
      id: '3',
      moduleName: 'Reports',
      name: 'DELETE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    },
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Share Report',
      id: '4',
      moduleName: 'Reports',
      name: 'SHARE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    }
  ];

  const user = [
    {
      createdAt: '2022-04-22T07:15:40.000Z',
      createdBy: 1,
      email: 'dev1@innovapptive.com',
      firstName: 'dev5',
      id: 4,
      isActive: false,
      lastName: 'inno',
      profileImage: { type: 'Buffer', data: Array(7728) },
      title: 'developer',
      updatedAt: '2022-04-26T11:59:24.000Z',
      updatedBy: 1
    }
  ];

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    rolesPermissionsServiceSpy = jasmine.createSpyObj(
      'RolesPermissionsService',
      [
        'getRolesWithPermissions$',
        'getPermissions$',
        'getUsersByRoleId$',
        'createRole$',
        'updateRole$'
      ]
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
        { provide: ToastService, useValue: toastServiceSpy },
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

    (rolesPermissionsServiceSpy.getPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(permissions));

    (rolesPermissionsServiceSpy.getRolesWithPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(permissions));

    (rolesPermissionsServiceSpy.getUsersByRoleId$ as jasmine.Spy)
      .withArgs(role.id)
      .and.returnValue(of(user));

    (rolesPermissionsServiceSpy.createRole$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(role));

    (rolesPermissionsServiceSpy.updateRole$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(role));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get form data', () => {
    const name = component.roleForm.controls.name;
    expect(name.valid).toBeFalsy();
    const description = component.roleForm.controls.description;
    expect(description.valid).toBeFalsy();
  });

  it('should get addRole method', () => {
    component.addRole();
  });

  it('should get getRoles method', () => {
    component.getRoles();
  });

  it('should get update method', () => {
    component.update('');
  });

  it('should get deleteRoles method', () => {
    component.deleteRoles();
    spyOn(component, 'deleteRole');
  });

  it('should get deleteRole method', () => {
    component.deleteRole(role);
  });

  it('should get saveRole', () => {
    spyOn(component, 'saveRole');
  });

  it('should get cancelRole', () => {
    component.cancelRole();
    expect(component.selectedRole).toBe(undefined);
  });

  it('should get showSelectedRole method', () => {
    component.showSelectedRole(role);
  });

  it('should get roleChecked method', () => {
    component.roleChecked(role, '');
  });
});
