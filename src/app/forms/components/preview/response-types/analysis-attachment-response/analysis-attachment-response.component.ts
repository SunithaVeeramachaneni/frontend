import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-analysis-attachment-response',
  templateUrl: './analysis-attachment-response.component.html',
  styleUrls: ['./analysis-attachment-response.component.scss']
})
export class AnalysisAttachmentResponseComponent implements OnInit {
  @Input() question: Question;
  
  constructor() { }

  ngOnInit(): void {}

}
