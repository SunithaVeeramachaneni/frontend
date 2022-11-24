import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppMaterialModules } from './material.module';
import { CommonService } from './shared/services/common.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MockComponent } from 'ng-mocks';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { openCollabWindow$ } from './shared/components/header/header.component.mock';
import { UsersService } from './components/user-management/services/users.service';
import { SharedModule } from './shared/shared.module';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { AuthHeaderService } from './shared/services/authHeader.service';
import { HeaderService } from './shared/services/header.service';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { LoginService } from './components/login/services/login.service';
import {
  permissions$,
  userAuthData$
} from './components/login/services/login.service.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { PeopleService } from './shared/components/collaboration/people/people.service';
import { ImageUtils } from './shared/utils/imageUtils';
import { MatDialog } from '@angular/material/dialog';
import { mockUserInfo } from './shared/components/collaboration/collaboration-mock';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let headerServiceSpy: HeaderService;
  let commonServiceSpy: CommonService;
  let translateServiceSpy: TranslateService;
  let chatServiceSpy: ChatService;
  let authHeaderServiceSpy: AuthHeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let usersServiceSpy: UsersService;
  let tenantServiceSpy: TenantService;
  let loginServiceSpy: LoginService;
  let peopleServiceSpy: PeopleService;
  let imageUtilsSpy: ImageUtils;
  let dialogSpy: MatDialog;

  let appDe: DebugElement;
  let appEl: HTMLElement;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setCurrentRouteUrl',
      'setTranslateLanguage'
    ]);

    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getInstallationURL$'
    ]);

    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$: userAuthData$
    });
    usersServiceSpy = jasmine.createSpyObj(
      'UsersService',
      ['getUserPermissionsByEmail$', 'removeUserPresence$', 'setUserPresence$'],
      {}
    );

    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      [
        'getCollaborationWindowStatus',
        'newMessageReceived',
        'setUnreadMessageCount',
        'getUnreadMessageCount'
      ],
      { processSSEMessages$: openCollabWindow$ }
    );
    authHeaderServiceSpy = jasmine.createSpyObj('AuthHeaderService', [
      'getAuthHeaders'
    ]);
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'getTenantInfo',
      'setTenantInfo'
    ]);
    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo', 'setLoggedInUserInfo'],
      {
        isUserAuthenticated$: of(true)
      }
    );
    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    peopleServiceSpy = jasmine.createSpyObj(
      'PeopleService',
      ['updateUserPresence'],
      {}
    );
    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});

    dialogSpy = jasmine.createSpyObj('MatDialog', ['close'], {
      open: () => {}
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        SharedModule,
        NgxShimmerLoadingModule
      ],
      declarations: [AppComponent, MockComponent(NgxSpinnerComponent)],
      providers: [
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthHeaderService, useValue: authHeaderServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: PeopleService, useValue: peopleServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appDe = fixture.debugElement;
    appEl = appDe.nativeElement;
    (usersServiceSpy.getUserPermissionsByEmail$ as jasmine.Spy)
      .withArgs('test.user@innovapptive.com')
      .and.returnValue(permissions$);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('onSignOut', () => {
    const tSpy = spyOn(component, 'removeUserPresence');
    component.onSignOut();
    expect(tSpy).toHaveBeenCalledTimes(1);
  });

  describe('updateUserPresence ', () => {
    it('when user is already online do nothing', () => {
      usersServiceSpy.setUserPresence$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));
      component.isUserOnline = true;
      component.isUserAuthenticated = false;
      const resp = component.updateUserPresence();
      expect(resp).toBeUndefined();
    });

    it('when user is not online update user presence', () => {
      usersServiceSpy.setUserPresence$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));
      component.isUserOnline = false;
      component.isUserAuthenticated = true;
      const resp = component.updateUserPresence();
      expect(resp).toBeUndefined();
      expect(usersServiceSpy.setUserPresence$).toHaveBeenCalledTimes(1);
    });
  });
  describe('removeUserPresence', () => {
    it('remove user presence', () => {
      usersServiceSpy.removeUserPresence$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));

      component.isUserOnline = false;
      component.isUserAuthenticated = true;
      const resp = component.removeUserPresence();
      expect(resp).toBeUndefined();
      expect(usersServiceSpy.removeUserPresence$).toHaveBeenCalledTimes(1);
    });
  });
});
