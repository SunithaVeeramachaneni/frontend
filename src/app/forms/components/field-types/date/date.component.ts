import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  @Output() checkedToDefaultTime: EventEmitter<boolean> = new EventEmitter();
  dateChecked = true;
  constructor() {}

  ngOnInit(): void {}

  toggleChecked() {
    this.dateChecked = !this.dateChecked;
    this.checkedToDefaultTime.emit(this.dateChecked);
  }
}
