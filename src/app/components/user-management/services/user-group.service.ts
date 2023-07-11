/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { superAdminIcon } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';

import {
  UserGroup,
  UserGroupDetails,
  ErrorInfo,
  TableEvent,
  LoadEvent,
  SearchEvent
} from './../../../interfaces';

interface UserGroupListUpdate {
  action: 'add' | 'edit' | 'delete' | 'copy' | null;
  group: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  addUpdateDeleteCopyUserGroup = false;
  userGroupActions$: BehaviorSubject<UserGroupListUpdate> =
    new BehaviorSubject<UserGroupListUpdate>({
      action: null,
      group: {}
    });

  fetchUserGroups$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
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
    params.set('limit', queryParams.limit.toString() ?? '');
    params.set('nextToken', queryParams.next ?? '');
    params.set('searchTerm', queryParams?.searchKey.toLocaleLowerCase() ?? '');
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
      {
        ...userGroupDetails,
        searchTerm:
          `${userGroupDetails.name.toLowerCase()} ${userGroupDetails?.description.toLowerCase()}` ||
          ''
      },
      info
    );

  copyUserGroup$ = (userGroupId: any, info: ErrorInfo = {} as ErrorInfo) =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      `user-groups/copy/${userGroupId}`,
      {},
      info
    );

  listUserGroups = (
    queryParams: {
      limit: number;
      nextToken: string;
      fetchType: string;
      plantId?: string;
      searchKey?: string;
    },
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', queryParams.limit.toString() ?? '');
    params.set('nextToken', queryParams.nextToken ?? '');
    params.set('searchTerm', queryParams?.searchKey?.toLocaleLowerCase() ?? '');
    params.set('plantId', queryParams?.plantId ?? '');

    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      return this.appService._getResp(
        environment.userRoleManagementApiUrl,
        'user-groups?' + params.toString(),
        info
      );
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  };
  listUserGroupUsers = (
    queryParams: {
      limit: number;
      nextToken: string;
      fetchType: string;
      searchKey?: string;
    },
    userGroupId: string,
    info: ErrorInfo = {} as ErrorInfo
  ) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('nextToken', queryParams.nextToken ?? '');
    params.set('searchTerm', queryParams?.searchKey?.toLocaleLowerCase() ?? '');
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      return this.appService._getResp(
        environment.userRoleManagementApiUrl,
        `user-groups/${userGroupId}/users?` + params.toString(),
        info
      );
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  };
  updateUserGroup(id: string, userGroup: any, info = {} as ErrorInfo) {
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `user-groups/${id}`,
      userGroup,
      info
    );
  }
  deleteUserGroup$(id: string, info = {} as ErrorInfo) {
    return this.appService._removeData(
      environment.userRoleManagementApiUrl,
      `user-groups/${id}`,
      info
    );
  }
  selectUnselectGroupMembers$(
    id: string,
    members: string[],
    info = {} as ErrorInfo
  ) {
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `user-groups/${id}/users`,
      { users: members },
      info
    );
  }
}
