/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { Buffer } from 'buffer';
import {
  map,
  mergeAll,
  mergeMap,
  reduce,
  shareReplay,
  tap,
  toArray
} from 'rxjs/operators';
import { AppService } from '../../../shared/services/app.services';
import {
  TableColumn,
  ErrorInfo,
  ReportCategory,
  Report,
  Count,
  Widget,
  UserDetails
} from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { addUserMock, updateUserMock, usersMock } from './users.mock';
import { query } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private reportDefinitionNameSubject = new BehaviorSubject<string>('');
  private clickNewReportSubject = new BehaviorSubject<boolean>(false);
  superAdminIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwhJREFUSInF1W9o1WUUB/DPubuyDSp0OWbZH4QKGogQRGVYhlEvgmgx96JMUMRtmXvRS7VY9Wq+qBFh907If73QiKKEoJERmAYiSWUEEflCbFqWvkisuXufXtzfvdvdvdYIogM/nt/znPN8v+ec53AO/7HEXIxSwTIsFbpQws+mHItNfvjXBGmXNn8YEgaw5CpmJzGqw+7oU5ozQSq4D/txC5LkuHAYZzAPi7EK3RnK18Lq2Oj7fyRIRasl+9CKd+VsbXYR0pi7lW3HSlwQHo9+n1+VII1ZruxT5ITnot9YA+gbrpf3kVaPxjoXUxIKXhJewHll98Szfqza52oXX9WubH/m+VBT8GF5eQeEa2OdixAhxaAXMYKFwr6Uph2vEWi3GTfj/RhQaJYSi4xglWRPg+6sLfhSWK6op5GgUi1JydZm2OlNT+N5lCRvz9bHsLKcbRVjg3UEWZ0vwYnY5LsG8KK7hJ3Z9pMYdKZphPONS34RHkw7LIB8plqarYcbwN/S6Yr30J55dzoVrc7+S876MIZNQfQppYIjeELenTiaz9Jzg4TkpzrwYXmTDuDW6VzYINmQ7SZ0GsfvM65VMMpunI6gbEogtNS532UNHmqaDibl9MZAHTjVd41KVNVHnsjWm+pMz9mrrKP28dV0eIZio6NNiBfPxKxGcFwLwiMzLWNYGRcgFXRjWQa+JwYVZyOnonmSFbis3claBFlX/FZyW9rh3iZewdps/cIV/U0tynowH4dirUs1gkxeUzkZScN159I7WrAGE67ojSF/Nni/S5vwSrYdrZ5PA3XYrZLjB3TVDCvyq4fRKac3NtdXWk0mjeEOHIwBhxoIok9JSS9+E7akgu2Z5+RckjzV7FHTLm2paK/kGZwS1s/UN7brSkf9AAtxAtt0+Hj2QEmvazVPj/AybscpJY/N7gTNB85OS5Tsw/3Z0XkcEU5L8ipNcQWuy/QHhfXR7/xsrL+dyangScmgsNJ0W6nKZYxLRmPQZ1fDmNvQ32GB0I1FwpSyc67xTbUU/1f5C9zA9dtYdVIPAAAAAElFTkSuQmCC';

  reportDefinitionAction$ = this.reportDefinitionNameSubject.asObservable();
  clickNewReportAction$ = this.clickNewReportSubject.asObservable();

  constructor(private appService: AppService,private sant: DomSanitizer) {}

  prepareUser = (user: UserDetails, roles) => {
    user.user = user.firstName + ' ' + user.lastName;
    const roleNames = roles.map((role) => role.name);
    if (roleNames.length) user.displayRoles = roleNames;
    user.roles = roles;
    if (!user.createdAt) user.createdAt = new Date();
    else user.createdAt = new Date(user.createdAt);
    user.postTextImage = {
      style: {
        width: '20px',
        height: '20px',
        'border-radius': '50%',
        display: 'block',
        padding: '0px 10px'
      },
      image:
        this.superAdminIcon,
      condition: {
        operation: 'contains',
        fieldName: 'displayRoles',
        operand: 'Tenant Admin'
      }
    }
    user.preTextImage ={
      style: {
        width: '30px',
        height: '30px',
        'border-radius': '50%',
        display: 'block',
        padding: '0px 10px'
      },
      image:
        this.getImageSrc(Buffer.from(user.profileImage).toString()),
      condition: true
    }
  return user;
  };

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sant.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  getRoles$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'roles',
      { displayToast, failureResponse }
    );
  };

  getBase64(file) {
    const reader = new FileReader();
    let base64;
    reader.readAsDataURL(file as Blob);
    reader.onloadend = () => {
      base64 = reader.result as string;
      return base64;
    };
  }

  getUsers$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> => {
    queryParams = { ...queryParams, isActive: true };
    const { displayToast, failureResponse = {} } = info;
    // queryParams = {};
    return this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        'users',
        { displayToast, failureResponse },
        queryParams
      )
      .pipe(
        mergeMap((users: UserDetails[]) =>
          from(users).pipe(
            mergeMap((user) =>
              this.getRoleByUserID$(user.id).pipe(
                map((roles) => ({ roles, userID: user.id }))
              )
            ),
            toArray(),
            map((resp) =>
              users.map((user) => {
                const find = resp.find((r) => r.userID === user.id);
                return this.prepareUser(user, find.roles);
              })
            )
          )
        )
      );
  };

  getUsersCount$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/count`,
      info,
      queryParams
    );

  getRoleByUserID$ = (
    userID,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/${userID}/roles`,
      info
    );


  deactivateUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const userID = user.id;
    const deactivateUser = { isActive: false };
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `users/${userID}`,
      deactivateUser,
      info
    );
  };

  createUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const roleIds = user.roles.map((role) => role.id);
    const createUser = { ...user, roleIds };
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `users`,
      createUser,
      info
    );
  };
  updateUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const roleIds = user.roles.map((role) => role.id);
    const patchUser = { ...user, roleIds };
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `users/${user.id}`,
      patchUser,
      info
    );
  };
}
