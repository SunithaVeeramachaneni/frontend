/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorInfo } from '../../interfaces/error-info';
import { AppService } from '../../shared/services/app.services';
import { environment } from '../../../environments/environment';
import { LogonUserDetails } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  logonUserDetails: Observable<LogonUserDetails>;

  constructor(private appService: AppService) {}

  getInstallationURL$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> =>
    this.appService._getResp(environment.slackAPIUrl, 'install/verify', info);
}
