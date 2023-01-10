import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Output() inputTextAnswer: EventEmitter<string> = new EventEmitter<string>();
  @Input() set question(data) {
    this.questionInfo = data;
  }

  get question() {
    return this.questionInfo;
  }
  textAnswer;
  private questionInfo;

  constructor() {}

  ngOnInit(): void {
    this.textAnswer = this.questionInfo.get('value').value;
  }

  dataChanged() {
    this.inputTextAnswer.emit(this.textAnswer);
  }
}
