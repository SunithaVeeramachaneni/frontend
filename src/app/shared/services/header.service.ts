/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorInfo } from '../../interfaces/error-info';
import { AppService } from '../../shared/services/app.services';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private headerTitleSubject = new BehaviorSubject<string>('');
  headerTitleAction$ = this.headerTitleSubject.asObservable();

  constructor(private appService: AppService) {}

  setHeaderTitle(value: string) {
    this.headerTitleSubject.next(value);
  }

  getInstallationURL$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'slack/install/verify',
      info,
      queryParams
    );
}
