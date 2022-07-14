import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

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
import { Buffer } from 'buffer';
import { ImageUtils } from '../../../../shared/utils/imageUtils';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { CommonService } from 'src/app/shared/services/common.service';

interface SendReceiveMessages {
  action: 'send' | 'receive' | '';
  message: any;
  channel: any;
}
interface UpdateConversations {
  action: 'update_latest_message' | '';
  message: any;
  channel: any;
}

interface Conversation {
  id: string;
  userInfo: any;
  chatType: string;
  topic: string;
  members: any[];
  latest: any;
}
interface Message {
  id: string;
  from: any;
  timestamp: string;
  message: string;
  attachments: [];
  chatId: string;
  messageType: string;
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
  conversations$: Observable<Conversation[]>;

  conversationHistoryInit$: Observable<any>;
  conversationHistory$: Observable<Message[]>;

  sendReceiveMessages$ = new BehaviorSubject<SendReceiveMessages>({
    action: 'send',
    message: {} as any,
    channel: ''
  });

  updateConversations$ = new BehaviorSubject<UpdateConversations>({
    action: 'update_latest_message',
    message: {} as any,
    channel: ''
  });

  private newMessageReceivedSubscription: Subscription;

  constructor(
    public uploadDialog: MatDialog,
    private chatService: ChatService,
    private emitterService: EmitterService,
    private commonService: CommonService,
    private imageUtils: ImageUtils
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

    const userInfo = this.commonService.getUserInfo();
    this.conversationsInitial$ = this.chatService
      .getConversations$(userInfo.email)
      .pipe(
        mergeMap((conversations) => {
          if (conversations.length) {
            conversations.forEach((conv) => {
              if (conv.chatType === 'oneOnOne') {
                conv.userInfo.profileImage = this.imageUtils.getImageSrc(
                  Buffer.from(conv.userInfo.profileImage).toString()
                );
              } else if (conv.chatType === 'group') {
                conv.userInfo.profileImage = '';
              }
            });
            if (this.targetUser) {
              conversations.forEach((conv) => {
                if (
                  conv.chatType === 'oneOnOne' &&
                  conv.userInfo.email === this.targetUser.email
                ) {
                  this.setSelectedConversation(conv);
                } else {
                  // TODO: Create a DM conversation with this.targetUser and set it as selected conversation
                }
              });
            } else {
              this.setSelectedConversation(conversations[0]);
            }
            return of({ data: conversations });
          }
        })
      );
    this.conversations$ = combineLatest([
      this.conversationsInitial$,
      this.updateConversations$
    ]).pipe(
      map(([initial, updateConversation]) => {
        const { action, message, channel } = updateConversation;
        const conversationsList = initial.data;
        if (action === 'update_latest_message' && channel?.length) {
          conversationsList.forEach((conv) => {
            if (conv.id === channel) {
              conv.latest = message;
            }
          });
        }
        return conversationsList;
      }),
      tap((conversations) => {
        this.conversations = conversations;
      })
    );
  }

  createGroup = () => {
    this.selectedView = 'CREATE_GROUP';
  };

  handleGroupCreation = (event) => {
    // TODO: Add the created group to the existing groups/conversations...
    this.selectedView = 'CHAT';
  };
  handleViewChange = ($event) => {
    this.selectedView = $event.view;
  };

