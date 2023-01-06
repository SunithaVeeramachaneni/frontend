import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  @Output() checkedMultiple: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  toggleChecked(event) {
    this.checkedMultiple.emit(event.target.checked);
  }
}
