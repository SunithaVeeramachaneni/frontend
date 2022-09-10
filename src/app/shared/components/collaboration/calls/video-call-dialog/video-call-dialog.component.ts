import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ChatService } from '../../chats/chat.service';
import { LoginService } from 'src/app/components/login/services/login.service';
import waitFor from 'src/app/shared/utils/waitFor';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let JitsiMeetExternalAPI: any;
export interface DialogData {
  conversation?: any;
  conferenceType?: string;
  isCreateConferenceEvent?: boolean;
  meetingEvent?: any;
}

@Component({
  selector: 'app-video-call-dialog',
  templateUrl: './video-call-dialog.component.html',
  styleUrls: ['./video-call-dialog.component.scss']
})
export class VideoCallDialogComponent implements OnInit {
  attachment: any;
  api: any;
  conferenceId: string;

  allParticipants: any[];
  moderator: any;

  isViewLoaded = false;
  jaasTokenGenerated = false;

  isMaximized: boolean;
  dialogCollapsed = false;

  constructor(
    public dialogRef: MatDialogRef<VideoCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private chatService: ChatService,
    private loginService: LoginService
  ) {}

  async ngOnInit() {
    const {
      conversation: { topic, id, chatType, userInfo, members } = {},
      isCreateConferenceEvent = true,
      meetingEvent = {},
      conferenceType = 'video'
    } = this.data;
    const { firstName, lastName, email } =
      this.loginService.getLoggedInUserInfo();

    this.chatService.endMeeting$.subscribe((event) => {
      if (event) {
        console.log('endmeeting event received', event);
        console.log(this.conferenceId, email);
        if (
          event.receiver === email &&
          event.conferenceId === this.conferenceId
        ) {
          console.log(event.receiver, 'is leaving...');
          this.dialogRef.close();
        }
      }
    });

    let conferenceName;
    const isMeetingEvent = Object.keys(meetingEvent).length !== 0;
    if (isMeetingEvent) {
      this.conferenceId = meetingEvent.conferenceId;
      const conferenceDetailsProm = this.chatService.getConferenceDetails$(
        this.conferenceId
      );
      const conferenceDetails = await waitFor(conferenceDetailsProm);
      conferenceName = conferenceDetails.metadata.subject;
    } else if (isCreateConferenceEvent) {
      conferenceName =
        chatType === 'oneOnOne' ? `${firstName} ${lastName}` : `${topic}`;
      const metadata = { subject: conferenceName, chatType, conferenceType };
      const createdJitsiConfProm = this.chatService.createJitsiConference$({
        chatType,
        conferenceType,
        metadata
      });
      const createdJitsiConf = await waitFor(createdJitsiConfProm);
      this.conferenceId = createdJitsiConf.id;
    } else {
      return;
    }

    const getJaaSJWTTokenProm = this.chatService.getJaaSJWTToken$(
      isCreateConferenceEvent
    );
    const jaasJWTToken = await waitFor(getJaaSJWTTokenProm);

    this.jaasTokenGenerated = true;
    const JAAS_APP_ID = 'vpaas-magic-cookie-c9a785fe985444a18ba0c24416de0d6c';
    const JAAS_DOMAIN = '8x8.vc';
    this.api = new JitsiMeetExternalAPI(JAAS_DOMAIN, {
      roomName: `${JAAS_APP_ID}/${this.conferenceId}`,
      jwt: jaasJWTToken,
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#jaas-container'),
      configOverwrite: {
        prejoinPageEnabled: false
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
      this.api.executeCommand(
        'subject',
        conferenceName ? conferenceName : 'Untitled Conference'
      );
      const metadata = {
        subject: conferenceName,
        chatType,
        conferenceType
      };
      let invitees = members.filter((m) => m.email !== email);
      invitees = invitees.map((i) => i.email);
      this.chatService
        .initiateConference$(this.conferenceId, invitees, metadata)
        .subscribe();
    }
  }

  collapseCollabDialog(): void {
    this.isMaximized = false;
    this.dialogCollapsed = true;
    this.dialogRef.updateSize('200px', '100px');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('overlay-min');
    this.dialogRef.addPanelClass('bottomRight');
  }

  minimizeCollabDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = false;
    this.dialogRef.updateSize('750px', 'auto');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('bottomRight');
    this.dialogRef.addPanelClass('overlay-min');
  }
  maximizeCollabDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = true;
    this.dialogRef.updateSize('100vw', '100vh');
    this.dialogRef.removePanelClass('overlay-min');
    this.dialogRef.removePanelClass('bottomRight');
    this.dialogRef.addPanelClass('overlay-max');
  }
}
