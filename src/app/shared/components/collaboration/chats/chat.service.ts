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
  private avConfWindowOpenStatus = { isOpen: false, isCollapsed: false };
  private acceptCallWindowStatus = { isOpen: false };
  private unreadMessageCount = 0;

  private newMessageReceivedSubject = new BehaviorSubject<any>({});
  private collaborationWindowSubject = new BehaviorSubject<any>({});
  private avConfWindowSubject = new BehaviorSubject<any>({});
  private acceptCallWindowSubject = new BehaviorSubject<any>({});

  private collabWindowCollapseExpandSubject = new BehaviorSubject<any>({});

  private openCollaborationWindowSubject = new BehaviorSubject<any>({});
  private unreadCountSubject = new BehaviorSubject<number>(0);

  private meetingSubject = new BehaviorSubject<any>(null);
  private endMeetingSubject = new BehaviorSubject<any>(null);

  newMessageReceivedAction$ = this.newMessageReceivedSubject.asObservable();
  collaborationWindowAction$ = this.collaborationWindowSubject.asObservable();
  collabWindowCollapseExpandAction$ =
    this.collabWindowCollapseExpandSubject.asObservable();

  openCollabWindow$ = this.openCollaborationWindowSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  meeting$ = this.meetingSubject.asObservable();
  endMeeting$ = this.endMeetingSubject.asObservable();

  constructor(
    private appService: AppService,
    private loginService: LoginService
  ) {}

  setMeeting(meetingInfo: any) {
    this.meetingSubject.next(meetingInfo);
  }

  endMeeting(meetingInfo: any) {
    this.endMeetingSubject.next(meetingInfo);
  }

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
  avConfWindowAction = (action: any) => {
    this.avConfWindowOpenStatus = action;
    this.avConfWindowSubject.next(action);
  };
  acceptCallWindowAction = (action: any) => {
    this.acceptCallWindowStatus = action;
    this.acceptCallWindowSubject.next(action);
  };

  getCollaborationWindowStatus = () => this.collabWindowOpenStatus;
  getAVConfWindowStatus = () => this.avConfWindowOpenStatus;
  getAcceptCallWindowStatus = () => this.acceptCallWindowStatus;

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
    let featureURI = `${userInfo.collaborationType}/conversations/${userId}`;
    if (skipToken) {
      skipToken = encodeURIComponent(skipToken);
      featureURI = `${featureURI}?skipToken=${skipToken}`;
    }
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      featureURI,
      info
    );
  };

  getConversationHistory$ = (
    conversationId: string,
    skipToken?: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    let featureURI = `${userInfo.collaborationType}/conversations/${conversationId}/history`;
    if (skipToken) {
      skipToken = encodeURIComponent(skipToken);
      featureURI = `${featureURI}?skipToken=${skipToken}`;
    }
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      featureURI,
      info
    );
  };

  sendMessage$ = (
    message: string,
    userId: string,
    formData: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/channels/${userId}/messages`,
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
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/conversations`,
      { groupName, invitedUsers, chatType },
      info
    );
  };

  openConversation$ = (
    groupName: string,
    invitedUsers: any,
    chatType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/conversations/open`,
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
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/conversations/${chatId}/members`,
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
    return this.appService.uploadFile(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/channels/${conversationId}/messages/files`,
      formData,
      info
    );
  };

  downloadAttachment$ = (
    file: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Blob> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    let fileId: string;
    if (userInfo.collaborationType === 'msteams') {
      fileId = file.name;
    } else if (userInfo.collaborationType === 'slack') {
      fileId = file.url_private;
    }
    return this.appService.downloadFile(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/files/download?url=${fileId}`,
      info
    );
  };

  processSSEMessages$ = (
    messageIds: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> => {
    const userInfo = this.loginService.getLoggedInUserInfo();
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `${userInfo.collaborationType}/sse/events`,
      { messageIds },
      info
    );
  };

  getJaaSJWTToken$ = (
    isCreateConferenceEvent: boolean,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `jitsi/jaasToken?isCreator=${isCreateConferenceEvent}`,
      info
    );

  createJitsiConference$ = (
    event: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences`,
      event,
      info
    );

  initiateConference$ = (
    conferenceId: any,
    invitees: string[],
    metadata: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences/${conferenceId}/init`,
      { invitees, metadata },
      info
    );

  joinConference$ = (
    conferenceId: any,
    joinedParticipant: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences/${conferenceId}/join`,
      { joinedParticipant },
      info
    );

  leaveConference$ = (
    conferenceId: any,
    leavingParticipant: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences/${conferenceId}/leave`,
      { leavingParticipant },
      info
    );

  inviteParticipants$ = (
    conferenceId: any,
    participants: string[],
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences/${conferenceId}/invite`,
      { participants },
      info
    );

  deleteJitsiEvent$ = (
    eventId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._removeData(
      environment.userRoleManagementApiUrl,
      `jitsi/sse/${eventId}`,
      info
    );

  getConferenceDetails$ = (
    conferenceId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `jitsi/conferences/${conferenceId}`,
      info
    );

  getCallLog$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      'jitsi/conferences/calls/history',
      info,
      { ...queryParams }
    );
}
