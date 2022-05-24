import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

import { SSEService } from './sse.service';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { VideoCallDialogComponent } from './video-call-dialog/video-call-dialog.component';
import { EmitterService } from '../EmitterService';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';

interface SendReceiveMessages {
  action: 'send' | 'receive';
  message: any;
}

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @Input() targetUser: any;
  // @ViewChild('window') window;

  messageText = '';
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

  constructor(
    public uploadDialog: MatDialog,
    private httpClient: HttpClient,
    private zone: NgZone,
    private chatService: ChatService,
    private sseService: SSEService,
    private emitterService: EmitterService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.emitterService.chatMessageAdded.subscribe((data) => {
      this.sendMessageToUser(data.data.conversation.userInfo, {
        type: 'meeting_request',
        link: data.meetingLink
      });
    });

    // const userId = 'U02R5D4SREU';
    // const ref = this;
    // const evtSource = new EventSource(
    //   `http://localhost:8007/slack/sse/${userId}`
    // );
    // // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    // evtSource.onmessage = function (event) {
    //   const eventData = JSON.parse(event.data);
    //   console.log(eventData);
    //   if (!eventData.isHeartbeat && eventData.eventType === 'message') {
    //     ref.addMessageToConversation(eventData);
    //   }
    // };

    this.conversationsInitial$ = this.chatService.getConversations$().pipe(
      mergeMap((conversations) => {
        if (conversations.length) {
          conversations.forEach((conv) => {
            conv.userInfo.profileImage = this.getImageSrc(
              Buffer.from(conv.userInfo.profileImage).toString()
            );
          });
          return of({ data: conversations });
        }
      }),
      catchError(() => of({ data: [] }))
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

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  downloadFile = (file: any) => {
    this.chatService.downloadFileSlack$(file.url_private).subscribe(
      (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
      (err) => {
        //
      }
    );
  };

  setSelectedConversation = async (conversation: any) => {
    this.conversationHistory = [];
    this.selectedConversation = conversation;
    this.conversationHistoryInit$ = this.chatService
      .getConversationHistory$(conversation.id)
      .pipe(
        // eslint-disable-next-line arrow-body-style
        mergeMap((history) => {
          // console.log(history);
          if (history.length) {
            history.forEach((message) => {
              message.userInfo.profileImage = this.getImageSrc(
                Buffer.from(message.userInfo.profileImage).toString()
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
          //
        } else {
          return initial.data;
        }
        return initial.data;
      })
    );
  };

  sendMessageToUser = async (targetUser, message) => {
    this.chatService.sendMessage$(message, targetUser.id).subscribe(
      (response) => {
        if (response && Object.keys(response).length) {
          if (response.ok) {
            this.sendReceiveMessages$.next({
              action: 'send',
              message: response.message
            });
          }
        }
      },
      (err) => {
        // this.toast.show({
        //   text: 'Error occured while creating dashboard',
        //   type: 'warning'
        // });
      }
    );

    // const sendMessageResponse = await this.chatService.sendMessage(
    //   message,
    //   targetUser.id
    // );
    const dateToday = moment().unix();
    this.conversationHistory.push({
      type: 'message',
      text: message,
      user: targetUser.id,
      ts: dateToday
    });
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
        this.httpClient
          .post<any>(
            `http://localhost:8007/slack/conversations/${conversationId}/files`,
            formData
          )
          .subscribe(
            (res) => {
              const filesArr = [];
              filesArr.push(result);
              const dateToday = moment().unix();
              this.conversationHistory.push({
                type: 'message',
                text: '',
                user: selectedConversation.user,
                files: filesArr,
                ts: dateToday
              });
            },
            (err) => console.log(err)
          );
      }
      console.log('The upload dialog was closed');
    });
  };

  addMessageToConversation = (message) => {
    if (message.channel === this.selectedConversation.id) {
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
      this.conversationHistory.push(message);
    } else {
      // Find the conversation and push it as latest..
    }
  };

  getConversationsByUser = async (targetUser) => {
    // const conversations = await this.chatService.getConversations();
    // this.conversations = conversations; //.data;

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
}
