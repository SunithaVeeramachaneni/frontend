import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { NumberRangeMetadata } from 'src/app/interfaces';
@Component({
  selector: 'app-task-leve-mid-panel-question-components',
  templateUrl: './task-leve-mid-panel-question-components.component.html',
  styleUrls: ['./task-leve-mid-panel-question-components.component.scss']
})
export class TaskLeveMidPanelQuestionComponentsComponent implements OnInit {
  questionForm: FormGroup = this.fb.group({
    id: '',
    sectionId: '',
    name: '',
    fieldType: 'TF',
    position: '',
    required: false,
    enableHistory: false,
    multi: false,
    value: 'TF',
    isPublished: false,
    isPublishedTillSave: false,
    isOpen: false,
    isResponseTypeModalOpen: false,
    unitOfMeasurement: 'None',
    rangeMetadata: {} as NumberRangeMetadata
  });
  @Input() set question(question: any) {
    if (question) {
      if (!isEqual(this.question, question)) {
        this._question = question;
        this.questionForm.patchValue(question, {
          emitEvent: false
        });
      }
    }
  }

  get question() {
    return this._question;
  }
  private _question: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
