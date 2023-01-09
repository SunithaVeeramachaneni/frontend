import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-read-only',
  templateUrl: './read-only.component.html',
  styleUrls: ['./read-only.component.scss']
})
export class ReadOnlyComponent implements OnInit {
  @Output() defaultValue: EventEmitter<string> = new EventEmitter<string>();
  @Input() question;
  default;
  constructor() {}

  ngOnInit(): void {
    this.default = this.question.get('value').value;
  }

  dataChanged(value) {
    this.defaultValue.emit(value);
  }
}
