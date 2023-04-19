import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-checkbox-response',
  templateUrl: './checkbox-response.component.html',
  styleUrls: ['./checkbox-response.component.scss']
})
export class CheckboxResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
