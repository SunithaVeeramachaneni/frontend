import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-location-response',
  templateUrl: './location-response.component.html',
  styleUrls: ['./location-response.component.scss']
})
export class LocationResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
