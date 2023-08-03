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
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  tap
} from 'rxjs/operators';
import { CreateUpdateResponse } from 'src/app/interfaces';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
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
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onQuestionDelete: EventEmitter<any> = new EventEmitter();
  @Input() formId: string;

  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;

  fieldOperators: any;

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];

  public isOpenState = {};
  fieldContentOpenState = {};
  richTextEditorToolbarState = {};
  isPopoverOpen = [false];
  popOverOpenState = {};

  public isMCQResponseOpen = false;
  quickResponsesData$: Observable<any>;
  globalResponsesData$: Observable<any>;
  createEditQuickResponse$ = new BehaviorSubject<CreateUpdateResponse>({
    type: 'create',
    response: {}
  });
  createEditGlobalResponse$ = new BehaviorSubject<CreateUpdateResponse>({
    type: 'create',
    response: {}
  });
  createEditQuickResponse = true;
  createEditGlobalResponse = true;

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
  isLLFFieldChanged = false;
  questionsValue: any;
  private _logic: any;

  @Input() set logic(logic: any) {
    if (!this.isOpenState[1]) this.isOpenState[1] = true;
    if (!this.fieldContentOpenState[1]) this.fieldContentOpenState[1] = {};
    if (!this.popOverOpenState[1]) this.popOverOpenState[1] = {};
    if (!this.richTextEditorToolbarState[1])
      this.richTextEditorToolbarState[1] = {};

    this.questionForm = this.fb.group({
      counter: [1],
      questions: logic.controls.questions
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
    private rdfService: RdfService,
    private imageUtils: ImageUtils
  ) {}

  ngOnInit() {
    this.rdfService
      .getFieldTypes$()
      .pipe(
        tap((fieldTypes) => {
          this.fieldTypes = fieldTypes;
          this.filteredFieldTypes = fieldTypes.filter(
            (fieldType) =>
              fieldType.type !== 'LTV' &&
              fieldType.type !== 'DD' &&
              fieldType.type !== 'DDM' &&
              fieldType.type !== 'VI'
          );
          this.cdrf.markForCheck();
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
          curr.forEach((q, i) => {
            if (!isEqual(curr[i], prev[i])) {
              this.isLLFFieldChanged = false;
              if (q.fieldType === 'LLF') {
                this.questionsValue = curr;
                this.isLLFFieldChanged = true;
              } else {
                this.onValueChanged.emit(curr);
              }
            }
          });
        })
      )
      .subscribe();

    this.quickResponsesData$ = combineLatest([
      of({ data: [] }),
      this.rdfService.getResponses$('quickResponse'),
      this.createEditQuickResponse$
    ]).pipe(
      map(([initial, responses, { type, response, responseType }]) => {
        if (
          type === 'cancel' ||
          !this.createEditQuickResponse ||
          (responseType !== 'quickResponse' && responseType !== undefined)
        ) {
          return initial;
        }
        if (Object.keys(response).length) {
          if (type === 'create') {
            initial.data = initial.data.concat([response]);
          } else {
            initial.data = initial.data.map((resp) => {
              if (resp.id === response.id) {
                return response;
              }
              return resp;
            });
          }
          this.createEditQuickResponse = false;
          return initial;
        } else {
          if (initial.data.length === 0) {
            const tempResp = responses.filter((item) => !item.formId);
            if (this.formId) {
              const addResp = responses.filter(
                (item) => item.formId === this.formId
              );
              tempResp.push(...addResp);
            }
            const quickResp = tempResp.map((r) => ({
              id: r.id,
              name: '',
              values: r.values
            }));
            initial.data = initial.data.concat(quickResp);
          }
          this.createEditQuickResponse = false;
          return initial;
        }
      })
    );

    this.quickResponsesData$.subscribe();

    this.globalResponsesData$ = combineLatest([
      of({ data: [] }),
      this.rdfService.getResponses$('globalResponse'),
      this.createEditGlobalResponse$
    ]).pipe(
      map(([initial, responses, { type, response, responseType }]) => {
        if (
          type === 'cancel' ||
          !this.createEditGlobalResponse ||
          (responseType !== 'globalResponse' && responseType !== undefined)
        ) {
          return initial;
        }
        if (Object.keys(response).length) {
          if (type === 'create') {
            initial.data = initial.data.concat([response]);
          } else {
            initial.data = initial.data.map((resp) => {
              if (resp.id === response.id) {
                return response;
              }
              return resp;
            });
          }
          this.createEditGlobalResponse = false;
          return initial;
        } else {
          if (initial.data.length === 0) {
            const globalResp = responses.map((resp) => ({
              id: resp.id,
              name: resp.name,
              values: resp.values
            }));
            initial.data = initial.data.concat(globalResp);
          }
          this.createEditGlobalResponse = false;
          return initial;
        }
      })
    );

    this.globalResponsesData$.subscribe();
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
      type === 'globalResponse'
        ? this.globalResponsesData$
        : this.quickResponsesData$;
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
    if (!this.richTextEditorToolbarState[sc][qc])
      this.richTextEditorToolbarState[sc][qc] = false;
    const questionId = this.rdfService.generateUUID(20);
    return this.fb.group({
      id: [questionId],
      name: [''],
      fieldType: [this.fieldType.type],
      position: [''],
      required: [false],
      multi: [false],
      value: ['TF'],
      isPublished: [false],
      isPublishedTillSave: [false],
      logics: this.fb.array([]),
      table: this.fb.array([])
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
        this.questionForm.get('questions').value.forEach((que) => {
          if (que.id === this.currentQuestion.value.id) {
            found = true;
          }
          if (!found && que.fieldType === 'IMG') {
            index++;
          }
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

  deleteQuestion(index: number) {
    const form = this.questionForm.getRawValue();
    form.questions.splice(index, 1);
    this.questionForm.patchValue(form);
    this.onQuestionDelete.emit({ index });
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }
  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  handleMCQFieldType = (question: any, response: any) => {
    const fieldType = response.values.length > 4 ? 'DD' : 'VI';
    question.get('fieldType').setValue(fieldType);
    question.get('value').setValue(response);
  };

  handleMCQResponse(event: CreateUpdateResponse) {
    const { responseType, type, response } = event;
    if (responseType === 'quickResponse') {
      this.createEditQuickResponse = true;
      this.createEditQuickResponse$.next({ type, response, responseType });
    } else {
      this.createEditGlobalResponse = true;
      this.createEditGlobalResponse$.next({ type, response, responseType });
    }
    this.handleMCQFieldType(this.currentQuestion, response);
    this.updateMcqAndGlobalResponses(response);
  }

  updateMcqAndGlobalResponses(value) {
    const fieldType = value.values.length > 4 ? 'DD' : 'VI';
    const { questions } = this.questionForm.value;
    questions.forEach((que) => {
      if (
        value.id === que.value.id &&
        (que.fieldType === 'VI' || que.fieldType === 'DD')
      ) {
        que.value = value;
        que.fieldType = fieldType;
      }
    });

    this.questionForm.patchValue({ questions });
  }

  applySliderOptions(values, question) {
    this.currentQuestion.get('value').setValue(values);
    // question.get('value').setValue(values);
    this.isCustomizerOpen = false;
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
      this.currentQuestion.get('value').setValue(value);
    };
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  handleEditorFocus(focus: boolean, i, j) {
    if (!focus && this.isLLFFieldChanged) {
      this.onValueChanged.emit(this.questionsValue);
      this.isLLFFieldChanged = false;
    }
    this.richTextEditorToolbarState[i][j + 1] = focus;
  }
}
