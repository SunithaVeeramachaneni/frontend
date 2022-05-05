import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @Input() targetUser: any;

  messageText = '';

  activeUsers: any = [];
  constructor(
    private httpClient: HttpClient,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.httpClient.get('assets/slackUsers.json').subscribe((data) => {
      this.activeUsers = data;
    });
  }

  setSelectedConversation = (user: any) => {
    this.targetUser = user;
  };

  sendMessageToUser = async (targetUser, message) => {
    const sendMessageResponse = await this.chatService.sendMessage(
      message,
      targetUser.id
    );
    console.log(sendMessageResponse);
  };
  getConversationsByUser = async () => {};
}
