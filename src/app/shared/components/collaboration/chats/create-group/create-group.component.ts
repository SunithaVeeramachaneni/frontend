import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PeopleService } from '../../people/people.service';
import { Buffer } from 'buffer';
import { ChatService } from '../chat.service';
import { getImageSrc } from '../../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { CommonService } from 'src/app/shared/services/common.service';

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

  constructor(
    private peopleService: PeopleService,
    private commonService: CommonService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
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
            user.profileImage = getImageSrc(
              Buffer.from(user.profileImage).toString(),
              this.sanitizer
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
          const userInfo = this.commonService.getUserInfo();
          if (userInfo.collaborationType === 'slack') {
            if (user.UserSlackDetail) {
              validUsers.push(user);
            }
          } else if (userInfo.collaborationType === 'msteams') {
            // This is a temporary check to restrict the user selection...
            if (user.email.endsWith('@ym27j.onmicrosoft.com')) {
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
  startConversation = (groupName: string, selectedUsers: any) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const invitedUsers = [];
    selectedUsers.forEach((user) => {
      const userInfo = this.commonService.getUserInfo();
      if (userInfo.collaborationType === 'slack') {
        if (user.UserSlackDetail && user.UserSlackDetail.slackID) {
          invitedUsers.push(user.UserSlackDetail.slackID);
        }
      } else if (userInfo.collaborationType === 'msteams') {
        invitedUsers.push(user.email);
      }
    });

    groupName = groupName.replace(/[^a-zA-Z ]/g, '');
    groupName = groupName.replaceAll(/\s/g, '');
    this.chatService
      .createConversation$(groupName, invitedUsers, info)
      .subscribe(
        (resp) => {
          if (resp.ok) {
            this.handleGroupCreation.emit(resp);
          }
        },
        (err) => {
          // TODO: Display toasty messsage
        }
      );
  };
}
