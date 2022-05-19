/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';

import axios from 'axios';

const baseURL = 'http://localhost:8007/slack';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private appService: AppService) {}

  sendMessage = async (message: string, userId: string) =>
    axios.post(`${baseURL}/users/${userId}/messages`, {
      message
    });

  getConversations = async () =>
    axios.get(`${baseURL}/conversations/U0139U8LUMV`);

  getConversationHistory = async (conversationId) =>
    axios.get(`${baseURL}/conversations/${conversationId}/history`);
  triggerCall = async (user) =>
    axios.post(`${baseURL}calls`, {
      user
    });
}
