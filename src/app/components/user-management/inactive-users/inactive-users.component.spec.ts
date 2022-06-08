import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { allRolesMock, usersMock } from '../services/users.mock';
import { UsersService } from '../services/users.service';
import { InactiveUsersComponent } from './inactive-users.component';
import {
  allPermissionsMock,
  roleWithPermissionsMock
} from '../services/roles-permissions.mock';
import { HeaderService } from 'src/app/shared/services/header.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {
  openCollabWindow$,
  unreadCount$,
  userData$
} from 'src/app/shared/components/header/header.component.mock';
import { ChatService } from 'src/app/shared/components/collaboration/chats/chat.service';

describe('InactiveUsersComponent', () => {
  let component: InactiveUsersComponent;
  let fixture: ComponentFixture<InactiveUsersComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
  let usersServiceSpy: UsersService;
  let headerServiceSpy: HeaderService;
  let chatServiceSpy: ChatService;
  let oidcSecurityServiceSpy: OidcSecurityService;

  beforeEach(async () => {
    rolesPermissionsServiceSpy = jasmine.createSpyObj(
      'RolesPermissionsService',
      ['getPermissions$', 'getRolesWithPermissions$']
    );

    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getRoles$',
      'getUsers$',
      'getUsersCount$'
    ]);

    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getLogonUserDetails',
      'getInstallationURL$'
    ]);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['collaborationWindowAction'],
      { unreadCount$, openCollabWindow$ }
    );

    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });

    await TestBed.configureTestingModule({
      declarations: [InactiveUsersComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUsersComponent);
    component = fixture.componentInstance;

    (headerServiceSpy.getInstallationURL$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of({ dummy: 'dummyvalue' }))
      .and.callThrough();

    (rolesPermissionsServiceSpy.getPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(allPermissionsMock));

    (usersServiceSpy.getRoles$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(allRolesMock));

    (rolesPermissionsServiceSpy.getRolesWithPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(roleWithPermissionsMock));

    (usersServiceSpy.getUsers$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: 25,
        isActive: false
      })
      .and.returnValue(of(usersMock));

    (usersServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({ isActive: false })
      .and.returnValue(of({ count: usersMock.length }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('getDisplayedUsers', () => {
    it('should define function', () => {
      expect(component.getDisplayedUsers).toBeDefined();
    });
    it('should get users data', () => {
      spyOn(component, 'getUsers');
      expect(usersServiceSpy.getUsers$).toHaveBeenCalledWith({
        skip: 0,
        limit: 25,
        isActive: false
      });
      component.users$.subscribe((response) => {
        expect(response.data).toEqual(usersMock);
      });
    });
  });

  describe('getUsers', () => {
    it('should define function', () => {
      expect(component.getUsers).toBeDefined();
    });

    it('should get all Users', () => {
      component.skip = 0;
      component.getUsers().subscribe((response) => {
        expect(response).toEqual(usersMock);
        expect(usersServiceSpy.getUsers$).toHaveBeenCalledWith({
          skip: 0,
          limit: 25,
          isActive: false
        });
      });
    });
  });

  describe('getUserCount', () => {
    it('should define function', () => {
      expect(component.getUserCount).toBeDefined();
    });

    it('should get users count', () => {
      component.userCount$.subscribe((response) => {
        expect(usersServiceSpy.getUsersCount$).toHaveBeenCalledWith({
          isActive: false
        });
        expect(response).toEqual({ count: usersMock.length });
      });
    });
  });

  describe('handleTableEvent', () => {
    it('should define function', () => {
      expect(component.handleTableEvent).toBeDefined();
    });

    it('should handle table event', () => {
      (usersServiceSpy.getUsers$ as jasmine.Spy)
        .withArgs({
          skip: 1,
          limit: 25,
          isActive: false
        })
        .and.returnValue(of([]));
      component.handleTableEvent({ data: 'infiniteScroll' });

      component.users$.subscribe((response) =>
        expect(response.data).toEqual(usersMock)
      );
    });
  });
});
