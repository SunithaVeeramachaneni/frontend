/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorInfo } from '../../interfaces/error-info';
import { AppService } from '../../shared/services/app.services';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  constructor(private appService: AppService) {}

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
