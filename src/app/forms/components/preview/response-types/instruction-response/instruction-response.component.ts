import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-instruction-response',
  templateUrl: './instruction-response.component.html',
  styleUrls: ['./instruction-response.component.scss']
})
export class InstructionResponseComponent implements OnInit {
  @Input() question: Question;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  getNoneTag() {
    return this.translate.instant('noneTag');
  }
}
