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
import { logonUserDetails } from 'src/app/shared/services/header.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { DashboardsComponent } from '../dashboards/dashboards.component';
import { dashboards$ } from '../dashboards/dashboards.component.mock';
import { DashboardService } from '../services/dashboard.service';

import { DashboardContainerComponent } from './dashboard-container.component';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;
  let dashboardServiceSpy: DashboardService;
  let headerServiceSpy: HeaderService;
  let chatServiceSpy: ChatService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let breadcrumbService: BreadcrumbService;

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [], {
      dashboardsAction$: dashboards$
    });
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
      { unreadCount$, openCollabWindow$ }
    );

    await TestBed.configureTestingModule({
      declarations: [
        DashboardContainerComponent,
        MockComponent(DashboardsComponent)
      ],
      imports: [
        SharedModule,
        AppMaterialModules,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(DashboardContainerComponent);
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
