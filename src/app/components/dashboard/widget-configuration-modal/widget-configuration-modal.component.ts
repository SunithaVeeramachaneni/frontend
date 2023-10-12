import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  BehaviorSubject,
  combineLatest,
  interval,
  Observable,
  of,
  Subject
} from 'rxjs';
import { filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import {
  defaultCountFieldName,
  defaultLimit,
  permissions
} from 'src/app/app.constants';
import {
  AppChartConfig,
  AppChartData,
  ChartVariantChanges,
  Count,
  Dashboard,
  FilterApplied,
  FilterOptions,
  Report,
  ReportConfiguration,
  ReportDetails,
  TableColumn,
  TableEvent,
  ValidationError,
  Widget
} from 'src/app/interfaces';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { ReportService } from '../services/report.service';
import { cloneDeep } from 'lodash-es';
import { LoginService } from '../../login/services/login.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

export interface WidgetConfigurationModalData {
  dashboard: Dashboard;
  widget?: Widget;
  mode?: 'edit';
}

@Component({
  selector: 'app-widget-configuration-modal',
  templateUrl: './widget-configuration-modal.component.html',
  styleUrls: ['./widget-configuration-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetConfigurationModalComponent implements OnInit {
  reports$: Observable<Report>;
  filteredReports$: Observable<Report>;
  widgetConfigForm: FormGroup;
  searchReport$: Observable<any>;
  selectedReport: ReportConfiguration;
  chartConfig: AppChartConfig;
  fetchChartData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isFetchingChartData = false;
  chartData$: Observable<AppChartData[]>;
  chartVarient: string;
  chartVarient$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isChartVarientFormValid = true;
  reportConfigurationForTable: ReportConfiguration;
  configOptions: ConfigOptions = {
    tableID: 'widgetConfiguration',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 173px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;
  dataCount$: Observable<Count>;
  reportDetailsOnChartVarientFilter$: Observable<ReportDetails>;
  reportDetailsOnScroll$: Observable<ReportDetails>;
  reportDetails$: Observable<ReportDetails>;
  fetchData$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );
  filtersApplied$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  filtersApplied = false;
  skip = 0;
  limit = defaultLimit;
  reportColumns: TableColumn[] = [];
  fetchFilterOptions$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  filterOptions$: Observable<FilterOptions>;
  countType: string;
  countField: string;
  setSearchReport$ = new Subject<boolean>();
  updateWidget$: Observable<boolean>;
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  readonly permissions = permissions;
  errors: ValidationError = {};

  constructor(
    private reportService: ReportService,
    private reportConfigService: ReportConfigurationService,
    private dialogRef: MatDialogRef<WidgetConfigurationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: WidgetConfigurationModalData,
    private fb: FormBuilder,
    private loginService: LoginService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.widgetConfigForm = this.fb.group({
      searchReport: new FormControl(''),
      widgetName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(48),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ])
    });
    this.reports$ = this.reportService.getReports$({
      pagination: false
    });
    this.searchReport$ = this.f.searchReport.valueChanges.pipe(startWith(''));

    this.filteredReports$ = combineLatest([
      this.reports$,
      this.searchReport$
    ]).pipe(
      map(([reports, search]) => {
        search = search.name ? search.name : search;
        const { data = [] } = reports;
        const reportData = data.filter(
          (report) =>
            report.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
        this.setSearchReport$.next(true);
        return { ...reports, data: reportData };
      })
    );

    this.chartData$ = this.fetchChartData$.pipe(
      filter((fetchChartData) => fetchChartData === true),
      tap(() => (this.isFetchingChartData = true)),
      switchMap(() =>
        this.getGroupByCountDetails().pipe(
          tap(() => (this.isFetchingChartData = false))
        )
      )
    );

    this.reportDetailsOnChartVarientFilter$ = combineLatest([
      this.chartVarient$.pipe(
        filter((chartVarient) => chartVarient === 'table')
      ),
      this.filtersApplied$
    ]).pipe(
      map(([, filtersApplied]) => {
        this.skip = 0;
        this.filtersApplied = filtersApplied;
        this.dataCount$ = this.getReportDataCount();
        return this.getReportData();
      }),
      switchMap((reportDetails) => reportDetails)
    );

    this.reportDetailsOnScroll$ = this.fetchData$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getReportData();
        } else {
          return of({} as ReportDetails);
        }
      })
    );

    this.reportDetails$ = combineLatest([
      this.reportDetailsOnChartVarientFilter$,
      this.reportDetailsOnScroll$
    ]).pipe(
      map(([loadFilter, scroll]) => {
        if (this.skip === 0 && this.filtersApplied) {
          const { reportData: filterData = [] } = loadFilter;
          loadFilter.reportData = filterData;
        } else {
          const { reportData: scrollData = [] } = scroll;
          loadFilter.reportData = loadFilter.reportData.concat(scrollData);
        }

        this.skip = loadFilter.reportData
        ? loadFilter.reportData.length
        : this.skip;
                this.dataSource = new MatTableDataSource(loadFilter.reportData);
        return loadFilter;
      })
    );

    this.filterOptions$ = this.fetchFilterOptions$.pipe(
      filter((fetchFilterOptions) => fetchFilterOptions === true),
      switchMap(() =>
        this.getFilterOptions().pipe(
          tap((filterOptions) => {
            this.selectedReport = { ...this.selectedReport, filterOptions };
          })
        )
      )
    );

    this.updateWidget$ = this.setSearchReport$.pipe(
      take(1),
      switchMap((setSearchReport) =>
        interval(0).pipe(
          take(1),
          map(() => {
            const { widget } = this.data;
            if (widget) {
              const { report, name } = widget;
              this.f.searchReport.setValue(report);
              this.onReportSelection(report);
              this.f.widgetName.setValue(name);
            }
            return setSearchReport;
          })
        )
      )
    );
  }

  get f() {
    return this.widgetConfigForm.controls;
  }

  displayWith(report: ReportConfiguration) {
    return report ? report.name : undefined;
  }

  onReportSelection = (report: ReportConfiguration) => {
    this.selectedReport = cloneDeep({ ...report });
    this.reportConfigurationForTable = { ...this.selectedReport };
    const {
      name,
      chartDetails: { type, indexAxis, countFieldName }
    } = this.selectedReport;

    this.chartConfig = this.reportConfigService.updateChartConfig(
      this.selectedReport,
      this.chartConfig,
      this.data.mode === 'edit' ? false : true,
      false,
      false
    );
    this.reportColumns = [];
    this.selectedReport.tableDetails?.forEach((col) => {
      this.reportColumns = this.reportColumns.concat(col.columns);
    });
    this.reportConfigurationForTable.groupBy = type !== 'table' ? [] : [...(this.selectedReport?.groupBy || [])];
    this.configOptions.tableID = `${this.configOptions.tableID}${this.reportConfigurationForTable.id}`;
    this.configOptions =
      this.reportConfigService.updateConfigOptionsFromReportConfiguration(
        this.reportConfigurationForTable,
        this.configOptions
      );
    this.chartVarient = this.selectedReport.groupBy?.length && type !== 'table'
      ? `${type}${indexAxis ? `_${indexAxis}` : ``}`
      : 'table';
    this.chartVarient$.next(this.chartVarient);
    this.setGroupByCountQueryParams(countFieldName);
    this.fetchChartData$.next(true);
    this.fetchFilterOptions$.next(true);
    this.f.widgetName.setValue(name);
  };

  saveWidget = () => {
    const name = this.f.widgetName.value;
    const { datasetFields, countFields, ...chartDetails } = this.chartConfig;
    const { id: reportId, filtersApplied } = this.selectedReport;
    const { id: dashboardId } = this.data.dashboard;
    const createdBy = this.loginService.getLoggedInUserName();
    const isTable = this.chartVarient === 'table' ? true : false;
    const groupBy = this.reportConfigurationForTable.groupBy;
    const columns: Column[] = this.configOptions.allColumns;
    const tableColumns: TableColumn[] = columns
      .map((column) => {
        if (column.visible) {
          const { id, order, sticky, visible, displayName } = column;
          return {
            name: id,
            order,
            sticky,
            visible,
            displayName
          } as TableColumn;
        }
      })
      .filter((data) => data);

    const widget: Widget = {
      name,
      isTable,
      chartDetails,
      tableColumns,
      groupBy,
      filtersApplied,
      config: {
        x: 0,
        y: 0,
        cols: 6,
        rows: 6,
        dragEnabled: true,
        resizeEnabled: true
      },
      isFavorite: false,
      reportId,
      dashboardId,
      createdBy,
      report: this.selectedReport
    };
    this.dialogRef.close(widget);
  };

  getGroupByCountDetails = () =>
    this.reportConfigService.getGroupByCountDetails$(this.selectedReport, {
      type: this.countType,
      field: this.countField
    });

  getReportData = () =>
    this.reportConfigService.getReportData$(this.selectedReport, {
      skip: this.skip,
      limit: this.limit
    });

  getReportDataCount = () =>
    this.reportConfigService.getReportDataCount$(this.selectedReport, {});

  getFilterOptions = () =>
    this.reportConfigService.getFilterOptions$(this.selectedReport, {});

  tableEventHandler(event: TableEvent) {
    this.fetchData$.next(event);
  }

  configOptionsChangeHandler(event: any) {
    const { eventType } = event;
    switch (eventType) {
      case 'REFRESH_CONFIG':
        this.configOptions = { ...event.data };
        if (
          this.reportConfigurationForTable.groupBy.length !==
          this.configOptions.groupByColumns.length
        ) {
          this.reportConfigurationForTable.groupBy =
            this.configOptions.groupByColumns;
        }
        break;

      default:
      // do nothing;
    }
  }

  applyFilter(filtersObj: any) {
    this.widgetConfigForm.markAsDirty();
    const filtersApplied: FilterApplied[] = filtersObj.filters;
    if (filtersApplied) {
      this.selectedReport = { ...this.selectedReport, filtersApplied };
      this.filtersApplied$.next(true);
      this.fetchChartData$.next(true);
    }
  }

  onChartVarientChanges = (event: ChartVariantChanges) => {
    this.widgetConfigForm.markAsDirty();
    const { type: eventType, value, isFormValid } = event;

    switch (eventType) {
      case 'chartVarient':
        if (value !== 'table') {
          const chartInfo = value.split('_');
          let type;
          let indexAxis;
          let isStacked = false;
          if (chartInfo.length === 2) {
            [type, indexAxis = ''] = chartInfo;
            isStacked = false;
          } else if (chartInfo.length === 3) {
            [, /*ignore*/ type, indexAxis] = chartInfo;
            isStacked = true;
          } else {
            [type, ,] = chartInfo;
          }
          this.selectedReport.chartDetails = {
            ...this.selectedReport.chartDetails,
            isStacked,
            type,
            indexAxis
          };
        }else {
          this.selectedReport.chartDetails = {
            ...this.selectedReport.chartDetails,
            type: 'table',
          }
        }
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.selectedReport,
          this.chartConfig,
          this.data.mode === 'edit' ? false : true,
          false
        );
        this.chartVarient = value;
        this.chartVarient$.next(value);
        break;

      case 'datasetFieldName':
        this.selectedReport.chartDetails.datasetFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.selectedReport,
          this.chartConfig,
          false,
          false
        );
        break;

      case 'stackFieldName':
        this.selectedReport.chartDetails.stackFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.selectedReport,
          this.chartConfig,
          true,
          true
        );
        break;

      case 'countFieldName':
        this.selectedReport.chartDetails.countFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.selectedReport,
          this.chartConfig,
          false,
          false,
          false
        );
        this.setGroupByCountQueryParams(value);
        this.fetchChartData$.next(true);
        break;

      case 'chartTitle':
        this.selectedReport.chartDetails.title = value;
        this.isChartVarientFormValid = isFormValid;
        this.chartConfig = {
          ...this.chartConfig,
          title: value,
          renderChart: !this.isFetchingChartData
        };
        break;

      case 'showValues':
        this.selectedReport.chartDetails.showValues = value;
        this.chartConfig = {
          ...this.chartConfig,
          showValues: value,
          renderChart: !this.isFetchingChartData
        };
        break;

      case 'showLegends':
        this.selectedReport.chartDetails.showLegends = value;
        this.chartConfig = {
          ...this.chartConfig,
          showLegends: value,
          renderChart: !this.isFetchingChartData
        };
        break;
      case 'customColors':
        this.selectedReport.chartDetails.customColors = value;
        this.chartConfig = {
          ...this.chartConfig,
          customColors: value,
          renderChart: !this.isFetchingChartData
        };
        this.cdrf.detectChanges();
        break;

      default:
      // do nothing
    }
  };

  setGroupByCountQueryParams = (countFieldName) => {
    if (countFieldName === defaultCountFieldName) {
      this.countType = 'count';
      this.countField = '';
    } else {
      this.countType = 'sum';
      this.countField = countFieldName;
    }
  };

  processValidationErrors(controlName: string): boolean {
    const touched = this.widgetConfigForm.get(controlName).touched;
    const errors = this.widgetConfigForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }
}
