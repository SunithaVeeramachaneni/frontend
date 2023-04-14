import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-visible-input-response',
  templateUrl: './visible-input-response.component.html',
  styleUrls: ['./visible-input-response.component.scss']
})
export class VisibleInputResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
