import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of, ReplaySubject, throwError } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { TimeAgoPipe } from 'src/app/shared/pipes/time-ago.pipe';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import {
  conversationHistoryMock,
  conversationHistoryMockObj,
  conversationsMock,
  conversationsMockGroupObj,
  conversationsMockObj,
  convNotExist,
  emptyConversations,
  mockGetUsers,
  MockTimeAgoPipe,
  mockUserInfo,
  mockUsers,
  selectedConversationMock,
  selectedConversationMockObj
} from '../collaboration-mock';
import { PeopleService } from '../people/people.service';
import { ChatService } from './chat.service';
import { ChatsComponent } from './chats.component';

const mySubject: ReplaySubject<any> = new ReplaySubject<any>(1);

fdescribe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;

  let dialogSpy: MatDialog;
  let peopleServiceSpy: PeopleService;
  let chatServiceSpy: ChatService;
  let loginServiceSpy: LoginService;
  let imageUtilsSpy: ImageUtils;

  jasmine.getEnv().allowRespy(true);

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['close'], {
      open: () => {}
    });
    peopleServiceSpy = jasmine.createSpyObj('PeopleService', ['getUsers$'], {
      updateUserPresence$: of({
        action: 'update_user_presence',
        data: ['cbouser1@cbo.com']
      })
    });
    peopleServiceSpy.getUsers$ = jasmine
      .createSpy()
      .and.returnValue(mockGetUsers);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      [
        'getCallLog$',
        'openConversation$',
        'getConversations$',
        'createConversation$',
        'getConversationHistory$',
        'newMessageReceived',
        'sendMessage$',
        'uploadFileToConversation$',
        'downloadAttachment$',
        'getAVConfWindowStatus'
      ],
      {
        newMessageReceivedAction$: mySubject
      }
    );

    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(conversationsMock);

    chatServiceSpy.openConversation$ = jasmine
      .createSpy()
      .and.returnValue(selectedConversationMock);

    chatServiceSpy.getConversationHistory$ = jasmine
      .createSpy()
      .and.returnValue(conversationHistoryMock);

    chatServiceSpy.downloadAttachment$ = jasmine
      .createSpy()
      .and.returnValue(of(new Blob([], { type: 'application/text' })));

    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );
    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});
    imageUtilsSpy.getImageSrc = jasmine.createSpy().and.returnValue('');

    await TestBed.configureTestingModule({
      declarations: [ChatsComponent, MockTimeAgoPipe],
      imports: [
        MatMenuModule,
        MatListModule,
        MatIconModule,
        MatProgressBarModule,
        FormsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: PeopleService, useValue: peopleServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    component.targetUser = mockUserInfo;
    component.messageText = 'abcd';
    component.conversationsSkipToken = 'emptytoken';
    component.conversationsSkipToken = 'emptytoken';
    component.conversationHistorySkipToken = 'sdlf';
    component.conversationsLength = 1;
    component.selectedView = 'CHAT';
    fixture.detectChanges();
  });

  it('ngOnInit() - GROUP_CREATED_EVENT', () => {
    mySubject.next({
      messageType: 'GROUP_CREATED_EVENT',
      id: 'convId4',
      userInfo: mockUserInfo,
      chatType: 'oneOnOne',
      topic: '',
      members: mockUsers,
      latest: {
        message: 'sample text message',
        createdDateTime: '2022-06-04T06:43:46.000Z',
        channel: 'channel1'
      },
      chatId: 'chatid1234324'
    });
    fixture.detectChanges();
    component.ngOnInit();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('ngOnInit() - NOT_GROUP_CREATED_EVENT', () => {
    mySubject.next({
      messageType: 'NOT_GROUP_CREATED_EVENT',
      id: 'convId4',
      userInfo: mockUserInfo,
      chatType: 'oneOnOne',
      topic: '',
      members: mockUsers,
      latest: {
        message: 'sample text message',
        createdDateTime: '2022-06-04T06:43:46.000Z',
        channel: 'channel1'
      },
      chatId: 'chatid1234324'
    });
    fixture.detectChanges();
    component.ngOnInit();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('ngOnInit() - !conversationExists', () => {
    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(convNotExist);
    component.ngOnInit();
    fixture.detectChanges();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('ngOnInit() - !conversationExists - slack', () => {
    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(convNotExist);

    const updateConversationSpy = spyOn(component.updateConversations$, 'next');
    component.ngOnInit();
    fixture.detectChanges();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(updateConversationSpy).toHaveBeenCalled();
    expect(imageUtilsSpy.getImageSrc).toHaveBeenCalled();
  });

  it('ngOnInit() - !conversationExists - slack', () => {
    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(convNotExist);

    const updateConversationSpy = spyOn(component.updateConversations$, 'next');
    component.ngOnInit();
    fixture.detectChanges();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(updateConversationSpy).toHaveBeenCalled();
    expect(imageUtilsSpy.getImageSrc).toHaveBeenCalled();
  });

  xit('ngOnInit() - !conversationExists - msteams', () => {
    const mockUserInfoMSTeams = {
      ...mockUserInfo,
      collaborationType: 'msteams'
    };
    const tSpy = spyOn(loginServiceSpy, 'getLoggedInUserInfo').and.returnValue(
      mockUserInfoMSTeams
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(tSpy).toHaveBeenCalled();
  });

  it('ngOnInit() - targetUser is undefined', () => {
    component.targetUser = undefined;
    const tSpy = spyOn(component, 'setSelectedConversation');
    component.ngOnInit();
    fixture.detectChanges();
    expect(tSpy).toHaveBeenCalled();
  });

  it('ngOnInit() - fetchConversations is empty', () => {
    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(emptyConversations);
    component.ngOnInit();
    // expect(tSpy).toHaveBeenCalled();
  });

  xit('ngOnInit() - conversation unreadCount is 0', () => {
    chatServiceSpy.getConversations$ = jasmine
      .createSpy()
      .and.returnValue(conversationsMock);
    component.updateConversations$.next({
      action: 'update_latest_message',
      message: {
        latest: {
          message: 'sample text message',
          createdDateTime: '2022-06-04T06:43:46.000Z',
          timestamp: '2022-06-04T06:43:46.000Z',
          channel: 'channel1'
        }
      },
      channel: 'convId1'
    });
    component.ngOnInit();
    // expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
  });

  xit('ngOnInit() - conversation unreadCount is 0', () => {
    chatServiceSpy.getConversations$ = jasmine.createSpy().and.returnValue(
      of({
        conversations: []
      })
    );
    component.updateConversations$.next({
      action: 'append_conversations',
      message: {
        id: 'conveId4',
        latest: {
          message: 'sample text message',
          createdDateTime: '2022-06-04T06:43:46.000Z',
          channel: 'channel1'
        }
      },
      channel: 'convId1'
    });
    // component.ngOnInit();
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
  });

  it('fetchConversations - without skipToken', () => {
    component.fetchConversations('dummyemail@cbo.com');
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
  });
  it('fetchConversations -with skipToken', () => {
    component.fetchConversations('dummyemail@cbo.com', 'testSkipToken');
    expect(chatServiceSpy.getConversations$).toHaveBeenCalled();
  });

  it('fetchConversationHistory - without skipToken', () => {
    component.fetchConversationHistory('dummyConveID');
    expect(chatServiceSpy.getConversationHistory$).toHaveBeenCalled();
  });

  it('fetchConversationHistory -with skipToken', () => {
    component.fetchConversationHistory('dummyConveID', 'testSkipToken');
    expect(chatServiceSpy.getConversationHistory$).toHaveBeenCalled();
  });

  it('formatConversations', () => {
    component.formatConversations(conversationsMockObj);
    expect(component).toBeTruthy();
    // expect(chatServiceSpy.getConversationHistory$).toHaveBeenCalled();
  });

  it('formatConversations - group', () => {
    component.formatConversations(conversationsMockGroupObj);
    expect(component).toBeTruthy();
  });

  it('formatConversations - group- empty topic', () => {
    component.formatConversations([
      {
        id: 'convId1',
        userInfo: mockUserInfo,
        topic: '',
        chatType: 'group',
        members: mockUsers,
        latest: {
          message: 'sample text message',
          createdDateTime: '2022-06-04T06:43:46.000Z',
          timestamp: '2022-06-04T06:43:46.000Z',
          channel: 'channel1'
        },
        chatId: 'chatid1234',
        unreadCount: 1
      }
    ]);
    expect(component).toBeTruthy();
  });

  it('formatConversationHistory', () => {
    component.selectedConversation = selectedConversationMockObj;
    component.formatConversationHistory(conversationHistoryMockObj);
    expect(component).toBeTruthy();
  });

  it('addPeopleToConversation - chatType=oneOnOne', () => {
    const conversation = {
      id: '1',
      userInfo: {},
      chatType: 'oneOnOne',
      topic: '',
      members: [],
      latest: {}
    };
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.addPeopleToConversation(conversation);
    expect(component.selectedView).toEqual('CREATE_UPDATE_GROUP');
    expect(tSpy).toHaveBeenCalled();
    expect(component.conversationMode).toEqual('CREATE_GROUP_WITH_USER');
  });

  it('addPeopleToConversation - chatType=group', () => {
    const conversation = {
      id: '1',
      userInfo: {},
      chatType: 'group',
      topic: '',
      members: [],
      latest: {}
    };
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.addPeopleToConversation(conversation);
    expect(component.selectedView).toEqual('CREATE_UPDATE_GROUP');
    expect(tSpy).toHaveBeenCalled();
    expect(component.conversationMode).toEqual('ADD_GROUP_MEMBERS');
  });

  it('createGroup', () => {
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.createGroup();
    expect(component.selectedView).toEqual('CREATE_UPDATE_GROUP');
    expect(component.conversationMode).toEqual('CREATE_GROUP');
    expect(tSpy).toHaveBeenCalled();
  });

  it('handleGroupCreation', () => {
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.handleGroupCreation({});
    expect(component.selectedView).toEqual('CHAT');
    expect(component.conversationsLength).toEqual(0);
    expect(tSpy).toHaveBeenCalled();
  });

  it('handleViewChange - CHAT', () => {
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.handleViewChange({ view: 'CHAT' });
    expect(component.selectedView).toEqual('CHAT');
    expect(tSpy).toHaveBeenCalled();
  });

  it('handleViewChange - viewChangeHandler not called', () => {
    const tSpy = spyOn(component.viewChangeHandler, 'emit');
    component.handleViewChange({ view: 'NON-CHAT-VIEW' });
    expect(component.selectedView).toEqual('NON-CHAT-VIEW');
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('downloadFile - downloadInProgress=true', () => {
    component.downloadInProgress = true;
    const file = {};
    const refId = 'refId';
    const fileId = 'fileId';
    const ret = component.downloadFile(file, refId, fileId);
    expect(ret).toBeUndefined();
    expect(chatServiceSpy.downloadAttachment$).toHaveBeenCalledTimes(0);
  });

  it('downloadFile - downloadInProgress=false', () => {
    component.downloadInProgress = false;
    const file = {};
    const refId = 'refId';
    const fileId = 'fileId';
    component.downloadFile(file, refId, fileId);
    expect(chatServiceSpy.downloadAttachment$).toHaveBeenCalledTimes(1);
  });

  it('downloadFile - download error', () => {
    component.downloadInProgress = false;
    const file = {};
    const refId = 'refId';
    const fileId = 'fileId';
    chatServiceSpy.downloadAttachment$ = jasmine
      .createSpy()
      .and.returnValue(throwError({ status: 500 }));
    component.downloadFile(file, refId, fileId);
    expect(chatServiceSpy.downloadAttachment$).toHaveBeenCalledTimes(1);
    expect(component.downloadingFileRef).toBeUndefined();
  });

  it('loadMoreConversations, - appendingConversations=true', () => {
    component.appendingConversations = true;
    fixture.detectChanges();
    const ret = component.loadMoreConversations();
    expect(ret).toBeUndefined();
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('loadMoreConversations, - appendingConversations=false & conversationsSkipToken exists', () => {
    component.appendingConversations = false;
    component.conversationsSkipToken = 'dummyskiptoken';
    const tSpy = spyOn(component, 'fetchConversations').and.returnValue(
      of(conversationsMockObj)
    );
    fixture.detectChanges();
    component.loadMoreConversations();
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
  });

  it('onConversationsListScrolled', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    const event = { target: mockTargetElementBottomReached };
    component.onConversationsListScrolled(event);
  });

  it('onConversationsListScrolled - scrollLeft is not same', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    const event = { target: mockTargetElementBottomReached };

    component.lastScrollLeft = 10;
    fixture.detectChanges();
    component.onConversationsListScrolled(event);
  });

  it('onConversationsListScrolled - isBottomReached', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    const event = { target: mockTargetElementBottomReached };
    const tSpy = spyOn(component, 'loadMoreConversations');
    component.onConversationsListScrolled(event);
    expect(tSpy).toHaveBeenCalled();
  });

  it('onConversationHistoryScrolled - isTopReached', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory');
    const event = {
      target: {
        scrollHeight: 120,
        scrollTop: 0,
        clientHeight: 20,
        scrollLeft: 0
      }
    };
    component.onConversationHistoryScrolled(event);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onConversationHistoryScrolled - appendingConvHistory', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory');
    const event = {
      target: {
        scrollHeight: 120,
        scrollTop: 0,
        clientHeight: 20,
        scrollLeft: 0
      }
    };
    component.appendingConvHistory = true;
    fixture.detectChanges();
    component.onConversationHistoryScrolled(event);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onConversationHistoryScrolled - appendingConversations', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory');
    const event = {
      target: {
        scrollHeight: 120,
        scrollTop: 0,
        clientHeight: 20,
        scrollLeft: 0
      }
    };
    component.appendingConversations = true;
    fixture.detectChanges();
    component.onConversationHistoryScrolled(event);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onConversationHistoryScrolled - conversationHistorySkipToken is undefined', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory');
    const event = {
      target: {
        scrollHeight: 120,
        scrollTop: 0,
        clientHeight: 20,
        scrollLeft: 0
      }
    };
    component.conversationHistorySkipToken = undefined;
    fixture.detectChanges();
    component.onConversationHistoryScrolled(event);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onConversationHistoryScrolled - fetchConversationHistory', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory').and.returnValue(
      of(conversationHistoryMockObj)
    );
    const event = {
      target: {
        scrollHeight: 120,
        scrollTop: 0,
        clientHeight: 20,
        scrollLeft: 0
      }
    };
    component.conversationHistorySkipToken = 'somedummytoken';
    fixture.detectChanges();
    component.onConversationHistoryScrolled(event);
    expect(tSpy).toHaveBeenCalledTimes(1);
  });

  it('setSelectedConversation', () => {
    const conv = selectedConversationMockObj;
    component.setSelectedConversation(selectedConversationMockObj);
    expect(component.showAttachmentPreview).toBeFalse();
  });

  it('setSelectedConversation', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory').and.returnValue(
      of(conversationHistoryMock)
    );
    component.setSelectedConversation(selectedConversationMockObj);
    expect(component.showAttachmentPreview).toBeFalse();
    expect(tSpy).toHaveBeenCalled();
  });

  it('setSelectedConversation - error', () => {
    const tSpy = spyOn(component, 'fetchConversationHistory').and.returnValue(
      throwError({ status: 500 })
    );
    component.setSelectedConversation(selectedConversationMockObj);
    expect(component.showAttachmentPreview).toBeFalse();
    expect(tSpy).toHaveBeenCalled();
  });
  it('isLoggedInUser - non-loggedInUser ', () => {
    component.isLoggedInUser({ email: 'test@innovapptive.com' });
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('isLoggedInUser - loggedInUser ', () => {
    component.isLoggedInUser({ email: 'test.user@innovapptive.com' });
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('onMessageEnter - empty message', () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = '';
    const tSpy = spyOn(component, 'sendMessageToUser');
    component.onMessageEnter(targetUser, message);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onMessageEnter - invalid message with spaces', () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = '    ';
    const tSpy = spyOn(component, 'sendMessageToUser');
    component.onMessageEnter(targetUser, message);
    expect(tSpy).toHaveBeenCalledTimes(0);
  });

  it('onMessageEnter - valid message', () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = 'dummy message';
    const tSpy = spyOn(component, 'sendMessageToUser');
    component.onMessageEnter(targetUser, message);
    expect(tSpy).toHaveBeenCalledTimes(1);
  });

  it('sendMessageToUser', async () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = 'dummy message';

    chatServiceSpy.sendMessage$ = jasmine
      .createSpy()
      .and.returnValue(of(conversationHistoryMockObj[0]));

    await component.sendMessageToUser(targetUser, message);
    expect(chatServiceSpy.sendMessage$).toHaveBeenCalled();
  });

  it('sendMessageToUser - with file upload', async () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = 'dummy message';
    component.uploadedFiles = [{ file: 'file1' }, { file: 'file2' }];
    chatServiceSpy.sendMessage$ = jasmine
      .createSpy()
      .and.returnValue(of(conversationHistoryMockObj[0]));
    fixture.detectChanges();
    await component.sendMessageToUser(targetUser, message);
    expect(chatServiceSpy.sendMessage$).toHaveBeenCalled();
  });

  it('sendMessageToUser - error', async () => {
    const targetUser = { email: 'testuser@cbo.com' };
    const message = 'dummy message';
    component.uploadedFiles = [{ file: 'file1' }, { file: 'file2' }];
    chatServiceSpy.sendMessage$ = jasmine
      .createSpy()
      .and.returnValue(throwError({ status: 500 }));
    fixture.detectChanges();
    await component.sendMessageToUser(targetUser, message);
    expect(chatServiceSpy.sendMessage$).toHaveBeenCalled();
  });

  it('openAudioVideoCallDialog - avConfWindowStatus - isOpen=true', () => {
    const conferenceType = 'audio';
    chatServiceSpy.getAVConfWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isOpen: true });

    component.openAudioVideoCallDialog(
      selectedConversationMock,
      conferenceType
    );
    expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalled();
  });

  xit('openAudioVideoCallDialog - avConfWindowStatus - isOpen=false', () => {
    const conferenceType = 'audio';
    chatServiceSpy.getAVConfWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isOpen: false });

    component.openAudioVideoCallDialog(
      selectedConversationMock,
      conferenceType
    );
    expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalled();
  });

  it('isImageType = true', () => {
    let resp = component.isImageType('image/png');
    expect(resp).toBeTrue();

    resp = component.isImageType('image/jpeg');
    expect(resp).toBeTrue();

    resp = component.isImageType('image/pjpeg');
    expect(resp).toBeTrue();
  });

  it('isImageType = false', () => {
    const resp = component.isImageType('random/ext');
    expect(resp).toBeFalse();
  });
  it('setSelectedAttachment', () => {
    component.setSelectedAttachment('dummyattachment');
    expect(component.selectedAttachment).toEqual('dummyattachment');
  });

  it('removeAttachment - file does not exist', () => {
    component.uploadedFiles = [{ name: 'file1' }, { name: 'file2' }];
    component.removeAttachment({ name: 'filexyz' });
  });

  it('removeAttachment - file exists', () => {
    component.uploadedFiles = [{ name: 'file1' }, { name: 'file2' }];
    component.removeAttachment({ name: 'file1' });
  });

  it('closePreview', () => {
    component.closePreview();
    expect(component.showAttachmentPreview).toBeFalse();
    expect(component.uploadedFiles.length).toEqual(0);
  });

  it('openAttachments', () => {
    component.openAttachments();
  });

  it('should detect file input change and set uploadedFile  model', () => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([''], 'test-file.pdf'));

    const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    // expect(component.uploadedFile).toBeTruthy();
    // expect(component.uploadedFile).toBe('test-file.pdf');
  });

  it('file change event should arrive in handler', () => {
    const element = fixture.nativeElement;
    const input = element.querySelector('#uploadFile');
    // spyOn(component, 'onFileSelected');
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // expect(component.onFileSelected).toHaveBeenCalled();
  });

  it('addMessageToConversation ', () => {
    const message = {
      chatId: 'convId1',
      message: 'meeting_request dummy message',
      text: '{"link":"http://dummylink.com/dummy"}'
    };
    component.addMessageToConversation(message);
  });
});
