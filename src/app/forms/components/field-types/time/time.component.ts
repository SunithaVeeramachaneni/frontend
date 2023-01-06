import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Output() checkedToDefaultTime: EventEmitter<boolean> = new EventEmitter();
  timeChecked = true;
  constructor() {}

  ngOnInit(): void {}

  toggleChecked() {
    this.timeChecked = !this.timeChecked;
    console.log(this.timeChecked);
    this.checkedToDefaultTime.emit(this.timeChecked);
  }
}
