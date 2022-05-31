import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { AppMaterialModules } from 'src/app/material.module';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { DashboardConfigurationComponent } from '../dashboard-configuration/dashboard-configuration.component';
import { DashboardService } from '../services/dashboard.service';

import { DashboardsComponent } from './dashboards.component';
import { dashboards, dashboards$ } from './dashboards.component.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { permissions$ } from 'src/app/shared/services/common.service.mock';

const info: ErrorInfo = {
  displayToast: true,
  failureResponse: 'throwError'
};

describe('DashboardsComponent', () => {
  let component: DashboardsComponent;
  let fixture: ComponentFixture<DashboardsComponent>;
  let dialogSpy: MatDialog;
  let dashboardServiceSpy: DashboardService;
  let commonServiceSpy: CommonService;
  let toastSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dashboardServiceSpy = jasmine.createSpyObj(
      'DashboardService',
      ['getDashboards$', 'updateDashboards', 'createDashboard$'],
      {
        dashboardSelectionChanged$: of('')
      }
    );
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['getUserName'], {
      permissionsAction$: permissions$
    });
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardsComponent,
        MockComponent(DashboardConfigurationComponent)
      ],
      imports: [
        AppMaterialModules,
        NgxShimmerLoadingModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsComponent);
    component = fixture.componentInstance;
    (dashboardServiceSpy.getDashboards$ as jasmine.Spy)
      .withArgs(info)
      .and.returnValue(dashboards$);
    component.selectedDashboard = dashboards[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
