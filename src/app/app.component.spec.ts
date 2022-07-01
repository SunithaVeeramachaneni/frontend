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
import {
  openCollabWindow$,
  userData$
} from './shared/components/header/header.component.mock';
import { permissions$ } from './shared/services/common.service.mock';
import { UsersService } from './components/user-management/services/users.service';
import { SharedModule } from './shared/shared.module';
import { ChatService } from './shared/components/collaboration/chats/chat.service';
import { AuthHeaderService } from './shared/services/authHeader.service';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let commonServiceSpy: CommonService;
  let translateServiceSpy: TranslateService;
  let chatServiceSpy: ChatService;
  let authHeaderServiceSpy: AuthHeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let usersServiceSpy: UsersService;
  let appDe: DebugElement;
  let appEl: HTMLElement;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj(
      'CommonService',
      ['setCurrentRouteUrl', 'setTranslateLanguage'],
      {
        minimizeSidebarAction$: of(false),
        permissionsAction$: permissions$
      }
    );

    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });
    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserPermissionsByEmail$'
    ]);
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

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        SharedModule
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
        { provide: AuthHeaderService, useValue: authHeaderServiceSpy }
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
});
