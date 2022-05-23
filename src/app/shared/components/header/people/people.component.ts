import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoCallDialogComponent } from '../chats/video-call-dialog/video-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/shared/services/app.services';
import { combineLatest, Observable, of } from 'rxjs';
import { PeopleService } from './people.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';

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
    private sanitizer: DomSanitizer
  ) {}

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  ngOnInit() {
    this.activeUsersInitial$ = this.peopleService.getUsers$().pipe(
      mergeMap((users) => {
        console.log(users);
        if (users.length) {
          users.forEach((user) => {
            user.profileImage = this.getImageSrc(
              Buffer.from(user.profileImage).toString()
            );
          });
          return of({ data: users });
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
