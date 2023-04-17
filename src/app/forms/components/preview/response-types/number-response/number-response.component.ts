import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-number-response',
  templateUrl: './number-response.component.html',
  styleUrls: ['./number-response.component.scss']
})
export class NumberResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
