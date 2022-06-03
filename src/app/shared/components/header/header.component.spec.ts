import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { HeaderService } from '../../services/header.service';
import { logonUserDetails } from '../../services/header.service.mock';
import { ChatService } from '../collaboration/chats/chat.service';

import { HeaderComponent } from './header.component';
import {
  userData$,
  unreadCount$,
  openCollabWindow$
} from './header.component.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let chatServiceSpy: ChatService;

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getLogonUserDetails',
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
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    (headerServiceSpy.getLogonUserDetails as jasmine.Spy)
      .withArgs()
      .and.returnValue(logonUserDetails);

    (headerServiceSpy.getInstallationURL$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of({ dummy: 'dummyvalue' }))
      .and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
