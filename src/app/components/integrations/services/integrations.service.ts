/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dashboard, ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

export interface UpdateGridOptions {
  update: boolean;
  subtractWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  constructor(private appService: AppService) {}

  getConnectors$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> =>
    this.appService._getResp('http://localhost:8012/', 'connections', info);

  testConnection$ = (
    connectionObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.integrationsApiUrl,
      'verify',
      connectionObj,
      info
    );
  createConnection$ = (
    connectionObj: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard> =>
    this.appService._postData(
      environment.integrationsApiUrl,
      'connections',
      connectionObj,
      info
    );

  // updateDashboard$ = (
  //   dashboardId: string,
  //   dashboard: Dashboard,
  //   info: ErrorInfo = {} as ErrorInfo
  // ): Observable<Dashboard> =>
  //   this.appService
  //     .patchData(
  //       environment.dashboardApiUrl,
  //       `dashboards/${dashboardId}`,
  //       dashboard,
  //       info
  //     )
  //     .pipe(map((response) => (response === null ? dashboard : response)));

  // deleteDashboard$ = (
  //   dashboardId: string,
  //   info: ErrorInfo = {} as ErrorInfo
  // ): Observable<Dashboard> =>
  //   this.appService._removeData(
  //     environment.dashboardApiUrl,
  //     `dashboards/${dashboardId}`,
  //     info
  //   );

  // copyDashboard$ = (dashboard: Dashboard, info: ErrorInfo = {} as ErrorInfo) =>
  //   this.appService._postData(
  //     environment.dashboardApiUrl,
  //     `dashboards/duplicate`,
  //     dashboard,
  //     info
  //   );

  // markDashboardDefault$ = (
  //   dashboardId: string,
  //   dashboard: Dashboard,
  //   info: ErrorInfo = {} as ErrorInfo
  // ): Observable<Dashboard> =>
  //   this.appService.patchData(
  //     environment.dashboardApiUrl,
  //     `dashboards/${dashboardId}/markdefault`,
  //     dashboard,
  //     info
  //   );
  // getDashboards$ = (
  //   info: ErrorInfo = {} as ErrorInfo
  // ): Observable<Dashboard[]> =>
  //   this.appService._getResp(environment.dashboardApiUrl, 'dashboards', info);
}
