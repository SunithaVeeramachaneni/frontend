/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private appService: AppService, private http: HttpClient) {}

  private updateUserPresenceSubject = new BehaviorSubject<any>({});

  updateUserPresence$ = this.updateUserPresenceSubject.asObservable();

  getUsers$ = (
    queryParams: any,
    includeSlackDetails: boolean,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'users',
      info,
      { ...queryParams, isActive: true, includeSlackDetails }
    );

  updateUserPresence = (message: any) => {
    this.updateUserPresenceSubject.next(message);
  };
}
