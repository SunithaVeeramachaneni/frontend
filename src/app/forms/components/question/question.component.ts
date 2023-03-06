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
import {
  fieldTypesMock,
  unitOfMeasurementsMock
} from '../response-type/response-types.mock';
import {
  QuestionEvent,
  Question,
  NumberRangeMetadata
} from 'src/app/interfaces';
import {
  getQuestionByID,
  getSectionQuestionsCount,
  State,
  getQuestionLogics
} from 'src/app/forms/state';
import { Store } from '@ngrx/store';
import { FormService } from '../../services/form.service';
import { isEqual } from 'lodash-es';
import { FormConfigurationActions } from '../../state/actions';
import { AddLogicActions } from '../../state/actions';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @ViewChild('unitMenuTrigger') unitMenuTrigger: MatMenuTrigger;

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
    'ARD',
    'DT',
    'HL'
  ];

  unitOfMeasurementsAvailable = [];

  unitOfMeasurements = [];

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
    isResponseTypeModalOpen: false,
    unitOfMeasurement: 'None',
    rangeMetadata: {} as NumberRangeMetadata
  });
  question$: Observable<Question>;
  question: Question;
  sectionQuestionsCount$: Observable<number>;
  ignoreUpdateIsOpen: boolean;
  addQuestionClicked: boolean;
  isHyperLinkOpen = false;
  formId: string;

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
    private rdfService: RaceDynamicFormService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.formId = params.id;
    });

    this.rdfService.formCreatedUpdated$.subscribe((data) => {
      if (data.id) {
        this.formId = data.id;
      }
    });

    this.unitOfMeasurementsAvailable = [...unitOfMeasurementsMock];

    this.fieldTypes = fieldTypesMock.fieldTypes.filter(
      (fieldType) =>
        fieldType.type !== 'LTV' &&
        fieldType.type !== 'DD' &&
        fieldType.type !== 'DDM' &&
        fieldType.type !== 'VI' &&
        fieldType.type !== 'IMG' &&
        fieldType.type !== 'USR' &&
        fieldType.type !== 'ARD' &&
        fieldType.type !== 'TAF'
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
          if (question) {
            if (
              question.isOpen &&
              !isEqual(question.isOpen, this.question?.isOpen)
            ) {
              timer(0).subscribe(() => this.name.nativeElement.focus());
            } else if (!question.isOpen) {
              if (this.isAskQuestion) {
                timer(0).subscribe(() => this.name.nativeElement.focus());
              } else {
                timer(0).subscribe(() => this.name.nativeElement.blur());
              }
            }
            this.question = question;
            this.questionForm.patchValue(question, {
              emitEvent: false
            });
          }
        })
      );

    this.sectionQuestionsCount$ = this.store.select(
      getSectionQuestionsCount(this.pageIndex, this.sectionId)
    );
  }

  getRangeMetadata() {
    return this.questionForm.get('rangeMetadata').value;
  }

  uomChanged(event) {
    this.questionForm.get('unitOfMeasurement').setValue(event.code);
    this.unitMenuTrigger.closeMenu();
  }

  onKey(event) {
    const value = event.target.value;
    const filter = value.toLowerCase();
    this.unitOfMeasurements = [...unitOfMeasurementsMock];
    this.unitOfMeasurementsAvailable = this.unitOfMeasurements.filter(
      (option) =>
        option.title.toLowerCase().startsWith(filter) ||
        option.code.toLowerCase().startsWith(filter) ||
        option.symbol.toLowerCase().startsWith(filter)
    );
  }

  addQuestion(ignoreUpdateIsOpen: boolean, ignoreDelay: boolean) {
    if (this.addQuestionClicked) return;
    this.ignoreUpdateIsOpen = ignoreUpdateIsOpen;
    if (ignoreDelay) {
      this.questionEvent.emit({
        pageIndex: this.pageIndex,
        sectionId: this.sectionId,
        questionIndex: this.questionIndex + 1,
        type: 'add'
      });
    } else {
      this.addQuestionClicked = true;
      timer(600).subscribe(() => {
        this.questionEvent.emit({
          pageIndex: this.pageIndex,
          sectionId: this.sectionId,
          questionIndex: this.questionIndex + 1,
          type: 'add'
        });
        this.addQuestionClicked = false;
      });
    }
  }

  deleteQuestion(event) {
    event.stopPropagation();

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

    this.removeLogicsOfQuestion(
      this.pageIndex,
      this.questionForm.get('id').value
    );

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
  rangeSelectorOpen(question) {
    this.formService.setRangeSelectorOpenState({
      isOpen: true,
      rangeMetadata: question.rangeMetadata
    });
  }

  getRangeDisplayText() {
    let resp = 'None';
    const rangeMeta = this.questionForm.get('rangeMetadata').value;
    if (rangeMeta && rangeMeta.min && rangeMeta.max) {
      resp = `${rangeMeta.min} - ${rangeMeta.max}`;
    }
    return resp;
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
    const isAskQuestion =
      this.questionForm.get('sectionId').value === `AQ_${this.sectionId}`;

    if (isAskQuestion) {
      return;
    }
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
      .setValue(isResponseTypeModalOpen, { emitEvent: false });
  }

  responseTypeCloseEventHandler(responseTypeClosed: boolean) {
    this.questionForm
      .get('isResponseTypeModalOpen')
      .setValue(!responseTypeClosed, { emitEvent: false });
  }
  setQuestionValue(event) {
    this.questionForm.get('value').setValue(event, { emitEvent: false });
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

  removeLogicsOfQuestion(pageIndex: number, questionId: string) {
    this.store.dispatch(
      AddLogicActions.removeLogicsOfQuestion({
        pageIndex,
        questionId
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
          isOpen: false,
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
    switch (event.eventType) {
      case 'quickResponsesAdd':
        const createDataset = {
          formId: this.formId,
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
          formId: this.formId,
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
  rangeSelectionHandler(event) {
    switch (event.eventType) {
      case 'update':
        this.questionForm.get('rangeMetadata').setValue(event.data);
        break;
    }
  }

  toggleHyperLink = () => {
    this.isHyperLinkOpen = !this.isHyperLinkOpen;
  };

  handlerHyperlink = (event: any) => {
    this.questionForm.get('value').setValue(event);
    this.isHyperLinkOpen = !this.isHyperLinkOpen;
  };
}
