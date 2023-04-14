import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-hyperlink-response',
  templateUrl: './hyperlink-response.component.html',
  styleUrls: ['./hyperlink-response.component.scss']
})
export class HyperlinkResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}

  openURL = (question: any) => {
    if (question.link.length) {
      window.open(question.link);
    }
  };
}
