import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VideoCallDialogComponent } from '../chats/video-call-dialog/video-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable, of } from 'rxjs';
import { PeopleService } from './people.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Buffer } from 'buffer';
import { ImageUtils } from '../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoginService } from 'src/app/components/login/services/login.service';

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

  constructor(
    public uploadDialog: MatDialog,
    private peopleService: PeopleService,
    private imageUtils: ImageUtils,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.activeUsersInitial$ = this.peopleService.getUsers$(info).pipe(
      mergeMap((users) => {
        if (users.length) {
          const validUsers = [];
          users.forEach((user) => {
            const userInfo = this.loginService.getLoggedInUserInfo();
            if (userInfo.collaborationType === 'slack') {
              if (user.slackDetail) {
                user.collaborationDisabled =
                  !user.slackDetail || !user.slackDetail.slackID;
                validUsers.push(user);
              }
            } else if (userInfo.collaborationType === 'msteams') {
              // This is a temporary check to restrict the user selection...
              if (user.email.endsWith('@ym27j.onmicrosoft.com')) {
                validUsers.push(user);
              }
            }
          });

          validUsers.forEach((user) => {
            user.profileImage = this.imageUtils.getImageSrc(
              Buffer.from(user.profileImage).toString()
            );
          });
          return of({ data: validUsers });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.activeUsers$ = combineLatest([this.activeUsersInitial$]).pipe(
      map(([initial]) => initial.data)
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
    });
  };
}
