import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { defaultLimit } from 'src/app/app.constants';
import {
  Count,
  ErrorInfo,
  Report,
  ReportConfiguration,
  ReportsRowActionEvent,
  TableEvent
} from 'src/app/interfaces';
import { ReportConfigurationListModalComponent } from '../report-configuration-list-modal/report-configuration-list-modal.component';
import { ReportService } from '../services/report.service';
import { debounce } from 'ts-debounce';
import { ReportConfigurationService } from '../services/report-configuration.service';
import { downloadFile } from '../../../shared/utils/fileUtils';
import { ReportDeleteModalComponent } from '../report-delete-modal/report-delete-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from 'src/app/shared/toast';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  headerTitle$: Observable<string>;
  readonly routingUrls = routingUrls;

  selectedReportSegmentControl = new FormControl('all');
  selectedReportSegment$ = this.selectedReportSegmentControl.valueChanges.pipe(
    startWith('all')
  );
  isExportInProgress = false;
  searchValue = '';
  finalData;
  reportsInitial$: Observable<Report>;
  reportsOnScroll$: Observable<Report>;
  reports$: Observable<Report>;
  reportsCount$: Observable<Count>;
  removeReport$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '' as string
  );
  addReport$: BehaviorSubject<ReportConfiguration> =
    new BehaviorSubject<ReportConfiguration>({} as ReportConfiguration);
  reduceReportCount$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '' as string
  );
  configOptions: ConfigOptions = {
    tableID: 'reportsTable',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: true,
    rowLevelActions: {
      menuActions: [
        {
          title: 'Preview',
          action: 'preview'
        },
        {
          title: 'Edit',
          action: 'edit'
        },
        {
          title: 'Export to Excel',
          action: 'export'
        },
        {
          title: 'Copy',
          action: 'copy'
        },
        {
          title: 'Delete',
          action: 'delete'
        }
      ],
      iconAction: {
        iconToggleOff: 'star_border',
        iconToggleOn: 'star',
        styleToggleOff: {},
        styleToggleOn: { color: '#f9d247' },
        property: 'isFavorite',
        action: 'favorite',
        title: 'Favorite'
      }
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 200px)',
    groupLevelColors: []
  };
  dataSource: MatTableDataSource<any>;
  skip = 0;
  limit = defaultLimit;
  debouncedSearchReports = debounce(() => this.fetchReports(), 2500);
  private fetchData$: BehaviorSubject<TableEvent> =
    new BehaviorSubject<TableEvent>({} as TableEvent);

  constructor(
    private snackBar: MatSnackBar,
    private toast: ToastService,
    public dialog: MatDialog,
    private reportService: ReportService,
    private reportConfigService: ReportConfigurationService,
    private router: Router,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  fetchReports() {
    this.reportsCount$ = combineLatest([
      this.reportService.getReportsCount$(),
      this.reduceReportCount$
    ]).pipe(
      map(([reportsCount, reduceAction]) => {
        if (reduceAction === 'reduce') {
          reportsCount.count = reportsCount.count - 1;
        }
        return reportsCount;
      })
    );
    this.reportsInitial$ = combineLatest([
      this.selectedReportSegment$,
      this.reportService.clickNewReportAction$
    ]).pipe(
      map(([, click]) => {
        this.skip = 0;
        if (click) {
          this.openDialog();
          this.reportService.clickNewReport(false);
        }
        return this.getReports();
      }),
      switchMap((res) => res)
    );

    this.reportsOnScroll$ = this.fetchData$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getReports();
        } else {
          return of({} as Report);
        }
      })
    );

    const reportsScrollUpdate$ = combineLatest([
      this.reportsInitial$,
      this.reportsOnScroll$
    ]).pipe(
      map(([initial, scroll]) => {
        if (this.skip === 0) {
          const { columns = [] } = initial;
          this.configOptions =
            this.reportService.updateConfigOptionsFromColumns(
              columns,
              this.configOptions
            );
        } else {
          const { data: scrollData = [] } = scroll;
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data ? initial.data.length : this.skip;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );

    const reportsDeleteUpdate$ = combineLatest([
      reportsScrollUpdate$,
      this.removeReport$
    ]).pipe(
      map(([reports, deleteReportID]) => {
        const { data = [] } = reports;
        if (deleteReportID) {
          const index = data.findIndex(
            (report) => report.id === deleteReportID
          );
          if (index > -1) {
            data.splice(index, 1);
            this.dataSource = new MatTableDataSource(data);
          }
        }
        return { ...reports, data };
      })
    );

    this.reports$ = combineLatest([reportsDeleteUpdate$, this.addReport$]).pipe(
      map(([reports, newReportConfiguration]) => {
        this.skip += 1;
        let { data = [] } = reports;

        if (
          !(
            Object.keys(newReportConfiguration).length === 0 &&
            newReportConfiguration.constructor === Object
          )
        ) {
          data.unshift(newReportConfiguration);
          this.dataSource = new MatTableDataSource(data);
        }
        return { ...reports, data };
      })
    );
  }

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        this.commonService.setHeaderTitle(routingUrls.reports.title);
        if (currentRouteUrl === routingUrls.reports.url) {
          this.breadcrumbService.set(routingUrls.reports.url, {
            skip: false
          });
        } else {
          this.breadcrumbService.set(routingUrls.reports.url, {
            skip: false
          });
        }
      })
    );
    this.headerTitle$ = this.commonService.headerTitleAction$;
    this.fetchReports();
  }

  openDialog() {
    const addReportRef = this.dialog.open(
      ReportConfigurationListModalComponent,
      { autoFocus: false }
    );
    addReportRef.afterClosed().subscribe();
  }
  openDeleteWarningDialog(reportID, reportName, groupedWidgets) {
    const deleteReportRef = this.dialog.open(ReportDeleteModalComponent, {
      data: {
        reportName,
        reportID,
        groupedWidgets
      }
    });
    deleteReportRef.afterClosed().subscribe((reportID) => {
      if (reportID) {
        this.reportService.deleteReport$(reportID).subscribe((resp) => {
          this.removeReport(reportID);
        });
        this.reduceReportCount$.next('reduce');
      }
    });
  }

  getReports = () =>
    this.reportService.getReports$({
      skip: this.skip,
      limit: this.limit,
      type: this.selectedReportSegmentControl.value,
      searchKey: this.searchValue
    });

  handleTableEvent(event: TableEvent) {
    this.fetchData$.next(event);
  }

  removeReport(id: string) {
    this.removeReport$.next(id);
    this.removeReport$.next('');
  }

  addReport(report: ReportConfiguration) {
    this.addReport$.next(report);
    this.addReport$.next({} as ReportConfiguration);
  }

  rowLevelActionHandler(event: ReportsRowActionEvent) {
    const {
      action,
      data: { id, name, isFavorite }
    } = event;
    let report;
    switch (action) {
      case 'edit':
        this.router.navigate(['dashboard/reports/editreport', id]);
        break;
      case 'delete':
        this.reportService.getWidgets$(id).subscribe((groupedWidgets) => {
          this.openDeleteWarningDialog(id, name, groupedWidgets);
        });
        break;
      case 'favorite':
        this.reportConfigService
          .updateReport$({ id, isFavorite: !isFavorite } as ReportConfiguration)
          .subscribe();
        if (this.selectedReportSegmentControl.value === 'favorite') {
          this.removeReport(id);
        }
        break;
      case 'export':
        const info: ErrorInfo = {
          displayToast: true,
          failureResponse: 'throwError'
        };
        report = event.data;
        if (!report.id) {
          return;
        }
        this.snackBar.open('Export is in progress...', '', {
          panelClass: 'exportSnackbar',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.reportConfigService
          .downloadReport$(`reports/${report.id}/download`, info)
          .subscribe(
            (data) => {
              downloadFile(data, report.name);
              this.snackBar.dismiss();
              this.toast.show({
                text: 'Report exported successfully',
                type: 'success'
              });
            },
            (err) => {
              this.snackBar.dismiss();
            }
          );
        break;
      case 'copy':
        report = event.data;

        this.reportService.copyReport$(report).subscribe((res) => {
          this.addReport(res);
          this.toast.show({
            text: 'Report copied successfully',
            type: 'success'
          });
        });
        break;
      default:
      // do nothing;
    }
  }
}
