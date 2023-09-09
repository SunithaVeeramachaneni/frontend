import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Count,
  ErrorInfo,
  Permission,
  Report,
  ReportConfiguration,
  RowLevelActionEvent,
  TableEvent,
  UserInfo
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
import { HeaderService } from 'src/app/shared/services/header.service';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  readonly perms = perms;
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
  changeReportCount$: BehaviorSubject<string> = new BehaviorSubject<string>(
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
      menuActions: [],
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
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: []
  };
  dataSource: MatTableDataSource<any>;
  skip = 0;
  limit = defaultLimit;
  debouncedSearchReports = debounce(() => this.fetchReports(), 1);
  userInfo$: Observable<UserInfo>;
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
    private headerService: HeaderService,
    private loginService: LoginService
  ) {}

  fetchReports() {
    this.reportsCount$ = combineLatest([
      this.reportService.getReportsCount$(),
      this.changeReportCount$
    ]).pipe(
      map(([reportsCount, changeCountAction]) => {
        if (changeCountAction === 'decrease') {
          reportsCount.count = reportsCount.count - 1;
        }
        if (changeCountAction === 'increase') {
          reportsCount.count = reportsCount.count + 1;
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
            this.skip -= 1;
            this.dataSource = new MatTableDataSource(data);
          }
        }
        return { ...reports, data };
      })
    );

    this.reports$ = combineLatest([reportsDeleteUpdate$, this.addReport$]).pipe(
      map(([reports, newReportConfiguration]) => {
        const { data = [] } = reports;
        if (
          !(
            Object.keys(newReportConfiguration).length === 0 &&
            newReportConfiguration.constructor === Object
          )
        ) {
          this.skip += 1;
          data.unshift(newReportConfiguration);
          this.dataSource = new MatTableDataSource(data);
        }
        return { ...reports, data };
      })
    );
  }

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.reports.title))
    );
    this.fetchReports();

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
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
    deleteReportRef.afterClosed().subscribe((deleteReportID) => {
      if (deleteReportID) {
        this.reportService.deleteReport$(deleteReportID).subscribe((resp) => {
          this.removeReport(deleteReportID);
          this.changeReportCount$.next('decrease');
          this.toast.show({
            text: 'Report deleted successfully',
            type: 'success'
          });
        });
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

  cellClickActionHandler = (event: CellClickActionEvent) => {
    const {
      columnId,
      row: { id }
    } = event;
    const moduleName = `operator-rounds`;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'createdBy':
      case 'createdOn':
        this.router.navigate([`${moduleName}/editreport`, id], {
          queryParams: { preview: true }
        });

        break;
      default:
      // do nothing
    }
  };

  rowLevelActionHandler(event: RowLevelActionEvent) {
    const {
      action,
      data: { id, name, isFavorite }
    } = event;
    let report;
    const moduleName = `operator-rounds`;
    switch (action) {
      case 'preview':
        this.router.navigate([`${moduleName}/editreport`, id], {
          queryParams: { preview: true }
        });
        break;
      case 'edit':
        this.router.navigate([`${moduleName}/reports/editreport`, id]);
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
        report = Object.assign({}, event.data);
        report.isFavorite = false;
        this.reportService.copyReport$(report).subscribe((res) => {
          this.addReport(res);
          this.changeReportCount$.next('increase');
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

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(permissions, 'VIEW_REPORTS') ||
      this.loginService.checkUserHasPermission(permissions, 'OPR_VIEW_REPORTS')
    ) {
      menuActions.push({
        title: 'Preview',
        action: 'preview'
      });
    }

    if (
      this.loginService.checkUserHasPermission(permissions, 'UPDATE_REPORT') ||
      this.loginService.checkUserHasPermission(permissions, 'OPR_UPDATE_REPORT')
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'REPORT_EXPORT_TO_EXCEL'
      ) ||
      this.loginService.checkUserHasPermission(
        permissions,
        'OPR_REPORT_EXPORT_TO_EXCEL'
      )
    ) {
      menuActions.push({
        title: 'Export to Excel',
        action: 'export'
      });
    }

    if (
      this.loginService.checkUserHasPermission(permissions, 'COPY_REPORT') ||
      this.loginService.checkUserHasPermission(permissions, 'OPR_COPY_REPORT')
    ) {
      menuActions.push({
        title: 'Copy',
        action: 'copy'
      });
    }

    if (
      this.loginService.checkUserHasPermission(permissions, 'DELETE_REPORT') ||
      this.loginService.checkUserHasPermission(permissions, 'OPR_DELETE_REPORT')
    ) {
      menuActions.push({
        title: 'Delete',
        action: 'delete'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions = { ...this.configOptions };
  }
}
