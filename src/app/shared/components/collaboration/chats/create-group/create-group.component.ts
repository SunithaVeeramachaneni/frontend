import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PeopleService } from '../../people/people.service';
import { Buffer } from 'buffer';
import { ChatService } from '../chat.service';
import { ImageUtils } from '../../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoginService } from 'src/app/components/login/services/login.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Output() handleGroupCreation = new EventEmitter<any>();
  @Output() viewChangeListener = new EventEmitter<any>();

  activeUsersInitial$: Observable<any>;
  activeUsers$: Observable<any[]>;

  selectedUsers: any[] = [];
  groupName = '';
  groupCreationInProgress = false;

  constructor(
    private peopleService: PeopleService,
    private chatService: ChatService,
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
          users.forEach((user) => {
            user.profileImage = this.imageUtils.getImageSrc(
              Buffer.from(user.profileImage).toString()
            );
          });
          return of({ data: users });
        }
      }),
      catchError(() => of({ data: [] }))
    );
    this.activeUsers$ = combineLatest([this.activeUsersInitial$]).pipe(
      map(([initial]) => {
        const validUsers = [];
        initial.data.forEach((user) => {
          const userInfo = this.loginService.getLoggedInUserInfo();
          let isCurrentUser = false;
          if (user.email === userInfo.email) {
            isCurrentUser = true;
          }

          if (userInfo.collaborationType === 'slack') {
            if (user.slackDetail && !isCurrentUser) {
              validUsers.push(user);
            }
          } else if (userInfo.collaborationType === 'msteams') {
            // This is a temporary check to restrict the user selection...
            if (
              user.email.endsWith('@ym27j.onmicrosoft.com') &&
              !isCurrentUser
            ) {
              validUsers.push(user);
            }
          }
        });
        return validUsers;
      })
    );
  }

  switchToConversationsView = () => {
    this.viewChangeListener.emit({ view: 'CHAT' });
  };

  selectUser = (user: any) => {
    const index = this.selectedUsers.findIndex((u) => u.id === user.id);
    if (index > -1) {
      return;
    }
    this.selectedUsers.push(user);
  };
  removeParticipant = (user) => {
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
    selectedUsers.forEach((user) => {
      const userInfo = this.loginService.getLoggedInUserInfo();
      if (userInfo.collaborationType === 'slack') {
        if (user.slackDetail && user.slackDetail.slackID) {
          invitedUsers.push(user.slackDetail.slackID);
        }
      } else if (userInfo.collaborationType === 'msteams') {
        invitedUsers.push(user.email);
      }
    });

    groupName = groupName.replace(/[^a-zA-Z ]/g, '');
    groupName = groupName.replaceAll(/\s/g, '');
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
}
