/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { ConfigUserDataResult } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';
import { Permission, UserInfo } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { TenantService } from '../../tenant-management/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInUserInfo = {} as UserInfo;
  private loggedInEmail: string;

  private isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserInfoSubject = new BehaviorSubject<UserInfo>(
    {} as UserInfo
  );

  isUserAuthenticated$ = this.isUserAuthenticatedSubject.asObservable();
  loggedInUserInfo$ = this.loggedInUserInfoSubject.asObservable();

  constructor(
    private commonService: CommonService,
    private tenantService: TenantService
  ) {}

  setUserAuthenticated(isUserAuthenticated: boolean) {
    this.isUserAuthenticatedSubject.next(isUserAuthenticated);
  }

  setLoggedInUserInfo(userInfo: UserInfo) {
    this.loggedInUserInfoSubject.next(userInfo);
    this.loggedInUserInfo = userInfo;
  }

  performPostLoginActions = (
    configUserDataResult: ConfigUserDataResult,
    configIds: string[]
  ) => {
    const {
      configId,
      userData: { email }
    } = configUserDataResult;
    this.loggedInEmail = email;
    const tenantInfo = this.tenantService
      .getTenantsInfo()
      .find((tenant) => tenant.tenantId === configId);
    const { protectedResources } = tenantInfo;
    const { node, sap } = protectedResources || {};

    this.tenantService.setTenantInfo(tenantInfo);
    this.commonService.setProtectedResources(node);
    this.commonService.setProtectedResources(sap);
    this.setUserAuthenticated(true);

    configIds.forEach((key) => sessionStorage.removeItem(key));
  };

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

  getLoggedInEmail(): string {
    return this.loggedInEmail;
  }
}
