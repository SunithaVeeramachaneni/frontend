import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
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

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
  selectedReportSegmentControl = new FormControl('all');
  selectedReportSegment$ = this.selectedReportSegmentControl.valueChanges.pipe(
    startWith('all')
  );
  searchValue = '';
  finalData;
  reportsInitial$: Observable<Report>;
  reportsOnScroll$: Observable<Report>;
  reports$: Observable<Report>;
  reportsCount$: Observable<Count>;
  removeReport$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '' as string
  );
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
          icon: 'remove_red_eye',
          title: 'Preview',
          action: 'preview'
        },
        {
          icon: 'edit',
          title: 'Edit',
          action: 'edit'
        },
        {
          icon: 'file_download',
          title: 'Export to Excel',
          action: 'export'
        },
        {
          icon: 'content_copy',
          title: 'Copy',
          action: 'copy'
        },
        {
          icon: 'delete',
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
    public dialog: MatDialog,
    private reportService: ReportService,
    private reportConfigService: ReportConfigurationService,
    private router: Router
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

    this.reports$ = combineLatest([
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

    this.reports$ = combineLatest([this.reports$, this.removeReport$]).pipe(
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
  }

  ngOnInit(): void {
    this.fetchReports();
  }

  openDialog() {
    const addReportRef = this.dialog.open(
      ReportConfigurationListModalComponent
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
          this.removeRow(reportID);
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

  removeRow(id: string) {
    this.removeReport$.next(id);
    this.removeReport$.next('');
  }

  rowLevelActionHandler(event: ReportsRowActionEvent) {
    const {
      action,
      data: { id, name, isFavorite }
    } = event;
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
          this.removeRow(id);
        }
        break;
      case 'export':
        const info: ErrorInfo = {
          displayToast: true,
          failureResponse: 'throwError'
        };
        const report = event.data;
        if (!report.id) {
          return;
        }

        this.reportConfigService
          .downloadReport$(`reports/${report.id}/download`, info)
          .subscribe(
            (data) => {
              downloadFile(data, report.name);
            },
            (err) => {}
          );
        break;
      default:
      // do nothing;
    }
  }
}
