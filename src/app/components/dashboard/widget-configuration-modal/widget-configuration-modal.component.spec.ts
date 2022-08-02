import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { dashboards } from '../dashboards/dashboards.component.mock';
import { reports$ } from '../reports/reports.component.mock';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { ReportService } from '../services/report.service';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import {
  WidgetConfigurationModalComponent,
  WidgetConfigurationModalData
} from './widget-configuration-modal.component';
import { LoginService } from '../../login/services/login.service';
import { userInfo$ } from '../../login/services/login.service.mock';

describe('WidgetConfigurationModalComponent', () => {
  let component: WidgetConfigurationModalComponent;
  let fixture: ComponentFixture<WidgetConfigurationModalComponent>;
  let reportServiceSpy: ReportService;
  let reportConfigServiceSpy: ReportConfigurationService;
  let loginServiceSpy: LoginService;
  let dialogRefSpy: MatDialogRef<WidgetConfigurationModalComponent>;
  let widgetConfigurationData: WidgetConfigurationModalData;

  beforeEach(async () => {
    reportServiceSpy = jasmine.createSpyObj('ReportService', ['getReports$']);
    reportConfigServiceSpy = jasmine.createSpyObj(
      'ReportConfigurationService',
      [
        'updateChartConfig',
        'updateConfigOptionsFromReportConfiguration',
        'getGroupByCountDetails$',
        'getReportData$',
        'getReportDataCount$',
        'getFilterOptions$'
      ]
    );
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });
    widgetConfigurationData = {
      dashboard: dashboards[0]
    };

    await TestBed.configureTestingModule({
      declarations: [WidgetConfigurationModalComponent],
      imports: [
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule
      ],
      providers: [
        { provide: ReportService, useValue: reportServiceSpy },
        {
          provide: ReportConfigurationService,
          useValue: reportConfigServiceSpy
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: widgetConfigurationData
        },
        {
          provide: LoginService,
          useValue: loginServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetConfigurationModalComponent);
    component = fixture.componentInstance;
    (reportServiceSpy.getReports$ as jasmine.Spy)
      .withArgs({
        pagination: false
      })
      .and.returnValue(reports$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
