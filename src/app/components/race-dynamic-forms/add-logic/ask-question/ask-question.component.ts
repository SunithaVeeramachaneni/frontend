/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';
import { RdfService } from '../../services/rdf.service';
import { fieldTypeOperatorMapping } from '../../utils/fieldOperatorMappings';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onValueChanged: EventEmitter<any> = new EventEmitter();

  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;

  fieldOperators: any;

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];

  public isOpenState = {};
  fieldContentOpenState = {};
  isPopoverOpen = [false];
  popOverOpenState = {};

  public isMCQResponseOpen = false;
  public quickResponses$: Observable<any>;
  public globalResponses$: Observable<any>;
  public activeResponses$: Observable<any>;
  public activeResponseId: string;
  activeResponseType: string;

  currentQuestion: any;
  status$ = new BehaviorSubject<string>('');
  isCustomizerOpen = false;
  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };

  public questionForm: FormGroup;

  private _logic: any;

  @Input() set logic(logic: any) {
    if (!this.isOpenState[1]) this.isOpenState[1] = true;
    if (!this.fieldContentOpenState[1]) this.fieldContentOpenState[1] = {};
    if (!this.popOverOpenState[1]) this.popOverOpenState[1] = {};

    this.questionForm = this.fb.group({
      counter: [1],
      // questions: logic.controls.questions
      questions: this.fb.array([this.initQuestion(1, 1, 1)])
    });
    // this.fieldOperators = fieldTypeOperatorMapping[question.value.fieldType];
    this._logic = logic ? logic : ({} as any);
    this.cdrf.detectChanges();
  }

  get logic(): any {
    return this._logic;
  }

  constructor(
    private cdrf: ChangeDetectorRef,
    private fb: FormBuilder,
    private rdfService: RdfService
  ) {}

  ngOnInit() {
    this.quickResponses$ = this.rdfService.getResponses$('quickResponse').pipe(
      tap((resp) => {
        const quickResp = resp.map((r) => ({
          id: r.id,
          name: '',
          values: r.values
        }));
        return quickResp;
      })
    );
    this.globalResponses$ = this.rdfService
      .getResponses$('globalResponse')
      .pipe(
        tap((resp) => {
          const globalResp = resp.map((r) => ({
            id: r.id,
            name: r.name,
            values: r.values
          }));
          return globalResp;
        })
      );
    this.quickResponses$.subscribe();
    this.globalResponses$.subscribe();

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

    this.questionForm
      .get('questions')
      .valueChanges.pipe(
        pairwise(),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          curr.forEach((q) => {
            if (!isEqual(curr, prev)) {
              // this.questionForm.patchValue(curr);
              // const control = this.logic.get('questions') as FormArray;
              // control.patchValue(curr);
              this.onValueChanged.emit(curr);
            }
          });
        })
      )
      .subscribe();
  }

  get questions(): FormArray {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.questionForm.get('questions') as FormArray;
  }
  getQuestions(form) {
    return form.controls.questions.controls;
    // return this.questionForm.controls.questions; //.controls;
  }

  handleResponses = (type: string, id: string) => {
    this.activeResponses$ =
      type === 'globalResponse' ? this.globalResponses$ : this.quickResponses$;
    this.activeResponseType = type;
    this.activeResponseId = id;
  };

  getCounter() {
    this.questionForm
      .get('counter')
      .setValue(this.questionForm.get('counter').value + 1);
    return this.questionForm.get('counter').value;
  }

  addQuestion(i, questionForm) {
    const control = this.questionForm.get('questions') as FormArray;
    control.push(this.initQuestion(1, control.length + 1, this.getCounter()));
    // this.onValueChanged.emit(questionForm.getRawValue());
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
      multi: [false],
      value: ['TF'],
      isPublished: [false],
      isPublishedTillSave: [false],
      logics: this.fb.array([])
    });
  };

  toggleFieldContentOpenState = (sectionIndex, questionIndex) => {
    Object.keys(this.fieldContentOpenState).forEach((sKey) => {
      Object.keys(this.fieldContentOpenState[sKey]).forEach((qKey) => {
        this.fieldContentOpenState[sKey][qKey] = false;
      });
    });
    this.fieldContentOpenState[1][questionIndex + 1] = true;
  };
  togglePopOverOpenState = (sectionIndex, questionIndex) => {
    this.popOverOpenState[1][questionIndex + 1] =
      !this.popOverOpenState[1][questionIndex + 1];
  };

  selectFieldType(fieldType, question) {
    if (fieldType.type === question.get('fieldType').value) {
      return;
    }
    this.currentQuestion = question;
    question.patchValue({
      fieldType: fieldType.type,
      required: false,
      value: ''
    });
    switch (fieldType.type) {
      case 'TF':
        question.get('value').setValue('TF');
        break;
      case 'VI':
        this.isCustomizerOpen = true;
        question.get('value').setValue([]);
        break;
      case 'RT':
        this.isCustomizerOpen = true;
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        question.get('value').setValue(sliderValue);
        this.sliderOptions = sliderValue;
        break;
      case 'IMG':
        let index = 0;
        let found = false;
        this.questionForm.get('sections').value.forEach((section) => {
          section.questions.forEach((que) => {
            if (que.id === this.currentQuestion.value.id) {
              found = true;
            }
            if (!found && que.fieldType === 'IMG') {
              index++;
            }
          });
        });

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

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }
  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }
}
