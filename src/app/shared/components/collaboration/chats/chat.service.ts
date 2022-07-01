/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';
import { environment } from '../../../../../environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private collabWindowOpenStatus = false;
  private unreadMessageCount = 0;

  private newMessageReceivedSubject = new BehaviorSubject<any>({});
  private collaborationWindowSubject = new BehaviorSubject<any>({});
  private openCollaborationWindowSubject = new BehaviorSubject<any>({});
  private unreadCountSubject = new BehaviorSubject<number>(0);

  newMessageReceivedAction$ = this.newMessageReceivedSubject.asObservable();
  collaborationWindowAction$ = this.collaborationWindowSubject.asObservable();
  openCollabWindow$ = this.openCollaborationWindowSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private appService: AppService) {}

  newMessageReceived = (message: any) => {
    this.newMessageReceivedSubject.next(message);
  };

  collaborationWindowAction = (action: any) => {
    this.collabWindowOpenStatus = action.isOpen;
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

  getConversations$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(environment.slackAPIUrl, `conversations`, info);

  getConversationHistory$ = (
    conversationId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.slackAPIUrl,
      `conversations/${conversationId}/history`,
      info
    );

  sendMessage$ = (
    message: string,
    userId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.slackAPIUrl,
      `channels/${userId}/messages`,
      { message },
      info
    );

  createConversation$ = (
    groupName: string,
    invitedUsers: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.slackAPIUrl,
      `conversations`,
      { groupName, invitedUsers },
      info
    );

  uploadFileToConversation$ = (
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.uploadFile(
      environment.userRoleManagementApiUrl,
      `msteams/channel/messages/files`,
      formData,
      info
    );

  downloadFileSlack$ = (
    fileId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Blob> =>
    this.appService._downloadFile(
      environment.slackAPIUrl,
      `files/download?url=${fileId}`,
      info
    );

  processSSEMessages$ = (
    messageIds: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.slackAPIUrl,
      `sse/events`,
      { messageIds },
      info
    );

  triggerCall = (user) => {
    //
  };
}
