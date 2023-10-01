import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Buffer } from 'buffer';
import { ImageUtils } from '../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { LoginService } from 'src/app/components/login/services/login.service';
import { defaultLimit } from 'src/app/app.constants';
import { ChatService } from '../chats/chat.service';

interface UpdateCallList {
  action: 'add_call' | 'add_call_search' | '';
  data: any;
}

@Component({
  selector: 'app-calls',
  templateUrl: 'calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callListInitial$: Observable<any>;
  callList$: Observable<any[]>;

  callListTotalCount = 0;
  callListLoadedCount = 0;

  skip = 0;
  limit = defaultLimit;
  lastScrollLeft = 0;
  searchKey = '';
  ghostLoading = new Array(16).fill(0).map((v, i) => i);
  searchKeyUpdate = new Subject<string>();
  fetchcallListInprogress = false;

  updateCallList$ = new BehaviorSubject<UpdateCallList>({
    action: '',
    data: {} as any
  });

  constructor(
    private chatService: ChatService,
    private imageUtils: ImageUtils,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.callListInitial$ = this.fetchcallList().pipe(
      mergeMap((users: any) => {
        this.fetchcallListInprogress = false;
        if (users.length) {
          const validUsers = this.formatUsers(users);
          return of({ data: validUsers });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.callList$ = combineLatest([
      this.callListInitial$,
      this.updateCallList$
    ]).pipe(
      map(([initial, updateCallList]) => {
        const { action, data } = updateCallList;
        this.fetchcallListInprogress = false;
        let callList = initial.data;
        if (action === 'add_call') {
          callList = callList.concat(data);
        } else if (action === 'add_call_search') {
          callList = [];
          callList = data;
        }
        this.skip = callList ? callList.length : this.skip;

        return callList;
      })
    );
  }

  fetchcallList = (isDebounceSearchEvent: boolean = false) => {
    this.fetchcallListInprogress = true;
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
    return this.chatService
      .getCallLog$(
        {
          skip: this.skip,
          limit: this.limit,
          searchKey: this.searchKey
        },
        info
      )
      .pipe(
        mergeMap((resp: any) => {
          if (resp.count) {
            this.callListTotalCount = resp.count;
          }
          this.callListTotalCount += resp.rows.length;
          return of(resp.rows);
        })
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
      if (!(this.callListLoadedCount < this.callListTotalCount)) {
        return;
      }
      if (this.fetchcallListInprogress) return;
      this.fetchcallList().subscribe((data) => {
        const validUsers = this.formatUsers(data);
        this.updateCallList$.next({
          action: 'add_call',
          data: validUsers
        });
      });
    }
  }
}
