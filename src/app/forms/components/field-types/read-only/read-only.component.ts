import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-read-only',
  templateUrl: './read-only.component.html',
  styleUrls: ['./read-only.component.scss']
})
export class ReadOnlyComponent implements OnInit {
  @Output() defaultValue: EventEmitter<boolean> = new EventEmitter();
  default;
  constructor() {}

  ngOnInit(): void {}

  dataChanged(value) {
    this.defaultValue.emit(value);
  }
}
