import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgChartsModule } from 'ng2-charts';
import { chartConfig } from '../report-configuration/report-configuration.component.mock';

import { ChartComponent } from './chart.component';
import { chartData } from './chart.component.mock';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChartComponent],
        imports: [NgChartsModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.chartConfig = chartConfig;
    component.chartData = chartData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `<app-chart
    [chartConfig]="chartConfig"
    [chartData]="chartData"
  ></app-chart>`
})
class TestChartHostComponent {
  chartConfig = chartConfig;
  chartData = chartData;
}

describe('TestChartHostComponent', () => {
  let component: TestChartHostComponent;
  let fixture: ComponentFixture<TestChartHostComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChartComponent, TestChartHostComponent],
        imports: [NgChartsModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChartHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
