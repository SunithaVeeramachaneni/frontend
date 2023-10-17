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
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from 'src/app/interfaces';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { filter, map, switchMap } from 'rxjs/operators';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { defaultLimit } from 'src/app/app.constants';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { ToastService } from 'src/app/shared/toast';
import { format } from 'date-fns';
import { UsersService } from '../../user-management/services/users.service';
import { fieldTypesMock } from 'src/app/forms/components/response-type/response-types.mock';
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
  downloadInProgress = false;
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  dateObject = {
    startDate: '',
    endDate: ''
  };
  userEmailToName = {};
  userNameToEmail = {};

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private reportConfigService: ReportConfigurationService,
    private dateUtilService: DateUtilService,
    private cdrf: ChangeDetectorRef,
    private toast: ToastService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    const { filters } = this.data;
    if (Object.keys(filters).length) {
      this.dateObject = this.dateUtilService.getStartAndEndDates(
        filters.timePeriod,
        filters.startDate,
        filters.endDate
      );
      this.dateObject.startDate = format(
        new Date(this.dateObject.startDate),
        'dd-MM-yyyy'
      );
      this.dateObject.endDate = format(
        new Date(this.dateObject.endDate),
        'dd-MM-yyyy'
      );
    }

    this.selectedReport = this.data?.widgetData;
    

    if (
      this.selectedReport &&
      this.selectedReport.report &&
      this.selectedReport.report.tableDetails &&
      this.selectedReport.report.tableDetails[0]
    ) {
      this.configOptions.allColumns = [
        ...this.selectedReport?.report?.tableDetails[0]?.columns
      ];
    } else {
      this.configOptions.allColumns = [...this.selectedReport.tableColumns];
    }

    this.reportColumns = [];
    this.configOptions.allColumns?.forEach((col: any) => {
      col.id = this.getId(col.name);
      col.controlType = 'string';
      col.displayName = col?.displayName || col?.name;
      this.reportColumns = this.reportColumns.concat(col);
    });
    const filtersApplied = this.getFiltersApplied();
    if (
      this.selectedReport.report &&
      this.selectedReport.report.filtersApplied
    ) {
      this.selectedReport.report.filtersApplied = [
        ...this.selectedReport.report.filtersApplied,
        ...filtersApplied
      ];
    }
    this.fetchReport$.next({ data: 'load' });
    this.fetchReport$.next({} as TableEvent);
    this.getDisplayedForms();
  }

  getId = (id) => {
    const ids = new Set(['assignedTo', 'raisedBy', 'roundSubmittedBy', 'taskCompletedBy']);
    if(ids.has(id)) return `${id}Display`;
    return id;
  }

  downloadReport = () => {
    this.downloadInProgress = true;
    this.cdrf.detectChanges();
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const filtersApplied = this.getFiltersApplied();
    this.reportConfigService
      .downloadWidgetReport$(
        `reports/${this.selectedReport.reportId}/download`,
        { report: this.selectedReport.report },
        info
      )
      .subscribe(
        (data) => {
          this.downloadInProgress = false;
          this.cdrf.detectChanges();
          downloadFile(data, 'Report');
          this.toast.show({
            text: 'Report exported successfully',
            type: 'success'
          });
        },
        (err) => {
          this.downloadInProgress = false;
          this.cdrf.detectChanges();
        }
      );
  };

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
      onScrollForms$,
      this.usersService.getUsersInfo$()
    ]).pipe(
      map(([rows, scrollData, usersList]) => {
        usersList.forEach((user) => {
          this.userEmailToName[user.email] = `${user.firstName} ${user.lastName}`;
          this.userNameToEmail[`${user.firstName} ${user.lastName}`] = user.email;
        })
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
        this.reportConfigService.formatReportData(initial.data, this.userEmailToName);
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getFiltersApplied = () => {
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
    if (filters.assetId && filters.assetId.length) {
      const assetFilter = {
        column: 'assetId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: filters.assetId
          }
        ]
      };
      filtersApplied.push(assetFilter);
    }
    if (filters.locationId && filters.locationId.length) {
      const locationFilter = {
        column: 'locationId',
        type: 'string',
        filters: [
          {
            operation: 'equals',
            operand: filters.locationId
          }
        ]
      };
      filtersApplied.push(locationFilter);
    }

    if (Object.keys(filters).length) {
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
    }
    const { chartData } = this.data;
    if(chartData.additionalData &&
      this.selectedReport.report &&
      this.selectedReport.report?.groupBy?.length) {
      this.selectedReport.report.groupBy.forEach((groupByFieldName) => {
        const filterObj = {
          column: groupByFieldName,
          type: 'string',
          filters: [
            {
              operation: 'equals',
              operand: chartData.additionalData[groupByFieldName]
            }
          ]
        };
        filtersApplied.push(filterObj);
      });
    } else if (
      chartData.name &&
      this.selectedReport.report &&
      this.selectedReport.report?.groupBy?.length
    ) {
      const filterObj = {
        column: this.selectedReport.report.groupBy[0],
        type: chartData?.name.includes('Total') ? 'default' : 'string',
        filters: [
          {
            operation: 'equals',
            operand: chartData.name
          }
        ]
      };
      filtersApplied.push(filterObj)
    }
    return filtersApplied;
  };

  getReportData = () => {
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
