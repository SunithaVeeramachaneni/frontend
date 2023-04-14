import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-date-time-response',
  templateUrl: './date-time-response.component.html',
  styleUrls: ['./date-time-response.component.scss']
})
export class DateTimeResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
