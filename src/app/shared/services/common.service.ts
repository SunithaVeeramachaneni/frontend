/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUserInfo } from 'src/app/interfaces/logged-in-user-info';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private protectedResources: [string[], string][] = [];
  private userInfo = {} as LoggedInUserInfo;

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private headerTitleSubject = new BehaviorSubject<string>('');
  private translateLanguageSubject = new BehaviorSubject<string>('');

  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();
  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  headerTitleAction$ = this.headerTitleSubject.asObservable();
  translateLanguageAction$ = this.translateLanguageSubject.asObservable();

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

  setProtectedResources(protectedResources: [string[], string][]) {
    this.protectedResources = protectedResources ? protectedResources : [];
  }

  getProtectedResources() {
    return this.protectedResources;
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
}
