import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  saveProgress = 'Save in progress...';
  changesSaved = 'All Changes Saved';
  formHeader: string;
  isOpenState = true;
  isSectionNameEditMode = true;
  fieldTypes: any = [];
  createInProgress = false;
  disableFormFields = true;
  status$ = new BehaviorSubject<string>('');
  setFieldType;
  isCustomizerOpen = false;
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
      counter: [1],
      sections: this.fb.array([this.initSection('Q1')]),
      isPublished: [false],
      isPublishedTillSave: [false]
    });
    this.rdfService
      .getFieldTypes$()
      .pipe(tap((fieldTypes) => (this.fieldTypes = fieldTypes)))
      .subscribe();

    this.createForm
      .get('name')
      .valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((formName) => {
          const displayName = formName.trim()
            ? formName
            : this.defaultFormHeader;
          this.formHeader = displayName;
          this.breadcrumbService.set('@formName', { label: displayName });
          this.headerService.setHeaderTitle(displayName);
        }),
        filter(() => this.createInProgress === false),
        switchMap(() => this.saveForm())
      )
      .subscribe();

    this.createForm
      .get('sections')
      .valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        filter(() => this.createForm.get('id').value),
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
    this.createForm.disable({ emitEvent: false });
    this.createForm.get('name').enable({ emitEvent: false });
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
    control.push(this.initSection(`Q${this.getCounter()}`));
  }

  addQuestion(j) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      j
    ].get('questions') as FormArray;
    control.push(this.initQuestion(`Q${this.getCounter()}`));
  }

  initQuestion = (id) =>
    this.fb.group({
      id: [id],
      name: [''],
      fieldType: ['TF'],
      position: [''],
      require: [false],
      isPublished: [false]
    });

  initSection = (id) =>
    this.fb.group({
      name: [{ value: '', disabled: true }],
      position: [''],
      questions: this.fb.array([this.initQuestion(id)])
    });

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
      this.status$.next(this.saveProgress);
      return this.rdfService.updateForm$(id, form).pipe(
        tap(() => {
          this.status$.next(this.changesSaved);
        })
      );
    } else {
      this.createInProgress = true;
      this.status$.next(this.saveProgress);
      return this.rdfService.createForm$(form).pipe(
        tap((createdForm) => {
          this.createForm.get('id').setValue(createdForm.id);
          this.createInProgress = false;
          this.createForm.enable({ emitEvent: false });
          this.disableFormFields = false;
          this.status$.next(this.changesSaved);
        })
      );
    }
  }

  getCounter() {
    this.createForm
      .get('counter')
      .setValue(this.createForm.get('counter').value + 1);
    return this.createForm.get('counter').value;
  }
}
