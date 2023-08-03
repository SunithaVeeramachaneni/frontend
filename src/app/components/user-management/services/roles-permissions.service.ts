/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray, shareReplay } from 'rxjs/operators';
import { ErrorInfo, Role, Permission, RoleWithoutID } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {
  constructor(private appService: AppService) {}

  getRolesWithPermissions$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role[]> => {
    queryParams = { ...queryParams };
    return this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        'roles',
        info,
        queryParams
      )
      .pipe(
        mergeMap((resp: any) => of(resp.rows)),
        mergeMap((roles: Role[]) =>
          from(roles).pipe(
            map((role) => {
              const permIds = role.permissions.map((p) => p.id);
              return {
                id: role.id,
                name: role.name,
                description: role.description,
                permissionIds: permIds
              };
            }),
            toArray()
          )
        )
      );
  };

  getRoleById$ = (
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `roles/${id}`,
      info
    );

  getUsersByRoleId$ = (
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `roles/${id}/users`,
      info
    );

  createRole$ = (
    role: RoleWithoutID,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      'roles',
      role,
      info
    );

  updateRole$ = (
    role: Role,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `roles/${role.id}`,
        role,
        info
      )
      .pipe(map((response) => (response === null ? role : response)));

  deleteRole$ = (
    role: Role,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService
      ._removeData(
        environment.userRoleManagementApiUrl,
        `roles/${role.id}`,
        info
      )
      .pipe(map((response) => (response === null ? role : response)));

  getPermissions$ = (info: ErrorInfo = {} as ErrorInfo): any =>
    this.appService
      ._getResp(environment.userRoleManagementApiUrl, 'permissions', info)
      .pipe(
        map((permissions) =>
          this.groupToArray(this.groupPermissions(permissions))
        ),
        shareReplay(1)
      );

  groupPermissions = (ungroupedPermissions) =>
    ungroupedPermissions.reduce((acc, cur) => {
      if (!acc[cur.moduleName]) {
        acc[cur.moduleName] = [];
      }
      acc[cur.moduleName].push(cur);
      return acc;
    }, {});

  groupToArray = (grouped) => {
    const permissionsArray = [];
    Object.keys(grouped).forEach((module) => {
      permissionsArray.push({
        name: module,
        permissions: grouped[module]
      });
    });
    return permissionsArray;
  };

  getRolePermissionsById$ = (
    id: number,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Permission[]> =>
    this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        `roles/${id}/permissions`,
        info
      )
      .pipe(shareReplay(1));
}
