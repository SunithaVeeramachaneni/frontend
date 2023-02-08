import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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
    this.toggleChecked();
  }

  toggleChecked() {
    this.checkedToDefaultDateAndTime.emit({
      date: this.defaultDateChecked,
      time: this.defaultTimeChecked
    });
  }
}
