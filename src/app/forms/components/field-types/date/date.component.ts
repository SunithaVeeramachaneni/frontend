import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  @Output() checkedToDefaultDate: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() set question(data) {
    this.questionInfo = data;
  }

  get question() {
    return this.questionInfo;
  }

  defaultChecked;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    this.defaultChecked = this.questionInfo.get('value').value;
  }

  toggleChecked() {
    this.checkedToDefaultDate.emit(this.defaultChecked);
  }
}
