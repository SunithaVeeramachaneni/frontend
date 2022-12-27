import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss']
})
export class ResponseTypeComponent implements OnInit {
  responseDrawer = false;
  constructor() {}

  openDrawer(): void {
    this.responseDrawer = true;
  }

  ngOnInit(): void {}
}
