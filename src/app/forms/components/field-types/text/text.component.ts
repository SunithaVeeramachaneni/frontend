import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Output() inputTextAnswer: EventEmitter<boolean> = new EventEmitter();
  textAnswer = 'TF';
  constructor() {}

  ngOnInit(): void {}

  dataChanged(value) {
    this.inputTextAnswer.emit(value);
  }
}
