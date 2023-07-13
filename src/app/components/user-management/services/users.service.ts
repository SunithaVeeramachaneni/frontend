/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Buffer } from 'buffer';
import { map, shareReplay, tap } from 'rxjs/operators';
import { superAdminText } from 'src/app/app.constants';
import { AppService } from '../../../shared/services/app.services';
import {
  ErrorInfo,
  Count,
  UserDetails,
  Role,
  Permission,
  UserProfile,
  UserInfo,
  UsersInfoByEmail
} from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { superAdminIcon } from 'src/app/app.constants';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private reportDefinitionNameSubject = new BehaviorSubject<string>('');
  private clickNewReportSubject = new BehaviorSubject<boolean>(false);

  reportDefinitionAction$ = this.reportDefinitionNameSubject.asObservable();
  clickNewReportAction$ = this.clickNewReportSubject.asObservable();
  userDetails: UserDetails;
  usersInfoByEmail: UsersInfoByEmail;

  constructor(private appService: AppService, private sant: DomSanitizer) {}

  prepareUser = (user: UserDetails, roles) => {
    if (user.firstName && user.lastName) {
      user.user = user.firstName + ' ' + user.lastName;
    } else {
      user.user = '';
    }
    const roleNames = roles.map((role) => role.name);
    if (roleNames.length) user.displayRoles = roleNames || '';
    user.roles = roles;
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
        operand: superAdminText
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

  getLoggedInUser$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<UserInfo> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'me',
      {
        displayToast,
        failureResponse
      }
    );
  };

  getRoles$ = (info: ErrorInfo = {} as ErrorInfo): Observable<Role[]> =>
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
  ): Observable<any> => {
    queryParams = { ...queryParams };
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'users',
      info,
      queryParams
    );
  };

  getUsersCount$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/count`,
      { displayToast, failureResponse },
      queryParams
    );
  };

  getRolesByUserID$ = (
    userID,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Role[]> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/${userID}/roles`,
      info
    );

  getUserPermissionsByEmail$ = (
    email: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Permission[]> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/${email}/permissions`,
      info
    );

  getUsersInfo$ = (): Observable<UserDetails[]> =>
    this.getUsers$(
      {
        includeRoles: false,
        includeSlackDetails: false,
        limit: 10000
      },
      { displayToast: true, failureResponse: { rows: [] } }
    ).pipe(
      map(({ rows: users }) =>
        users.map((user: UserDetails) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: this.getImageSrc(
            Buffer.from(user.profileImage).toString()
          ),
          isActive: user.isActive
        }))
      ),
      tap((users) => this.setUsers(users)),
      shareReplay(1)
    );

  setUsers(users: UserDetails[]) {
    this.usersInfoByEmail = users.reduce((acc, curr) => {
      acc[curr.email] = {
        fullName: `${curr.firstName} ${curr.lastName}`,
        isActive: curr.isActive
      };
      return acc;
    }, {});
  }
  getUserIsActive(email: string): boolean {
    return this.usersInfoByEmail[email]?.isActive;
  }

  getUsersInfo(): UsersInfoByEmail {
    return this.usersInfoByEmail;
  }

  getUserFullName(email: string): string {
    return this.usersInfoByEmail[email]?.fullName;
  }

  deactivateUser$ = (userID, info: ErrorInfo = {} as ErrorInfo) => {
    const deactivateUser = { isActive: false };
    return this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `users/${userID}`,
        deactivateUser,
        info
      )
      .pipe(map((response) => (response === null ? deactivateUser : response)));
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

  updateUserProfile$ = (
    userId: number,
    userProfile: UserProfile,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<UserProfile> =>
    this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `users/profile/${userId}`,
        userProfile,
        info
      )
      .pipe(map((response) => (response === null ? userProfile : response)));

  verifyUserEmail$ = (
    emailID: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `users/verify/${emailID}`,
      { displayToast, failureResponse }
    );
  };

  setUserPresence$ = (info: ErrorInfo = {} as ErrorInfo) =>
    this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `users/current/presence/online`,
        {},
        info
      )
      .pipe(map((response) => response));

  removeUserPresence$ = (info: ErrorInfo = {} as ErrorInfo) =>
    this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `users/current/presence/offline`,
        {},
        info
      )
      .pipe(map((response) => response));
}
