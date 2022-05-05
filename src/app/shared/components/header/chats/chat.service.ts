/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from '../../../services/app.services';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private appService: AppService) {}

  sendMessage = async (message: string, userId: string) =>
    axios.post(`http://localhost:8005/slack/users/${userId}/messages`, {
      message
    });
}
