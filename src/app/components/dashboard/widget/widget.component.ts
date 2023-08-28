/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { defaultCountFieldName, defaultLimit } from 'src/app/app.constants';
import {
  AppChartConfig,
  AppChartData,
  Count,
  ReportConfiguration,
  ReportDetails,
  TableEvent,
  Widget,
  WidgetAction
} from 'src/app/interfaces';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartReportDialog } from '../chart-report-dialog/chart-report-dialog.component';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit {
  @Input() set widget(widget: Widget) {
    this._widget = widget ? widget : ({} as Widget);
    if (Object.keys(this.widget).length) {
      this.prepareWidgetData();
    }
  }
  get widget(): Widget {
    return this._widget;
  }
  @Input() set height(height: number) {
    this._height = height;
    if (height && this.widget.isTable) {
      this.configOptions = {
        ...this.configOptions,
        tableHeight: `${height - 75}px`
      };
    }
  }
  get height(): number {
    return this._height;
  }

  @Input() set width(width: number) {
    this._width = width;
  }
  get width(): number {
    return this._width;
  }

  @Input() set filters(_filters) {
    this._filters = _filters;
  }
  get filters(): any {
    return this._filters;
  }

  @Output() widgetAction: EventEmitter<WidgetAction> =
    new EventEmitter<WidgetAction>();
  chartConfig: AppChartConfig;
  chartData$: Observable<AppChartData[]>;
  report: ReportConfiguration;
  configOptions: ConfigOptions = {
    tableID: 'widget',
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
    tableHeight: 'calc(100vh - 370px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;
  dataCount$: Observable<Count>;
  reportDetailsOnScroll$: Observable<ReportDetails>;
  reportDetails$: Observable<ReportDetails>;
  fetchData$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );
  skip = 0;
  limit = defaultLimit;
  countType: string;
  countField: string;
  public _height: number;
  public _width: number;
  private _widget: Widget;
  private _filters: any;

  constructor(
    private reportConfigService: ReportConfigurationService,
    private dialog: MatDialog,
    private readonly dateUtilService: DateUtilService
  ) {}

  ngOnInit(): void {
    const filtersApplied = [];
    if (this.filters.plantId && this.filters.plantId.length) {
      const plantFilter = {
        column: 'plantId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: this.filters.plantId
          }
        ]
      };
      filtersApplied.push(plantFilter);
    }
    if (this.filters.shiftId && this.filters.shiftId.length) {
      const shiftFilter = {
        column: 'shiftId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: this.filters.shiftId
          }
        ]
      };
      filtersApplied.push(shiftFilter);
    }

    const startAndEndDate = this.dateUtilService.getStartAndEndDates(
      this.filters.timePeriod,
      this.filters.startDate,
      this.filters.endDate
    );
    filtersApplied.push({
      column: 'updatedOn',
      type: 'daterange',
      filters: [
        {
          operation: 'custom',
          operand: {
            startDate: startAndEndDate.startDate,
            endDate: startAndEndDate.endDate
          }
        }
      ]
    });

    this.report.filtersApplied = [
      ...this.report.filtersApplied,
      ...filtersApplied
    ];
    this.chartData$ = this.reportConfigService.getGroupByCountDetails$(
      this.report,
      {
        type: this.countType,
        field: this.countField
      }
    );

    this.dataCount$ = this.getReportDataCount();

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
      this.getReportData(),
      this.reportDetailsOnScroll$
    ]).pipe(
      map(([initial, scroll]) => {
        if (this.skip !== 0) {
          const { reportData: scrollData = [] } = scroll;
          initial.reportData = initial.reportData.concat(scrollData);
        }

        this.skip = initial.reportData ? initial.reportData.length : this.skip;
        this.dataSource = new MatTableDataSource(initial.reportData);
        return initial;
      })
    );
  }

  onChartClickHandle = (event: any) => {
    console.log(event);
    const dialogRef = this.dialog.open(ChartReportDialog, {
      disableClose: true,
      // width: '80%',
      // height: '80%',
      data: {
        chartData: event.data,
        widgetData: this.widget,
        filters: this.filters
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      //
    });
  };

  prepareWidgetData = () => {
    const {
      report,
      isTable,
      chartDetails,
      groupBy,
      tableColumns,
      filtersApplied
    } = this.widget;
    report.chartDetails = chartDetails;
    report.filtersApplied = filtersApplied;
    this.report = report;
    if (!isTable) {
      this.chartConfig = this.reportConfigService.updateChartConfig(
        this.report,
        this.chartConfig,
        false,
        false
      );
      const { countFieldName } = chartDetails;
      if (countFieldName === defaultCountFieldName) {
        this.countType = 'count';
        this.countField = '';
      } else {
        this.countType = 'sum';
        this.countField = countFieldName;
      }
    } else {
      this.configOptions.tableID = `${this.configOptions.tableID}${this.widget.id}`;
      this.report.groupBy = groupBy;
      const tableColumnsObj = tableColumns.reduce((acc, val) => {
        acc[val.name] = val;
        return acc;
      }, {});
      const tableDetails = this.report.tableDetails.map((tableDetail) => {
        const columns = tableDetail.columns.map((column) => {
          if (tableColumnsObj[column.name]) {
            return { ...column, ...tableColumnsObj[column.name] };
          } else {
            return { ...column, order: null, sticky: false, visible: false };
          }
        });
        return { ...tableDetail, columns };
      });
      this.report.tableDetails = tableDetails;
      this.configOptions =
        this.reportConfigService.updateConfigOptionsFromReportConfiguration(
          this.report,
          this.configOptions,
          false
        );
      this.dataSource = new MatTableDataSource([]);
    }
  };

  tableEventHandler(event: TableEvent) {
    this.fetchData$.next(event);
  }

  getReportData = () =>
    this.reportConfigService.getReportData$(this.report, {
      skip: this.skip,
      limit: this.limit
    });

  getReportDataCount = () =>
    this.reportConfigService.getReportDataCount$(this.report, {});

  editWidget = (widget: Widget) =>
    this.widgetAction.emit({ type: 'edit', value: widget });
}
