import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantsComponent } from '../tenants/tenants.component';

import { TenantManagementContainerComponent } from './tenant-management-container.component';

describe('TenantManagementContainerComponent', () => {
  let component: TenantManagementContainerComponent;
  let fixture: ComponentFixture<TenantManagementContainerComponent>;
  let commonServiceSpy: CommonService;
  let headerServiceSpy: HeaderService;
  let breadcrumbService: BreadcrumbService;
  let cdrf: ChangeDetectorRef;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      currentRouteUrlAction$: of(routingUrls.tenantManagement.url)
    });
    headerServiceSpy = jasmine.createSpyObj(
      'HeaderService',
      ['setHeaderTitle'],
      {
        headerTitleAction$: of(routingUrls.tenantManagement.title)
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        TenantManagementContainerComponent,
        MockComponent(TenantsComponent)
      ],
      imports: [SharedModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(TenantManagementContainerComponent);
    cdrf = fixture.debugElement.injector.get(ChangeDetectorRef);
    component = fixture.componentInstance;
    spyOn(breadcrumbService, 'set');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should skip breadcrumb if current route URL is tenant-management', () => {
    const detectChangesSpy = spyOn(cdrf.constructor.prototype, 'detectChanges');

    component.currentRouteUrl$.subscribe((data) => {
      expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
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
  });

  it('should set breadcrumb if current route url is not tenant-management', () => {
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
  });
});
