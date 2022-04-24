import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo, Role, Permission } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {
  constructor(private appService: AppService) {}

  getRoles$ = (info: ErrorInfo = {} as ErrorInfo): Observable<Role[]> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(environment.rolesApiUrl, 'roles', {
      displayToast,
      failureResponse
    });
  };

  getRoleById$ = (
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService._getResp(environment.rolesApiUrl, `roles/${id}`, info);

  createRole$ = (
    role: Role,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService._postData(environment.rolesApiUrl, 'roles', role, info);

  updateRole$ = (
    role: Role,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService
      .patchData(environment.rolesApiUrl, `roles/${role.id}`, role, info)
      .pipe(map((response) => (response === null ? role : response)));

  deleteRole$ = (
    role: Role,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role> =>
    this.appService
      ._removeData(environment.rolesApiUrl, `roles/${role.id}`, info)
      .pipe(map((response) => (response === null ? role : response)));

  getPermissions$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Permission[]> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(environment.rolesApiUrl, 'permissions', {
      displayToast,
      failureResponse
    });
  };

  getRolePermissionsById$ = (
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Permission[]> =>
    this.appService._getResp(
      environment.rolesApiUrl,
      `roles/${id}/permissions`,
      info
    );
}
