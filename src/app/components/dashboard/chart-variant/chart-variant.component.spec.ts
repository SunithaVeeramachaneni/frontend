import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVariantComponent } from './chart-variant.component';
import {
  chartConfig,
  configOptions,
  reportDetails
} from '../report-configuration/report-configuration.component.mock';
import { ReportConfiguration } from 'src/app/interfaces';
import { AppMaterialModules } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { DynamictableModule } from '@innovapptive.com/dynamictable';

const { report } = reportDetails;

describe('ChartVariantComponent', () => {
  let component: ChartVariantComponent;
  let fixture: ComponentFixture<ChartVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartVariantComponent],
      imports: [
        AppMaterialModules,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DynamictableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartVariantComponent);
    component = fixture.componentInstance;
    component.report = report as ReportConfiguration;
    component.chartConfig = chartConfig;
    component.configOptions = configOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `<app-chart-variant
    [report]="selectedReport"
    [chartConfig]="chartConfig"
    [configOptions]="configOptions"
    [displayTableVarient]="true"
    (chartVarientChanges)="onChartVarientChanges($event)"
  ></app-chart-variant>`
})
class TestChartVariantHostComponent {
  report = report;
  chartConfig = chartConfig;
  configOptions = configOptions;
  onChartVarientChanges = () => {};
}

describe('TestChartVariantHostComponent', () => {
  let component: TestChartVariantHostComponent;
  let fixture: ComponentFixture<TestChartVariantHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartVariantComponent, TestChartVariantHostComponent],
      imports: [
        AppMaterialModules,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DynamictableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChartVariantHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
