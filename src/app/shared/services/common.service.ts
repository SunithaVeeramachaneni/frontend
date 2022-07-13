/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {
  Permission,
  ProtectedResource,
  Tenant,
  UserDetails
} from 'src/app/interfaces';
import { ConfigUserDataResult } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private protectedResources: ProtectedResource[] = [];
  private tenantInfo: Tenant = {} as Tenant;
  private tenantsInfo: Tenant[] = [];
  private userInfo = {} as UserDetails;

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private translateLanguageSubject = new BehaviorSubject<string>('');
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);

  private userInfoSubject = new BehaviorSubject<UserDetails>({} as UserDetails);

  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();
  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  translateLanguageAction$ = this.translateLanguageSubject.asObservable();
  permissionsAction$ = this.permissionsSubject.asObservable();
  userInfo$ = this.userInfoSubject.asObservable();

  constructor() {}

  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }

  setCurrentRouteUrl(value: string) {
    this.currentRouteUrlSubject.next(value);
  }

  setProtectedResources(protectedResources: ProtectedResource) {
    this.protectedResources = [
      ...this.protectedResources,
      { ...protectedResources }
    ];
  }

  getProtectedResources() {
    return this.protectedResources;
  }

  setTenantInfo(tenantInfo: Tenant) {
    this.tenantInfo = tenantInfo;
  }

  getTenantInfo() {
    return this.tenantInfo;
  }

  setTenantsInfo(tenantsInfo: Tenant[]) {
    this.tenantsInfo = tenantsInfo;
  }

  getTenantsInfo() {
    return this.tenantsInfo;
  }

  setTranslateLanguage(value: string) {
    this.translateLanguageSubject.next(value);
  }

  getUserName(): string {
    const { firstName, lastName } = this.userInfo;
    return `${firstName} ${lastName}`;
  }

  decrypt(value: string, key: string) {
    const bytes = CryptoJS.AES.decrypt(value.toString(), key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  setPermissions(permissions: Permission[]) {
    this.permissionsSubject.next(permissions);
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

  setUserInfo(userInfo: UserDetails) {
    this.userInfoSubject.next(userInfo);
    this.userInfo = userInfo;
  }

  getUserInfo(): UserDetails {
    return this.userInfo;
  }
}
