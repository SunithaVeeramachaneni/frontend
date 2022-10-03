import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFormComponent implements OnInit {
  public createForm: FormGroup;
  isOpenState = true;
  isSectionNameEditMode = true;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      name: [''],
      description: [''],
      sections: this.fb.array([this.initSection()]),
      counter: ['']
    });
  }

  getQuestions(form) {
    return form.controls.questions.controls;
  }

  getSections(form) {
    return form.controls.sections.controls;
  }

  addSection() {
    const control = this.createForm.get('sections') as FormArray;
    control.push(this.initSection());
  }

  addQuestion(j) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      j
    ].get('questions') as FormArray;
    control.push(this.initQuestion());
  }

  /* addSections() {
    console.log('in section');
    // this.sections.push(this.initSection());
  } */

  initQuestion = () =>
    this.fb.group({
      id: [''],
      name: [''],
      fieldType: [''],
      position: ['']
    });

  initSection = () =>
    this.fb.group({
      name: [{ value: '', disabled: true }],
      position: [''],
      questions: this.fb.array([this.initQuestion()])
    });

  titleChange(value) {
    console.log(value);
  }

  editSection(e) {
    e.get('name').enable();
  }

  publishInstruction() {
    console.log('published');
  }
}
