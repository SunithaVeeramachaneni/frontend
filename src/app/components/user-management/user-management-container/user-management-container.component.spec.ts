import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { ChatService } from 'src/app/shared/components/collaboration/chats/chat.service';
import {
  openCollabWindow$,
  unreadCount$,
  userData$
} from 'src/app/shared/components/header/header.component.mock';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { UsersComponent } from '../users/users.component';

import { UserManagementContainerComponent } from './user-management-container.component';

describe('UserManagementContainerComponent', () => {
  let component: UserManagementContainerComponent;
  let fixture: ComponentFixture<UserManagementContainerComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let headerServiceSpy: HeaderService;
  let chatServiceSpy: ChatService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let breadcrumbService: BreadcrumbService;

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getInstallationURL$'
    ]);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['collaborationWindowAction'],
      { unreadCount$, openCollabWindow$ }
    );
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [
      'logoffAndRevokeTokens'
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        UserManagementContainerComponent,
        MockComponent(UsersComponent)
      ],
      imports: [
        SharedModule,
        AppMaterialModules,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(UserManagementContainerComponent);
    component = fixture.componentInstance;
    (headerServiceSpy.getInstallationURL$ as jasmine.Spy).and.returnValue(
      of({ dummy: 'dummyvalue' })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
