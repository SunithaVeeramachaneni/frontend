import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-read-only',
  templateUrl: './read-only.component.html',
  styleUrls: ['./read-only.component.scss']
})
export class ReadOnlyComponent implements OnInit {
  @Output() defaultValue: EventEmitter<string> = new EventEmitter<string>();
  @Input() set question(data) {
    this.questionInfo = data;
  }
  get question() {
    return this.questionInfo;
  }
  @Input() translateValue: string;

  default;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    this.default = this.questionInfo.get('value').value;
  }

  dataChanged() {
    this.defaultValue.emit(this.default);
  }
}
