/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { superAdminIcon } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';

import { UserGroup, UserGroupDetails, ErrorInfo } from './../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  constructor(private appService: AppService) {}

  createUserGroup$ = (
    userGroup: UserGroupDetails,
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const createUserGroup = { ...userGroup };
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `usersGroup`,
      createUserGroup,
      info
    );
  };
}
