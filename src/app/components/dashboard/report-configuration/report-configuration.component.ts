import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pairwise,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  AppChartConfig,
  AppChartData,
  ChartVariantChanges,
  ColumnObject,
  Count,
  ErrorInfo,
  FilterApplied,
  ReportConfiguration,
  ReportDetails,
  TableColumn,
  TableEvent
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { ReportService } from '../services/report.service';
import {
  defaultLimit,
  defaultCountFieldName,
  permissions
} from '../../../app.constants';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { ReportConfigurationService } from '../services/report-configuration.service';

import { UndoRedoUtil } from '../../../shared/utils/UndoRedoUtil';
import { DynamictableFilterService } from '@innovapptive.com/dynamictable';
import { downloadFile } from '../../../shared/utils/fileUtils';
import { ReportSaveAsModalComponent } from '../report-save-as-modal/report-save-as-modal.component';
import { BreadcrumbService } from 'xng-breadcrumb';
import { HeaderService } from 'src/app/shared/services/header.service';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-report-configuration',
  templateUrl: './report-configuration.component.html',
  styleUrls: ['./report-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportConfigurationComponent implements OnInit {
  title = 'Report Configuration';
  disableReportName = true;
  isPopoverOpen = false;
  reportNameAndDescForm: FormGroup;
  reportDetailsOnLoadFilter$: Observable<ReportDetails>;
  reportDetailsOnScroll$: Observable<ReportDetails>;
  isChartVariantApplyDisabled = false;
  reportDetails$: Observable<ReportDetails>;
  dataSource: MatTableDataSource<any>;
  chartVarient: string;
  chartVarient$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isFetchingChartData = false;
  countType: string;
  countField: string;
  chartVariantChanges = {};
  configOptions: ConfigOptions = {
    tableID: 'reportConfigurationTable',
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
    tableHeight: 'calc(100vh - 160px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e6d9d9']
  };
  dummy = '';
  skip = 0;
  searchKey = '';
  limit = defaultLimit;
  reportConfiguration: ReportConfiguration;
  reportDefinitionNameOrId: string;
  reportDetailsUrlString: string;
  reportDataCountUrlString: string;
  dataCount$: Observable<Count>;
  fetchData$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );
  filtersApplied$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  filtersApplied = false;
  chartConfig: AppChartConfig = {
    title: '',
    type: 'bar',
    isStacked: false,
    indexAxis: 'y',
    showLegends: false,
    showValues: false,
    datasetFieldName: '',
    countFieldName: defaultCountFieldName,
    datasetFields: [],
    countFields: []
  };
  fetchChartData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  chartData$: Observable<AppChartData[]>;
  reportColumns: TableColumn[] = [];
  undoRedoUtil: any;
  subscription: any;
  isExportInProgress = false;
  showPreview: boolean;
  readonly permissions = permissions;

  constructor(
    private cdrf: ChangeDetectorRef,
    private reportService: ReportService,
    private reportConfigService: ReportConfigurationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
    private dynamictableFilterService: DynamictableFilterService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private breadcrumbService: BreadcrumbService,
    private headerService: HeaderService,
    private loginService: LoginService
  ) {}

  get reportName() {
    return this.reportNameAndDescForm.get('name');
  }

  get reportDescription() {
    return this.reportNameAndDescForm.get('description');
  }

  ngOnInit() {
    this.reportNameAndDescForm = this.fb.group({
      // reportDescription: new FormControl(''),[
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(48)
      // ],
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(48)
      ])
    });

    this.reportName.valueChanges
      .pipe(
        distinctUntilChanged(),
        pairwise() // gets a pair of old and new value
      )
      .subscribe(([oldValue, newValue]) => {
        this.reportConfiguration.name = newValue;
        this.undoRedoUtil.WRITE({
          eventType: 'REPORT_TITLE',
          currentValue: newValue,
          prevValue: oldValue
        });
        this.reportName.patchValue(newValue);
        this.breadcrumbService.set('@reportConfiguration', { label: newValue });
        this.headerService.setHeaderTitle(newValue);
      });

    this.undoRedoUtil = new UndoRedoUtil();

    this.reportDetailsOnLoadFilter$ = combineLatest([
      this.reportService.reportDefinitionAction$,
      this.filtersApplied$,
      this.route.params,
      this.route.queryParams
    ]).pipe(
      map(([reportDefinition, filtersApplied, params, queryParams]) => {
        this.skip = 0;
        this.filtersApplied = filtersApplied;
        const preview =
          queryParams.preview === 'true' || queryParams.preview === 'false'
            ? JSON.parse(queryParams.preview)
            : false;
        this.showPreview =
          this.showPreview === undefined ? preview : this.showPreview;
        if (this.filtersApplied) {
          this.dataCount$ = this.getReportDataCount();
          return this.getReportData();
        } else if (!this.filtersApplied) {
          if (params.id || reportDefinition) {
            if (params.id) {
              this.reportDefinitionNameOrId = params.id;
              this.reportDetailsUrlString = 'reports/';
              this.reportDataCountUrlString = 'reports/recordCountById/';
            } else {
              this.reportDefinitionNameOrId = reportDefinition;
              this.reportDetailsUrlString = 'reports/definition/';
              this.reportDataCountUrlString =
                'reports/recordCountByDefinition/';
            }
            this.dataCount$ = this.getReportDataCountById();
            return this.getReportDetails();
          } else {
            this.reportService.clickNewReport(true);
            this.router.navigate(['/dashboard/reports']);
            return of({} as ReportDetails);
          }
        }
      }),
      switchMap((reportDetails) => reportDetails)
    );

    this.reportDetailsOnScroll$ = this.fetchData$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          if (this.filtersApplied) {
            return this.getReportData();
          } else {
            return this.getReportDetails();
          }
        } else {
          return of({} as ReportDetails);
        }
      })
    );

    this.reportDetails$ = combineLatest([
      this.reportDetailsOnLoadFilter$,
      this.reportDetailsOnScroll$
    ]).pipe(
      map(([loadFilter, scroll]) => {
        if (this.skip === 0 && !this.filtersApplied) {
          const { report } = loadFilter;
          this.reportConfiguration = report
            ? report
            : ({} as ReportConfiguration);
          this.reportName.patchValue(this.reportConfiguration.name);
          this.breadcrumbService.set('@reportConfiguration', {
            label:
              this.reportConfiguration && this.reportConfiguration.id
                ? this.reportName.value
                : `${this.reportName.value} *`
          });
          this.headerService.setHeaderTitle(
            this.reportConfiguration && this.reportConfiguration.id
              ? this.reportName.value
              : `${this.reportName.value} *`
          );
          const { showChart = false, chartDetails } = this.reportConfiguration;
          this.configOptions =
            this.reportConfigService.updateConfigOptionsFromReportConfiguration(
              this.reportConfiguration,
              this.configOptions
            );
          const { datasetFields, ...rest } = this.chartConfig;
          this.reportConfiguration.chartDetails = chartDetails
            ? chartDetails
            : rest;
          this.updateChartConfig(showChart, true);
          this.reportConfiguration.tableDetails?.forEach((col) => {
            this.reportColumns = this.reportColumns.concat(col.columns);
          });
        } else if (this.skip === 0 && this.filtersApplied) {
          const { reportData: filterData = [] } = loadFilter;
          loadFilter.report = this.reportConfiguration;
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

    this.chartData$ = this.fetchChartData$.pipe(
      filter((fetchChartData) => fetchChartData === true),
      tap(() => (this.isFetchingChartData = true)),
      switchMap(() =>
        this.getGroupByCountDetails().pipe(
          tap(() => (this.isFetchingChartData = false))
        )
      )
    );
  }

  appendChartVariantChanges = (event: ChartVariantChanges) => {
    const { type: eventType, isFormValid } = event;
    if (isFormValid !== undefined)
      this.isChartVariantApplyDisabled = !isFormValid;
    if (!this.chartVariantChanges[eventType])
      this.chartVariantChanges[eventType] = null;
    this.chartVariantChanges[eventType] = event;
  };

  applyChartVarientChange = (event: ChartVariantChanges) => {
    const { type: eventType, value } = event;
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

          this.reportConfiguration.chartDetails = {
            ...this.reportConfiguration.chartDetails,
            isStacked,
            type,
            indexAxis
          };
          this.chartConfig = this.reportConfigService.updateChartConfig(
            this.reportConfiguration,
            this.chartConfig,
            true,
            true
          );
        }
        this.chartVarient = value;
        this.chartVarient$.next(value);
        break;

      case 'datasetFieldName':
        this.reportConfiguration.chartDetails.datasetFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.reportConfiguration,
          this.chartConfig,
          true,
          true
        );
        break;

      case 'stackFieldName':
        this.reportConfiguration.chartDetails.stackFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.reportConfiguration,
          this.chartConfig,
          true,
          true
        );
        break;

      case 'countFieldName':
        this.reportConfiguration.chartDetails.countFieldName = value;
        this.chartConfig = this.reportConfigService.updateChartConfig(
          this.reportConfiguration,
          this.chartConfig,
          true,
          true,
          false
        );
        this.setGroupByCountQueryParams(value);
        this.fetchChartData$.next(true);
        break;

      case 'chartTitle':
        this.reportConfiguration.chartDetails.title = value;
        this.chartConfig = {
          ...this.chartConfig,
          title: value,
          renderChart: !this.isFetchingChartData
        };
        break;

      case 'showValues':
        this.reportConfiguration.chartDetails.showValues = value;
        this.chartConfig = {
          ...this.chartConfig,
          showValues: value,
          renderChart: !this.isFetchingChartData
        };
        break;

      case 'showLegends':
        this.reportConfiguration.chartDetails.showLegends = value;
        this.chartConfig = {
          ...this.chartConfig,
          showLegends: value,
          renderChart: !this.isFetchingChartData
        };
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

  applyChartVariantChanges = () => {
    this.isPopoverOpen = false;
    // eslint-disable-next-line guard-for-in
    for (const key in this.chartVariantChanges) {
      if (this.chartVariantChanges[key])
        this.applyChartVarientChange(this.chartVariantChanges[key]);
    }
    this.chartVariantChanges = {};
  };

  handleEvent(event: any) {
    if (event.eventType === 'WRITE_TO_UNDO_REDO') {
      this.undoRedoUtil.WRITE(event);
    }
  }

  undo = (event: Event) => {
    event.stopPropagation();
    const operation = this.undoRedoUtil.UNDO();
    if (
      !(
        operation.eventType === 'FAVORITE_TOGGLE' ||
        operation.eventType === 'REPORT_TITLE'
      )
    ) {
      this.dynamictableFilterService.emitEvent({
        ...operation,
        eventType: 'EXECUTE_UNDO'
      });
    } else if (operation.eventType === 'FAVORITE_TOGGLE') {
      this.reportConfiguration.isFavorite = operation.isFavorite ? false : true;
    } else if (operation.eventType === 'REPORT_TITLE') {
      this.reportConfiguration.name = operation.prevValue;
    }
  };
  redo = (event: Event) => {
    event.stopPropagation();
    const operation = this.undoRedoUtil.REDO();
    if (
      !(
        operation.eventType === 'FAVORITE_TOGGLE' ||
        operation.eventType === 'REPORT_TITLE'
      )
    ) {
      this.dynamictableFilterService.emitEvent({
        ...operation,
        eventType: 'EXECUTE_REDO'
      });
    } else if (operation.eventType === 'FAVORITE_TOGGLE') {
      this.reportConfiguration.isFavorite = operation.isFavorite ? true : false;
    } else if (operation.eventType === 'REPORT_TITLE') {
      this.reportConfiguration.name = operation.currentValue;
    }
  };

  openSaveAsDialog() {
    const saveAsReportRef = this.dialog.open(ReportSaveAsModalComponent, {
      data: { name: this.reportName.value }
    });
    saveAsReportRef.afterClosed().subscribe((name) => {
      if (name) {
        this.reportConfiguration.name = name;
        this.saveReport({ saveAs: true });
      }
    });
  }

  saveReport(params) {
    const { id, tableDetails = [] } = this.reportConfiguration;
    const allColumns: Column[] = this.configOptions.allColumns;
    const columnsObj: ColumnObject = allColumns.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {});
    this.reportConfiguration.tableDetails = tableDetails.map((table) => {
      const columns = table.columns.map((column) => {
        const {
          order = null,
          visible = false,
          sticky = false
        } = columnsObj[column.name];
        return { ...column, visible, order, sticky };
      });
      return { ...table, columns };
    });

    this.spinner.show();
    if (id === undefined || params.saveAs) {
      this.reportConfiguration.createdBy =
        this.loginService.getLoggedInUserName();
      this.reportConfigService
        .saveReport$(this.reportConfiguration)
        .subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            this.reportConfiguration.id = response.id;
            this.toast.show({
              text: 'Report Configuration saved successfully',
              type: 'success'
            });
          }
        });
    } else {
      this.reportConfigService
        .updateReport$(this.reportConfiguration)
        .subscribe((response) => {
          this.spinner.hide();
          if (Object.keys(response).length) {
            this.toast.show({
              text: 'Report Configuration updated successfully',
              type: 'success'
            });
          }
        });
    }
  }

  getReportDetails = () =>
    this.reportConfigService.getReportDetails$(
      this.reportDetailsUrlString,
      this.reportDefinitionNameOrId,
      { skip: this.skip, limit: this.limit }
    );

  getReportData = () =>
    this.reportConfigService.getReportData$(this.reportConfiguration, {
      skip: this.skip,
      limit: this.limit,
      searchKey: this.searchKey
    });

  getGroupByCountDetails = () =>
    this.reportConfigService.getGroupByCountDetails$(this.reportConfiguration, {
      type: this.countType,
      field: this.countField
    });

  getReportDataCountById = () =>
    this.reportConfigService.getReportDataCountById$(
      this.reportDataCountUrlString,
      this.reportDefinitionNameOrId,
      {}
    );

  getReportDataCount = () =>
    this.reportConfigService
      .getReportDataCount$(this.reportConfiguration, {
        searchKey: this.searchKey
      })
      .pipe(
        mergeMap((response) => {
          if (!response.count) {
            this.reportConfiguration.showChart = false;
          }
          return of(response);
        })
      );

  tableEventHandler(event: TableEvent) {
    this.fetchData$.next(event);
  }

  configOptionsChangeHandler(event: any) {
    const { eventType } = event;
    switch (eventType) {
      case 'REFRESH_CONFIG':
        this.configOptions = { ...event.data };
        if (
          this.reportConfiguration.groupBy.length !==
          this.configOptions.groupByColumns.length
        ) {
          if (this.configOptions.groupByColumns.length === 0) {
            this.reportConfiguration.groupBy =
              this.configOptions.groupByColumns;
            this.reportConfiguration.showChart = false;
            this.updateChartConfig(this.reportConfiguration.showChart, false);
          } else if (
            this.reportConfiguration.groupBy.length >
            this.configOptions.groupByColumns.length
          ) {
            this.reportConfiguration.groupBy =
              this.configOptions.groupByColumns;
            this.updateChartConfig(this.reportConfiguration.showChart, false);
          } else {
            this.reportConfiguration.groupBy =
              this.configOptions.groupByColumns;
            this.updateChartConfig(
              this.reportConfiguration.showChart,
              true,
              false
            );
          }
        }
        break;
      case 'WRITE_TO_UNDO_REDO':
        this.handleEvent(event);
        break;

      default:
      // do nothing;
    }
  }

  applyFilter(filtersObj: any) {
    const filtersApplied: FilterApplied[] = filtersObj.filters;
    this.searchKey = filtersObj.searchKey;
    if (filtersApplied) {
      this.reportConfiguration = {
        ...this.reportConfiguration,
        filtersApplied
      };
      this.filtersApplied$.next(true);
      this.updateChartConfig(this.reportConfiguration.showChart, true, false);
      this.configOptions =
        this.reportConfigService.updateConfigOptionsFromFiltersApplied(
          filtersApplied ? filtersApplied : [],
          this.configOptions
        );
    }
  }

  favoriteToggle = () => {
    this.reportConfiguration.isFavorite = !this.reportConfiguration.isFavorite;
    this.undoRedoUtil.WRITE({
      eventType: 'FAVORITE_TOGGLE',
      isFavorite: this.reportConfiguration.isFavorite
    });
  };

  downloadReport = (event: Event) => {
    event.stopPropagation();
    if (!this.reportConfiguration.id) {
      return;
    }
    this.isExportInProgress = true;
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.reportConfigService
      .downloadReport$(`reports/${this.reportConfiguration.id}/download`, info)
      .subscribe(
        (data) => {
          this.cdrf.markForCheck();
          this.isExportInProgress = false;
          downloadFile(data, this.reportConfiguration.name);
          this.toast.show({
            text: 'Report exported successfully',
            type: 'success'
          });
        },
        (err) => {
          this.isExportInProgress = false;
        }
      );
  };

  toggleChart = () => {
    this.reportConfiguration.showChart = !this.reportConfiguration.showChart;
    this.updateChartConfig(this.reportConfiguration.showChart, true, false);
  };

  togglePreview = () => {
    this.showPreview = !this.showPreview;
  };

  updateChartConfig = (
    showChart: boolean,
    fetchChartData: boolean,
    renderChart: boolean = true
  ) => {
    this.chartConfig = this.reportConfigService.updateChartConfig(
      this.reportConfiguration,
      this.chartConfig,
      true,
      true,
      renderChart
    );
    this.fetchChartData$.next(fetchChartData);
    if (showChart) {
      this.configOptions = {
        ...this.configOptions,
        tableHeight: 'calc(100vh - 330px)'
      };
    } else {
      this.configOptions = {
        ...this.configOptions,
        tableHeight: 'calc(100vh - 150px)'
      };
    }
  };

  getImage = (imageName: string, active: boolean) =>
    active
      ? `assets/dashboard-icons/${imageName}_active.svg`
      : `assets/dashboard-icons/${imageName}.svg`;
}
