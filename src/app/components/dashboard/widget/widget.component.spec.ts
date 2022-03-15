import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { ReportConfigurationService } from '../services/report-configuration.service';

import { WidgetComponent } from './widget.component';
import { widget } from './widget.component.mock';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;
  let reportConfigServiceSpy: ReportConfigurationService;

  beforeEach(async () => {
    reportConfigServiceSpy = jasmine.createSpyObj(
      'ReportConfigurationService',
      [
        'getGroupByCountDetails$',
        'updateChartConfig',
        'updateConfigOptionsFromReportConfiguration',
        'getReportData$',
        'getReportDataCount$'
      ]
    );

    await TestBed.configureTestingModule({
      declarations: [WidgetComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        }),
        NgxShimmerLoadingModule
      ],
      providers: [
        TranslateService,
        {
          provide: ReportConfigurationService,
          useValue: reportConfigServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = widget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `<app-widget
    [widget]="widget"
    [height]="height"
    (widgetAction)="widgetActionHandler($event)"
  ></app-widget>`
})
class TestWidgetHostComponent {
  widget = widget;
  height = 250;
  widgetActionHandler = () => {};
}

describe('TestWidgetHostComponent', () => {
  let component: TestWidgetHostComponent;
  let fixture: ComponentFixture<TestWidgetHostComponent>;
  let reportConfigServiceSpy: ReportConfigurationService;

  beforeEach(async () => {
    reportConfigServiceSpy = jasmine.createSpyObj(
      'ReportConfigurationService',
      [
        'getGroupByCountDetails$',
        'updateChartConfig',
        'updateConfigOptionsFromReportConfiguration',
        'getReportData$',
        'getReportDataCount$'
      ]
    );

    await TestBed.configureTestingModule({
      declarations: [WidgetComponent, TestWidgetHostComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        }),
        NgxShimmerLoadingModule
      ],
      providers: [
        TranslateService,
        {
          provide: ReportConfigurationService,
          useValue: reportConfigServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWidgetHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
