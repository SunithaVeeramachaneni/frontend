import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-date-range-response',
  templateUrl: './date-range-response.component.html',
  styleUrls: ['./date-range-response.component.scss']
})
export class DateRangeResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
