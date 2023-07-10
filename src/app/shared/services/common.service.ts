/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProtectedResource, UserInfo } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private protectedResources: ProtectedResource[] = [];
  private permissionRevokeModalStatus = { isOpen: false };

  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private translateLanguageSubject = new BehaviorSubject<string>('');
  private userInfoSubject = new BehaviorSubject<UserInfo>({} as UserInfo);
  private displayPermissionRevokeSubject = new BehaviorSubject<boolean>(false);
  private displayLoaderSubject = new BehaviorSubject<boolean>(false);

  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  translateLanguageAction$ = this.translateLanguageSubject.asObservable();
  userInfo$ = this.userInfoSubject.asObservable();
  displayPermissionRevoke$ = this.displayPermissionRevokeSubject.asObservable();
  displayLoader$ = this.displayLoaderSubject.asObservable();

  constructor() {}

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

  setTranslateLanguage(value: string) {
    this.translateLanguageSubject.next(value);
  }

  displayPermissionRevoke(display: boolean) {
    this.displayPermissionRevokeSubject.next(display);
  }

  setPermisionRevokeModalStatus(isOpen: boolean) {
    this.permissionRevokeModalStatus.isOpen = isOpen;
  }

  getPermisionRevokeModalStatus(): boolean {
    return this.permissionRevokeModalStatus.isOpen;
  }

  setDisplayLoader(display: boolean) {
    this.displayLoaderSubject.next(display);
  }

  isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
