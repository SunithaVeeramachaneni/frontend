/* eslint-disable @typescript-eslint/naming-convention */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime,
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
export class CreateFormComponent implements OnInit, AfterViewInit {
  @ViewChild('name') private name: ElementRef;
  public createForm: FormGroup;
  defaultFormHeader = 'Untitled Form';
  saveProgress = 'Save in progress...';
  changesSaved = 'All Changes Saved';
  publishingChanges = 'Publishing changes...';
  changesPublished = 'All Changes published';
  public isOpenState = {};
  isSectionNameEditMode = true;
  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];
  createInProgress = false;
  publishInProgress = false;
  disableFormFields = true;
  currentQuestion: any;
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
      .pipe(
        tap((fieldTypes) => {
          this.fieldTypes = fieldTypes;
          this.filteredFieldTypes = fieldTypes.filter(
            (fieldType) =>
              fieldType.type !== 'LTV' &&
              fieldType.type !== 'DD' &&
              fieldType.type !== 'DDM'
          );
        })
      )
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

  ngAfterViewInit(): void {
    this.name.nativeElement.focus();
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

  addQuestion(i) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      i
    ].get('questions') as FormArray;
    control.push(
      this.initQuestion(i + 1, control.length + 1, this.getCounter())
    );
  }

  deleteQuestion(i, j, question) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      i
    ].get('questions') as FormArray;
    control.removeAt(j);
    this.fieldContentOpenState[i + 1][j + 1] = false;
    if (question.value.isPublished) {
      this.rdfService
        .deleteAbapFormField$({
          FORMNAME: this.createForm.get('id').value,
          UNIQUEKEY: question.value.id
        })
        .subscribe();
    }
  }

  deleteSection(i, section) {
    /* const control = this.createForm.get('sections') as FormArray;
    control.removeAt(i);
    console.log(section); */
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
      value: ['TF'],
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
    Object.keys(this.fieldContentOpenState).forEach((sKey) => {
      Object.keys(this.fieldContentOpenState[sKey]).forEach((qKey) => {
        this.fieldContentOpenState[sKey][qKey] = false;
      });
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
    this.status$.next(this.publishingChanges);

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
            this.status$.next(this.changesPublished);
          }
          this.createForm.patchValue(form, { emitEvent: false });
          this.publishInProgress = false;
        }),
        switchMap(() => this.saveForm(true))
      )
      .subscribe(() => {
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
          if (!ignoreStatus) {
            this.status$.next(this.changesSaved);
          }
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
    this.currentQuestion.get('value').setValue(values);
    // question.get('value').setValue(values);
    this.isCustomizerOpen = false;
  }

  selectFieldType(fieldType, question) {
    this.isCustomizerOpen = true;
    if (fieldType.type === 'TF') {
      question.get('value').setValue('TF');
    }
    question.get('fieldType').setValue(fieldType.type);

    if (fieldType.type === 'RT') {
      this.currentQuestion = question;
      let sliderValue = {
        min: 0,
        max: 100,
        increment: 1
      };
      if (
        Object.keys(question.get('value').value).find((item) => item === 'min')
      ) {
        sliderValue = question.get('value').value;
      } else {
        question.get('value').setValue(sliderValue);
      }
      this.sliderOptions = sliderValue;
    }
  }
}
