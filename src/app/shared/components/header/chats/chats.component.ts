import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @Input() targetUser: any;

  activeUsers: any = [];
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get('assets/slackUsers.json').subscribe((data) => {
      this.activeUsers = data;
    });
  }
}
