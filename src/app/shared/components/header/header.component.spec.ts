import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CommonService } from '../../services/common.service';
import { permissions$ } from '../../services/common.service.mock';
import { HeaderService } from '../../services/header.service';
import { ChatService } from '../collaboration/chats/chat.service';

import { HeaderComponent } from './header.component';
import { userData$, openCollabWindow$ } from './header.component.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;
  let commonServiceSpy: CommonService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let chatServiceSpy: ChatService;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj(
      'CommonService',
      ['setCurrentRouteUrl', 'setTranslateLanguage'],
      {
        minimizeSidebarAction$: of(false),
        permissionsAction$: permissions$,
        userInfo$: userData$
      }
    );

    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getInstallationURL$'
    ]);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['collaborationWindowAction'],
      {
        unreadCount$: of(true),
        openCollabWindow$
      }
    );

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
        { provide: CommonService, useValue: commonServiceSpy }
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
