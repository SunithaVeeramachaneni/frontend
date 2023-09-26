import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DateAndTime } from 'src/app/interfaces';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  @Output() checkedToDefaultDateAndTime: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() set question(data) {
    this.questionInfo = data;
  }

  get question() {
    return this.questionInfo;
  }

  defaultDateChecked = true;
  defaultTimeChecked = true;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    if (this.question && this.isDateAndTime(this.question.value)) {
      this.defaultDateChecked = this.question.value.date;
      this.defaultTimeChecked = this.question.value.time;
    }

    this.toggleChecked();
  }

  isDateAndTime(object: any) {
    return (
      object && object.hasOwnProperty('date') && object.hasOwnProperty('time')
    );
  }

  toggleChecked() {
    if (!this.defaultDateChecked && !this.defaultTimeChecked)
      this.defaultDateChecked = true;
    this.checkedToDefaultDateAndTime.emit({
      date: this.defaultDateChecked,
      time: this.defaultTimeChecked
    } as DateAndTime);
  }
}
