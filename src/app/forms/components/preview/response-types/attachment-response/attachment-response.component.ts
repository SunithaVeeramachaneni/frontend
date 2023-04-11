import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-attachment-response',
  templateUrl: './attachment-response.component.html',
  styleUrls: ['./attachment-response.component.scss']
})
export class AttachmentResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
