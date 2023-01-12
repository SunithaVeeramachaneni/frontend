/* eslint-disable no-underscore-dangle */
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  tap
} from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { QuestionEvent, Question } from 'src/app/interfaces';
import {
  getQuestionByID,
  getSectionQuestionsCount,
  State,
  getQuestionLogics,
  getFormMetadata
} from 'src/app/forms/state';
import { Store } from '@ngrx/store';
import { FormService } from '../../services/form.service';
import { isEqual } from 'lodash-es';
import { FormConfigurationActions } from '../../state/actions';
import { AddLogicActions } from '../../state/actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @ViewChild('name', { static: false }) name: ElementRef;
  @Output() questionEvent: EventEmitter<QuestionEvent> =
    new EventEmitter<QuestionEvent>();
  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;

  @Input() set questionId(id: string) {
    this._id = id;
  }
  get questionId() {
    return this._id;
  }

  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  @Input() set sectionId(sectionId: string) {
    this._sectionId = sectionId;
  }
  get sectionId() {
    return this._sectionId;
  }
  @Input() set questionIndex(questionIndex: number) {
    this._questionIndex = questionIndex;
  }
  get questionIndex() {
    return this._questionIndex;
  }

  @Input() set isAskQuestion(isAskQuestion: boolean) {
    this._isAskQuestion = isAskQuestion;
  }
  get isAskQuestion() {
    return this._isAskQuestion;
  }

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];

  addLogicNotAppliedFields = [
    'LTV',
    'TIF',
    'SF',
    'LF',
    'LLF',
    'SGF',
    'ATT',
    'IMG',
    'GAL',
    'DFR',
    'RT',
    'TAF',
    'ARD'
  ];

  questionForm: FormGroup = this.fb.group({
    id: '',
    sectionId: '',
    name: '',
    fieldType: 'TF',
    position: '',
    required: false,
    multi: false,
    value: 'TF',
    isPublished: false,
    isPublishedTillSave: false,
    isOpen: false,
    isResponseTypeModalOpen: false
  });
  question$: Observable<Question>;
  question: Question;
  sectionQuestionsCount$: Observable<number>;
  ignoreUpdateIsOpen: boolean;
  private _pageIndex: number;
  private _id: string;
  private _sectionId: string;
  private _questionIndex: number;
  private _isAskQuestion: boolean;

  constructor(
    private fb: FormBuilder,
    private imageUtils: ImageUtils,
    private store: Store<State>,
    private formService: FormService,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes.filter(
      (fieldType) =>
        fieldType.type !== 'LTV' &&
        fieldType.type !== 'DD' &&
        fieldType.type !== 'DDM' &&
        fieldType.type !== 'VI'
    );
    this.questionForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        distinctUntilChanged(),
        pairwise(),
        tap(([previous, current]) => {
          const { isOpen, isResponseTypeModalOpen, ...prev } = previous;
          const {
            isOpen: currIsOpen,
            isResponseTypeModalOpen: currIsResponseTypeModalOpen,
            ...curr
          } = current;
          if (!isEqual(prev, curr)) {
            this.questionEvent.emit({
              pageIndex: this.pageIndex,
              sectionId: this.sectionId,
              question: this.questionForm.value,
              questionIndex: this.questionIndex,
              type: 'update'
            });
          }
        })
      )
      .subscribe();

    this.question$ = this.store
      .select(getQuestionByID(this.pageIndex, this.sectionId, this.questionId))
      .pipe(
        tap((question) => {
          if (question.isOpen) {
            timer(0).subscribe(() => this.name.nativeElement.focus());
          } else {
            timer(0).subscribe(() => this.name.nativeElement.blur());
          }
          this.question = question;
          this.questionForm.patchValue(question, {
            emitEvent: false
          });
        })
      );

    this.sectionQuestionsCount$ = this.store.select(
      getSectionQuestionsCount(this.pageIndex, this.sectionId)
    );
  }

  addQuestion(ignoreUpdateIsOpen = false) {
    this.ignoreUpdateIsOpen = ignoreUpdateIsOpen;
    this.questionEvent.emit({
      pageIndex: this.pageIndex,
      sectionId: this.sectionId,
      questionIndex: this.questionIndex + 1,
      type: 'add'
    });
  }

  deleteQuestion() {
    this.questionEvent.emit({
      pageIndex: this.pageIndex,
      sectionId: this.sectionId,
      questionIndex: this.questionIndex,
      type: 'delete',
      questionId: this.questionId
    });
  }

  selectFieldTypeEventHandler(fieldType) {
    if (fieldType.type === this.questionForm.get('fieldType').value) {
      return;
    }

    this.questionForm.get('fieldType').setValue(fieldType.type);
    this.questionForm.get('required').setValue(false);
    this.questionForm.get('value').setValue('');

    switch (fieldType.type) {
      case 'TF':
        this.questionForm.get('value').setValue('TF');
        break;
      case 'DF':
        this.questionForm.get('value').setValue(false);
        break;
      case 'TIF':
        this.questionForm.get('value').setValue(false);
        break;
      case 'VI':
        this.questionForm.get('value').setValue([]);
        break;
      case 'RT':
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        this.questionForm.get('value').setValue(sliderValue);
        break;
      case 'IMG':
        this.insertImages.toArray()[this.questionIndex]?.nativeElement.click();
        break;
      default:
      // do nothing
    }
  }

  sliderOpen() {
    this.formService.setsliderOpenState(true);
  }

  insertImageHandler(event) {
    let base64: string;
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const image = base64.split(',')[1];
      const value = {
        name: files[0].name,
        size: (files[0].size / 1024).toFixed(2),
        base64: image
      };
      this.questionForm.get('value').setValue(value);
    };
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  updateIsOpen(isOpen: boolean) {
    if (this.questionForm.get('isOpen').value !== isOpen) {
      if (!this.ignoreUpdateIsOpen) {
        this.store.dispatch(
          FormConfigurationActions.updateQuestionState({
            questionId: this.questionId,
            isOpen,
            isResponseTypeModalOpen: this.questionForm.get(
              'isResponseTypeModalOpen'
            ).value
          })
        );
      }
      this.ignoreUpdateIsOpen = false;
    }
  }

  responseTypeOpenEventHandler(isResponseTypeModalOpen: boolean) {
    this.questionForm
      .get('isResponseTypeModalOpen')
      .setValue(isResponseTypeModalOpen);
  }

  responseTypeCloseEventHandler(responseTypeClosed: boolean) {
    this.questionForm
      .get('isResponseTypeModalOpen')
      .setValue(!responseTypeClosed);
  }

  getQuestionLogics(pageIndex: number, questionId: string) {
    return this.store.select(getQuestionLogics(pageIndex, questionId));
  }

  addLogicToQuestion(pageIndex: number, questionId: string) {
    this.store.dispatch(
      AddLogicActions.addLogicToQuestion({
        pageIndex,
        questionId,
        logic: this.constructLogic(pageIndex, questionId)
      })
    );
  }
  constructLogic(pageIndex: number, questionId: string) {
    return {
      id: uuidv4(),
      questionId,
      pageIndex,
      operator: 'EQ',
      operand1: '',
      operand2: '',
      action: '',
      logicTitle: '',
      expression: '',
      questions: [],
      mandateQuestions: [],
      hideQuestions: []
    };
  }

  logicEventHandler(event) {
    const { type, questionId, pageIndex } = event;
    switch (type) {
      case 'create':
        this.store.dispatch(
          AddLogicActions.addLogicToQuestion({
            pageIndex,
            questionId,
            logic: this.constructLogic(pageIndex, questionId)
          })
        );
        break;
      case 'update':
        this.store.dispatch(
          AddLogicActions.updateQuestionLogic({
            questionId,
            pageIndex,
            logic: event.logic
          })
        );
        break;
      case 'delete':
        this.store.dispatch(
          AddLogicActions.deleteQuestionLogic({
            questionId,
            pageIndex,
            logicId: event.logicId
          })
        );
        break;
      case 'ask_question_create':
        const newQuestion = {
          id: `AQ_${uuidv4()}`,
          sectionId: `AQ_${event.logic.id}`,
          name: '',
          fieldType: 'TF',
          position: 0,
          required: false,
          multi: false,
          value: 'TF',
          isPublished: false,
          isPublishedTillSave: false,
          isOpen: true,
          isResponseTypeModalOpen: false
        };
        this.store.dispatch(
          AddLogicActions.askQuestionsCreate({
            questionId: event.questionId,
            pageIndex: event.pageIndex,
            logicIndex: event.logicIndex,
            logicId: event.logic.id,
            question: newQuestion
          })
        );
        break;
    }
  }
  quickResponseTypeHandler(event) {
    let formId;
    this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        formId = formMetadata.id;
      })
    );
    switch (event.eventType) {
      case 'quickResponsesAdd':
        const createDataset = {
          formId,
          type: 'quickResponses',
          values: event.data.responses,
          name: 'quickResponses'
        };
        this.rdfService.createDataSet$(createDataset).subscribe((response) => {
          // do nothing
        });
        break;

      case 'quickResponseUpdate':
        const updateDataset = {
          formId,
          type: 'quickResponses',
          values: event.data.responses,
          name: 'quickResponses',
          id: event.data.id
        };
        this.rdfService
          .updateDataSet$(event.data.id, updateDataset)
          .subscribe((response) => {
            // do nothing
          });
        break;
    }
  }
}
