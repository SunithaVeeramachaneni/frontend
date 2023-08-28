/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo, Widget } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  constructor(private appService: AppService) {}

  createWidget$ = (
    widget: Widget,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget> =>
    this.appService._postData(
      environment.dashboardApiUrl,
      'widgets',
      widget,
      info
    );

  copyWidget$ = (
    widget: Widget,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget> =>
    this.appService._postData(
      environment.dashboardApiUrl,
      'widgets/duplicate',
      widget,
      info
    );

  updateWidget$ = (
    widget: Widget,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget> =>
    this.appService
      .patchData(
        environment.dashboardApiUrl,
        `widgets/${widget.id}`,
        widget,
        info
      )
      .pipe(map((response) => (response === null ? widget : response)));

  deleteWidget$ = (
    widget: Widget,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget> =>
    this.appService
      ._removeData(environment.dashboardApiUrl, `widgets/${widget.id}`, info)
      .pipe(map((response) => (response === null ? widget : response)));

  getDahboardWidgetsWithReport$ = (
    id: string,
    queryParams = {} as any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget[]> =>
    this.appService._getResp(
      environment.dashboardApiUrl,
      `widgets/${id}/report`,
      info,
      queryParams
    );

  getDashboardByModule$ = (
    moduleName: string,
    queryParams = {} as any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Widget> =>
    this.appService._getResp(
      environment.dashboardApiUrl,
      `dashboards/${moduleName}`,
      info,
      queryParams
    );
}
