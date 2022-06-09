import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { ChatService } from 'src/app/shared/components/collaboration/chats/chat.service';
import {
  openCollabWindow$,
  unreadCount$,
  userData$
} from 'src/app/shared/components/header/header.component.mock';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { logonUserDetails } from 'src/app/shared/services/header.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantsComponent } from '../tenants/tenants.component';

import { TenantManagementContainerComponent } from './tenant-management-container.component';

describe('TenantManagementContainerComponent', () => {
  let component: TenantManagementContainerComponent;
  let fixture: ComponentFixture<TenantManagementContainerComponent>;
  let headerServiceSpy: HeaderService;
  let chatServiceSpy: ChatService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let commonServiceSpy: CommonService;
  let breadcrumbService: BreadcrumbService;
  let cdrf: ChangeDetectorRef;

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
      { unreadCount$, openCollabWindow$ }
    );
    commonServiceSpy = jasmine.createSpyObj(
      'CommonService',
      ['setHeaderTitle', 'setUserInfo'],
      {
        headerTitleAction$: of(routingUrls.tenantManagement.title),
        currentRouteUrlAction$: of(routingUrls.tenantManagement.url),
        minimizeSidebarAction$: of(true)
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        TenantManagementContainerComponent,
        MockComponent(TenantsComponent)
      ],
      imports: [SharedModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(TenantManagementContainerComponent);
    cdrf = fixture.debugElement.injector.get(ChangeDetectorRef);
    component = fixture.componentInstance;
    (headerServiceSpy.getLogonUserDetails as jasmine.Spy)
      .withArgs()
      .and.returnValue(logonUserDetails)
      .and.callThrough();

    (headerServiceSpy.getInstallationURL$ as jasmine.Spy).and.returnValue(
      of({ dummy: 'dummyvalue' })
    );
    spyOn(breadcrumbService, 'set');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should skip breadcrumb if current route URL is tenant-management', () => {
    const detectChangesSpy = spyOn(cdrf.constructor.prototype, 'detectChanges');

    component.currentRouteUrl$.subscribe((data) => {
      expect(commonServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
        routingUrls.tenantManagement.title
      );
      expect(breadcrumbService.set).toHaveBeenCalledWith(
        routingUrls.tenantManagement.url,
        {
          skip: true
        }
      );
      expect(detectChangesSpy).toHaveBeenCalledWith();
    });
    component.headerTitle$.subscribe((data) =>
      expect(data).toBe(routingUrls.tenantManagement.title)
    );
  });

  it('should display breadcrumb if current route url is not tenant-management', () => {
    (
      Object.getOwnPropertyDescriptor(
        commonServiceSpy,
        'currentRouteUrlAction$'
      ).get as jasmine.Spy
    ).and.returnValue(of('/tenant-management/create'));

    component.ngOnInit();
    fixture.detectChanges();

    component.currentRouteUrl$.subscribe(() => {
      expect(breadcrumbService.set).toHaveBeenCalledWith(
        routingUrls.tenantManagement.url,
        {
          skip: false
        }
      );
    });
    component.headerTitle$.subscribe((data) =>
      expect(data).toBe(routingUrls.tenantManagement.title)
    );
  });
});
