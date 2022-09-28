/* eslint-disable no-underscore-dangle */
import { TestBed, async } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { AppService } from 'src/app/shared/services/app.services';
import { of } from 'rxjs';
import {
  conversationHistoryMockObj,
  conversationsMockObj,
  mockUserInfo
} from '../collaboration-mock';
import { LoginService } from 'src/app/components/login/services/login.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpTestingController: HttpTestingController;
  let appServiceSpy: AppService;
  let loginServiceSpy: LoginService;

  beforeEach(async () => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      '_postData',
      'uploadFile',
      'downloadFile',
      'patchData'
    ]);

    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );
    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: AppService, useValue: appServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    });
    service = TestBed.inject(ChatService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('setMeeting', () => {
    service.setMeeting({ start: true });
    service.meeting$.subscribe((meeting) => expect(meeting.start).toBeTrue());
  });

  it('endMeeting', () => {
    service.endMeeting({ ended: true });
    service.endMeeting$.subscribe((meeting) =>
      expect(meeting.ended).toBeTrue()
    );
  });

  it('newMessageReceived', () => {
    service.newMessageReceived({ received: true });
    service.newMessageReceivedAction$.subscribe((event) =>
      expect(event.received).toBeTrue()
    );
  });

  it('expandCollaborationWindow', () => {
    service.expandCollaborationWindow();
    service.collabWindowCollapseExpandAction$.subscribe((event) =>
      expect(event.expand).toBeTrue()
    );
  });
  it('collaborationWindowAction', () => {
    service.collaborationWindowAction({ action: 'action' });
    service.collaborationWindowAction$.subscribe((event) =>
      expect(event.action).toEqual('action')
    );
  });

  it('avConfWindowAction ', () => {
    service.avConfWindowAction({ isOpen: true });
    const status = service.getAVConfWindowStatus();
    expect(status.isOpen).toBeTrue();
  });

  it('acceptCallWindowAction ', () => {
    service.acceptCallWindowAction({ isOpen: true });
    const status = service.getAcceptCallWindowStatus();
    expect(status.isOpen).toBeTrue();
  });

  it('getCollaborationWindowStatus  ', () => {
    service.collaborationWindowAction({ isOpen: true, isCollapsed: false });
    const status = service.getCollaborationWindowStatus();
    expect(status.isOpen).toBeTrue();
    expect(status.isCollapsed).toBeFalse();
  });

  it('getAVConfWindowStatus   ', () => {
    service.avConfWindowAction({ isOpen: true, isCollapsed: false });
    const status = service.getAVConfWindowStatus();
    expect(status.isOpen).toBeTrue();
    expect(status.isCollapsed).toBeFalse();
  });

  it('getAcceptCallWindowStatus ', () => {
    service.acceptCallWindowAction({ isOpen: true });
    const status = service.getAcceptCallWindowStatus();
    expect(status.isOpen).toBeTrue();
  });

  it('openCollaborationWindow ', () => {
    service.openCollaborationWindow({ action: 'action' });
    service.openCollabWindow$.subscribe((event) =>
      expect(event.action).toEqual('action')
    );
  });

  it('setUnreadMessageCount ', () => {
    service.setUnreadMessageCount(1);
    service.unreadCount$.subscribe((event) => expect(event).toEqual(1));
  });

  it('getUnreadMessageCount  ', () => {
    service.setUnreadMessageCount(5);
    const count = service.getUnreadMessageCount();
    expect(count).toEqual(5);
  });

  it('getConversations$', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of(conversationsMockObj));
    const conversations = service.getConversations$('testuser@cbo.com');
    conversations.subscribe((resp) => {
      expect(resp[0].latest.message).toEqual('sample text message');
      expect(resp[0].userInfo.email).toEqual('test.user@innovapptive.com');
    });
  });

  it('getConversations$ - with skipToken', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of(conversationsMockObj));
    const conversations = service.getConversations$(
      'testuser@cbo.com',
      'testskipToken'
    );
    conversations.subscribe((resp) => {
      expect(resp[0].latest.message).toEqual('sample text message');
      expect(resp[0].userInfo.email).toEqual('test.user@innovapptive.com');
    });
  });

  it('getConversationHistory$', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of(conversationHistoryMockObj));
    const history = service.getConversationHistory$('convId1');
    history.subscribe((resp) => {
      expect(resp[0].client_msg_id).toEqual(
        'dac54ba8-010c-40c6-ac6a-7072d5ebc95c'
      );
      expect(resp[0].team).toEqual('T78857ZCK');
      expect(resp[0].from.email).toEqual('test.user@innovapptive.com');
    });
  });

  it('getConversationHistory$ - with skipToken', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of(conversationHistoryMockObj));
    const history = service.getConversationHistory$('convId1', 'skiptokenTest');
    history.subscribe((resp) => {
      expect(resp[0].client_msg_id).toEqual(
        'dac54ba8-010c-40c6-ac6a-7072d5ebc95c'
      );
      expect(resp[0].team).toEqual('T78857ZCK');
      expect(resp[0].from.email).toEqual('test.user@innovapptive.com');
    });
  });

  it('sendMessage$', () => {
    const formData = new FormData();
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ chatId: 'chat1234' }));
    const response = service.sendMessage$(
      'test message',
      'testuser@cbo.com',
      formData
    );
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.chatId).toEqual('chat1234');
    });
  });

  it('createConversation$', () => {
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.createConversation$(
      'testGroup',
      ['testuser@cbo.com'],
      'oneOnOne'
    );
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('openConversation$', () => {
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.openConversation$(
      'testGroup',
      ['testuser@cbo.com'],
      'oneOnOne'
    );
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('addMembersToConversation$', () => {
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.addMembersToConversation$('chatId', [
      'testuser@cbo.com'
    ]);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('uploadFileToConversation$', () => {
    const formData = new FormData();
    appServiceSpy.uploadFile = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.uploadFileToConversation$('convID', formData);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('downloadAttachment$ - msteams', () => {
    appServiceSpy.downloadFile = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const file = {
      name: 'file1'
    };

    spyOn(loginServiceSpy, 'getLoggedInUserInfo').and.returnValue({
      collaborationType: 'msteams',
      slackDetail: undefined,
      permissions: [],
      id: 0,
      title: '',
      email: '',
      isActive: false,
      roles: []
    });

    const response = service.downloadAttachment$(file);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });

  it('downloadAttachment$ - slack', () => {
    appServiceSpy.downloadFile = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const file = {
      name: 'file1'
    };
    const response = service.downloadAttachment$(file);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });

  it('processSSEMessages$', () => {
    appServiceSpy.patchData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.processSSEMessages$(['msgid1', 'msgid2']);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });

  it('getJaaSJWTToken$', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.getJaaSJWTToken$(true);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });

  it('createJitsiConference$', () => {
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.createJitsiConference$({ event: 'dummyevent' });
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('initiateConference$', () => {
    appServiceSpy._postData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.initiateConference$(
      'confID',
      ['user1@cbo.com', 'user2@cbo.com'],
      {}
    );
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('joinConference$', () => {
    appServiceSpy.patchData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.joinConference$('confID', 'joined-user1@cbo.com');
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('leaveConference$', () => {
    appServiceSpy.patchData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.leaveConference$(
      'confID',
      'leaving-user1@cbo.com'
    );
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('inviteParticipants$', () => {
    appServiceSpy.patchData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.inviteParticipants$('confID', [
      'cbouser3@cbo.com',
      'cbouser4@cbo.com'
    ]);
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('deleteJitsiEvent$', () => {
    appServiceSpy._removeData = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.deleteJitsiEvent$('confID');
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
      expect(resp.ok).toBeTrue();
    });
  });

  it('getConferenceDetails$', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.getConferenceDetails$('confID');
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });

  it('getCallLog$', () => {
    appServiceSpy._getResp = jasmine
      .createSpy()
      .and.returnValue(of({ ok: true }));
    const response = service.getCallLog$('cbouser@cbo.com');
    response.subscribe((resp) => {
      expect(Object.keys(resp).length).toBe(1);
    });
  });
});
