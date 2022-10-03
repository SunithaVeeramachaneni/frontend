import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RdfService } from '../services/rdf.service';

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
  fieldTypes$: Observable<any>;
  fieldTypes: any = [];
  constructor(private fb: FormBuilder, private rdfService: RdfService) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      name: [''],
      description: [''],
      sections: this.fb.array([this.initSection()]),
      counter: ['']
    });
    this.fieldTypes$ = this.rdfService
      .getFieldTypes$()
      .pipe(tap((fieldTypes) => (this.fieldTypes = fieldTypes)));
    this.fieldTypes$.subscribe();
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

  getFieldTypeImage(type) {
    return `assets/rdf-forms-icons/fieldType-icons/${type}.svg`;
  }

  getFieldTypeDescription(type) {
    const fieldType = this.fieldTypes.find((field) => field.type === type);
    return fieldType?.description;
  }
}
