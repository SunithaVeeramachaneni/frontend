import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PeopleService } from '../../people/people.service';
import { Buffer } from 'buffer';
import { ChatService } from '../chat.service';
import { getImageSrc } from '../../../../../shared/utils/imageUtils';

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
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.activeUsersInitial$ = this.peopleService.getUsers$().pipe(
      mergeMap((users) => {
        console.log(users);
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
      map(([initial]) => initial.data)
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
    const invitedUsers = ['U0139U8LUMV', 'UP2GXBKDL', 'U031PDC3D0E'];
    groupName = groupName.replace(/[^a-zA-Z ]/g, '');
    groupName = groupName.replaceAll(/\s/g, '');
    this.chatService.createConversation$(groupName, invitedUsers).subscribe(
      (resp) => {
        if (resp.ok) {
          this.handleGroupCreation.emit(resp);
          console.log(resp);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
}
