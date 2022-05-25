/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {
  LoggedInUserInfo,
  Permission,
  ProtectedResource,
  TenantConfig
} from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private protectedResources: ProtectedResource[] = [];
  private tenantConfig: TenantConfig = {} as TenantConfig;
  private userInfo = {} as LoggedInUserInfo;
  private permissions: Permission[] = [];

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private headerTitleSubject = new BehaviorSubject<string>('');
  private translateLanguageSubject = new BehaviorSubject<string>('');
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);

  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();
  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  headerTitleAction$ = this.headerTitleSubject.asObservable();
  translateLanguageAction$ = this.translateLanguageSubject.asObservable();
  permissionsAction$ = this.permissionsSubject.asObservable();

  constructor() {}

  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }

  setCurrentRouteUrl(value: string) {
    this.currentRouteUrlSubject.next(value);
  }

  setHeaderTitle(value: string) {
    this.headerTitleSubject.next(value);
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

  setTenantConfig(tenantConfig: TenantConfig) {
    this.tenantConfig = tenantConfig;
  }

  getTenantConfig() {
    return this.tenantConfig;
  }

  setTranslateLanguage(value: string) {
    this.translateLanguageSubject.next(value);
  }

  setUserInfo(userInfo: LoggedInUserInfo) {
    this.userInfo = userInfo;
  }

  getUserInfo(): LoggedInUserInfo {
    return this.userInfo;
  }

  getUserName(): string {
    const { userData = {} } = this.userInfo;
    const { name = '' } = userData;
    return name.split('.').join(' ');
  }

  decrypt(value: string, key: string) {
    const bytes = CryptoJS.AES.decrypt(value.toString(), key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  setPermissions(permissions: Permission[]) {
    this.permissionsSubject.next(permissions);
    this.permissions = permissions;
  }

  getPermissions(): Permission[] {
    return this.permissions;
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
}
