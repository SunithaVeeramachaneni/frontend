import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { PeopleService } from '../../people/people.service';
import { Buffer } from 'buffer';
import { ChatService } from '../chat.service';
import { ImageUtils } from '../../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { LoginService } from 'src/app/components/login/services/login.service';
import { defaultLimit } from 'src/app/app.constants';

interface UpdatePeople {
  action: 'add_people' | 'add_people_search' | '';
  data: any;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Input() selectedConversation: any;
  @Input() conversationMode: string;

  @Output() handleGroupCreation = new EventEmitter<any>();
  @Output() viewChangeListener = new EventEmitter<any>();

  activeUsersInitial$: Observable<any>;
  activeUsers$: Observable<any[]>;

  skip = 0;
  limit = defaultLimit;
  lastScrollLeft = 0;
  searchKey = '';
  searchKeyUpdate = new Subject<string>();
  fetchActiveUsersInprogress = false;

  peopleTotalCount = 0;
  peopleLoadedCount = 0;

  updatePeople$ = new BehaviorSubject<UpdatePeople>({
    action: '',
    data: {} as any
  });

  selectedUsers: any[] = [];
  groupName = '';
  groupCreationInProgress = false;
  newUsersAddedToGroup = false;
  ghostLoading = new Array(10).fill(0).map((v, i) => i);

  constructor(
    private peopleService: PeopleService,
    private chatService: ChatService,
    private imageUtils: ImageUtils,
    private loginService: LoginService
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
    this.activeUsersInitial$ = this.fetchActiveUsers().pipe(
      mergeMap((users: any) => {
        this.fetchActiveUsersInprogress = false;
        if (users.length) {
          const validUsers = this.formatUsers(users);

          const userInfo = this.loginService.getLoggedInUserInfo();
          if (
            this.conversationMode === 'CREATE_GROUP_WITH_USER' ||
            this.conversationMode === 'ADD_GROUP_MEMBERS'
          ) {
            // add selected conversation members.... remove current user..
            let memberEmails = this.selectedConversation.members.map(
              (m) => m.email
            );
            memberEmails = memberEmails.filter(
              (m) => m.email !== userInfo.email
            );
            validUsers.forEach((user) => {
              if (memberEmails.indexOf(user.email) > -1) {
                user.disabled = true;
                user.selected = true;
                this.selectedUsers.push(user);
              }
            });
            if (this.conversationMode === 'ADD_GROUP_MEMBERS') {
              this.groupName = this.selectedConversation.topic;
            }
          }

          return of({ data: validUsers });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.activeUsers$ = combineLatest([
      this.activeUsersInitial$,
      this.updatePeople$
    ]).pipe(
      map(([initial, updatePeople]) => {
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
    return this.peopleService
      .getUsers$(
        {
          skip: this.skip,
          limit: this.limit,
          isActive: true,
          searchKey: this.searchKey
        },
        includeSlackDetails,
        info
      )
      .pipe(
        mergeMap((resp: any) => {
          if (resp.count) {
            this.peopleTotalCount = resp.count;
          }
          this.peopleLoadedCount += resp.rows.length;
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
          if (userInfo.email !== user.email) {
            validUsers.push(user);
          }
        }
      } else if (userInfo.collaborationType === 'msteams') {
        //@TODO: This is a temporary check to restrict the user selection...
        if (user.email.endsWith('@ym27j.onmicrosoft.com')) {
          if (userInfo.email !== user.email) {
            validUsers.push(user);
          }
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
      if (!(this.peopleLoadedCount < this.peopleTotalCount)) {
        return;
      }
      if (this.fetchActiveUsersInprogress) return;
      this.fetchActiveUsers().subscribe((data) => {
        this.updatePeople$.next({
          action: 'add_people',
          data
        });
      });
    }
  }

  switchToConversationsView = () => {
    this.viewChangeListener.emit({ view: 'CHAT' });
  };

  addParticipant = (user: any) => {
    user.selected = true;
    const index = this.selectedUsers.findIndex((u) => u.id === user.id);
    if (index > -1) {
      return;
    }
    this.selectedUsers.push(user);
    this.newUsersAddedToGroup = true;
  };

  removeParticipant = (user) => {
    user.selected = false;
    const index = this.selectedUsers.findIndex((u) => u.id === user.id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    }
  };
  onGroupCreateEnter = (groupName, selectedUsers) => {
    if (
      groupName &&
      groupName.length &&
      selectedUsers &&
      selectedUsers.length
    ) {
      this.startConversation(groupName, selectedUsers);
    }
  };
  startConversation = (groupName: string, selectedUsers: any) => {
    this.groupCreationInProgress = true;
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const invitedUsers = [];
    const userInfo = this.loginService.getLoggedInUserInfo();
    selectedUsers.forEach((user) => {
      if (userInfo.collaborationType === 'slack') {
        if (user.slackDetail && user.slackDetail.slackID) {
          invitedUsers.push(user.slackDetail.slackID);
        }
      } else if (userInfo.collaborationType === 'msteams') {
        invitedUsers.push(user.email);
      }
    });
    if (userInfo.collaborationType === 'slack') {
      groupName = groupName.replace(/[^a-zA-Z ]/g, '');
      groupName = groupName.replaceAll(/\s/g, '');
    }

    this.chatService
      .createConversation$(groupName, invitedUsers, 'group', info)
      .subscribe(
        (resp) => {
          if (resp.ok) {
            this.groupCreationInProgress = false;
            this.handleGroupCreation.emit(resp);
          }
        },
        (err) => {
          this.groupCreationInProgress = false;
          // TODO: Display toasty messsage
        }
      );
  };
  updateGroupMembers = () => {
    // Note - Shiva: This works only for MS Teams, need to figure out a way for making it work for Slack as well...
    if (!this.newUsersAddedToGroup) {
      return;
    }
    this.groupCreationInProgress = true;
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const userInfo = this.loginService.getLoggedInUserInfo();
    let members;
    if (userInfo.collaborationType === 'slack') {
      members = this.selectedUsers.map((user) => user.slackDetail.slackID);
    } else if (userInfo.collaborationType === 'msteams') {
      members = this.selectedUsers.map((user) => user.email);
    }
    this.chatService
      .addMembersToConversation$(this.selectedConversation.id, members, info)
      .subscribe(
        (resp) => {
          this.groupCreationInProgress = false;
          this.handleGroupCreation.emit(resp);
        },
        (err) => {
          this.groupCreationInProgress = false;
          // TODO: Display toasty messsage
        }
      );
  };
}
