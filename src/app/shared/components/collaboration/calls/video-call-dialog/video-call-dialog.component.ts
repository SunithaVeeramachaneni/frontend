import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../../chats/chat.service';
import { LoginService } from 'src/app/components/login/services/login.service';
import { Buffer } from 'buffer';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from 'src/environments/environment';
import { WaitForUtil } from 'src/app/shared/utils/waitFor';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let JitsiMeetExternalAPI: any;
export interface DialogData {
  conversation?: any;
  conferenceType?: string;
  isCreateConferenceEvent?: boolean;
  meetingEvent?: any;
}

export interface Conference {
  id: string;
  userInfo: any;
  isGroupCall: boolean;
  topic: string;
  members: any[];
  metadata?: any;
}

@Component({
  selector: 'app-video-call-dialog',
  templateUrl: './video-call-dialog.component.html',
  styleUrls: ['./video-call-dialog.component.scss']
})
export class VideoCallDialogComponent implements OnInit {
  isSideNavOpen = false;

  attachment: any;
  api: any;
  conferenceId: string;

  allParticipants: any[];
  moderator: any;

  joinedUsers: any[];

  isMaximized: boolean;
  dialogCollapsed = false;

  selectedConference: Conference;
  isOpen = false;

  isConferenceReadyToJoin = false;

  constructor(
    public dialogRef: MatDialogRef<VideoCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private chatService: ChatService,
    private loginService: LoginService,
    private imageUtils: ImageUtils,
    private spinner: NgxSpinnerService,
    private waitForUtil: WaitForUtil
  ) {}

