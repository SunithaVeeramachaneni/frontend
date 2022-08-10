/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';
import { environment } from '../../../../../environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private collabWindowOpenStatus = { isOpen: false, isCollapsed: false };
  private unreadMessageCount = 0;

  private newMessageReceivedSubject = new BehaviorSubject<any>({});
  private collaborationWindowSubject = new BehaviorSubject<any>({});
  private collabWindowCollapseExpandSubject = new BehaviorSubject<any>({});

  private openCollaborationWindowSubject = new BehaviorSubject<any>({});
  private unreadCountSubject = new BehaviorSubject<number>(0);

  newMessageReceivedAction$ = this.newMessageReceivedSubject.asObservable();
  collaborationWindowAction$ = this.collaborationWindowSubject.asObservable();
  collabWindowCollapseExpandAction$ =
    this.collabWindowCollapseExpandSubject.asObservable();

  openCollabWindow$ = this.openCollaborationWindowSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private appService: AppService,
    private loginService: LoginService
  ) {}

  newMessageReceived = (message: any) => {
    this.newMessageReceivedSubject.next(message);
  };

  expandCollaborationWindow = () => {
    this.collabWindowCollapseExpandSubject.next({ expand: true });
  };

  collaborationWindowAction = (action: any) => {
    this.collabWindowOpenStatus = action;
    this.collaborationWindowSubject.next(action);
  };

  getCollaborationWindowStatus = () => this.collabWindowOpenStatus;

  openCollaborationWindow = (action: any) => {
    this.openCollaborationWindowSubject.next(action);
  };

  setUnreadMessageCount = (count: number) => {
    this.unreadMessageCount = count;
    this.unreadCountSubject.next(count);
  };
  getUnreadMessageCount = () => this.unreadMessageCount;

  getConversations$ = (
    userId: string,
    skipToken?: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    let featureURI = `conversations/${userId}`;
    if (skipToken) {
      skipToken = encodeURIComponent(skipToken);
      featureURI = `${featureURI}?skipToken=${skipToken}`;
    }
    return this.appService._getResp(apiURL, featureURI, info);
  };

  getConversationHistory$ = (
    conversationId: string,
    skipToken: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    let featureURI = `conversations/${conversationId}/history`;
    if (skipToken) {
      skipToken = encodeURIComponent(skipToken);
      featureURI = `${featureURI}?skipToken=${skipToken}`;
    }
    return this.appService._getResp(apiURL, featureURI, info);
  };

  sendMessage$ = (
    message: string,
    userId: string,
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    return this.appService._postData(
      apiURL,
      `channels/${userId}/messages`,
      formData,
      info
    );
  };

  createConversation$ = (
    groupName: string,
    invitedUsers: any,
    chatType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    return this.appService._postData(
      apiURL,
      `conversations`,
      { groupName, invitedUsers, chatType },
      info
    );
  };

  addMembersToConversation$ = (
    chatId: string,
    members: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    return this.appService._postData(
      apiURL,
      `conversations/${chatId}/members`,
      { members },
      info
    );
  };

  uploadFileToConversation$ = (
    conversationId: string,
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    return this.appService.uploadFile(
      apiURL,
      `channels/${conversationId}/messages/files`,
      formData,
      info
    );
  };

  downloadAttachment$ = (
    file: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Blob> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    let fileId: string;
    if (userInfo.collaborationType === 'msteams') {
      fileId = file.name;
    } else if (userInfo.collaborationType === 'slack') {
      fileId = file.url_private;
    }
    return this.appService._downloadFile(
      apiURL,
      `files/download?url=${fileId}`,
      info
    );
  };

  processSSEMessages$ = (
    messageIds: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    const apiURL = `${environment.userRoleManagementApiUrl}${userInfo.collaborationType}/`;
    return this.appService.patchData(
      apiURL,
      `sse/events`,
      { messageIds },
      info
    );
  };

  triggerCall = (user) => {
    //
  };
}
