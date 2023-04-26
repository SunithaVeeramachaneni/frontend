import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-scan-response',
  templateUrl: './scan-response.component.html',
  styleUrls: ['./scan-response.component.scss']
})
export class ScanResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
