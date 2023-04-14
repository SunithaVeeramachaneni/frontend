import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-read-only-response',
  templateUrl: './read-only-response.component.html',
  styleUrls: ['./read-only-response.component.scss']
})
export class ReadOnlyResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