  downloadFile = (file: any) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    if (this.downloadInProgress) {
      return;
    }
    this.downloadInProgress = true;
    this.chatService.downloadFileSlack$(file.url_private, info).subscribe(
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
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.sendReceiveMessages$.next({ action: '', message: '', channel: '' });
    this.conversationHistory = [];
    this.selectedConversation = conversation;

    this.conversationHistoryInit$ = this.chatService
      .getConversationHistory$(conversation.id, info)
      .pipe(
        // eslint-disable-next-line arrow-body-style
        mergeMap((history) => {
          if (history.length) {
            history.forEach((message) => {
              const members = this.selectedConversation.members;
              const user = members.find(
                (member) => member.userId === message.from.id
              );
              if (user) {
                message.from = user;
                setTimeout(() => {
                  message.from.profileImage = this.imageUtils.getImageSrc(
                    Buffer.from(message.from.profileImage).toString()
                  );
                }, 0);
              }
              message.isMeeting = false;
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
        const { action, message, channel } = messageAction;
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
          if (
            this.selectedConversation &&
            this.selectedConversation.id === channel
          ) {
            this.selectedConversation.latest = message;
          } else {
            this.updateConversations$.next({
              action: 'update_latest_message',
              message,
              channel: message.channel
            });
          }
          return initial.data;
        } else if (action === 'receive') {
          message.isMeeting = false;
          initial.data = initial.data.concat(message);

          if (
            this.selectedConversation &&
            this.selectedConversation.id === channel
          ) {
            this.selectedConversation.latest = message;
          } else {
            this.updateConversations$.next({
              action: 'update_latest_message',
              message,
              channel: message.chatId
            });
          }

          return initial.data;
        } else {
          return initial.data;
        }
      })
    );
  };

  isLoggedInUser = (user) => {
    const userInfo = this.commonService.getUserInfo();
    return userInfo.email === user.email;
  };

  onMessageEnter = (targetUser, message) => {
    if (message && message.length) {
      this.sendMessageToUser(targetUser, message);
    }
  };

  sendMessageToUser = async (targetUser, message) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.messageDeliveryProgress = true;
    this.chatService.sendMessage$(message, targetUser.id, info).subscribe(
      (response) => {
        if (response && Object.keys(response).length) {
          response.user = response.from.user;
          this.sendReceiveMessages$.next({
            action: 'send',
            message: response,
            channel: response.chatId
          });
          this.messageText = '';
          this.messageDeliveryProgress = false;
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
    });
  };

  selectFile() {
    const fileUpload = document.getElementById(
      'uploadFile'
    ) as HTMLInputElement;
    fileUpload.onchange = () => {
      // Note: enable the below for loop if we need to support uploading of multiple files.
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      // for (let index = 0; index < fileUpload.files.length; index++) {
      const selectedFile = fileUpload.files[0];
      const info: ErrorInfo = {
        displayToast: true,
        failureResponse: 'throwError'
      };
      const conversationId = this.selectedConversation.id;
      const formData = new FormData();
      formData.append('attachment', selectedFile);
      this.chatService
        .uploadFileToConversation$(conversationId, formData, info)
        .subscribe(
          (response) => {
            this.sendReceiveMessages$.next({
              action: 'send',
              message: {
                id: this.selectedConversation.id,
                from: response.from,
                timestamp: response.createdDateTime,
                message: `${this.selectedConversation.userInfo.firstName} Uploaded a file.`,
                attachments: response.attachments || [],
                chatId: this.selectedConversation.id,
                messageType: 'message'
              },
              channel: this.selectedConversation.id
            });
          },
          (err) => {
            // TODO: Display toasty message
          }
        );
      // }
    };
    fileUpload.click();
  }

  addMessageToConversation = (message) => {
    // check if collaboration dialog is open and chat window is open,
    // if open insert the messgae in conversation,
    // if not increase the unread message count in badge...
    // and display a toast in bottom right of the screen....
    // return;
    if (
      this.selectedConversation &&
      message.chatId === this.selectedConversation.id
    ) {
      if (message.message.indexOf('meeting_request')) {
        try {
          message.jsonObj = JSON.parse(message.text);
          if (message.jsonObj.link) {
            message.isMeeting = true;
          }
        } catch (err) {
          // TODO: Display toasty message
        }
      }
      this.sendReceiveMessages$.next({
        action: 'receive',
        message,
        channel: message.chatId
      });
    } else {
      // TODO: Find the conversation and push it as latest..
      this.updateConversations$.next({
        action: 'update_latest_message',
        message,
        channel: message.chatId
      });
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
