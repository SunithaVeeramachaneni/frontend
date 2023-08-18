/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProtectedResource, UserInfo } from 'src/app/interfaces';
import { v4 as uuidV4 } from 'uuid';

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

  /**
   * @description Generate UUID unique string.
   * @param startKeyWord {String} Start key
   * @param limit {Number} Number of characters to generate
   */
  generateUUID(startKeyWord: string = null, limit: number = 20): string {
    const initialIndex = 0;
    const startSliceIndex = 3;
    let uuid: string = uuidV4();
    // Preparing startSliceIndex for uuid in range of xxxx-xxxx-xxxx-xxxx
    const statSliceIndex: number = startKeyWord
      ? startKeyWord.length + startSliceIndex
      : startSliceIndex;
    uuid = uuid?.length > limit ? uuid?.slice(statSliceIndex) : uuid;
    const preparedUUID: string = startKeyWord ? `${startKeyWord}${uuid}` : uuid;
    return preparedUUID?.slice(initialIndex, limit);
  }
}
