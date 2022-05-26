import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calls',
  templateUrl: 'calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  @Input() targetUser: any;
  @Input() callType: string;

  ngOnInit() {}
}
