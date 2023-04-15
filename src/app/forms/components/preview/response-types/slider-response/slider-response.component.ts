import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-slider-response',
  templateUrl: './slider-response.component.html',
  styleUrls: ['./slider-response.component.scss']
})
export class SliderResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}

  formatLabel(value: number): string {
    return `${value}`;
  }
}
