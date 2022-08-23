import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VideoCallDialogComponent } from '../chats/video-call-dialog/video-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { PeopleService } from './people.service';
import {
  catchError,
  map,
  mergeMap,
  tap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Buffer } from 'buffer';
import { ImageUtils } from '../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { LoginService } from 'src/app/components/login/services/login.service';
import { defaultLimit } from 'src/app/app.constants';
import { AuthHeaderService } from 'src/app/shared/services/authHeader.service';
import { environment } from 'src/environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface UpdatePeople {
  action: 'add_people' | 'add_people_search' | '';
  data: any;
}

interface UpdateUserPresence {
  action: 'update_user_presence' | '';
  data: any;
}

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

  eventSource: any;

  skip = 0;
  limit = defaultLimit;
  lastScrollLeft = 0;
  searchKey = '';
  searchKeyUpdate = new Subject<string>();
  fetchActiveUsersInprogress = false;

  updatePeople$ = new BehaviorSubject<UpdatePeople>({
    action: '',
    data: {} as any
  });

  updateUserPresence$ = new BehaviorSubject<UpdateUserPresence>({
    action: 'update_user_presence',
    data: [] as any
  });

  constructor(
    public uploadDialog: MatDialog,
    private peopleService: PeopleService,
    private imageUtils: ImageUtils,
    private loginService: LoginService,
    private authHeaderService: AuthHeaderService
  ) {
    this.searchKeyUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.fetchActiveUsers(true).subscribe((data) => {
          const validUsers = this.formatUsers(data);
          this.updatePeople$.next({
            action: 'add_people_search',
            data: validUsers
          });
        });
      });
  }

  ngOnInit() {
    const SSE_URL = `${environment.userRoleManagementApiUrl}users/sse/users_presence`;

    const { authorization, tenantid } =
      this.authHeaderService.getAuthHeaders(SSE_URL);
    this.eventSource = new EventSourcePolyfill(SSE_URL, {
      headers: {
        authorization,
        tenantid
      }
    });
    this.eventSource.onmessage = async (event: any) => {
      const eventData = JSON.parse(event.data);
      if (!eventData.isHeartbeat) {
        this.updateUserPresence$.next({
          action: 'update_user_presence',
          data: eventData
        });
      }
    };

    this.activeUsersInitial$ = this.fetchActiveUsers().pipe(
      mergeMap((users) => {
        this.fetchActiveUsersInprogress = false;
        if (users.length) {
          const validUsers = this.formatUsers(users);
          return of({ data: validUsers });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.activeUsers$ = combineLatest([
      this.activeUsersInitial$,
      this.updatePeople$,
      this.updateUserPresence$
    ]).pipe(
      map(([initial, updatePeople, updateUserPresence]) => {
        this.fetchActiveUsersInprogress = false;
        const { action, data } = updatePeople;
        let peopleList = initial.data;
        if (action === 'add_people') {
          peopleList = peopleList.concat(data);
        } else if (action === 'add_people_search') {
          peopleList = [];
          peopleList = data;
        }
        this.skip = peopleList ? peopleList.length : this.skip;

        if (
          updateUserPresence &&
          updateUserPresence.action === 'update_user_presence'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { data } = updateUserPresence;
          peopleList.forEach((user) => {
            if (data.indexOf(user.email) > -1) {
              user.online = true;
            } else {
              user.online = false;
            }
          });
        }

        return peopleList;
      })
    );
  }

  fetchActiveUsers = (isDebounceSearchEvent: boolean = false) => {
    this.fetchActiveUsersInprogress = true;
    // TODO: Increase skip and limits
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const userInfo = this.loginService.getLoggedInUserInfo();
    let includeSlackDetails = false;
    if (userInfo.collaborationType === 'slack') {
      includeSlackDetails = true;
    }
    if (isDebounceSearchEvent) {
      this.skip = 0;
    }
    return this.peopleService.getUsers$(
      {
        skip: this.skip,
        limit: this.limit,
        isActive: true,
        searchKey: this.searchKey
      },
      includeSlackDetails,
      info
    );
  };

  formatUsers = (users: any) => {
    const validUsers = [];
    const userInfo = this.loginService.getLoggedInUserInfo();
    users.forEach((user) => {
      if (userInfo.collaborationType === 'slack') {
        if (user.slackDetail) {
          user.collaborationDisabled =
            !user.slackDetail || !user.slackDetail.slackID;
          validUsers.push(user);
        }
      } else if (userInfo.collaborationType === 'msteams') {
        //@TODO: This is a temporary check to restrict the user selection...
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
    return validUsers;
  };

  onPeopleListScrolled(event: any) {
    const element = event.target;
    const isBottomReached =
      Math.abs(element.scrollHeight) -
        Math.abs(element.scrollTop) -
        Math.abs(element.clientHeight) <=
      1;

    const documentScrollLeft = element.scrollLeft;
    if (this.lastScrollLeft !== documentScrollLeft) {
      this.lastScrollLeft = documentScrollLeft;
      return;
    }

    if (isBottomReached) {
      if (this.fetchActiveUsersInprogress) return;
      this.fetchActiveUsers().subscribe((data) => {
        const validUsers = this.formatUsers(data);
        this.updatePeople$.next({
          action: 'add_people',
          data: validUsers
        });
      });
    }
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
