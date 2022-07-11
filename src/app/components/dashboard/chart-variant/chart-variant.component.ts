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
  isStacked: boolean;
  chartVarientForm = this.fb.group({
    chartTitle: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(48)
    ]),
    datasetFieldName: [''],
    countFieldName: [''],
    stackFieldName: [''],
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
    const { isStacked, datasetFieldName, countFieldName, stackFieldName } =
      this.chartConfig;
    this.isStacked = isStacked;
    let chartVarient: string;
    if (isStacked) chartVarient = `stacked_${type}_${indexAxis}`;
    else
      chartVarient = groupBy?.length
        ? `${type}${indexAxis ? `_${indexAxis}` : ``}`
        : 'table';
    this.chartVarientForm.patchValue({
      chartVarient,
      chartTitle,
      datasetFieldName,
      countFieldName,
      stackFieldName,
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
        tap((value) => {
          this.chartVarientChanges.emit({
            type: 'showValues',
            value
          });
        })
      )
      .subscribe();

    this.f.showLegends.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((value) => {
          this.chartVarientChanges.emit({
            type: 'showLegends',
            value
          });
        })
      )
      .subscribe();

    this.f.datasetFieldName.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((value) => {
          this.chartVarientChanges.emit({
            type: 'datasetFieldName',
            value
          });
          if (this.isStacked) {
            const datasetFields = this.chartConfig.datasetFields.filter(
              (datasetField) =>
                datasetField.name !== this.f.stackFieldName.value
            );
            if (this.f.datasetFieldName.value === this.f.stackFieldName.value) {
              this.f.stackFieldName.setValue(datasetFields[0].name);
            }
          }
        })
      )
      .subscribe();

    this.f.countFieldName.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((value) => {
          this.chartVarientChanges.emit({
            type: 'countFieldName',
            value
          });
        })
      )
      .subscribe();

    this.f.stackFieldName.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((value) => {
          this.chartVarientChanges.emit({
            type: 'stackFieldName',
            value
          });
          if (this.isStacked) {
            const datasetFields = this.chartConfig.datasetFields.filter(
              (datasetField) =>
                datasetField.name !== this.f.datasetFieldName.value
            );
            if (this.f.datasetFieldName.value === this.f.stackFieldName.value) {
              this.f.datasetFieldName.setValue(datasetFields[0].name);
            }
          }
        })
      )
      .subscribe();
  }

  get f() {
    return this.chartVarientForm.controls;
  }

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
    this.isStacked = false;
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

    if (this.f.chartVarient.value.indexOf('stacked') > -1) {
      this.isStacked = true;
    }
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
