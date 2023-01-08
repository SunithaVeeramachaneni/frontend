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
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { QuestionEvent, Question } from 'src/app/interfaces';
import {
  getQuestionByID,
  getSectionQuestionsCount,
  State,
  getQuestionLogics
} from 'src/app/forms/state';
import { Store } from '@ngrx/store';
import { FormService } from '../../services/form.service';
import { FormConfigurationActions } from '../../state/actions';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
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

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  openResponseType = false;
  fieldContentOpenState = false;
  openResponseTypeModal$: Observable<boolean>;

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
    value: '',
    isPublished: false,
    isPublishedTillSave: false
  });
  question$: Observable<Question>;
  question: Question;
  sectionQuestionsCount$: Observable<number>;
  private _pageIndex: number;
  private _id: string;
  private _sectionId: string;
  private _questionIndex: number;

  constructor(
    private fb: FormBuilder,
    private imageUtils: ImageUtils,
    private store: Store<State>,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
    this.openResponseTypeModal$ = this.formService.openResponseType$;
    this.questionForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() =>
          this.questionEvent.emit({
            pageIndex: this.pageIndex,
            sectionId: this.sectionId,
            question: this.questionForm.value,
            questionIndex: this.questionIndex,
            type: 'update'
          })
        )
      )
      .subscribe();

    this.question$ = this.store
      .select(getQuestionByID(this.pageIndex, this.sectionId, this.questionId))
      .pipe(
        tap((question) => {
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

  addQuestion() {
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
      type: 'delete'
    });
  }

  selectFieldTypeEventHandler(fieldType) {
    if (fieldType.type === this.questionForm.get('fieldType').value) {
      return;
    }

    this.questionForm.get('fieldType').setValue(fieldType.type);
    this.questionForm.get('required').setValue(false);
    this.questionForm.get('value').setValue('');
    this.openResponseTypeModal$ = this.formService.openResponseType$;

    switch (fieldType.type) {
      case 'TF':
        this.questionForm.get('value').setValue('TF');
        break;
      case 'VI':
        //this.isCustomizerOpen = true;
        this.questionForm.get('value').setValue([]);
        break;
      case 'RT':
        //this.isCustomizerOpen = true;
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        this.questionForm.get('value').setValue(sliderValue);
        //this.sliderOptions = sliderValue;
        break;
      case 'IMG':
        let index = 0;
        let found = false;
        if (this.questionForm.get('id').value === this.question.value.id) {
          found = true;
        }
        if (!found && this.questionForm.get('fieldType').value === 'IMG') {
          index++;
        }

        timer(0)
          .pipe(
            tap(() => {
              this.insertImages.toArray()[index]?.nativeElement.click();
            })
          )
          .subscribe();
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

  getQuestionLogics(pageIndex: number, questionId: string) {
    return this.store.select(getQuestionLogics(pageIndex, questionId));
  }

  addLogicToQuestion(pageIndex: number, questionId: string) {
    this.store.dispatch(
      FormConfigurationActions.addLogicToQuestion({
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
    const { logics, type, questionId, pageIndex } = event;
    switch (type) {
      // case 'update':
      //   this.store.dispatch(
      //     FormConfigurationActions.updateQuestionLogics({
      //       questionId,
      //       pageIndex,
      //       logics
      //     })
      //   );
      //   break;
      case 'update_logic':
        this.store.dispatch(
          FormConfigurationActions.updateQuestionLogic({
            questionId,
            pageIndex,
            logic: event.logic
          })
        );
        break;
      case 'delete':
        this.store.dispatch(
          FormConfigurationActions.deleteQuestionLogic({
            questionId,
            pageIndex,
            logicId: event.logicId
          })
        );
        break;
    }
  }
}
