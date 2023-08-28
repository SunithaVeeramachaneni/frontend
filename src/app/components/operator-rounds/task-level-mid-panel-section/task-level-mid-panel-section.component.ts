import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-task-level-mid-panel-section',
  templateUrl: './task-level-mid-panel-section.component.html',
  styleUrls: ['./task-level-mid-panel-section.component.scss']
})
export class TaskLevelMidPanelSectionComponent implements OnInit {
  @Input() set question(question: any) {
    this._question = question;
  }
  get question() {
    return this._question;
  }

  @Input() set section(section: any) {
    if (section) {
      if (!isEqual(this.section, section)) {
        this._section = section;
        this.sectionForm.patchValue(section, {
          emitEvent: false
        });
      }
    }
  }
  get section() {
    return this._section;
  }
  private _section: any;
  private _question: any;
  sectionForm: FormGroup = this.fb.group({
    id: '',
    name: {
      value: '',
      disabled: true
    },
    position: '',
    isOpen: true,
    isImported: false,
    templateId: '',
    templateName: '',
    externalSectionId: ''
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  toggleIsOpenState = () => {
    this.sectionForm
      .get('isOpen')
      .setValue(!this.sectionForm.get('isOpen').value);
  };
}
