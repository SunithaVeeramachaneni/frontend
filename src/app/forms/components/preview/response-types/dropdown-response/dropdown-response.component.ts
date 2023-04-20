import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-dropdown-response',
  templateUrl: './dropdown-response.component.html',
  styleUrls: ['./dropdown-response.component.scss']
})
export class DropdownResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
