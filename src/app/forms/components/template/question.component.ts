/* eslint-disable no-underscore-dangle */
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
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
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { fieldTypesMock } from '../response-type/response-types.mock';
import {
  AddQuestionEvent,
  Question,
  UpdateQuestionEvent
} from 'src/app/interfaces';
import { getQuestion, getSectionQuestions, State } from 'src/app/forms/state';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  @Output() addQuestionEvent: EventEmitter<AddQuestionEvent> =
    new EventEmitter<AddQuestionEvent>();
  @Output() updateQuestionEvent: EventEmitter<UpdateQuestionEvent> =
    new EventEmitter<UpdateQuestionEvent>();
  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;

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
  fieldContentOpenState = false;
  openResponseType = false;

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
  sectionQuestions$: Observable<Question[]>;
  sectionQuestions: Question[];
  private _pageIndex: number;
  private _sectionId: string;
  private _questionIndex: number;

  constructor(
    private fb: FormBuilder,
    private imageUtils: ImageUtils,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
    this.questionForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.updateQuestionEvent.emit({
          pageIndex: this.pageIndex,
          sectionId: this.sectionId,
          question: this.questionForm.value
        });
      });

    this.question$ = this.store
      .select(getQuestion(this.pageIndex, this.sectionId, this.questionIndex))
      .pipe(
        tap((question) => {
          this.question = question;
          this.questionForm.patchValue(question, {
            emitEvent: false
          });
        })
      );

    this.sectionQuestions$ = this.store
      .select(getSectionQuestions(this.pageIndex, this.sectionId))
      .pipe(tap((questions) => (this.sectionQuestions = questions)));
  }

  addQuestion(position: number) {
    this.addQuestionEvent.emit({
      pageIndex: this.pageIndex,
      sectionId: this.sectionId,
      questionIndex: position
    });
  }

  deleteQuestion() {
    console.log('delete question');
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  openResponseTypeModalEventHandler(value) {
    this.openResponseType = value;
  }

  selectFieldTypeEventHandler(fieldType) {
    if (fieldType.type === this.questionForm.get('fieldType').value) {
      return;
    }

    this.questionForm.get('fieldType').setValue(fieldType.type);
    this.questionForm.get('required').setValue(false);
    this.questionForm.get('value').setValue('');
    this.openResponseType = false;

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

  toggleFieldContentOpenState() {
    this.fieldContentOpenState = true;
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
}
