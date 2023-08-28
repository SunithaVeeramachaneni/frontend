/* eslint-disable @angular-eslint/component-class-suffix */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  of
} from 'rxjs';
import { LoadEvent, SearchEvent, TableEvent } from 'src/app/interfaces';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { filter, map, switchMap } from 'rxjs/operators';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { defaultLimit } from 'src/app/app.constants';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';

@Component({
  selector: 'app-chart-report-dialog',
  templateUrl: './chart-report-dialog.component.html',
  styleUrls: ['./chart-report-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartReportDialog implements OnInit {
  dataSource: MatTableDataSource<any>;
  reportDetails$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchReport$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  fetchData$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );

  configOptions: ConfigOptions = {
    tableID: 'ChartReportConfiguration',
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
    // tableHeight: 'calc(100vh - 400px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  selectedReport: any;
  skip = 0;
  limit = defaultLimit;
  fetchType = 'load';
  nextToken = '';
  reportColumns: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private reportConfigService: ReportConfigurationService,
    private dateUtilService: DateUtilService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.selectedReport = this.data?.widgetData;
    const { chartData } = this.data;
    if (
      chartData.name &&
      this.selectedReport.report &&
      this.selectedReport.report?.groupBy?.length
    ) {
      const filterObj = {
        column: this.selectedReport.report.groupBy[0],
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: chartData.name
          }
        ]
      };
      this.selectedReport.report.filtersApplied = [filterObj];
    }

    this.reportColumns = [];
    this.selectedReport.tableColumns?.forEach((col) => {
      col.id = col.name;
      col.controlType = 'string';
      col.displayName = col.name?.toUpperCase();
      this.reportColumns = this.reportColumns.concat(col);
    });
    this.configOptions.allColumns = [...this.selectedReport.tableColumns];

    this.fetchReport$.next({ data: 'load' });
    this.fetchReport$.next({} as TableEvent);
    this.getDisplayedForms();
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchReport$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getReportData();
      })
    );

    const onScrollForms$ = this.fetchReport$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getReportData();
        } else {
          return of({} as any);
        }
      })
    );

    const initial = {
      columns: this.reportColumns,
      data: []
    };
    this.reportDetails$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          initial.data = rows.reportData;
        } else {
          initial.data = initial.data.concat(scrollData.reportData);
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getReportData = () => {
    const filtersApplied = [];
    const { filters } = this.data;
    if (filters.plantId && filters.plantId.length) {
      const plantFilter = {
        column: 'plantId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: filters.plantId
          }
        ]
      };
      filtersApplied.push(plantFilter);
    }
    if (filters.shiftId && filters.shiftId.length) {
      const shiftFilter = {
        column: 'shiftId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: filters.shiftId
          }
        ]
      };
      filtersApplied.push(shiftFilter);
    }

    const startAndEndDate = this.dateUtilService.getStartAndEndDates(
      filters.timePeriod,
      filters.startDate,
      filters.endDate
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
    if (
      this.selectedReport.report &&
      this.selectedReport.report.filtersApplied
    ) {
      this.selectedReport.report.filtersApplied = [
        ...this.selectedReport.report.filtersApplied,
        ...filtersApplied
      ];
    }

    return this.reportConfigService.getReportData$(
      this.selectedReport?.report,
      {
        skip: this.skip,
        limit: this.limit
      }
    );
  };

  tableEventHandler(event: TableEvent) {
    this.fetchReport$.next(event);
  }

  close() {
    this.dialogRef.close({ confirmed: true });
  }
}
