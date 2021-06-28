import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const NODE_ENDPOINT = 'http://localhost:5000/api';
const NODE_ENDPOINT1 = 'http://localhost:5000/apione';
const BOOKS_ENDPOINT = 'http://localhost:8080/api/v1/books';
const VIDEOS_ENDPOINT = 'http://localhost:8080/api/v1/videos';

type ProfileType = {
  givenName?: string,
  surname?: string,
  displayName?: string;
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getProfile();
    this.callNodeEndPoint();
    this.callNodeEndPoint1();
    this.callBooksEndPoint();
    this.callVideosEndPoint();
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        console.log(profile);
        this.profile = profile;
      });
  }

  callNodeEndPoint() {
    this.http.get(NODE_ENDPOINT)
      .subscribe(data => {
        console.log(data);
      });
  }

  callNodeEndPoint1() {
    this.http.get(NODE_ENDPOINT1)
      .subscribe(data => {
        console.log(data);
      });
  }

  callBooksEndPoint() {
    this.http.get(BOOKS_ENDPOINT)
      .subscribe(data => {
        console.log(data);
      });
  }

  callVideosEndPoint() {
    this.http.get(VIDEOS_ENDPOINT)
      .subscribe(data => {
        console.log(data);
      });
  }
}
