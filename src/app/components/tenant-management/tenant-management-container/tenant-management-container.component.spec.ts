import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TenantsComponent } from '../tenants/tenants.component';

import { TenantManagementContainerComponent } from './tenant-management-container.component';

describe('TenantManagementContainerComponent', () => {
  let component: TenantManagementContainerComponent;
  let fixture: ComponentFixture<TenantManagementContainerComponent>;
  let commonServiceSpy: CommonService;
  let cdrf: ChangeDetectorRef;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj(
      'CommonService',
      ['setHeaderTitle'],
      {
        headerTitleAction$: of(routingUrls.tenantManagement.title),
        currentRouteUrlAction$: of(routingUrls.tenantManagement.url)
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        TenantManagementContainerComponent,
        MockComponent(TenantsComponent)
      ],
      imports: [SharedModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [{ provide: CommonService, useValue: commonServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantManagementContainerComponent);
    cdrf = fixture.debugElement.injector.get(ChangeDetectorRef);
    component = fixture.componentInstance;
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
  });
});
