/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AppService } from '../../../shared/services/app.services';
import {
  TableColumn,
  ErrorInfo,
  ReportCategory,
  Report,
  Count,
  Widget
} from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private reportDefinitionNameSubject = new BehaviorSubject<string>('');
  private clickNewReportSubject = new BehaviorSubject<boolean>(false);

  reportDefinitionAction$ = this.reportDefinitionNameSubject.asObservable();
  clickNewReportAction$ = this.clickNewReportSubject.asObservable();

  constructor(private appService: AppService) {}

  getReports$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Report> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.dashboardApiUrl,
      'reports',
      { displayToast, failureResponse },
      queryParams
    );
  };

  getReportCategories$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<ReportCategory[]> =>
    this.appService
      ._getResp(environment.dashboardApiUrl, 'reports/categories', info)
      .pipe(shareReplay(1));

  updateReportDefinitionName(reportDefinitionName: string) {
    this.reportDefinitionNameSubject.next(reportDefinitionName);
  }

  getReportsCount$ = (info: ErrorInfo = {} as ErrorInfo): Observable<Count> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.dashboardApiUrl,
      `reports/count`,
      { displayToast, failureResponse }
    );
  };

  getWidgets$ = (
    reportId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget[]> =>
    this.appService._getResp(
      environment.dashboardApiUrl,
      `reports/widgets/${reportId}`,
      info
    );

  clickNewReport(click: boolean) {
    this.clickNewReportSubject.next(click);
  }

  updateConfigOptionsFromColumns(
    columns: TableColumn[],
    configOptions: ConfigOptions
  ) {
    const allColumns = columns.map((column, index) => {
      const { name: id, displayName, type } = column;
      return {
        id,
        displayName,
        type,
        controlType: 'string',
        visible: true,
        sticky: false,
        searchable: true,
        sortable: true,
        movable: true,
        order: index + 1,
        groupable: true,
        hasSubtitle: false,
        subtitleColumn: '',
        showMenuOptions: false,
        hideable: true,
        stickable: true,
        titleStyle: {},
        subtitleStyle: {},
        hasPostTextImage: false,
        hasPreTextImage: false
      };
    });
    configOptions = { ...configOptions, allColumns };
    return configOptions;
  }

  deleteReport$ = (reportId: string, info: ErrorInfo = {} as ErrorInfo) =>
    this.appService._removeData(
      environment.dashboardApiUrl,
      `reports/${reportId}`,
      info
    );

  copyReport$ = (report: Report, info: ErrorInfo = {} as ErrorInfo) =>
    this.appService._postData(
      environment.dashboardApiUrl,
      `reports/duplicate`,
      report,
      info
    );
}
