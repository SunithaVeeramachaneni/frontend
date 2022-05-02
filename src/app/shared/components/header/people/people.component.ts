import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-people',
  templateUrl: 'people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  @Output() handleTextMessaging = new EventEmitter<any>();
  @Output() handleAudioMessaging = new EventEmitter<any>();
  @Output() handleVideoMessaging = new EventEmitter<any>();

  activeUsers: any = [];
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get('assets/slackUsers.json').subscribe((data) => {
      this.activeUsers = data;
    });
  }
  onTextMessageClick(targetUser) {
    this.handleTextMessaging.emit({ ...targetUser });
  }
  onAudioMessageClick(targetUser) {
    this.handleAudioMessaging.emit(targetUser);
  }
  onVideoMessageClick(targetUser) {
    this.handleVideoMessaging.emit(targetUser);
  }
}
