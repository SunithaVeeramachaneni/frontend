/* eslint-disable @typescript-eslint/member-ordering */
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
  NumberRangeMetadata,
  FormMetadata,
  InstructionsFile
} from 'src/app/interfaces';
import {
  getQuestionByID,
  getSectionQuestionsCount,
  State,
  getQuestionLogics,
  getFormMetadata,
  getModuleName
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Store } from '@ngrx/store';
import { FormService } from '../../services/form.service';
import { isEqual } from 'lodash-es';
import {
  BuilderConfigurationActions,
  MCQResponseActions
} from '../../state/actions';
import { AddLogicActions } from '../../state/actions';
import { ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { ToastService } from 'src/app/shared/toast';
import { TranslateService } from '@ngx-translate/core';

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

  @Input() selectedNodeId: any;

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
  formMetadata: FormMetadata;
  moduleName: string;

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
    'HL',
    'INST'
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
    enableHistory: false,
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
  isINSTFieldChanged = false;
  instructionTagColours = {};

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
    private responseSetService: ResponseSetService,
    private operatorRoundsService: OperatorRoundsService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.formId = params.id;
    });

    this.operatorRoundsService.formCreatedUpdated$.subscribe((data) => {
      if (data.id) {
        this.formId = data.id;
      }
    });

    this.store
      .select(getFormMetadata)
      .subscribe((event) => (this.formMetadata = event));
    this.store
      .select(getModuleName)
      .subscribe((event) => (this.moduleName = event));

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
          const {
            isOpen,
            isResponseTypeModalOpen,
            value: prevValue,
            ...prev
          } = previous;
          const {
            isOpen: currIsOpen,
            isResponseTypeModalOpen: currIsResponseTypeModalOpen,
            value: currValue,
            ...curr
          } = current;
          if (!isEqual(prev, curr)) {
            if (
              this.questionForm.get('fieldType').value === 'INST' &&
              prevValue !== undefined &&
              isEqual(prevValue, currValue)
            ) {
              this.isINSTFieldChanged = true;
            } else {
              if (
                currValue?.type === 'globalResponse' ||
                prevValue?.type === 'globalResponse'
              )
                this.handleGlobalResponseRefCount(prevValue, currValue);

              this.questionEvent.emit({
                pageIndex: this.pageIndex,
                sectionId: this.sectionId,
                question: this.questionForm.value,
                questionIndex: this.questionIndex,
                type: 'update'
              });
            }
          }
        })
      )
      .subscribe();

    this.question$ = this.store
      .select(
        getQuestionByID(
          this.pageIndex,
          this.sectionId,
          this.questionId,
          this.selectedNodeId
        )
      )
      .pipe(
        tap((question) => {
          if (question) {
            if (
              question.isOpen &&
              !isEqual(question.isOpen, this.question?.isOpen)
            ) {
              if (question.fieldType !== 'INST') {
                timer(0).subscribe(() => this.name.nativeElement.focus());
              }
            } else if (!question.isOpen) {
              if (this.isAskQuestion) {
                if (question.fieldType !== 'INST') {
                  timer(0).subscribe(() => this.name.nativeElement.focus());
                }
              } else {
                if (question.fieldType !== 'INST') {
                  timer(0).subscribe(() => this.name.nativeElement.blur());
                }
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
      getSectionQuestionsCount(
        this.pageIndex,
        this.sectionId,
        this.selectedNodeId
      )
    );

    this.instructionTagColours[this.translate.instant('cautionTag')] =
      '#FEF3C7';
    this.instructionTagColours[this.translate.instant('warningTag')] =
      '#FF5C00';
    this.instructionTagColours[this.translate.instant('dangerTag')] = '#991B1B';
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

    // removing HTML tags that Quill material component puts in name field for non INST types.
    if (this.questionForm.get('fieldType').value === 'INST') {
      const originalName = this.questionForm.get('name').value;
      this.questionForm.get('name').setValue(this.stripHTMLTags(originalName));
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
      case 'INST':
        const instructionsValue = {
          tag: {
            title: this.translate.instant('noneTag'),
            colour: null
          },
          images: [null, null, null],
          pdf: null
        };
        this.questionForm.get('value').setValue(instructionsValue);
        break;
      default:
      // do nothing
    }
  }

  handleGlobalResponseRefCount = (prev, curr) => {
    const { type: prevType, value: prevValue, ...prevValues } = prev;
    const { type: currType, value: currValue, ...currValues } = curr;
    if (
      prev?.type === 'globalResponse' &&
      curr?.type === 'globalResponse' &&
      prev.id !== curr.id
    ) {
      this.responseSetService
        .updateResponseSet$({
          ...prevValues,
          refCount: prevValues.refCount - 1,
          values: JSON.stringify(prevValue)
        })
        .subscribe();
      this.responseSetService
        .createResponseSet$({
          ...currValues,
          refCount: currValues.refCount + 1,
          values: JSON.stringify(currValue)
        })
        .subscribe();
    } else if (prev?.type === 'globalResponse') {
      this.responseSetService
        .updateResponseSet$({
          ...prevValues,
          refCount: prevValues.refCount - 1,
          values: JSON.stringify(prevValue)
        })
        .subscribe();
    } else if (curr?.type === 'globalResponse') {
      this.responseSetService
        .createResponseSet$({
          ...currValues,
          refCount: currValues.refCount + 1,
          values: JSON.stringify(currValue)
        })
        .subscribe();
    }
  };

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
          BuilderConfigurationActions.updateQuestionState({
            questionId: this.questionId,
            isOpen,
            isResponseTypeModalOpen: this.questionForm.get(
              'isResponseTypeModalOpen'
            ).value,
            subFormId: this.selectedNodeId
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
    this.questionForm.get('value').setValue(event);
  }

  getQuestionLogics(pageIndex: number, questionId: string) {
    return this.store.select(
      getQuestionLogics(pageIndex, questionId, this.selectedNodeId)
    );
  }

  addLogicToQuestion(pageIndex: number, questionId: string) {
    this.store.dispatch(
      AddLogicActions.addLogicToQuestion({
        pageIndex,
        questionId,
        logic: this.constructLogic(pageIndex, questionId),
        subFormId: this.selectedNodeId
      })
    );
  }

  removeLogicsOfQuestion(pageIndex: number, questionId: string) {
    this.store.dispatch(
      AddLogicActions.removeLogicsOfQuestion({
        pageIndex,
        questionId,
        subFormId: this.selectedNodeId
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
      mandateAttachment: false,
      raiseIssue: false,
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
            logic: this.constructLogic(pageIndex, questionId),
            subFormId: this.selectedNodeId
          })
        );
        break;
      case 'update':
        this.store.dispatch(
          AddLogicActions.updateQuestionLogic({
            questionId,
            pageIndex,
            logic: event.logic,
            subFormId: this.selectedNodeId
          })
        );
        break;
      case 'delete':
        this.store.dispatch(
          AddLogicActions.deleteQuestionLogic({
            questionId,
            pageIndex,
            logicId: event.logicId,
            subFormId: this.selectedNodeId
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
          enableHistory: false,
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
            question: newQuestion,
            subFormId: this.selectedNodeId
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
        this.operatorRoundsService
          .createDataSet$(createDataset)
          .subscribe((response) => {
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
        this.operatorRoundsService
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

  instructionsFileUploadHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const allowedFileTypes: String[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    Array.from(target.files).forEach((file) => {
      const originalValue = this.questionForm.get('value').value;
      if (allowedFileTypes.indexOf(file.type) === -1) {
        this.toast.show({
          text: 'Invalid file type, only JPG/JPEG/PNG/PDF accepted.',
          type: 'warning'
        });
        return;
      }

      if (file.type === 'application/pdf') {
        if (originalValue.pdf === null) {
          this.sendFileToS3(file, {
            originalValue,
            isImage: false
          });
        } else {
          this.toast.show({
            text: 'Only 1 PDF can be attached to an instruction.',
            type: 'warning'
          });
        }
      } else {
        const index = originalValue.images.findIndex((image) => image === null);
        if (index !== -1) {
          this.sendFileToS3(file, {
            originalValue,
            isImage: true,
            index
          });
        } else {
          this.toast.show({
            text: 'Only upto 3 images can be attached to an instruction.',
            type: 'warning'
          });
        }
      }
    });
  };

  sendFileToS3(file, params): void {
    const { originalValue, isImage, index } = params;
    this.formService
      .uploadToS3$(`${this.moduleName}/${this.formMetadata?.id}`, file)
      .subscribe((event) => {
        const value: InstructionsFile = {
          name: file.name,
          size: file.size,
          objectKey: event.message.objectKey,
          objectURL: event.message.objectURL
        };
        if (isImage) {
          originalValue.images[index] = value;
        } else {
          originalValue.pdf = value;
        }
        this.instructionsUpdateValue();
        this.questionForm.get('value').setValue(originalValue);
      });
  }

  handleEditorFocus(focus: boolean) {
    if (!focus && this.isINSTFieldChanged) {
      this.instructionsUpdateValue();
      this.isINSTFieldChanged = false;
    }
  }

  instructionsUpdateValue() {
    this.questionEvent.emit({
      pageIndex: this.pageIndex,
      sectionId: this.sectionId,
      question: this.questionForm.value,
      questionIndex: this.questionIndex,
      type: 'update'
    });
  }

  updateInstructionTag(event: string) {
    const originalValue = this.questionForm.get('value').value;
    originalValue.tag = {
      title: event,
      colour: this.instructionTagColours[event]
    };
    this.questionForm.get('value').setValue(originalValue);
    this.instructionsUpdateValue();
  }

  stripHTMLTags(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  instructionsFileDeleteHandler(index: number) {
    const originalValue = this.questionForm.get('value').value;
    if (index < 3) {
      this.formService.deleteFromS3(originalValue.images[index].objectKey);
      originalValue.images[index] = null;
      originalValue.images = this.imagesArrayRemoveNullGaps(
        originalValue.images
      );
    } else {
      this.formService.deleteFromS3(originalValue.pdf.objectKey);
      originalValue.pdf = null;
    }
    this.questionForm.get('value').setValue(originalValue);
    this.instructionsUpdateValue();
  }

  imagesArrayRemoveNullGaps(images) {
    const nonNullImages = images.filter((image) => image !== null);
    return nonNullImages.concat(Array(3 - nonNullImages.length).fill(null));
  }
}
