import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { VideoCallDialogComponent } from './video-call-dialog/video-call-dialog.component';
import { EmitterService } from '../EmitterService';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription
} from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { getImageSrc } from '../../../../shared/utils/imageUtils';

interface SendReceiveMessages {
  action: 'send' | 'receive';
  message: any;
}

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Input() targetUser: any;

  selectedView = 'CHAT';
  messageText = '';
  messageDeliveryProgress = false;
  downloadInProgress = false;
  conversations: any = [];
  selectedConversation: any;
  conversationHistory: any = [];

  activeUsers: any = [];

  userMaps: any = [];

  conversationsInitial$: Observable<any>;
  conversations$: Observable<any[]>;

  conversationHistoryInit$: Observable<any>;
  conversationHistory$: Observable<any[]>;

  sendReceiveMessages$ = new BehaviorSubject<SendReceiveMessages>({
    action: 'send',
    message: {} as any
  });

  private newMessageReceivedSubscription: Subscription;

  constructor(
    public uploadDialog: MatDialog,
    private chatService: ChatService,
    private emitterService: EmitterService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.selectedView = 'CHAT';
    this.emitterService.chatMessageAdded.subscribe((data) => {
      this.sendMessageToUser(data.data.conversation.userInfo, {
        type: 'meeting_request',
        link: data.meetingLink
      });
    });

    this.newMessageReceivedSubscription =
      this.chatService.newMessageReceivedAction$.subscribe((event) => {
        this.addMessageToConversation(event);
      });

    this.conversationsInitial$ = this.chatService.getConversations$().pipe(
      mergeMap((conversations) => {
        console.log(conversations);
        if (conversations.length) {
          conversations.forEach((conv) => {
            conv.userInfo.profileImage = getImageSrc(
              Buffer.from(conv.userInfo.profileImage).toString(),
              this.sanitizer
            );
          });
          console.log(conversations);
          return of({ data: conversations });
        }
      }),
      catchError((err) => {
        console.log('error', err);
        return of({ data: [] });
      })
    );
    this.conversations$ = combineLatest([this.conversationsInitial$]).pipe(
      map(([initial]) => {
        this.setSelectedConversation(initial.data[0]);
        return initial.data;
      }),
      tap((conversations) => {
        this.conversations = conversations;
      })
    );
  }

  createGroup = () => {
    this.selectedView = 'CREATE_GROUP';
  };

  handleGroupCreation = ($event) => {
    // TODO: Add the created group to the existing groups/conversations...
    this.selectedView = 'CHAT';
  };
  handleViewChange = ($event) => {
    this.selectedView = $event.view;
  };

  downloadFile = (file: any) => {
    if (this.downloadInProgress) {
      return;
    }
    this.downloadInProgress = true;
    this.chatService.downloadFileSlack$(file.url_private).subscribe(
      (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.downloadInProgress = false;
      },
      (err) => {
        //
        this.downloadInProgress = false;
      }
    );
  };

  setSelectedConversation = async (conversation: any) => {
    this.conversationHistory = [];
    this.selectedConversation = conversation;
    console.log(conversation);
    this.conversationHistoryInit$ = this.chatService
      .getConversationHistory$(conversation.id)
      .pipe(
        // eslint-disable-next-line arrow-body-style
        mergeMap((history) => {
          if (history.length) {
            history.forEach((message) => {
              message.userInfo.profileImage = getImageSrc(
                Buffer.from(message.userInfo.profileImage).toString(),
                this.sanitizer
              );
              message.isMeeting = false;
              if (message.text.indexOf('meeting_request')) {
                try {
                  message.jsonObj = JSON.parse(message.text);
                  if (message.jsonObj.link) {
                    message.isMeeting = true;
                  }
                } catch (err) {
                  console.log(err.message);
                }
              }
            });
            return of({ data: history });
          }
          return of({ data: history });
        }),
        catchError(() => of({ data: [] }))
      );

    this.conversationHistory$ = combineLatest([
      this.conversationHistoryInit$,
      this.sendReceiveMessages$
    ]).pipe(
      map(([initial, messageAction]) => {
        const { action, message } = messageAction;
        if (action === 'send') {
          let userInfo;
          initial.data.forEach((msg) => {
            if (message.user === msg.user) {
              userInfo = msg.userInfo;
            }
          });
          message.userInfo = userInfo;
          message.isMeeting = false;
          initial.data = initial.data.concat(message);
          return initial.data;
        } else if (action === 'receive') {
          let userInfo;
          initial.data.forEach((msg) => {
            if (message.user === msg.user) {
              userInfo = msg.userInfo;
            }
          });
          message.userInfo = userInfo;
          message.isMeeting = false;
          initial.data = initial.data.concat(message);
          return initial.data;
        } else {
          return initial.data;
        }
      })
    );
  };

  onMessageEnter = (targetUser, message) => {
    if (message && message.length) {
      this.sendMessageToUser(targetUser, message);
    }
  };

  sendMessageToUser = async (targetUser, message) => {
    this.messageDeliveryProgress = true;
    this.chatService.sendMessage$(message, targetUser.id).subscribe(
      (response) => {
        if (response && Object.keys(response).length) {
          if (response.ok) {
            this.sendReceiveMessages$.next({
              action: 'send',
              message: response.message
            });
            this.messageText = '';
            this.messageDeliveryProgress = false;
          }
        }
      },
      (err) => {
        this.messageDeliveryProgress = false;
        // this.toast.show({
        //   text: 'Error occured while creating dashboard',
        //   type: 'warning'
        // });
      }
    );
  };

  openVideoCallDialog = (selectedConversation: any) => {
    const dialogRef = this.uploadDialog.open(VideoCallDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      width: '100%',
      data: {
        conversation: selectedConversation
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //
      }
      console.log('The video call dialog was closed');
    });
  };

  openUploadDialog = (selectedConversation: any) => {
    const dialogRef = this.uploadDialog.open(UploadDialogComponent, {
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const conversationId = selectedConversation.id;
        const formData = new FormData();
        formData.append('attachment', result);
        this.chatService
          .uploadFileToConversation$(conversationId, formData)
          .subscribe(
            (res) => {
              const filesArr = [];
              filesArr.push(result);
              const dateToday = moment().unix();

              this.sendReceiveMessages$.next({
                action: 'send',
                message: {
                  type: 'message',
                  text: '',
                  user: selectedConversation.user,
                  files: filesArr,
                  ts: dateToday
                }
              });
            },
            (err) => {
              console.log(err);
            }
          );
      }
    });
  };

  addMessageToConversation = (message) => {
    // check if collaboration dialog is open and chat window is open,
    // if open insert the messgae in conversation,
    // if not increase the unread message count in badge...
    // and display a toast in bottom right of the screen....
    // return;
    if (
      this.selectedConversation &&
      message.channel === this.selectedConversation.id
    ) {
      if (message.text.indexOf('meeting_request')) {
        try {
          message.jsonObj = JSON.parse(message.text);
          if (message.jsonObj.link) {
            message.isMeeting = true;
          }
        } catch (err) {
          console.log(err.message);
        }
      }
      this.sendReceiveMessages$.next({
        action: 'receive',
        message
      });
    } else {
      // TODO: Find the conversation and push it as latest..
    }
  };

  getConversationsByUser = async (targetUser) => {
    if (targetUser) {
      const targetConversation = this.conversations.find(
        (c) => c.user === this.targetUser.id
      );
      if (targetConversation) {
        this.setSelectedConversation(targetConversation);
      }
    } else {
      // this.setSelectedConversation(conversations[0]);
    }
  };

  getLocalDateFromEpoch = (epochTS) => {
    const d = new Date(0);
    d.setUTCSeconds(epochTS);
    return moment(d).fromNow();
  };

  triggerCall = async (conv) => {
    await this.chatService.triggerCall(conv);
  };

  openMeetingLink = (message) => {
    let url = message.jsonObj.link;
    url = url.slice(1, -1);
    window.open(url, '_blank');
  };

  ngOnDestroy(): void {
    if (this.newMessageReceivedSubscription) {
      this.newMessageReceivedSubscription.unsubscribe();
    }
  }
}
