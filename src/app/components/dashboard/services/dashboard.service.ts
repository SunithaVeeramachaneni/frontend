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
export class DashboardService {
  private dashboardSelectionChangedSubject = new Subject<any>();

  private dashboardsSubject = new BehaviorSubject<Dashboard[]>([]);
  private updateGridOptionsSubject = new BehaviorSubject<UpdateGridOptions>({
    update: false,
    subtractWidth: 0
  });

  private dashboards: Dashboard[] = [];
  dashboardsAction$ = this.dashboardsSubject.asObservable();
  updateGridOptionsAction$ = this.updateGridOptionsSubject.asObservable();
  dashboardSelectionChanged$ =
    this.dashboardSelectionChangedSubject.asObservable();

  constructor(private appService: AppService) {}

  createDashboard$ = (
    dashboard: Dashboard,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard> =>
    this.appService._postData(
      environment.dashboardApiUrl,
      'dashboards',
      dashboard,
      info
    );

  updateDashboard$ = (
    dashboardId: string,
    dashboard: Dashboard,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard> =>
    this.appService
      .patchData(
        environment.dashboardApiUrl,
        `dashboards/${dashboardId}`,
        dashboard,
        info
      )
      .pipe(map((response) => (response === null ? dashboard : response)));

  deleteDashboard$ = (
    dashboardId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard> =>
    this.appService._removeData(
      environment.dashboardApiUrl,
      `dashboards/${dashboardId}`,
      info
    );

  copyDashboard$ = (dashboard: Dashboard, info: ErrorInfo = {} as ErrorInfo) =>
    this.appService._postData(
      environment.dashboardApiUrl,
      `dashboards/duplicate`,
      dashboard,
      info
    );

  markDashboardDefault$ = (
    dashboardId: string,
    dashboard: Dashboard,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard> =>
    this.appService.patchData(
      environment.dashboardApiUrl,
      `dashboards/${dashboardId}/markdefault`,
      dashboard,
      info
    );
  getDashboards$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Dashboard[]> =>
    this.appService._getResp(environment.dashboardApiUrl, 'dashboards', info);

  updateDashboards = (dashboards: Dashboard[]) => {
    this.dashboardsSubject.next(dashboards);
    this.dashboards = dashboards;
  };

  getDashboards = () => this.dashboards;

  updateGridOptions = (options: UpdateGridOptions) => {
    this.updateGridOptionsSubject.next(options);
  };

  dashboardSelectionChanged = (dashboard: any) =>
    this.dashboardSelectionChangedSubject.next(dashboard);
}
