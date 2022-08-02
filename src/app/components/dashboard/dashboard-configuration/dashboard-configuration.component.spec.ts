import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { GridsterModule } from 'angular-gridster2';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';
import { LoginService } from '../../login/services/login.service';
import { userInfo$ } from '../../login/services/login.service.mock';
import {
  dashboards,
  dashboards$
} from '../dashboards/dashboards.component.mock';
import { DashboardService } from '../services/dashboard.service';
import { WidgetService } from '../services/widget.service';
import { WidgetComponent } from '../widget/widget.component';

import { DashboardConfigurationComponent } from './dashboard-configuration.component';
import { widgets$ } from './dashboard-configuration.component.mock';

describe('DashboardConfigurationComponent', () => {
  let component: DashboardConfigurationComponent;
  let fixture: ComponentFixture<DashboardConfigurationComponent>;
  let dialogSpy: MatDialog;
  let spinnerSpy: NgxSpinnerService;
  let widgetServiceSpy: WidgetService;
  let dashboardServiceSpy: DashboardService;
  let loginServiceSpy: LoginService;
  let toastSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    widgetServiceSpy = jasmine.createSpyObj('WidgetService', [
      'updateWidget$',
      'getDahboardWidgetsWithReport$',
      'updateWidget$',
      'createWidget$'
    ]);
    dashboardServiceSpy = jasmine.createSpyObj(
      'DashboardService',
      ['dashboardSelectionChanged', 'updateGridOptions'],
      {
        dashboardsAction$: dashboards$,
        updateGridOptionsAction$: of({
          update: false,
          subtractWidth: 0
        })
      }
    );
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardConfigurationComponent,
        MockComponent(WidgetComponent),
        MockComponent(NgxSpinnerComponent)
      ],
      imports: [
        AppMaterialModules,
        GridsterModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        }),
        ReactiveFormsModule
      ],
      providers: [
        TranslateService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: WidgetService, useValue: widgetServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardConfigurationComponent);
    component = fixture.componentInstance;
    component.dashboard = dashboards[0];
    component.dashboardDisplayMode = 'ALL';
    (widgetServiceSpy.getDahboardWidgetsWithReport$ as jasmine.Spy)
      .withArgs(dashboards[0].id)
      .and.returnValue(widgets$);
    component.renderDashboard();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `<app-dashboard-configuration
    [dashboard]="selectedDashboard"
    [dashboardDisplayMode]="ALL"
  ></app-dashboard-configuration>`
})
class TestDashboardConfigurationHostComponent {
  selectedDashboard = dashboards[0];
}

describe('TestDashboardConfigurationHostComponent', () => {
  let component: TestDashboardConfigurationHostComponent;
  let fixture: ComponentFixture<TestDashboardConfigurationHostComponent>;
  let dialogSpy: MatDialog;
  let spinnerSpy: NgxSpinnerService;
  let widgetServiceSpy: WidgetService;
  let dashboardServiceSpy: DashboardService;
  let loginServiceSpy: LoginService;
  let toastSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    widgetServiceSpy = jasmine.createSpyObj('WidgetService', [
      'updateWidget$',
      'getDahboardWidgetsWithReport$',
      'updateWidget$',
      'createWidget$'
    ]);
    dashboardServiceSpy = jasmine.createSpyObj(
      'DashboardService',
      ['dashboardSelectionChanged', 'updateGridOptions'],
      {
        dashboardsAction$: dashboards$,
        updateGridOptionsAction$: of({
          update: false,
          subtractWidth: 0
        })
      }
    );
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardConfigurationComponent,
        TestDashboardConfigurationHostComponent,
        MockComponent(WidgetComponent),
        MockComponent(NgxSpinnerComponent)
      ],
      imports: [
        AppMaterialModules,
        GridsterModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        }),
        ReactiveFormsModule
      ],
      providers: [
        TranslateService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: WidgetService, useValue: widgetServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDashboardConfigurationHostComponent);
    component = fixture.componentInstance;
    (widgetServiceSpy.getDahboardWidgetsWithReport$ as jasmine.Spy)
      .withArgs(dashboards[0].id)
      .and.returnValue(widgets$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
