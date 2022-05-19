import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoCallDialogComponent } from '../chats/video-call-dialog/video-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/shared/services/app.services';
import { combineLatest, Observable, of } from 'rxjs';
import { PeopleService } from './people.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-people',
  templateUrl: 'people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  @Output() handleTextMessaging = new EventEmitter<any>();
  @Output() handleAudioMessaging = new EventEmitter<any>();
  @Output() handleVideoMessaging = new EventEmitter<any>();

  activeUsersInitial$: Observable<any>;
  activeUsers$: Observable<any[]>;

  slackInstallationURL$: Observable<any>;

  constructor(
    public uploadDialog: MatDialog,
    private peopleService: PeopleService
  ) {}

  ngOnInit() {
    this.activeUsersInitial$ = this.peopleService.getWorkspaceUsers$().pipe(
      mergeMap((users) => {
        if (users.length) {
          return of({ data: users });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.activeUsers$ = combineLatest([this.activeUsersInitial$]).pipe(
      map(([initial]) => initial.data)
    );

    this.slackInstallationURL$ = this.peopleService.getInstallationURL$().pipe(
      mergeMap((url) => {
        console.log(url);
        return url;
      })
    );
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
