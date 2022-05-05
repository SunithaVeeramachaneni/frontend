import {
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import { async } from '@angular/core/testing';
import * as moment from 'moment';

import { SSEService } from './sse.service';

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
    private httpClient: HttpClient,
    private zone: NgZone,
    private chatService: ChatService,
    private sseService: SSEService
  ) {}

  ngOnInit() {
    const userId = 'U02R5D4SREU';
    const ref = this;

    // this.sseService
    //   .getServerSentEvent(`http://localhost:8005/slack/sse/${userId}`)
    //   .subscribe((data) => console.log(data));
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

  addMessageToConversation = (message) => {
    if (message.channel === this.selectedConversation.id) {
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
}
