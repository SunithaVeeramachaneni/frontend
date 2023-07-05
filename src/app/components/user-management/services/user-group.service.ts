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

  listDynamoUsers$ = (
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      plantId: string;
    },
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', `${queryParams.limit}`);
    params.set('nextToken', queryParams.next);
    params.set('searchTerm', queryParams?.searchKey.toLocaleLowerCase());
    params.set('plantId', queryParams.plantId);

    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `user-groups/users?` + params.toString(),
      info
    );
  };

  createUserGroup$ = (
    userGroupDetails: any,
    info: ErrorInfo = {} as ErrorInfo
  ) =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      `user-groups`,
      userGroupDetails,
      info
    );

  listUserGroups = (
    queryParams: {
      limit: number;
      nextToken: string;
      plantId?: string;
      searchKey?: string;
    },
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', `${queryParams.limit}` ?? '');
    params.set('nextToken', queryParams.nextToken ?? '');
    params.set('searchTerm', queryParams?.searchKey?.toLocaleLowerCase() ?? '');
    params.set('plantId', queryParams?.plantId ?? '');

    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'user-groups?' + params.toString(),
      info
    );
  };
}
