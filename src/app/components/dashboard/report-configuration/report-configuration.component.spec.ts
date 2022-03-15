import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportService } from '../services/report.service';
import { categories } from '../report-configuration-list-modal/report-configuration-list-modal.component.mock';
import { ReportConfigurationComponent } from './report-configuration.component';
import { of } from 'rxjs';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from 'src/app/shared/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderService } from 'src/app/shared/services/header.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { userData$ } from 'src/app/shared/components/header/header.component.mock';
import { ActivatedRoute } from '@angular/router';
import { defaultLimit } from 'src/app/app.constants';
import {
  configOptions,
  reportDetails,
  reportDetails$
} from './report-configuration.component.mock';
import { AppMaterialModules } from 'src/app/material.module';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { BreadcrumbService } from 'xng-breadcrumb';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MockComponent } from 'ng-mocks';

describe('ReportConfigurationComponent', () => {
  let component: ReportConfigurationComponent;
  let fixture: ComponentFixture<ReportConfigurationComponent>;
  let reportServiceSpy: ReportService;
  let reportConfigServiceSpy: ReportConfigurationService;
  let toastSpy: ToastService;
  let headerServiceSpy: HeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let activatedRouteSpy: ActivatedRoute;
  let breadcrumbService: BreadcrumbService;

  beforeEach(async () => {
    reportServiceSpy = jasmine.createSpyObj(
      'ReportService',
      ['clickNewReport'],
      {
        reportDefinitionAction$: of(categories[0].subCategories[0])
      }
    );
    reportConfigServiceSpy = jasmine.createSpyObj(
      'ReportConfigurationService',
      [
        'updateConfigOptionsFromReportConfiguration',
        'getReportDetails$',
        'getReportData$',
        'getGroupByCountDetails$',
        'getReportDataCountById$',
        'getReportDataCount$',
        'updateConfigOptionsFromFiltersApplied',
        'updateChartConfig'
      ]
    );
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getLogonUserDetails'
    ]);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$
    });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({})
    });

    await TestBed.configureTestingModule({
      declarations: [ReportConfigurationComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        RouterTestingModule,
        SharedModule,
        AppMaterialModules,
        DynamictableModule,
        BrowserAnimationsModule,
        FormsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: ReportService, useValue: reportServiceSpy },
        {
          provide: ReportConfigurationService,
          useValue: reportConfigServiceSpy
        },
        { provide: ToastService, useValue: toastSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(ReportConfigurationComponent);
    component = fixture.componentInstance;
    (reportConfigServiceSpy.getReportDetails$ as jasmine.Spy)
      .withArgs('reports/definition/', categories[0].subCategories[0], {
        skip: 0,
        limit: defaultLimit
      })
      .and.returnValue(reportDetails$);

    (
      reportConfigServiceSpy.updateConfigOptionsFromReportConfiguration as jasmine.Spy
    )
      .withArgs(reportDetails.report, component.configOptions)
      .and.returnValue({
        ...configOptions,
        tableId: 'reportConfigurationTable'
      });
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
