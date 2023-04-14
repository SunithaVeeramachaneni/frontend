import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-signature-response',
  templateUrl: './signature-response.component.html',
  styleUrls: ['./signature-response.component.scss']
})
export class SignatureResponseComponent implements OnInit {
  @Input() question: Question;

  constructor() {}

  ngOnInit(): void {}
}
