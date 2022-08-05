import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PeopleService } from '../../people/people.service';
import { Buffer } from 'buffer';
import { ChatService } from '../chat.service';
import { ImageUtils } from '../../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { LoginService } from 'src/app/components/login/services/login.service';

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

  selectedUsers: any[] = [];
  groupName = '';
  groupCreationInProgress = false;
  newUsersAddedToGroup = false;

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
        const userInfo = this.loginService.getLoggedInUserInfo();
        initial.data.forEach((user) => {
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

        if (
          this.conversationMode === 'CREATE_GROUP_WITH_USER' ||
          this.conversationMode === 'ADD_GROUP_MEMBERS'
        ) {
          // add selected conversation members.... remove current user..

          let memberEmails = this.selectedConversation.members.map(
            (m) => m.email
          );
          memberEmails = memberEmails.filter((m) => m.email !== userInfo.email);
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
        return validUsers;
      })
    );
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
    const members = this.selectedUsers.map((user) => user.email);
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
