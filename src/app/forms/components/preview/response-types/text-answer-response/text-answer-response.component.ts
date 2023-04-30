import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-text-answer-response',
  templateUrl: './text-answer-response.component.html',
  styleUrls: ['./text-answer-response.component.scss']
})
export class TextAnswerResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
