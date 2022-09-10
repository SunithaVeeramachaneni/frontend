import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { VideoCallDialogComponent } from '../video-call-dialog/video-call-dialog.component';

@Component({
  selector: 'app-accept-call',
  templateUrl: './accept-call.component.html',
  styleUrls: ['./accept-call.component.scss']
})
export class AcceptCallComponent implements OnInit {
  roomName: string;
  incomingCallType: string;
  conferenceType: string;

  constructor(
    public dialogRef: MatDialogRef<AcceptCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.data.meetingEvent);
    this.roomName = this.data.meetingEvent?.metadata?.subject;
    this.incomingCallType = this.data.meetingEvent?.metadata?.chatType;
    this.conferenceType = this.data.meetingEvent?.metadata?.conferenceType;
    if (!this.roomName) {
      this.roomName = this.data.meetingEvent.conferenceId.replace(/-/g, ' ');
    }
    // // TODO: After 60s, if the call is neither accepted nor rejected, dismiss the call dialog..
    // setTimeout(function () {
    //   this.dialogRef.close();
    //   this.data.audio.pause();
    // }, 60000);
  }

  rejectIncomingCall = () => {
    this.data.audio.pause();
    this.dialogRef.close();
  };

  acceptIncomingCall = () => {
    this.dialogRef.close();
    this.data.audio.pause();
    const dialogRef = this.dialog.open(VideoCallDialogComponent, {
      hasBackdrop: false,
      width: '750px',
      disableClose: true,
      panelClass: 'jitsiMeetingDialog',
      data: {
        meetingEvent: this.data.meetingEvent
      }
    });
  };
}
