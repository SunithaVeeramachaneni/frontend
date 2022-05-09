/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';
import axios from 'axios';
import { async } from '@angular/core/testing';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private appService: AppService) {}

  sendMessage = async (message: string, userId: string) =>
    axios.post(`http://localhost:8005/slack/users/${userId}/messages`, {
      message
    });

  getConversations = async () =>
    axios.get(`http://localhost:8005/slack/conversations/U0139U8LUMV`);

  getConversationHistory = async (conversationId) =>
    axios.get(
      `http://localhost:8005/slack/conversations/${conversationId}/history`
    );
  triggerCall = async (user) =>
    axios.post(`http://localhost:8005/slack/calls`, {
      user
    });
}
