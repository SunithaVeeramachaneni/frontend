import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { WaitForUtil } from 'src/app/shared/utils/waitFor';
import { ChatService } from '../../chats/chat.service';
import {
  mockUserInfo,
  endMeeting$,
  videoCallDialogData,
  selectedConfMock
} from '../../collaboration-mock';

import {
  DialogData,
  VideoCallDialogComponent
} from './video-call-dialog.component';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let JitsiMeetExternalAPI: any;

describe('VideoCallDialogComponent', () => {
  let component: VideoCallDialogComponent;
  let fixture: ComponentFixture<VideoCallDialogComponent>;

  let chatServiceSpy: ChatService;
  let loginServiceSpy: LoginService;
  let imageUtilsSpy: ImageUtils;
  let spinnerSpy: NgxSpinnerService;
  let waitForUtilSpy: WaitForUtil;
  let jitsiMeetExternalAPISpy: any;

  let dialogRefSpy: MatDialogRef<VideoCallDialogComponent>;
  let collabDialogData: any;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'updatePosition',
      'updateSize',
      'removePanelClass',
      'addPanelClass'
    ]);
    collabDialogData = videoCallDialogData as DialogData;

    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      [
        'getConferenceDetails$',
        'createJitsiConference$',
        'initiateConference$',
        'avConfWindowAction',
        'getJaaSJWTToken$',
        'getCollaborationWindowStatus'
      ],
      {
        endMeeting$: of({
          receiver: 'test.user@innovapptive.com',
          conferenceId: 'conference1'
        })
      }
    );
    chatServiceSpy.createJitsiConference$ = jasmine
      .createSpy()
      .and.returnValue(selectedConfMock);
    chatServiceSpy.getConferenceDetails$ = jasmine
      .createSpy()
      .and.returnValue(selectedConfMock);
    chatServiceSpy.initiateConference$ = jasmine
      .createSpy()
      .and.returnValue(selectedConfMock);

    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );
    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});
    imageUtilsSpy.getImageSrc = jasmine
      .createSpy()
      .and.returnValue('transformedImageSrc');

    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    jitsiMeetExternalAPISpy = new JitsiMeetExternalAPI();

    waitForUtilSpy = jasmine.createSpyObj('WaitForUtil', ['waitFor']);
    waitForUtilSpy.waitFor = jasmine
      .createSpy()
      .and.returnValue(selectedConfMock);

    await TestBed.configureTestingModule({
      declarations: [VideoCallDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: collabDialogData
        },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: WaitForUtil, useValue: waitForUtilSpy },
        { provide: JitsiMeetExternalAPI, useValue: jitsiMeetExternalAPISpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component - ngOnInit() - isMeetingEvent', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - isCreateConferenceEvent', () => {
    component.data.isCreateConferenceEvent = true;
    component.data.meetingEvent = {};

    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - chatType=group', () => {
    component.data.conversation.chatType = 'group';
    component.data.conversation.topic = 'groupName';
    component.data.meetingEvent = {};
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - not isMeeting and not isCreateConferenceEvent', () => {
    component.data.isCreateConferenceEvent = false;
    component.data.meetingEvent = {};
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - conferenceType=audio', () => {
    component.data.conferenceType = 'audio';
    component.data.meetingEvent = {};
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - dialogData empty', () => {
    component.data = {
      conversation: {}
    };
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('openSideNav', () => {
    component.openSideNav();
    expect(component.isSideNavOpen).toBeTrue();
  });

  it('onSideNavClose  - type=close', () => {
    const event = {
      type: 'close'
    };
    component.onSideNavClose(event);
    expect(component.isSideNavOpen).toBeFalse();
  });

  it('onSideNavClose  - type=add', () => {
    const event = {
      type: 'add',
      data: ['user@cbo.com']
    };
    chatServiceSpy.inviteParticipants$ = jasmine
      .createSpy()
      .and.returnValue(of(true));
    component.onSideNavClose(event);
    expect(component.isSideNavOpen).toBeFalse();
    expect(chatServiceSpy.inviteParticipants$).toHaveBeenCalled();
  });

  it('collapseAVConfDialog  - isCollapsed=true', () => {
    chatServiceSpy.getCollaborationWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isCollapsed: true });
    component.collapseAVConfDialog();
    expect(component.isMaximized).toBeFalse();
    expect(component.dialogCollapsed).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(2);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.avConfWindowAction).toHaveBeenCalledTimes(1);
  });

  it('collapseAVConfDialog  - isCollapsed=false', () => {
    chatServiceSpy.getCollaborationWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isCollapsed: false });
    component.collapseAVConfDialog();
    expect(component.isMaximized).toBeFalse();
    expect(component.dialogCollapsed).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(2);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.avConfWindowAction).toHaveBeenCalledTimes(1);
  });

  it('minimizeAVConfDialog', () => {
    component.minimizeAVConfDialog();
    expect(component.dialogCollapsed).toBeFalse();
    expect(component.isMaximized).toBeFalse();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(3);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.avConfWindowAction).toHaveBeenCalledTimes(1);
  });

  it('maximizeAVConfDialog', () => {
    component.maximizeAVConfDialog();
    expect(component.dialogCollapsed).toBeFalse();
    expect(component.isMaximized).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(3);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.avConfWindowAction).toHaveBeenCalledTimes(1);
  });
});
