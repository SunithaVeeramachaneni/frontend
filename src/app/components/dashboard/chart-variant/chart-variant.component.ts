/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  AppChartConfig,
  ChartVariantChanges,
  ReportConfiguration
} from 'src/app/interfaces';

@Component({
  selector: 'app-chart-variant',
  templateUrl: './chart-variant.component.html',
  styleUrls: ['./chart-variant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartVariantComponent implements OnInit, OnDestroy {
  @Input() set report(report: ReportConfiguration) {
    this._report = report ? report : ({} as ReportConfiguration);
  }
  get report(): ReportConfiguration {
    return this._report;
  }
  @Input() chartConfig: AppChartConfig;
  @Input() configOptions: ConfigOptions;
  @Input() displayTableVarient: boolean;

  @Output() chartVarientChanges: EventEmitter<ChartVariantChanges> =
    new EventEmitter<ChartVariantChanges>();

  firstInputName: string;
  secondInputName: string;
  chartVarientForm = this.fb.group({
    chartTitle: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(48)
    ]),
    chartVarient: new FormControl(''),
    showValues: new FormControl(false),
    showLegends: new FormControl(false)
  });

  private _report: ReportConfiguration;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const {
      chartDetails: {
        type,
        indexAxis,
        title: chartTitle,
        showValues,
        showLegends
      } = {},
      groupBy
    } = this.report;
    const { isStacked } = this.chartConfig;
    let chartVarient;
    if (isStacked) chartVarient = `stacked_${type}_${indexAxis}`;
    else
      chartVarient = groupBy?.length
        ? `${type}${indexAxis ? `_${indexAxis}` : ``}`
        : 'table';
    this.chartVarientForm.patchValue({
      chartVarient,
      chartTitle,
      showValues,
      showLegends
    });
    this.setAxisNames();

    this.f.chartTitle.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((title) => {
          this.chartVarientChanges.emit({
            type: 'chartTitle',
            value: title,
            isFormValid: this.chartVarientForm.valid
          });
        })
      )
      .subscribe();

    this.f.showValues.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((showValues) => {
          this.chartVarientChanges.emit({
            type: 'showValues',
            value: showValues
          });
        })
      )
      .subscribe();

    this.f.showLegends.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((showLegends) => {
          this.chartVarientChanges.emit({
            type: 'showLegends',
            value: showLegends
          });
        })
      )
      .subscribe();
  }

  get f() {
    return this.chartVarientForm.controls;
  }

  onDatasetFieldNameChange = () => {
    this.chartVarientChanges.emit({
      type: 'datasetFieldName',
      value: this.chartConfig.datasetFieldName
    });
  };

  onCountFieldNameChange = () => {
    this.chartVarientChanges.emit({
      type: 'countFieldName',
      value: this.chartConfig.countFieldName
    });
  };

  onStackFieldNameChange = () => {
    this.chartVarientChanges.emit({
      type: 'stackFieldName',
      value: this.chartConfig.stackFieldName
    });
  };

  onChartVarientChange = (event: MatButtonToggleChange) => {
    const { value } = event;
    this.chartVarientChanges.emit({
      type: 'chartVarient',
      value
    });
    this.setAxisNames();
  };

  getImage = (imageName: string, active: boolean) =>
    active
      ? `assets/dashboard-icons/${imageName}_active.svg`
      : `assets/dashboard-icons/${imageName}.svg`;

  setAxisNames = () => {
    if (
      this.f.chartVarient.value === 'doughnut' ||
      this.f.chartVarient.value === 'pie'
    ) {
      this.firstInputName = 'Sliced By';
      this.secondInputName = 'Value';
    } else if (
      this.f.chartVarient.value === 'stacked_bar_x' ||
      this.f.chartVarient.value === 'bar_x'
    ) {
      this.firstInputName = 'X axis';
      this.secondInputName = 'Y axis';
    } else {
      this.firstInputName = 'Y axis';
      this.secondInputName = 'X axis';
    }
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
