import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { ReportService } from '../services/report.service';

import { ReportsComponent } from './reports.component';
import { configOptions, reports, reports$ } from './reports.component.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { HeaderService } from 'src/app/shared/services/header.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let dialogSpy: MatDialog;
  let reportServiceSpy: ReportService;
  let reportConfigServiceSpy: ReportConfigurationService;
  let toastServiceSpy: ToastService;
  let headerServiceSpy: HeaderService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    reportServiceSpy = jasmine.createSpyObj(
      'ReportService',
      [
        'getReportsCount$',
        'clickNewReport',
        'updateConfigOptionsFromColumns',
        'deleteReport$',
        'getReports$',
        'getWidgets$'
      ],
      {
        clickNewReportAction$: of(false)
      }
    );
    reportConfigServiceSpy = jasmine.createSpyObj(
      'ReportConfigurationService',
      ['downloadReport$', 'updateReport$']
    );
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      imports: [
        RouterTestingModule,
        SharedModule,
        AppMaterialModules,
        DynamictableModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ReportService, useValue: reportServiceSpy },
        {
          provide: ReportConfigurationService,
          useValue: reportConfigServiceSpy
        },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    (reportServiceSpy.getReports$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: defaultLimit,
        type: 'all',
        searchKey: ''
      })
      .and.returnValue(reports$);
    (reportServiceSpy.getReportsCount$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(reports.data.length));
    (reportServiceSpy.updateConfigOptionsFromColumns as jasmine.Spy)
      .withArgs(reports.columns, component.configOptions)
      .and.returnValue(configOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