  async ngOnInit() {
    const {
      conversation: { topic, chatType, members } = {},
      isCreateConferenceEvent = true,
      meetingEvent = {},
      conferenceType = 'audio'
    } = this.data;
    const { firstName, lastName, email } =
      this.loginService.getLoggedInUserInfo();
    this.chatService.endMeeting$.subscribe((event) => {
      if (event) {
        if (
          event.receiver === email &&
          event.conferenceId === this.conferenceId
        ) {
          this.dialogRef.close();
        }
      }
    });
    this.spinner.show();
    let conferenceName;
    const isMeetingEvent = Object.keys(meetingEvent).length !== 0;
    if (isMeetingEvent) {
      this.conferenceId = meetingEvent.conferenceId;
      const conferenceDetailsProm = this.chatService.getConferenceDetails$(
        this.conferenceId
      );

      const conferenceDetails = await this.waitForUtil.waitFor(
        conferenceDetailsProm
      );
      conferenceName = conferenceDetails.metadata.subject;
      this.selectedConference = conferenceDetails;
      this.selectedConference.members.forEach((user) => {
        user.profileImage = this.imageUtils.getImageSrc(
          Buffer.from(user.profileImage).toString()
        );
      });
      if (
        chatType === 'oneOnOne' &&
        this.selectedConference.userInfo &&
        this.selectedConference.userInfo.profileImage
      ) {
        this.selectedConference.userInfo.profileImage =
          this.imageUtils.getImageSrc(
            Buffer.from(
              this.selectedConference.userInfo.profileImage
            ).toString()
          );
      }
      this.isConferenceReadyToJoin = true;
      this.spinner.hide();
    } else if (isCreateConferenceEvent) {
      conferenceName =
        chatType === 'oneOnOne' ? `${firstName} ${lastName}` : `${topic}`;
      const metadata = { subject: conferenceName, chatType, conferenceType };
      const createdJitsiConfProm = this.chatService.createJitsiConference$({
        chatType,
        conferenceType,
        metadata
      });
      const createdJitsiConf = await this.waitForUtil.waitFor(
        createdJitsiConfProm
      );

      this.conferenceId = createdJitsiConf.id;
      if (members && members.length) {
        let invitees = members.filter((m) => m.email !== email);
        invitees = invitees.map((i) => i.email);
        const initConfProm = this.chatService.initiateConference$(
          this.conferenceId,
          invitees,
          metadata
        );
        const confrenceInitiatedObj = await this.waitForUtil.waitFor(
          initConfProm
        );
        this.selectedConference = confrenceInitiatedObj;
        this.selectedConference.members.forEach((user) => {
          user.profileImage = this.imageUtils.getImageSrc(
            Buffer.from(user.profileImage).toString()
          );
        });

        if (
          chatType === 'oneOnOne' &&
          this.selectedConference.userInfo &&
          this.selectedConference.userInfo.profileImage
        ) {
          this.selectedConference.userInfo.profileImage =
            this.imageUtils.getImageSrc(
              Buffer.from(
                this.selectedConference.userInfo.profileImage
              ).toString()
            );
        }
        this.isConferenceReadyToJoin = true;
        this.spinner.hide();
      }
    } else {
      return;
    }
    this.joinedUsers = [...this.selectedConference.members];
    this.chatService.avConfWindowAction({
      isOpen: true,
      isCollapsed: false
    });
    const getJaaSJWTTokenProm = this.chatService.getJaaSJWTToken$(
      isCreateConferenceEvent
    );
    const jaasJWTToken = await this.waitForUtil.waitFor(getJaaSJWTTokenProm);
    const isAudioOnly = conferenceType === 'audio' ? true : false;
    const JAAS_DOMAIN = '8x8.vc';
    this.api = new JitsiMeetExternalAPI(JAAS_DOMAIN, {
      roomName: `${environment.jaasAppID}/${this.conferenceId}`,
      jwt: jaasJWTToken,
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#jaas-container'),
      configOverwrite: {
        prejoinPageEnabled: false,
        startAudioOnly: isAudioOnly,
        startWithVideoMuted: isAudioOnly
      },
      userInfo: {
        email,
        avatar: email,
        displayName: email,
        formattedDisplayName: `${firstName} ${lastName}`
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      interfaceConfigOverwrite: { DEFAULT_BACKGROUND: '#fff' }
    });
    if (isCreateConferenceEvent) {
      setTimeout(() => {
        this.api.executeCommand(
          'subject',
          conferenceName ? conferenceName : 'Untitled Conference'
        );
      }, 0);
    }
  }

  openSideNav(): void {
    this.isSideNavOpen = true;
  }

  onSideNavClose(event): void {
    if (event && event.type === 'close') {
      this.isSideNavOpen = false;
    } else if (
      event &&
      event.type === 'add' &&
      event.data &&
      Object.keys(event.data).length
    ) {
      this.isSideNavOpen = false;
      const participants = event.data;
      this.chatService
        .inviteParticipants$(this.conferenceId, participants)
        .subscribe();
    }
  }

  collapseAVConfDialog(): void {
    this.isMaximized = false;
    this.dialogCollapsed = true;
    this.dialogRef.updateSize('450px', '100px');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('overlay-min');
    const collaborationWindowStatus =
      this.chatService.getCollaborationWindowStatus();
    const isCollabWindowCollapsed = collaborationWindowStatus.isCollapsed;
    if (isCollabWindowCollapsed) {
      this.dialogRef.addPanelClass('bottomRightVideoCollabCollapsed');
    } else {
      this.dialogRef.addPanelClass('bottomRightVideo');
    }
    this.chatService.avConfWindowAction({
      isOpen: true,
      isCollapsed: true
    });
  }

  minimizeAVConfDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = false;
    this.dialogRef.updateSize('750px', 'auto');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('bottomRightVideo');
    this.dialogRef.removePanelClass('bottomRightVideoCollabCollapsed');
    this.dialogRef.addPanelClass('overlay-min');
    this.chatService.avConfWindowAction({
      isOpen: true,
      isCollapsed: false
    });
  }
  maximizeAVConfDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = true;
    this.dialogRef.updateSize('100vw', '100vh');
    this.dialogRef.removePanelClass('overlay-min');
    this.dialogRef.removePanelClass('bottomRightVideo');
    this.dialogRef.removePanelClass('bottomRightVideoCollabCollapsed');
    this.dialogRef.addPanelClass('overlay-max');
    this.chatService.avConfWindowAction({
      isOpen: true,
      isCollapsed: false
    });
  }
}
