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
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import {
  openCollabWindow$,
  unreadCount$,
  userData$
} from 'src/app/shared/components/header/header.component.mock';
import { HeaderService } from 'src/app/shared/services/header.service';
import { logonUserDetails } from 'src/app/shared/services/header.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule, ToastService } from 'src/app/shared/toast';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { ReportService } from '../services/report.service';

import { ReportsComponent } from './reports.component';
import { configOptions, reports, reports$ } from './reports.component.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { ChatService } from 'src/app/shared/components/collaboration/chats/chat.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let dialogSpy: MatDialog;
  let reportServiceSpy: ReportService;
  let reportConfigServiceSpy: ReportConfigurationService;
  let headerServiceSpy: HeaderService;
  let chatServiceSpy: ChatService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let toastServiceSpy: ToastService;

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
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getLogonUserDetails',
      'getInstallationURL$'
    ]);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['collaborationWindowAction'],
      { unreadCount$, openCollabWindow$ }
    );
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

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
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
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
