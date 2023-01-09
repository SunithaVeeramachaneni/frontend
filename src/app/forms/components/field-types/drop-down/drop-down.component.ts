import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  @Output() checkedMultiple: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() set question(data) {
    this.questionInfo = data;
  }

  get question() {
    return this.questionInfo;
  }

  multiChecked;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    this.multiChecked = this.questionInfo.get('multi').value;
  }

  toggleChecked(event) {
    this.multiChecked = event;
    this.checkedMultiple.emit(this.multiChecked);
  }
}
