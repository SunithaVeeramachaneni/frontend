import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Output() inputTextAnswer: EventEmitter<string> = new EventEmitter<string>();
  @Input() question;
  textAnswer;
  constructor() {}

  ngOnInit(): void {
    this.textAnswer = this.question.get('value').value;
  }

  dataChanged(value) {
    this.inputTextAnswer.emit(value);
  }
}
