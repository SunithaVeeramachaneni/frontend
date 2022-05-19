import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoCallDialogComponent } from '../chats/video-call-dialog/video-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/shared/services/app.services';

@Component({
  selector: 'app-people',
  templateUrl: 'people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  @Output() handleTextMessaging = new EventEmitter<any>();
  @Output() handleAudioMessaging = new EventEmitter<any>();
  @Output() handleVideoMessaging = new EventEmitter<any>();

  activeUsers: any = [];
  constructor(
    private httpClient: HttpClient,
    public uploadDialog: MatDialog,
    private appService: AppService
  ) {}

  ngOnInit() {
    // this.appService._getResp()
    this.httpClient
      .get('http://localhost:8005/slack/users')
      .subscribe((data) => {
        this.activeUsers = data;
      });
  }
  onTextMessageClick(targetUser) {
    this.handleTextMessaging.emit({ ...targetUser });
  }
  onAudioMessageClick(targetUser) {
    this.handleAudioMessaging.emit(targetUser);
  }
  // onVideoMessageClick(targetUser) {
  //   this.handleVideoMessaging.emit(targetUser);
  // }

  onVideoMessageClick = (user: any) => {
    console.log(user);
    const dialogRef = this.uploadDialog.open(VideoCallDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      width: '100%',
      data: {
        conversation: user
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //
      }
      console.log('The video call dialog was closed');
    });
  };
}
