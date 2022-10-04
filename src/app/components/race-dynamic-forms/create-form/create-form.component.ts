import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs/operators';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RdfService } from '../services/rdf.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFormComponent implements OnInit {
  public createForm: FormGroup;
  defaultFormHeader = 'Untitled Form';
  formHeader: string;
  isOpenState = true;
  isSectionNameEditMode = true;
  fieldTypes: any = [];
  createInProgress = false;
  constructor(
    private fb: FormBuilder,
    private rdfService: RdfService,
    private breadcrumbService: BreadcrumbService,
    private headerService: HeaderService
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      counter: [0],
      sections: this.fb.array([this.initSection()])
    });
    this.rdfService
      .getFieldTypes$()
      .pipe(tap((fieldTypes) => (this.fieldTypes = fieldTypes)))
      .subscribe();

    this.createForm
      .get('name')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((formName) => {
          const displayName = formName.trim()
            ? formName
            : this.defaultFormHeader;
          this.formHeader = displayName;
          this.breadcrumbService.set('@formName', { label: displayName });
          this.headerService.setHeaderTitle(displayName);
          console.log(this.createForm.getRawValue());
        }),
        filter(() => this.createInProgress === false),
        switchMap(() => this.saveForm())
      )
      .subscribe();

    const headerTitle = this.createForm.get('name').value
      ? this.createForm.get('name').value
      : this.defaultFormHeader;
    this.headerService.setHeaderTitle(headerTitle);
    this.breadcrumbService.set('@formName', {
      label: headerTitle
    });

    // this.createForm.get('name').setValue(this.defaultFormHeader);
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
      id: ['Q1'],
      name: [''],
      fieldType: ['TF'],
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
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  saveForm() {
    const { id, ...form } = this.createForm.getRawValue();

    if (id) {
      return this.rdfService.updateForm$(id, form).pipe();
    } else {
      this.createInProgress = true;
      return this.rdfService.createForm$(form).pipe(
        tap((createdForm) => {
          this.createForm.get('id').setValue(createdForm.id);
          this.createInProgress = false;
        })
      );
    }
  }
}
