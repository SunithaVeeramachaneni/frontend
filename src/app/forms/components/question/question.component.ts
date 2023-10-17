/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  Observable,
  Subject,
  asapScheduler,
  combineLatest,
  forkJoin,
  of,
  timer
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { fieldTypesMock } from '../response-type/response-types.mock';
import {
  QuestionEvent,
  Question,
  NumberRangeMetadata,
  FormMetadata,
  InstructionsFile,
  UnitOfMeasurement,
  AdditionalDetails
} from 'src/app/interfaces';
import {
  State,
  getFormMetadata,
  getModuleName,
  selectQuestionInstuctionsMediaMap
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Store } from '@ngrx/store';
import { FormService } from '../../services/form.service';
import { cloneDeep, isEqual } from 'lodash-es';
import { BuilderConfigurationActions } from '../../state/actions';
import { AddLogicActions } from '../../state/actions';
import { MatMenuTrigger } from '@angular/material/menu';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { ToastService } from 'src/app/shared/toast';
import { TranslateService } from '@ngx-translate/core';
import { getUnitOfMeasurementList } from '../../state';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { MatDialog } from '@angular/material/dialog';
import { Base64HelperService } from 'src/app/components/work-instructions/services/base64-helper.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  fileUploadSizeToastMessage,
  operatorRounds
} from 'src/app/app.constants';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PDFDocument } from 'pdf-lib';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit, OnDestroy {
  @ViewChild('unitMenuTrigger') unitMenuTrigger: MatMenuTrigger;
  @ViewChild('name', { static: false }) name: ElementRef;
  @Output() questionEvent: EventEmitter<QuestionEvent> =
    new EventEmitter<QuestionEvent>();
  @ViewChild('insertImage') private insertImage: ElementRef;

  @Input() selectedNodeId: any;
  @Input() isTemplate: boolean;
  @Input() isImported: boolean;
  @Input() tagDetailType: string;
  @Input() attributeDetailType: string;
  base64result: string;

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

  @Input() set questionName(questionName: string) {
    this._questionName = questionName;
  }

  get questionName() {
    return this._questionName;
  }

  @Input() set subFormId(subFormId: string) {
    this._subFormId = subFormId;
  }

  get subFormId() {
    return this._subFormId;
  }

  @Input() set isQuestionPublished(value: boolean) {
    this._isQuestionPublished = value;
  }

  get isQuestionPublished() {
    return this._isQuestionPublished;
  }

  @Input() isPreviewActive;
  @Input() isEmbeddedForm;

  @Input() isAskQuestionFocusId: any;
  @Input() set question(question: Question) {
    if (question) {
      if (
        this.question?.isOpen !== question.isOpen &&
        !isEqual(this.question, question)
      ) {
        this._question = Object.assign({}, question);
        this.updateQuestion();
      }
    }
  }

  get question() {
    return this._question;
  }
  @Input() set logics(logics: any) {
    if (!isEqual(this.logics, logics)) {
      this._logics = logics;
    }
  }
  get logics() {
    return this._logics;
  }
  @Output() isAskedQuestionFocusId = new EventEmitter<any>();

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  formMetadata: FormMetadata;
  moduleName: string;
  operatorRounds: string = operatorRounds;
  showAskQuestionFeatures = true;

  get rangeDisplayText() {
    return this._rangeDisplayText;
  }

  set rangeDisplayText(d) {
    const rangeMeta = this.questionForm.get('rangeMetadata').value;
    if (rangeMeta && rangeMeta.min && rangeMeta.max) {
      this._rangeDisplayText = `${rangeMeta.min} - ${rangeMeta.max}`;
    }
  }

  private _rangeDisplayText = 'None';

  get additionalDetailsText() {
    return this._additionalDetailsText;
  }

  set additionalDetailsText(d) {
    const additionalDetails = this.questionForm.get('additionalDetails').value;
    if (
      !additionalDetails.tags?.length &&
      !additionalDetails.attributes?.length
    ) {
      this._additionalDetailsText = 'None';
    } else {
      this._additionalDetailsText = 'Show';
    }
  }

  private _additionalDetailsText = 'None';

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
    'INST',
    'DF',
    'TIF'
  ];

  unitOfMeasurementsAvailable: any[] = [];
  unitOfMeasurements = [];
  fetchUnitOfMeasurement: Observable<any>;
  instructionsMedia = {
    images: [],
    pdf: null
  };

  questionForm: FormGroup = this.fb.group({
    id: '',
    sectionId: '',
    name: '',
    fieldType: 'TF',
    position: '',
    required: false,
    enableHistory: false,
    historyCount: [5, [Validators.required, Validators.min(0)]],
    multi: false,
    value: 'TF',
    isPublished: false,
    isPublishedTillSave: false,
    isOpen: false,
    isResponseTypeModalOpen: false,
    unitOfMeasurement: 'None',
    rangeMetadata: {} as NumberRangeMetadata,
    additionalDetails: {} as AdditionalDetails,
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: ''
  });
  question$: Observable<Question>;
  ignoreUpdateIsOpen: boolean;
  addQuestionClicked: boolean;
  isHyperLinkOpen = false;
  formId: string;
  isINSTFieldChanged = false;
  instructionTagColours = {};
  instructionTagTextColour = {};
  formMetadata$: Observable<FormMetadata>;
  moduleName$: Observable<string>;
  instructionMediaMap$: Observable<any>;
  uom$: Observable<UnitOfMeasurement[]>;
  embeddedFormId = '';

  private _pageIndex: number;
  private _id: string;
  private _sectionId: string;
  private _questionIndex: number;
  private _isAskQuestion: boolean;
  private _questionName: string;
  private _subFormId: string;
  private _question: Question;
  private onDestroy$ = new Subject();
  private _isQuestionPublished: boolean;
  private _logics: any = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private imageUtils: ImageUtils,
    private store: Store<State>,
    private formService: FormService,
    private responseSetService: ResponseSetService,
    private toast: ToastService,
    private translate: TranslateService,
    private rdfService: RaceDynamicFormService,
    private operatorRoundsService: OperatorRoundsService,
    private readonly commonService: CommonService,
    private imageCompress: NgxImageCompressService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((event) => {
        this.formId = event.id;
        this.formMetadata = event;
        this.embeddedFormId = event?.embeddedFormId;
      })
    );
    this.moduleName$ = this.store.select(getModuleName).pipe(
      tap((event) => {
        this.moduleName = event;
        this.setQuestionInstructionMediaMap();
      })
    );

    this.uom$ = this.store.select(getUnitOfMeasurementList).pipe(
      tap((unitOfMeasurements) => {
        this.unitOfMeasurements = unitOfMeasurements.filter(
          (value, index, array) =>
            index ===
              array.findIndex(
                (item) => item.description === value.description
              ) && value.isActive === true
        );
        this.unitOfMeasurementsAvailable = [...this.unitOfMeasurements];
      })
    );

    this.fieldTypes = fieldTypesMock.fieldTypes.filter(
      (fieldType) =>
        fieldType.type !== 'LTV' &&
        fieldType.type !== 'DD' &&
        fieldType.type !== 'DDM' &&
        fieldType.type !== 'VI' &&
        fieldType.type !== 'ARD' &&
        fieldType.type !== 'TAF' &&
        (this.isEmbeddedForm
          ? fieldType.type !== 'DT'
          : fieldType.type !== 'DF' &&
            fieldType.type !== 'TIF' &&
            fieldType.type !== 'IMG' &&
            fieldType.type !== 'USR')
    );

    // isAskQuestion true set question id and section id
    if (this.isAskQuestion) {
      this.questionForm.get('id').setValue(this.questionId);
      this.questionForm.get('sectionId').setValue(this.sectionId);
      this.questionForm.get('name').setValue(this.questionName);
      this.questionForm.get('isPublished').setValue(this.isQuestionPublished);
      this.selectedNodeId = this.subFormId;
    }

    this.questionForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        pairwise(),
        tap(([previous, current]) => {
          const { isOpen, isResponseTypeModalOpen, ...prev } = previous;
          const {
            isOpen: currIsOpen,
            isResponseTypeModalOpen: currIsResponseTypeModalOpen,
            ...curr
          } = current;
          if (current.historyCount === null || current.historyCount < 0) {
            this.questionForm.get('historyCount').setValue(0);
          }
          if (!isEqual(prev, curr)) {
            const { value: prevValue } = prev;
            const { value: currValue } = curr;
            this.checkAskQuestionFeatures();
            if (
              current.fieldType === 'INST' &&
              !isEqual(prevValue, currValue)
            ) {
              this.isINSTFieldChanged = true;
            } else {
              // Commented as part of SA-647. Refcount implementations needs to be fixed

              /*if (
                currValue?.type === 'globalResponse' ||
                prevValue?.type === 'globalResponse'
              )
                this.handleGlobalResponseRefCount(prevValue, currValue); */

              if (!isEqual(prev.rangeMetadata, curr.rangeMetadata))
                this.rangeDisplayText = '';
              if (!isEqual(prev.additionalDetails, curr.additionalDetails))
                this.additionalDetailsText = '';

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

    this.instructionTagColours[this.translate.instant('cautionTag')] =
      '#FFCC00';
    this.instructionTagColours[this.translate.instant('informationTag')] =
      '#CAE4FB';
    this.instructionTagColours[this.translate.instant('dangerTag')] = '#FF3B30';
    this.instructionTagTextColour[this.translate.instant('cautionTag')] =
      '#000000';
    this.instructionTagTextColour[this.translate.instant('informationTag')] =
      '#000000';
    this.instructionTagTextColour[this.translate.instant('dangerTag')] =
      '#FFFFFF';
    this.store
      .select(
        selectQuestionInstuctionsMediaMap(
          this.selectedNodeId,
          this.questionId,
          this.pageIndex
        )
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((map) => {
        if (map && Object.keys(map?.instructionsMedia).length > 0)
          this.instructionsMedia = map.instructionsMedia;
        else
          this.instructionsMedia = {
            images: [null, null, null],
            pdf: {
              id: null,
              data: {
                fileInfo: null,
                attachment: null
              }
            }
          };
      });
  }

  setQuestionInstructionMediaMap() {
    let instructionsMedia = {
      images: [null, null, null],
      pdf: {
        id: null,
        data: {
          fileInfo: null,
          attachment: null
        }
      }
    };
    if (this.question.fieldType === 'INST') {
      const { images, pdf } = this.question.value;
      const imageObservables = images.map((image) => {
        const getAttachmentsById$ =
          this.moduleName === 'RDF'
            ? this.rdfService.getAttachmentsById$(image)
            : this.operatorRoundsService.getAttachmentsById$(image);
        return getAttachmentsById$.pipe(
          map((data) => ({
            id: image,
            data: data?.attachment
              ? `data:image/jpeg;base64,${data?.attachment}`
              : null
          }))
        );
      });
      const getAttachmentsById$ =
        this.moduleName === 'RDF'
          ? this.rdfService.getAttachmentsById$(pdf)
          : this.operatorRoundsService.getAttachmentsById$(pdf);
      const pdfObservable = getAttachmentsById$.pipe(
        map((data) => ({
          id: pdf,
          data: {
            fileInfo: data?.fileInfo ? JSON.parse(data.fileInfo) : null,
            attachment: data?.attachment
              ? `data:application/pdf;base64,${data?.attachment}`
              : null
          }
        }))
      );

      forkJoin([...imageObservables, pdfObservable])
        .pipe(
          switchMap((results) => {
            // Process the results here
            return of(results);
          })
        )
        .subscribe((data) => {
          const imageArray = [];
          let pdf = null;
          data.forEach((element: any) => {
            if (typeof element.data === 'string' || element.data === null) {
              imageArray.push(element);
            } else {
              pdf = element;
            }
          });
          instructionsMedia = {
            ...instructionsMedia,
            images: imageArray,
            pdf
          };
          this.store.dispatch(
            BuilderConfigurationActions.addInstructionMediaMap({
              subFormId: this.selectedNodeId,
              questionId: this.questionId,
              pageIndex: this.pageIndex,
              instructionsMedia
            })
          );
        });
    }
  }

  updateQuestion() {
    if (this.question.isOpen) {
      if (this.question.fieldType !== 'INST') {
        timer(0, asapScheduler).subscribe(() =>
          this.name.nativeElement.focus()
        );
      }
    } else if (!this.question.isOpen) {
      if (this.isAskQuestion) {
        if (this.question.fieldType !== 'INST') {
          timer(0).subscribe(() => {
            if (
              this.name.nativeElement.id === this.isAskQuestionFocusId ||
              this.isAskQuestionFocusId === ''
            ) {
              this.name.nativeElement.focus();
              this.isAskQuestionFocusId = this.name.nativeElement.id;
              this.isAskedQuestionFocusId.emit(this.name.nativeElement.id);
            }
          });
        }
      } else {
        if (this.question.fieldType !== 'INST') {
          timer(0).subscribe(() => this.name.nativeElement.blur());
        }
      }
    }
    // this.question = question;
    this.questionForm.patchValue(this.question, {
      emitEvent: false
    });
    this.checkAskQuestionFeatures();
    this.rangeDisplayText = '';
    this.additionalDetailsText = '';
  }

  getRangeMetadata() {
    return this.questionForm.get('rangeMetadata').value;
  }

  uomChanged(event) {
    this.questionForm.get('unitOfMeasurement').setValue(event.symbol);
    this.unitMenuTrigger.closeMenu();
  }

  handleMatMenu() {
    this.unitOfMeasurementsAvailable = [...this.unitOfMeasurements];
  }

  onKey(event) {
    const value = event.target.value;
    const filter = value.toLowerCase();
    this.unitOfMeasurementsAvailable = [...this.unitOfMeasurements];
    this.unitOfMeasurementsAvailable = this.unitOfMeasurementsAvailable.filter(
      (option) =>
        option.description?.toLowerCase().startsWith(filter) ||
        option.code?.toLowerCase().startsWith(filter) ||
        option.symbol?.toLowerCase().startsWith(filter)
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

  checkAskQuestionFeatures() {
    const fieldType = this.questionForm.get('fieldType').value;
    if (this.isAskQuestion) {
      switch (fieldType) {
        case 'ATT':
          if (this.isAskQuestion) this.showAskQuestionFeatures = false;
          break;
        default:
          this.showAskQuestionFeatures = true;
      }
    } else {
      this.showAskQuestionFeatures = true;
    }
  }

  selectFieldTypeEventHandler(fieldType) {
    if (
      fieldType.type === this.questionForm.get('fieldType').value &&
      fieldType.type !== 'IMG'
    ) {
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
        this.insertImage.nativeElement.click();
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
    if (
      prev?.type === 'globalResponse' &&
      curr?.type === 'globalResponse' &&
      prev.id !== curr.id
    ) {
      this.updateResponseSet(prev, 'deselected').subscribe();
      this.updateResponseSet(curr, 'selected').subscribe();
    } else if (prev?.type === 'globalResponse') {
      this.updateResponseSet(prev, 'deselected').subscribe();
    } else if (curr?.type === 'globalResponse') {
      this.updateResponseSet(curr, 'selected').subscribe();
    }
  };

  sliderOpen() {
    this.formService.setsliderOpenState({
      isOpen: true,
      questionId: this.questionForm.get('id').value,
      value: {
        value: 0,
        min: 0,
        max: 100,
        increment: 1
      }
    });
  }
  rangeSelectorOpen(question) {
    this.formService.setRangeSelectorOpenState({
      isOpen: true,
      questionId: question.id,
      rangeMetadata: question.rangeMetadata
    });
  }
  additionalDetailsOpen() {
    this.formService.setAdditionalDetailsOpenState({
      isOpen: true,
      questionId: this.questionForm.get('id').value,
      additionalDetails: this.questionForm.get('additionalDetails').value
    });
  }

  insertImageHandler(event) {
    const { files } = event.target as HTMLInputElement;
    const file = {
      name: files[0].name,
      size: (files[0].size / 1024).toFixed(2),
      type: files[0].type
    };

    this.formService
      .uploadToS3$(`${this.moduleName}/${this.formMetadata?.id}`, files[0])
      .subscribe(async (data) => {
        const value = {
          name: file.name,
          size: file.size,
          objectKey: data.message.objectKey,
          objectURL: data.message.objectURL
        };
        this.questionForm.get('value').setValue(value);
      });
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  updateResponseSet = (responseSet, actionType) =>
    this.responseSetService.updateResponseSet$({
      id: responseSet?.id,
      name: responseSet?.name,
      description: responseSet?.description,
      isMultiColumn: responseSet?.isMultiColumn,
      moduleName: responseSet?.moduleName,
      refCount: responseSet?.refCount + (actionType === 'deselected' ? -1 : 1),
      values: JSON.stringify(responseSet?.value),
      createdBy: responseSet?.createdBy
    });

  updateIsOpen(isOpen: boolean) {
    if (this.isAskQuestion) {
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
      askEvidence: '',
      raiseIssue: false,
      logicTitle: '',
      expression: '',
      raiseNotification: false,
      triggerInfo: '',
      triggerWhen: '',
      questions: [],
      evidenceQuestions: [],
      mandateQuestions: [],
      hideQuestions: [],
      hideSections: []
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
        let newQuestion = {
          id: `AQ_${uuidv4()}`,
          sectionId: `AQ_${event.logic.id}`,
          name: '',
          fieldType: 'TF',
          position: 0,
          required: false,
          enableHistory: false,
          historyCount: 5,
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
      case 'ask_evidence_create':
        newQuestion = {
          id: event.askEvidence,
          sectionId: `EVIDENCE_${event.logic.id}`,
          name: `Attach Evidence for ${event.questionName}`,
          fieldType: 'ATT',
          position: 0,
          required: true,
          enableHistory: false,
          historyCount: 5,
          multi: false,
          value: 'ATT',
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

  uploadAttachmentsForInstructions(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files);
    const reader = new FileReader();
    const allowedFileTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    if (files.length > 0 && files[0] instanceof File) {
      const file: File = files[0];
      if (allowedFileTypes.indexOf(file.type) === -1) {
        this.toast.show({
          text: 'Invalid file type, only JPG/JPEG/PNG/PDF accepted.',
          type: 'warning'
        });
        return;
      }

      const maxSize = 390000;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let originalValue = this.questionForm.get('value').value;
        this.base64result = reader?.result as string;
        if (this.base64result.includes('data:application/pdf;base64,')) {
          this.resizePdf(this.base64result)
            .then((compressedPdf) => {
              const onlybase64 = compressedPdf.split(',')[1];
              const resizedPdfSize = atob(onlybase64).length;
              const pdf = {
                fileInfo: { name: file.name, size: resizedPdfSize },
                attachment: onlybase64
              };
              const pdfObservable =
                this.moduleName === 'RDF'
                  ? this.rdfService.uploadAttachments$({ file: pdf })
                  : this.operatorRoundsService.uploadAttachments$({
                      file: pdf
                    });
              if (resizedPdfSize <= maxSize) {
                if (originalValue.pdf === null) {
                  pdfObservable
                    .pipe(
                      tap((response) => {
                        if (response) {
                          const responsenew =
                            this.moduleName === 'RDF'
                              ? response?.data?.createFormAttachments?.id
                              : response?.data?.createRoundPlanAttachments?.id;
                          this.instructionsMedia = {
                            ...this.instructionsMedia,
                            pdf: {
                              id: responsenew,
                              data: pdf
                            }
                          };
                          originalValue = cloneDeep({
                            ...originalValue,
                            pdf: responsenew
                          });
                          this.questionForm
                            .get('value')
                            .setValue(originalValue);
                          this.instructionsUpdateValue();
                          this.cdrf.detectChanges();
                        }
                      })
                    )
                    .subscribe();
                } else {
                  this.toast.show({
                    text: 'Only 1 PDF can be attached to an instruction.',
                    type: 'warning'
                  });
                }
              } else {
                this.toast.show({
                  type: 'warning',
                  text: fileUploadSizeToastMessage
                });
              }
            })
            .catch(() => {
              this.toast.show({
                type: 'warning',
                text: 'Error while uploading PDF'
              });
            });
        } else {
          this.resizeImage(this.base64result).then((compressedImage) => {
            const onlybase64 = compressedImage.split(',')[1];
            const resizedImageSize = atob(onlybase64).length;
            const image = {
              fileInfo: { name: file.name, size: resizedImageSize },
              attachment: onlybase64
            };
            if (resizedImageSize <= maxSize) {
              const imageObservable =
                this.moduleName === 'RDF'
                  ? this.rdfService.uploadAttachments$({ file: image })
                  : this.operatorRoundsService.uploadAttachments$({
                      file: image
                    });
              const index = originalValue.images.findIndex(
                (image) => image === null
              );
              if (index !== -1) {
                imageObservable
                  .pipe(
                    tap((response) => {
                      if (response) {
                        const responsenew =
                          this.moduleName === 'RDF'
                            ? response?.data?.createFormAttachments?.id
                            : response?.data?.createRoundPlanAttachments?.id;
                        const images = [...originalValue.images];
                        images[index] = responsenew;
                        originalValue = cloneDeep({
                          ...originalValue,
                          images
                        });
                        this.instructionsMedia = {
                          ...this.instructionsMedia,
                          images: [
                            ...this.instructionsMedia.images.slice(0, index),
                            {
                              id: responsenew,
                              data: compressedImage
                            },
                            ...this.instructionsMedia.images.slice(index + 1)
                          ]
                        };
                        this.questionForm.get('value').setValue(originalValue);
                        this.instructionsUpdateValue();
                        this.cdrf.detectChanges();
                      }
                    })
                  )
                  .subscribe();
              } else {
                this.toast.show({
                  text: 'Only upto 3 images can be attached to an instruction.',
                  type: 'warning'
                });
              }
            } else {
              this.toast.show({
                type: 'warning',
                text: fileUploadSizeToastMessage
              });
            }
          });
        }
      };
    }
  }

  async resizeImage(base64result: string): Promise<string> {
    const compressedImage = await this.imageCompress.compressFile(
      base64result,
      -1,
      100,
      800,
      600
    );
    return compressedImage;
  }

  async resizePdf(base64Pdf: string): Promise<string> {
    try {
      const base64Data = base64Pdf.split(',')[1];
      const binaryString = atob(base64Data);

      const encoder = new TextEncoder();
      const pdfBytes = encoder.encode(binaryString);

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const currentSize = pdfBytes.length / 1024;
      const desiredSize = 400 * 1024;
      if (currentSize <= desiredSize) {
        return base64Pdf;
      }

      const scalingFactor = Math.sqrt(desiredSize / currentSize);
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setSize(width * scalingFactor, height * scalingFactor);
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const decoder = new TextDecoder();
      const base64ModifiedPdf = btoa(decoder.decode(modifiedPdfBytes));

      return base64ModifiedPdf;
    } catch (error) {
      throw error;
    }
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
      instructionsMedia: this.instructionsMedia,
      type: 'update'
    });
  }

  updateInstructionTag(event: string) {
    let originalValue = this.questionForm.get('value').value;
    originalValue = {
      ...originalValue,
      tag: {
        title: event,
        colour: this.instructionTagColours[event],
        textColour: this.instructionTagTextColour[event]
      }
    };
    this.questionForm.get('value').setValue(originalValue);
    this.instructionsUpdateValue();
  }

  stripHTMLTags(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  instructionsFileDeleteHandler(index: number, type: string, data: any = {}) {
    let originalValue = Object.assign({}, this.questionForm.get('value').value);
    const { id: attachmentId } = data;

    if (type === 'image') {
      let images = [...originalValue.images];
      images[index] = null;
      originalValue = {
        ...originalValue,
        images
      };

      const updatedMediaImages = this.instructionsMedia.images.filter(
        (image) => image?.id !== attachmentId
      );

      this.instructionsMedia = {
        ...this.instructionsMedia,
        images: updatedMediaImages
      };
      originalValue = cloneDeep({
        ...originalValue,
        images: this.imagesArrayRemoveNullGaps(originalValue.images)
      });
    } else {
      this.instructionsMedia = {
        ...this.instructionsMedia,
        pdf: {
          id: null,
          data: {
            fileInfo: null,
            attachment: null
          }
        }
      };
      originalValue = cloneDeep({
        ...originalValue,
        pdf: null
      });
    }
    this.questionForm.get('value').setValue(originalValue);
    this.instructionsUpdateValue();
    this.cdrf.detectChanges();
  }

  imagesArrayRemoveNullGaps(images) {
    const nonNullImages = images.filter((image) => image !== null);
    return nonNullImages.concat(Array(3 - nonNullImages.length).fill(null));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  openPreviewDialog() {
    const slideshowImages = [];
    this.instructionsMedia.images.forEach((image) => {
      if (image?.data) {
        slideshowImages.push(image.data);
      }
    });
    if (slideshowImages) {
      this.dialog.open(SlideshowComponent, {
        width: '100%',
        height: '100%',
        panelClass: 'slideshow-container',
        backdropClass: 'slideshow-backdrop',
        data: slideshowImages
      });
    }
  }
}
