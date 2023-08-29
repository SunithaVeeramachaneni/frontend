import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-task-level-mid-panel-pages',
  templateUrl: './task-level-mid-panel-pages.component.html',
  styleUrls: ['./task-level-mid-panel-pages.component.scss']
})
export class TaskLevelMidPanelPagesComponent implements OnInit {
  questionToSectionId: Map<number, any[]> = new Map();
  constructor(private fb: FormBuilder) {}
  @Input() set checkboxStatus(checkboxStatus: any) {
    console.log('checkboxStatusinside pages:', checkboxStatus);
    this._checkboxStatus = checkboxStatus;
  }
  get checkboxStatus() {
    return this._checkboxStatus;
  }
  @Input() set page(page: any) {
    if (page) {
      if (!isEqual(this.page, page)) {
        this._page = page;
        this.pageForm.patchValue(page, {
          emitEvent: false
        });
      }
      this.questionToSectionId = this.mapQuestionToSection(page.questions);
    }
  }
  get page() {
    return this._page;
  }

  private _page: any;
  private _checkboxStatus: any;
  pageForm: FormGroup = this.fb.group({
    name: {
      value: '',
      disabled: true
    },
    position: '',
    isOpen: true
  });

  ngOnInit(): void {}

  toggleIsOpenState = () => {
    this.pageForm.get('isOpen').setValue(!this.pageForm.get('isOpen').value);
  };

  mapQuestionToSection(questions: any[]) {
    const questionMap = new Map<number, any[]>();
    questions.forEach((question) => {
      if (!questionMap.has(question.sectionId)) {
        questionMap.set(question.sectionId, []);
      }
      questionMap.get(question.sectionId)!.push(question);
    });
    return questionMap;
  }
}
