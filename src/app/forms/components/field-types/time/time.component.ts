import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Output() checkedToDefaultTime: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() set question(data) {
    this.questionInfo = data;
  }

  get question() {
    return this.questionInfo;
  }

  timeChecked;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    this.timeChecked = this.questionInfo.get('value').value;
  }

  toggleChecked(event) {
    this.timeChecked = event;
    this.checkedToDefaultTime.emit(this.timeChecked);
  }
}
