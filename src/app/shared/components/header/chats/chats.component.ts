import { Component, Input, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

import { SSEService } from './sse.service';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { VideoCallDialogComponent } from './video-call-dialog/video-call-dialog.component';
import { EmitterService } from '../EmitterService';
@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @Input() targetUser: any;

  messageText = '';
  conversations: any = [];
  selectedConversation: any;
  conversationHistory: any = [];

  activeUsers: any = [];

  userMaps: any = [];

  constructor(
    public uploadDialog: MatDialog,
    private httpClient: HttpClient,
    private zone: NgZone,
    private chatService: ChatService,
    private sseService: SSEService,
    private emitterService: EmitterService
  ) {}

  ngOnInit() {
    this.emitterService.chatMessageAdded.subscribe((data) => {
      console.log(data);
      this.sendMessageToUser(data.data.conversation.userInfo, {
        type: 'meeting_request',
        link: data.meetingLink
      });
    });

    const userId = 'U02R5D4SREU';
    const ref = this;
    const evtSource = new EventSource(
      `http://localhost:8005/slack/sse/${userId}`
    );
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    evtSource.onmessage = function (event) {
      // console.log(event.data);
      const eventData = JSON.parse(event.data);
      console.log(eventData);
      if (!eventData.isHeartbeat && eventData.eventType === 'message') {
        ref.addMessageToConversation(eventData);
      }
    };

    this.httpClient.get('assets/slackUsers.json').subscribe((data) => {
      this.activeUsers = data;
      this.activeUsers.forEach((user) => {
        this.userMaps[user.id] = user;
      });
    });
    this.getConversationsByUser(this.targetUser);
  }

  setSelectedConversation = async (conversation: any) => {
    this.conversationHistory = [];
    this.selectedConversation = conversation;
    const conversationHistory = await this.chatService.getConversationHistory(
      conversation.id
    );
    this.conversationHistory = conversationHistory.data.messages;
    this.conversationHistory.forEach((message) => {
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

    const objDiv = document.getElementById('conversationHistory');
    objDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  sendMessageToUser = async (targetUser, message) => {
    const sendMessageResponse = await this.chatService.sendMessage(
      message,
      targetUser.id
    );
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
            `http://localhost:8005/slack/conversations/${conversationId}/files`,
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
    const conversations = await this.chatService.getConversations();
    this.conversations = conversations.data;

    if (targetUser) {
      const targetConversation = this.conversations.find(
        (c) => c.user === this.targetUser.id
      );
      if (targetConversation) {
        this.setSelectedConversation(targetConversation);
      }
    } else {
      this.setSelectedConversation(conversations.data[0]);
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
