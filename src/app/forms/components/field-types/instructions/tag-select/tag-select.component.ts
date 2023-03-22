import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.scss']
})
export class TagSelectComponent implements OnInit {
  @Output() inputTagAnswer: EventEmitter<string> = new EventEmitter<string>();
  @Input() set question(data) {
    this.questionForm = data;
  }

  tagAnswer: string;
  private questionForm: any;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.tagAnswer = this.questionForm.get('value').value.tag.title;
  }

  dataChanged() {
    this.inputTagAnswer.emit(this.tagAnswer);
  }

  getNoneTag() {
    return this.translate.instant('noneTag');
  }
}
