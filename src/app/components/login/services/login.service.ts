/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Permission, UserInfo } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInUserInfo = {} as UserInfo;
  private loggedInUserSession: any;
  private isUserAuthenticated: boolean;

  private isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserInfoSubject = new BehaviorSubject<UserInfo>(
    {} as UserInfo
  );

  isUserAuthenticated$ = this.isUserAuthenticatedSubject.asObservable();
  loggedInUserInfo$ = this.loggedInUserInfoSubject.asObservable();

  constructor() {}

  setUserAuthenticated(isUserAuthenticated: boolean) {
    this.isUserAuthenticated = isUserAuthenticated;
    this.isUserAuthenticatedSubject.next(isUserAuthenticated);
  }

  setLoggedInUserInfo(userInfo: UserInfo) {
    this.loggedInUserInfoSubject.next(userInfo);
    this.loggedInUserInfo = userInfo;
  }

  checkUserHasPermission(permissions: Permission[], checkPermissions: string) {
    if (checkPermissions) {
      const hasPermission = permissions.find((per) =>
        checkPermissions.includes(per.name)
      );
      return hasPermission ? true : false;
    }
    return true;
  }

  getLoggedInUserName(): string {
    const { firstName, lastName } = this.loggedInUserInfo;
    return `${firstName} ${lastName}`;
  }

  getLoggedInUserInfo(): UserInfo {
    return this.loggedInUserInfo;
  }

  getLoggedInUserSession(): any {
    return this.loggedInUserSession;
  }

  loggedInUserSession$ = (): Observable<any> =>
    from(Auth.currentSession()).pipe(
      tap((userSession) => {
        this.loggedInUserSession = userSession;
      })
    );

  isUserAuthenticatedObservable$ = (): Observable<boolean> =>
    of(this.isUserAuthenticated);
}
