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
import { superAdminIcon } from 'src/app/app.constants';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private reportDefinitionNameSubject = new BehaviorSubject<string>('');
  private clickNewReportSubject = new BehaviorSubject<boolean>(false);

  reportDefinitionAction$ = this.reportDefinitionNameSubject.asObservable();
  clickNewReportAction$ = this.clickNewReportSubject.asObservable();

  constructor(private appService: AppService, private sant: DomSanitizer) {}

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
      image: superAdminIcon,
      condition: {
        operation: 'contains',
        fieldName: 'displayRoles',
        operand: 'Tenant Admin'
      }
    };
    user.preTextImage = {
      style: {
        width: '30px',
        height: '30px',
        'border-radius': '50%',
        display: 'block',
        padding: '0px 10px'
      },
      image: this.getImageSrc(Buffer.from(user.profileImage).toString()),
      condition: true
    };
    return user;
  };

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sant.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  getRoles$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'roles',
      info
    );

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
    // queryParams = {};
    return this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        'users',
        info,
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
    return this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `users/${user.id}`,
        patchUser,
        info
      )
      .pipe(map((response) => (response === null ? user : response)));
  };
}
