import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import {
  userAuthData$,
  userInfo$
} from 'src/app/components/login/services/login.service.mock';
import { AppMaterialModules } from 'src/app/material.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';
import { ChatService } from '../collaboration/chats/chat.service';

import { HeaderComponent } from './header.component';
import { openCollabWindow$ } from './header.component.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;
  let commonServiceSpy: CommonService;
  let loginServiceSpy: LoginService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let chatServiceSpy: ChatService;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setCurrentRouteUrl',
      'setTranslateLanguage'
    ]);

    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getInstallationURL$'
    ]);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$: userAuthData$
    });
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['collaborationWindowAction'],
      {
        unreadCount$: of(true),
        openCollabWindow$
      }
    );
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$,
      userInfo$
    });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        AppMaterialModules,
        BreadcrumbModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
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
