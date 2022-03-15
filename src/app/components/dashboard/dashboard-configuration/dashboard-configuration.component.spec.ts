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
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
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
  let commonServiceSpy: CommonService;
  let widgetServiceSpy: WidgetService;
  let dashboardServiceSpy: DashboardService;
  let toastSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      minimizeSidebarAction$: of(true)
    });
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
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: WidgetService, useValue: widgetServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
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
  let commonServiceSpy: CommonService;
  let widgetServiceSpy: WidgetService;
  let dashboardServiceSpy: DashboardService;
  let toastSpy: ToastService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      minimizeSidebarAction$: of(true)
    });
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
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: WidgetService, useValue: widgetServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
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
