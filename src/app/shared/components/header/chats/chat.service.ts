/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';
import { environment } from '../../../../../environments/environment';

import axios from 'axios';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:8007/slack';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private appService: AppService) {}

  getConversations$ = (info: ErrorInfo = {} as ErrorInfo): Observable<any[]> =>
    this.appService._getResp(
      environment.slackAPIUrl,
      'conversations/U02R5D4SREU',
      info
    );
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
      `users/${userId}/messages`,
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
    conversationId,
    formData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.uploadFile(
      environment.slackAPIUrl,
      `conversations/${conversationId}/files`,
      formData
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

  triggerCall = (user) =>
    axios.post(`${baseURL}calls`, {
      user
    });
}
