/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
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
  UserDetails,
  UserTable
} from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { addUserMock, updateUserMock, usersMock } from './users.mock';
import { query } from '@angular/animations';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private reportDefinitionNameSubject = new BehaviorSubject<string>('');
  private clickNewReportSubject = new BehaviorSubject<boolean>(false);

  reportDefinitionAction$ = this.reportDefinitionNameSubject.asObservable();
  clickNewReportAction$ = this.clickNewReportSubject.asObservable();

  constructor(private appService: AppService) {}

  prepareUser = (user: UserDetails, roles) => {
    user.user = user.firstName + ' ' + user.lastName;
    const roleNames = roles.map((role) => role.name);
    if (roleNames.length) user.displayRoles = roleNames.join(', ');
    user.roles = roles;
    if (!user.createdAt) user.createdAt = new Date();
    else user.createdAt = new Date(user.createdAt);
    return user;
  };

  getRoles$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.usersAndPermissionsUrl,
      'roles',
      { displayToast, failureResponse }
    );
  };

  getUsers$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> => {
    const { displayToast, failureResponse = {} } = info;
    // queryParams = {};
    return this.appService
      ._getResp(
        environment.usersAndPermissionsUrl,
        'users',
        { displayToast, failureResponse },
        queryParams
      )
      .pipe(
        mergeMap((users: UserDetails[]) =>
          from(users).pipe(
            mergeMap((user) => {
              return this.getRoleByUserID$(user.id).pipe(
                map((roles) => ({ roles, userID: user.id }))
              );
            }),
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

  getUsersCount$ = (info: ErrorInfo = {} as ErrorInfo): Observable<Count> =>
    this.appService._getResp(
      environment.usersAndPermissionsUrl,
      `users/count`,
      info
    );

  getRoleByUserID$ = (
    userID,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.usersAndPermissionsUrl,
      `users/${userID}/roles`,
      info
    );

  updateConfigOptionsFromColumns(
    columns: TableColumn[],
    configOptions: ConfigOptions
  ) {
    const allColumns = columns.map((column, index) => {
      const { name: id, displayName, type } = column;
      return {
        id,
        displayName,
        type,
        visible: true,
        sticky: false,
        searchable: true,
        sortable: true,
        movable: false,
        order: index + 1,
        groupable: false,
        hasSubtitle: false,
        subtitleColumn: ''
      };
    });
    configOptions = { ...configOptions, allColumns };
    return configOptions;
  }

  deactivateUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const userID = user.id;
    const deactivateUser = { isActive: false };
    return this.appService.patchData(
      environment.usersAndPermissionsUrl,
      `users/${userID}`,
      deactivateUser,
      info
    );
  };

  createUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const roleIds = user.roles.map((role) => role.id);
    const createUser = { ...user, roleIds };
    createUser.profileImage = createUser.profileImage.split(',')[1];
    return this.appService._postData(
      environment.usersAndPermissionsUrl,
      `users`,
      createUser,
      info
    );
  };
  updateUser$ = (user: UserDetails, info: ErrorInfo = {} as ErrorInfo) => {
    const roleIds = user.roles.map((role) => role.id);
    const patchUser = { ...user, roleIds };
    patchUser.profileImage = patchUser.profileImage.split(',')[1];
    return this.appService.patchData(
      environment.usersAndPermissionsUrl,
      `users/${user.id}`,
      patchUser,
      info
    );
  };
}
