/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private appService: AppService) {}

  getInstallationURL$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> =>
    this.appService._getResp(environment.slackAPIUrl, 'install/verify', info);

  getWorkspaceUsers$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.slackAPIUrl, 'users', info);
}
