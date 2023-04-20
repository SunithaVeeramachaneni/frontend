import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-array-response',
  templateUrl: './array-response.component.html',
  styleUrls: ['./array-response.component.scss']
})
export class ArrayResponseComponent implements OnInit {
  @Input() question: Question;

  arrayField = false;

  constructor() {}

  ngOnInit(): void {}

  openBottomSheet(): void {
    this.arrayField = !this.arrayField;
  }
}
