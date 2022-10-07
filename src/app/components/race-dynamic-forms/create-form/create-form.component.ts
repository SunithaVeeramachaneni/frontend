import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  pairwise,
  switchMap,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RdfService } from '../services/rdf.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

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
  changesPublished = 'All Changes published';
  public isOpenState = {};
  isSectionNameEditMode = true;
  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  createInProgress = false;
  publishInProgress = false;
  disableFormFields = true;
  status$ = new BehaviorSubject<string>('');
  isCustomizerOpen = false;
  sliderOptions = {
    min: 0,
    max: 100,
    increment: 1
  };
  isPopoverOpen = [false];
  popOverOpenState = {};
  fieldContentOpenState = {};

  constructor(
    private fb: FormBuilder,
    private rdfService: RdfService,
    private breadcrumbService: BreadcrumbService,
    private headerService: HeaderService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      counter: [1],
      sections: this.fb.array([this.initSection(1, 1, 1)]),
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
          this.breadcrumbService.set('@formName', { label: displayName });
          this.headerService.setHeaderTitle(displayName);
          const form = this.createForm.getRawValue();
          form.sections.forEach((section) => {
            section.questions.forEach((question) => {
              question.isPublishedTillSave = false;
            });
          });
          form.isPublishedTillSave = false;
          this.createForm.patchValue(form, { emitEvent: false });
        }),
        filter(() => this.createInProgress === false),
        switchMap(() => this.saveForm())
      )
      .subscribe();

    this.createForm
      .get('sections')
      .valueChanges.pipe(
        pairwise(),
        debounceTime(1000),
        distinctUntilChanged(),
        filter(() => this.createForm.get('id').value),
        tap(([prev, curr]) => {
          curr.forEach(({ questions: cq, ...currSection }, i) => {
            const { questions: pq, ...prevSection } = prev[i];
            if (isEqual(currSection, prevSection)) {
              cq.forEach((q, j) => {
                if (!isEqual(q, pq[j])) {
                  q.isPublishedTillSave = false;
                }
              });
            } else {
              cq.forEach((q) => {
                q.isPublishedTillSave = false;
              });
            }
          });
          this.createForm.patchValue(
            { sections: curr, isPublishedTillSave: false },
            { emitEvent: false }
          );
        }),
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
    this.createForm.get('name').setValue(this.defaultFormHeader);
  }

  setFormTitle() {
    const formName = this.createForm.get('name').value;
    this.createForm.patchValue({
      name: formName.trim() ? formName : this.defaultFormHeader
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getQuestions(form) {
    return form.controls.questions.controls;
  }

  getSections(form) {
    return form.controls.sections.controls;
  }

  addSection(index: number) {
    const control = this.createForm.get('sections') as FormArray;
    control.insert(
      index + 1,
      this.initSection(control.length + 1, 1, this.getCounter())
    );
  }

  addQuestion(j) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      j
    ].get('questions') as FormArray;
    control.push(
      this.initQuestion(j + 1, control.length + 1, this.getCounter())
    );
  }

  addLogicForQuestion(question: any, form: any) {
    question.hasLogic = true;
    question.value.logics.push({
      operator: 'is',
      operand1: question.value.name,
      operand2: '10'
    });
  }

  initQuestion = (sc: number, qc: number, uqc: number) => {
    if (!this.fieldContentOpenState[sc][qc])
      this.fieldContentOpenState[sc][qc] = false;
    if (!this.popOverOpenState[sc][qc]) this.popOverOpenState[sc][qc] = false;
    return this.fb.group({
      id: [`Q${uqc}`],
      name: [''],
      fieldType: [this.fieldType.type],
      position: [''],
      required: [false],
      value: [''],
      isPublished: [false],
      isPublishedTillSave: [false],
      logics: this.fb.array([])
    });
  };

  initSection = (sc: number, qc: number, uqc: number) => {
    if (!this.isOpenState[sc]) this.isOpenState[sc] = true;
    if (!this.fieldContentOpenState[sc]) this.fieldContentOpenState[sc] = {};
    if (!this.popOverOpenState[sc]) this.popOverOpenState[sc] = {};

    return this.fb.group({
      uid: [`uid${sc}`],
      name: [{ value: `Section ${sc}`, disabled: true }],
      position: [''],
      questions: this.fb.array([this.initQuestion(sc, qc, uqc)])
    });
  };

  toggleOpenState = (idx: number) => {
    this.isOpenState[idx + 1] = !this.isOpenState[idx + 1];
  };

  toggleFieldContentOpenState = (sectionIndex, questionIndex) => {
    Object.keys(this.fieldContentOpenState[sectionIndex + 1]).forEach((key) => {
      this.fieldContentOpenState[sectionIndex + 1][key] = false;
    });
    this.fieldContentOpenState[sectionIndex + 1][questionIndex + 1] = true;
  };

  togglePopOverOpenState = (sectionIndex, questionIndex) => {
    this.popOverOpenState[sectionIndex + 1][questionIndex + 1] =
      !this.popOverOpenState[sectionIndex + 1][questionIndex + 1];
  };

  editSection(e) {
    e.get('name').enable();
  }

  publishForm() {
    let publishedCount = 0;
    const form = this.createForm.getRawValue();
    this.publishInProgress = true;

    this.rdfService
      .publishForm$(form)
      .pipe(
        tap((response) => {
          form.sections.forEach((section) => {
            section.questions.forEach((question) => {
              if (response.includes(question.id)) {
                publishedCount++;
                question.isPublished = true;
                question.isPublishedTillSave = true;
              }
            });
          });
          if (publishedCount === response.length) {
            form.isPublishedTillSave = true;
          }
          this.createForm.patchValue(form, { emitEvent: false });
          this.publishInProgress = false;
        }),
        switchMap(() => this.saveForm(true))
      )
      .subscribe(() => {
        this.status$.next(this.changesPublished);
        this.cdrf.markForCheck();
      });
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  saveForm(ignoreStatus = false) {
    const { id, ...form } = this.createForm.getRawValue();

    if (id) {
      if (!ignoreStatus) {
        this.status$.next(this.saveProgress);
      }
      return this.rdfService.updateForm$(id, form).pipe(
        tap(() => {
          this.status$.next(this.changesSaved);
        })
      );
    } else {
      this.createInProgress = true;
      if (!ignoreStatus) {
        this.status$.next(this.saveProgress);
      }
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

  applySliderOptions(values, question) {
    question.get('value').setValue(values);
    this.isCustomizerOpen = false;
  }

  selectFieldType(fieldType, question) {
    this.isCustomizerOpen = true;
    question.get('fieldType').setValue(fieldType.type);
  }
}
