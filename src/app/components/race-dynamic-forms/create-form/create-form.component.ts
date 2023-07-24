/* eslint-disable @typescript-eslint/naming-convention */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  from,
  timer,
  Observable,
  of,
  combineLatest
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  pairwise,
  switchMap,
  tap,
  toArray,
  map
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
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportQuestionsModalComponent } from '../import-questions-modal/import-questions-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast';
import { ErrorInfo, CreateUpdateResponse } from 'src/app/interfaces';
import { AddDependencyModalComponent } from '../add-dependency-modal/add-dependency-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from 'src/app/shared/error-handler/error-handler.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFormComponent implements OnInit, AfterViewInit {
  @ViewChild('name') private name: ElementRef;
  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;
  public createForm: FormGroup;
  public isMCQResponseOpen = false;
  quickResponsesData$: Observable<any>;
  globalResponsesData$: Observable<any>;
  globalDatasetsData$: Observable<any>;
  createEditQuickResponse$ = new BehaviorSubject<CreateUpdateResponse>({
    type: 'create',
    response: {}
  });
  createEditGlobalResponse$ = new BehaviorSubject<CreateUpdateResponse>({
    type: 'create',
    response: {}
  });
  createGlobalDataset$ = new BehaviorSubject<CreateUpdateResponse>({
    type: 'create',
    response: {}
  });
  createForm$: BehaviorSubject<any> = new BehaviorSubject({});
  createEditQuickResponse = true;
  createEditGlobalResponse = true;
  createGlobalDataset = true;
  public openAppSider$: Observable<any>;
  public activeResponses$: Observable<any>;
  public quickCommonResponse$: Observable<any>;
  public activeResponseId: string;
  public formId: string;
  defaultFormHeader = 'Untitled Form';
  saveProgress = 'Save in progress...';
  changesSaved = 'All changes saved';
  publishingChanges = 'Publishing changes...';
  changesPublished = 'All changes published';
  public isOpenState = {};
  isSectionNameEditMode = true;
  activeResponseType: string;
  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];
  tableFilteredFieldTypes: any = [this.fieldType];
  createInProgress = false;
  publishInProgress = false;
  disableFormFields = true;
  currentQuestion: any;
  status$ = new BehaviorSubject<string>('');
  isCustomizerOpen = false;
  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };
  popOverOpenState = {};
  fieldContentOpenState = {};
  richTextEditorToolbarState = {};
  sectionActiveState = {};
  isLLFFieldChanged = false;
  sections: any;
  selectedFormData: any;
  allChecked = [];
  subChecked = [];
  showFilterSection = {};
  filterRequiredInfo;
  addLogicIgnoredFields = [
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
    'TAF'
  ];
  showTableResponseType = {};
  tableRowSelectState = {};
  children = {};
  globalDatasetQuestions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private rdfService: RdfService,
    private breadcrumbService: BreadcrumbService,
    private headerService: HeaderService,
    private cdrf: ChangeDetectorRef,
    private imageUtils: ImageUtils,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private toaster: ToastService,
    private spinner: NgxSpinnerService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      counter: [1],
      sections: this.fb.array([this.initSection(1, 1, 1)]),
      isPublished: [false],
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
              fieldType.type !== 'DDM' &&
              fieldType.type !== 'VI'
          );
          this.tableFilteredFieldTypes = fieldTypes.filter(
            (fieldType) =>
              fieldType.type !== 'DD' &&
              fieldType.type !== 'DDM' &&
              fieldType.type !== 'VI' &&
              fieldType.type !== 'TAF' &&
              fieldType.type !== 'ARD' &&
              fieldType.type !== 'USR'
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
          this.setHeaderTitle(displayName);
          const form = this.createForm.getRawValue();
          form.sections.forEach((section) => {
            section.questions.forEach((question) => {
              question.isPublishedTillSave = false;
              question.table.forEach((row) => {
                row.isPublishedTillSave = false;
              });
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
      .get('description')
      .valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        filter(() => this.createForm.get('id').value),
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
          let isPublishedTillSave = this.createForm.get(
            'isPublishedTillSave'
          ).value;
          curr.forEach(({ questions: cq, ...currSection }, i) => {
            const { questions: pq, ...prevSection } = prev[i];
            if (isEqual(currSection, prevSection)) {
              cq.forEach((q, j) => {
                if (!isEqual(q, pq[j])) {
                  this.isLLFFieldChanged = false;
                  q.isPublishedTillSave = false;
                  q.table.forEach((row) => {
                    row.isPublishedTillSave = false;
                  });
                  isPublishedTillSave = false;
                  if (q.fieldType === 'LLF') {
                    this.sections = curr;
                    this.isLLFFieldChanged = true;
                  }
                }
              });
            } else {
              cq.forEach((q) => {
                q.isPublishedTillSave = false;
                q.table.forEach((row) => {
                  row.isPublishedTillSave = false;
                });
                isPublishedTillSave = false;
              });
            }
          });
          if (!this.isLLFFieldChanged) {
            this.createForm.patchValue(
              { sections: curr, isPublishedTillSave },
              { emitEvent: false }
            );
            this.rdfService.setCurrentFormValue(this.createForm.getRawValue());
          }
        }),
        switchMap(() => this.saveForm())
      )
      .subscribe();

    this.createForm.valueChanges.subscribe(() =>
      this.createForm$.next(this.createForm.getRawValue())
    );

    const headerTitle = this.createForm.get('name').value
      ? this.createForm.get('name').value
      : this.defaultFormHeader;
    this.setHeaderTitle(headerTitle);

    this.route.params.subscribe(({ id }) => {
      if (id === undefined) {
        this.createForm.disable({ emitEvent: false });
        this.createForm.get('name').enable({ emitEvent: false });
        this.createForm.get('name').setValue(this.defaultFormHeader);
      }
      this.formId = id;
    });

    this.route.data.subscribe(({ form }) => {
      if (form && Object.keys(form).length) {
        this.createForm.patchValue(form, { emitEvent: false });
        const { name: formName, sections } = form;
        this.formId = form.id;
        this.setHeaderTitle(formName);

        (this.createForm.get('sections') as FormArray).removeAt(0);

        sections.forEach((section, index) => {
          const { uid, name, position, questions } = section;
          const sc = index + 1;
          if (!this.isOpenState[sc]) this.isOpenState[sc] = true;
          if (!this.sectionActiveState[sc]) this.sectionActiveState[sc] = false;
          if (!this.fieldContentOpenState[sc])
            this.fieldContentOpenState[sc] = {};
          if (!this.popOverOpenState[sc]) this.popOverOpenState[sc] = {};
          if (!this.showTableResponseType[sc])
            this.showTableResponseType[sc] = {};
          if (!this.tableRowSelectState[sc]) this.tableRowSelectState[sc] = {};
          if (!this.showFilterSection[sc]) this.showFilterSection[sc] = {};
          if (!this.richTextEditorToolbarState[sc])
            this.richTextEditorToolbarState[sc] = {};

          const questionsFormBuilderArray = questions.map(
            (question, qindex) => {
              const {
                id,
                fieldType,
                name: qname,
                position: qposition,
                required,
                multi,
                value,
                isPublished,
                isPublishedTillSave,
                logics,
                table
              } = question;

              const qc = qindex + 1;
              if (!this.fieldContentOpenState[sc][qc])
                this.fieldContentOpenState[sc][qc] = false;
              if (!this.popOverOpenState[sc][qc])
                this.popOverOpenState[sc][qc] = false;
              if (!this.showTableResponseType[sc][qc])
                this.showTableResponseType[sc][qc] = {};
              if (!this.tableRowSelectState[sc][qc])
                this.tableRowSelectState[sc][qc] = {};
              if (!this.showFilterSection[sc][qc])
                this.showFilterSection[sc][qc] = false;
              if (!this.richTextEditorToolbarState[sc][qc])
                this.richTextEditorToolbarState[sc][qc] = false;

              let tableFormBuilderArray = [];
              if (table && table.length) {
                tableFormBuilderArray = table.map((row, tIndex) => {
                  const tc = tIndex + 1;
                  if (!this.showTableResponseType[sc][qc][tc])
                    this.showTableResponseType[sc][qc][tc] = false;
                  if (!this.tableRowSelectState[sc][qc][tc])
                    this.tableRowSelectState[sc][qc][tc] = false;
                  return this.fb.group({
                    id: row.id,
                    name: row.name,
                    fieldType: row.fieldType,
                    value: row.value,
                    readOnly: row.readOnly,
                    isPublished: row.isPublished,
                    isPublishedTillSave: row.isPublishedTillSave
                  });
                });
              }

              let logicsFormArray = [];
              if (logics && logics.length) {
                logicsFormArray = logics.map((logic) => {
                  const mandateQuestions = logic.mandateQuestions;
                  const hideQuestions = logic.hideQuestions;
                  const askQuestions = logic.questions;
                  let mandateQuestionsFormArray = [];
                  let askQuestionsFormArray = [];

                  if (mandateQuestions && mandateQuestions.length) {
                    mandateQuestionsFormArray = mandateQuestions.map((mq) =>
                      this.fb.control(mq)
                    );
                  }

                  let hideQuestionsFormArray = [];
                  if (hideQuestions && hideQuestions.length) {
                    hideQuestionsFormArray = hideQuestions.map((mq) =>
                      this.fb.control(mq)
                    );
                  }

                  if (askQuestions && askQuestions.length) {
                    askQuestionsFormArray = askQuestions.map((askQuestion) =>
                      this.fb.group({
                        id: askQuestion.id,
                        name: askQuestion.name,
                        fieldType: askQuestion.fieldType,
                        position: askQuestion.position,
                        required: askQuestion.required,
                        multi: askQuestion.multi,
                        value: askQuestion.value,
                        isPublished: askQuestion.isPublished,
                        isPublishedTillSave: askQuestion.isPublishedTillSave,
                        logics: this.fb.array([]) //this.fb.array([])
                      })
                    );
                  }

                  return this.fb.group({
                    operator: logic.operator || '',
                    operand1: logic.operand1 || '',
                    operand2: logic.operand2 || '',
                    action: logic.action || '',
                    logicTitle: logic.logicTitle || 'blank',
                    expression: logic.expression || '',
                    questions: this.fb.array(askQuestionsFormArray),
                    mandateQuestions: this.fb.array(mandateQuestionsFormArray),
                    hideQuestions: this.fb.array(hideQuestionsFormArray),
                    validationMessage: logic.validationMessage || '',
                    askEvidence: logic.askEvidence || '',
                    raiseNotification: logic?.raiseNotification || false,
                    triggerInfo: logic?.triggerInfo || '',
                    triggerWhen: logic?.triggerWhen || ''
                  });
                });
              }

              return this.fb.group({
                id,
                name: qname,
                fieldType,
                position: qposition,
                required,
                multi,
                value,
                isPublished,
                isPublishedTillSave,
                logics: this.fb.array(logicsFormArray), //this.fb.array([])
                table: this.fb.array(tableFormBuilderArray)
              });
            }
          );

          (this.createForm.get('sections') as FormArray).push(
            this.fb.group({
              uid,
              name: [{ value: name, disabled: true }],
              position,
              questions: this.fb.array(questionsFormBuilderArray)
            })
          );
        });

        this.disableFormFields = false;
      }
    });
    this.sectionActiveState[1] = true;

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

    this.globalDatasetsData$ = combineLatest([
      of({ data: [] }),
      this.rdfService.getResponses$('globalDataset'),
      this.createGlobalDataset$
    ]).pipe(
      map(([initial, responses, { type, response, responseType }]) => {
        if (
          !this.createGlobalDataset ||
          (responseType !== 'globalDataset' && responseType !== undefined)
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
          this.createGlobalDataset = false;
          return initial;
        } else {
          if (initial.data.length === 0) {
            const globalResp = responses.map((resp) => ({
              id: resp.id,
              name: resp.name,
              values: resp.values,
              fileName: resp.fileName
            }));
            initial.data = initial.data.concat(globalResp);
          }
          this.createGlobalDataset = false;
          return initial;
        }
      })
    );

    this.globalDatasetsData$.subscribe();
  }

  getTableData(form) {
    return form.controls.table.controls;
  }

  initTable = (sc, qc, tc, tableId, table = {} as any) => {
    if (!this.showTableResponseType[sc][qc][tc])
      this.showTableResponseType[sc][qc][tc] = false;
    if (!this.tableRowSelectState[sc][qc][tc])
      this.tableRowSelectState[sc][qc][tc] = false;

    const {
      name = '',
      fieldType = 'TF',
      value = 'TF',
      readOnly = false
    } = table;

    return this.fb.group({
      id: tableId,
      name,
      fieldType,
      value,
      readOnly,
      isPublished: [false],
      isPublishedTillSave: [false]
    });
  };

  addTableRows(i, j) {
    const control = (
      (this.createForm.get('sections') as FormArray).controls[i].get(
        'questions'
      ) as FormArray
    ).controls[j].get('table') as FormArray;
    control.push(
      this.initTable(i + 1, j + 1, control.length + 1, `T${this.getCounter()}`)
    );
  }

  setHeaderTitle(title) {
    this.headerService.setHeaderTitle(title);
    this.breadcrumbService.set('@formName', {
      label: title
    });
  }

  handleEditorFocus(focus: boolean, i, j) {
    if (!focus && this.isLLFFieldChanged) {
      this.createForm.patchValue({
        sections: this.sections,
        isPublishedTillSave: false
      });
      this.isLLFFieldChanged = false;
    }
    this.richTextEditorToolbarState[i + 1][j + 1] = focus;
  }

  handleFieldType = (question: any, response: any) => {
    const fieldType = response.values.length > 4 ? 'DD' : 'VI';
    question.get('fieldType').setValue(fieldType);
    question.get('value').setValue(response);
    this.cdrf.detectChanges();
  };

  handleGlobalDatasetFieldType = (
    question: any,
    response: any,
    responseType: string
  ) => {
    const { id, fileName } = response;
    question.get('fieldType').setValue('DD');
    question.get('logics').setControl(this.fb.array([]));
    question
      .get('value')
      .setValue({ id, responseType, fileName, globalDataset: true });
  };

  handleGlobalDatasetRowFieldType = (
    table: any,
    response: any,
    responseType: string
  ) => {
    const { id, fileName } = response;
    table.get('fieldType').setValue('DD');
    table
      .get('value')
      .setValue({ id, responseType, fileName, globalDataset: true });
  };

  handleResponses = (type: string, id: string) => {
    this.activeResponses$ =
      type === 'globalResponse'
        ? this.globalResponsesData$
        : type === 'globalDataset'
        ? this.globalDatasetsData$
        : this.quickResponsesData$;
    this.activeResponseType = type;
    this.activeResponseId = id;
  };

  ngAfterViewInit(): void {
    this.name.nativeElement.focus();
  }

  setFormTitle() {
    const formName = this.createForm.get('name').value;
    if (!formName)
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

  addSection(index: number, section: any = null, sectionName = null) {
    const control = this.createForm.get('sections') as FormArray;
    control.insert(
      index + 1,
      this.initSection(
        control.length + 1,
        1,
        this.getCounter(),
        section,
        sectionName
      )
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

  duplicateQuestion = (i, j, question) => {
    const control = (this.createForm.get('sections') as FormArray).controls[
      i
    ].get('questions') as FormArray;

    control.insert(j + 1, question);
  };

  deleteQuestion(i, j, question) {
    const control = (this.createForm.get('sections') as FormArray).controls[
      i
    ].get('questions') as FormArray;
    const questionsToBeDeleted = [];
    const evidenceQuestions = [];
    if (question.value.logics) {
      question.value.logics.forEach((logic) => {
        if (logic.action === 'ask_evidence') {
          questionsToBeDeleted.push(logic.askEvidence);
          evidenceQuestions.push(logic.askEvidence);
        } else if (logic.action === 'ask_questions') {
          logic.questions.forEach((aq) => {
            questionsToBeDeleted.push(aq.id);
          });
        }
      });
    }

    control.removeAt(j);
    if (evidenceQuestions.length) {
      const removeIndexes = [];
      control.value.forEach((q, index) => {
        if (evidenceQuestions.indexOf(q.id) > -1) {
          removeIndexes.push(index);
        }
      });
      if (removeIndexes.length) {
        removeIndexes.forEach((index) => {
          control.removeAt(index);
        });
      }
    }

    this.fieldContentOpenState[i + 1][j + 1] = false;
    if (
      question.value.fieldType === 'DD' &&
      question.value.value.globalDataset
    ) {
      this.updateDependentChildrenHierarchy();
    }
    if (question.value.isPublished) {
      this.rdfService
        .deleteAbapFormField$({
          FORMNAME: this.createForm.get('id').value,
          UNIQUEKEY: question.value.id
        })
        .subscribe();
    }
    if (questionsToBeDeleted.length) {
      questionsToBeDeleted.forEach((qId) => {
        this.rdfService
          .deleteAbapFormField$({
            FORMNAME: this.createForm.get('id').value,
            UNIQUEKEY: qId
          })
          .subscribe();
      });
    }
  }

  deleteSection(i, section) {
    const control = this.createForm.get('sections') as FormArray;
    control.removeAt(i);
    from(section.value.questions)
      .pipe(
        filter((question: any) => question.isPublished),
        mergeMap((question) =>
          this.rdfService.deleteAbapFormField$({
            FORMNAME: this.createForm.get('id').value,
            UNIQUEKEY: question.id
          })
        ),
        toArray()
      )
      .subscribe();
  }

  deleteTableRow(i, j, k, row, question) {
    const control = (
      (this.createForm.get('sections') as FormArray).controls[i].get(
        'questions'
      ) as FormArray
    ).controls[j].get('table') as FormArray;
    control.removeAt(k);
    this.tableRowSelectState[i + 1][j + 1][k + 1] = false;
    if (row.value.isPublished) {
      this.rdfService
        .deleteAbapFormField$({
          FORMNAME: `${
            this.createForm.get('id').value
          }TABULARFORM${question.value.id.slice(1)}`,
          UNIQUEKEY: row.value.id
        })
        .subscribe();
    }
  }

  onValueChanged(section: any, question: any, event: any) {
    const control = question.get('logics') as FormArray;
    control.patchValue(event);
    const sections = this.createForm.get('sections') as FormArray;
    let sectionIndex = 0;
    for (let i = 0; i < sections.value.length; i++) {
      if (sections.value[i].uid === section.value.uid) {
        sectionIndex = i;
      }
    }
    const sectionControl = sections.at(sectionIndex) as FormArray;
    const questions = sectionControl.get('questions') as FormArray;
    let questionIndex = 0;
    for (let j = 0; j < questions.value.length; j++) {
      if (questions.value[j].id === question.value.id) {
        questionIndex = j;
      }
    }
    const logics = questions.at(questionIndex).get('logics') as FormArray;
    logics.patchValue(event);
    this.createForm.patchValue({ sections: sections.getRawValue() });
    this.createForm.get('isPublishedTillSave').setValue(false);
  }

  onLogicDelete(section: any, question: any, event: any) {
    const sections = this.createForm.get('sections') as FormArray;
    let sectionIndex = 0;
    for (let i = 0; i < sections.value.length; i++) {
      if (sections.value[i].uid === section.value.uid) {
        sectionIndex = i;
      }
    }
    const sectionControl = sections.at(sectionIndex) as FormArray;
    const questions = sectionControl.get('questions') as FormArray;
    let questionIndex = 0;
    for (let j = 0; j < questions.value.length; j++) {
      if (questions.value[j].id === question.value.id) {
        questionIndex = j;
      }
    }
    const logics = questions.at(questionIndex).get('logics') as FormArray;
    logics.removeAt(event.index);
    this.createForm.patchValue({ sections: sections.getRawValue() });
  }

  onAskEvidence(
    section: any,
    question: any,
    questionIndex: number,
    event: any
  ) {
    const form = this.createForm.getRawValue();
    const index = form.sections.findIndex(
      (sec) => sec.uid === section.value.uid
    );
    if (index > -1) {
      const control = (this.createForm.get('sections') as FormArray).controls[
        index
      ].get('questions') as FormArray;
      control.insert(
        questionIndex + 1,
        this.addEvidenceQuestion(
          question,
          question.value.id,
          questionIndex + 1,
          event
        )
      );

      // const controlRaw = control.getRawValue();

      // controlRaw.forEach((q) => {
      //   if (q.position > questionIndex) {
      //     questionIndex = questionIndex + 1;
      //     q.position = questionIndex;
      //   }
      // });
      // controlRaw.sort((a, b) => (a.position > b.position ? 1 : -1));
      // control.patchValue(controlRaw);
    }
    this.createForm.get('isPublishedTillSave').setValue(false);
  }

  addLogicForQuestion(question: any, section: any, form: any) {
    if (question.controls.value.value?.responseType) {
      return;
    }
    question.hasLogic = true;
    const control = question.get('logics') as FormArray;
    const dropDownTypes = ['DD', 'VI', 'DDM'];
    let operand2Val = '';
    if (dropDownTypes.indexOf(question.value.fieldType) > -1) {
      operand2Val = question.value.value.values[0]?.title ?? '';
    }
    control.push(
      this.fb.group({
        operator: ['EQ'],
        operand1: [''],
        operand2: [operand2Val],
        action: [''],
        logicTitle: ['blank'],
        expression: [''],
        questions: this.fb.array([]),
        mandateQuestions: this.fb.array([]),
        hideQuestions: this.fb.array([]),
        validationMessage: [''],
        askEvidence: [''],
        raiseNotification: false,
        triggerInfo: [''],
        triggerWhen: ['']
      })
    );
    this.cdrf.detectChanges();
  }

  initQuestion = (
    sc: number,
    qc: number,
    uqc: number,
    question = {} as any
  ) => {
    if (!this.fieldContentOpenState[sc][qc])
      this.fieldContentOpenState[sc][qc] = false;
    if (!this.popOverOpenState[sc][qc]) this.popOverOpenState[sc][qc] = false;
    if (!this.showTableResponseType[sc][qc])
      this.showTableResponseType[sc][qc] = {};
    if (!this.tableRowSelectState[sc][qc])
      this.tableRowSelectState[sc][qc] = {};
    if (!this.showFilterSection[sc][qc]) this.showFilterSection[sc][qc] = false;
    if (!this.richTextEditorToolbarState[sc][qc])
      this.richTextEditorToolbarState[sc][qc] = false;

    const {
      name = '',
      fieldType = this.fieldType.type,
      position = '',
      required = false,
      multi = false,
      value = 'TF',
      table = []
    } = question;

    const tableFormBuilderArray = [];
    table.forEach((tab, index) => {
      tableFormBuilderArray.push(
        this.initTable(sc, qc, index + 1, `T${this.getCounter()}`, tab)
      );
    });

    return this.fb.group({
      id: [`Q${uqc}`],
      name,
      fieldType,
      position,
      required,
      multi,
      value,
      isPublished: [false],
      isPublishedTillSave: [false],
      logics: this.fb.array([]),
      table: this.fb.array(tableFormBuilderArray)
    });
  };

  addEvidenceQuestion = (
    question: any,
    questionId: string,
    questionIndex: number,
    event: any
  ) =>
    this.fb.group({
      id: [`${questionId}_${event.index}_EVIDENCE`],
      name: [`Attach Evidence for ${question.value.name}`],
      fieldType: ['ATT'],
      position: [questionIndex + 1],
      required: [false],
      multi: [false],
      value: ['ATT'],
      isPublished: [false],
      isPublishedTillSave: [false],
      logics: this.fb.array([]),
      table: this.fb.array([])
    });

  initSection = (
    sc: number,
    qc: number,
    uqc: number,
    section = null,
    sectionName = null
  ) => {
    if (!this.isOpenState[sc]) this.isOpenState[sc] = true;
    if (!this.sectionActiveState[sc]) this.sectionActiveState[sc] = false;
    if (!this.fieldContentOpenState[sc]) this.fieldContentOpenState[sc] = {};
    if (!this.popOverOpenState[sc]) this.popOverOpenState[sc] = {};
    if (!this.showTableResponseType[sc]) this.showTableResponseType[sc] = {};
    if (!this.tableRowSelectState[sc]) this.tableRowSelectState[sc] = {};
    if (!this.showFilterSection[sc]) this.showFilterSection[sc] = {};
    if (!this.richTextEditorToolbarState[sc])
      this.richTextEditorToolbarState[sc] = {};

    return this.fb.group({
      uid: [`uid${sc}`],
      name: [
        {
          value:
            section && sectionName === null
              ? `${section.get('name').value} Copy`
              : sectionName
              ? sectionName
              : `Section ${sc}`,
          disabled: true
        }
      ],
      position: [''],
      questions: section
        ? this.addQuestionsForCopySections(sc, section.value.questions)
        : this.fb.array([this.initQuestion(sc, qc, uqc)])
    });
  };

  addQuestionsForCopySections = (sc, questions) => {
    const questionsForm = this.fb.array([]);
    questions.forEach((q, index) => {
      const uqc = this.getCounter();
      questionsForm.push(this.initQuestion(sc, index + 1, uqc, q));
    });
    this.createForm.patchValue({ isPublishedTillSave: false });
    return questionsForm;
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
    this.resetTableRowSelectState();
  };

  toggleTableRowSelectState = (
    sectionIndex,
    questionIndex,
    tableIndex,
    event
  ) => {
    event.stopPropagation();
    this.resetTableRowSelectState();
    this.tableRowSelectState[sectionIndex + 1][questionIndex + 1][
      tableIndex + 1
    ] = true;
  };

  resetTableRowSelectState() {
    Object.keys(this.tableRowSelectState).forEach((sKey) => {
      Object.keys(this.tableRowSelectState[sKey]).forEach((qKey) => {
        this.tableRowSelectState[sKey][qKey] = {};
        Object.keys(this.tableRowSelectState[sKey][qKey]).forEach((tKey) => {
          this.tableRowSelectState[sKey][qKey][tKey] = false;
        });
      });
    });
  }

  togglePopOverOpenState = (sectionIndex, questionIndex) => {
    this.popOverOpenState[sectionIndex + 1][questionIndex + 1] =
      !this.popOverOpenState[sectionIndex + 1][questionIndex + 1];
  };

  hideShowFilterState = (sectionIndex, questionIndex) => {
    this.showFilterSection[sectionIndex + 1][questionIndex + 1] = false;
  };

  editSection(e) {
    e.get('name').enable();
  }

  publishForm() {
    const publishedCount = 0;
    const form = this.createForm.getRawValue();
    this.publishInProgress = true;
    this.status$.next(this.publishingChanges);
    let requestType: 'create' | 'update' = null;

    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.publishFormRequest(form, info, publishedCount, requestType).subscribe(
      () => {
        this.cdrf.markForCheck();
        requestType = null;
      },
      (err) => {
        const recordNotExist = 'Record not exist.';
        const recordAlreadyExist = 'Record Already Exist.';
        if (err?.error?.message === recordNotExist) {
          requestType = 'create';
        } else if (err?.error?.message === recordAlreadyExist) {
          requestType = 'update';
        } else {
          this.toaster.show({
            text: this.errorHandlerService.getErrorMessage(err),
            type: 'warning'
          });
        }
        if (requestType) {
          this.publishFormRequest(
            form,
            info,
            publishedCount,
            requestType
          ).subscribe();
        } else {
          this.createForm.patchValue({ isPublishedTillSave: false });
          this.disableFormFields = false;
          this.publishInProgress = false;
          this.status$.next(this.changesSaved);
        }
      }
    );
  }

  publishFormRequest(form, info, publishedCount, requestType) {
    return this.rdfService.publishForm$(form, info, requestType).pipe(
      tap((response) => {
        form.sections.forEach((section) => {
          section.questions.forEach((question) => {
            if (response.includes(question.id)) {
              publishedCount++;
              question.isPublished = true;
              question.isPublishedTillSave = true;
            }
            question.table.forEach((row) => {
              if (response.includes(question.id)) {
                publishedCount++;
                row.isPublished = true;
                row.isPublishedTillSave = true;
              }
            });
            question.logics.forEach((logic) => {
              logic.questions.forEach((que) => {
                if (response.includes(que.id)) {
                  publishedCount++;
                  que.isPublished = true;
                  que.isPublishedTillSave = true;
                }
              });
            });
          });
        });
        if (publishedCount === response.length) {
          form.isPublished = true;
          form.isPublishedTillSave = true;
          this.status$.next(this.changesPublished);
        }
        this.createForm.patchValue(form, { emitEvent: false });
        this.publishInProgress = false;
      }),
      switchMap(() => this.saveForm(true))
    );
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
      return this.rdfService.updateForm$({ ...form, id }).pipe(
        tap((updateForm) => {
          if (!ignoreStatus && Object.keys(updateForm).length) {
            this.status$.next(this.changesSaved);
            this.formId = updateForm.id;
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
          if (Object.keys(createdForm).length) {
            this.formId = createdForm.id;
            this.createForm.get('id').setValue(createdForm.id);
            this.createInProgress = false;
            this.createForm.enable({ emitEvent: false });
            this.disableFormFields = false;
            this.status$.next(this.changesSaved);
            this.router.navigate(['/rdf-forms/edit', createdForm.id]);
          }
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

  selectRowFieldType(fieldType, table) {
    if (fieldType.type === table.get('fieldType').value) {
      return;
    }

    table.get('fieldType').setValue(fieldType.type);
    table.get('value').setValue('');
    table.get('readOnly').setValue(false);
    switch (fieldType.type) {
      case 'TF':
        table.get('value').setValue('TF');
        break;
      case 'VI':
        this.isCustomizerOpen = true;
        table.get('value').setValue([]);
        break;
      case 'RT':
        this.isCustomizerOpen = true;
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        table.get('value').setValue(sliderValue);
        this.sliderOptions = sliderValue;
        break;
      case 'IMG':
        let index = 0;
        let found = false;
        this.createForm.get('sections').value.forEach((section) => {
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

  selectFieldType(fieldType, question, i, j) {
    question.get('logics').setControl(this.fb.array([]));
    if (
      fieldType.type === question.get('fieldType').value &&
      fieldType.type !== 'IMG'
    ) {
      return;
    }

    this.currentQuestion = question;

    if (fieldType.type !== 'IMG') {
      question.get('value').setValue('');
    }
    question.get('fieldType').setValue(fieldType.type);
    question.get('required').setValue(false);

    if (fieldType.type !== 'ARD' && fieldType.type !== 'TAF') {
      (question.get('table') as FormArray).clear();
    }
    // (question.get('table') as FormArray).clear();

    question.hasLogic = false;
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
        this.createForm.get('sections').value.forEach((section) => {
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
      case 'TAF':
      case 'ARD':
        this.addTableRows(i, j);
        break;
      default:
      // do nothing
    }
    this.cdrf.detectChanges();
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

  setSectionActiveState(sectionIndex) {
    Object.keys(this.sectionActiveState).forEach((key) => {
      this.sectionActiveState[key] = false;
    });
    this.sectionActiveState[sectionIndex + 1] = true;
  }

  handleMCQResponse(event: CreateUpdateResponse) {
    const { responseType, type, response } = event;
    if (responseType === 'quickResponse') {
      this.createEditQuickResponse = true;
      this.createEditQuickResponse$.next({ type, response, responseType });
    } else {
      this.createEditGlobalResponse = true;
      this.createEditGlobalResponse$.next({ type, response, responseType });
    }
    this.handleFieldType(this.currentQuestion, response);
    this.updateMcqAndGlobalResponses(response);
  }

  updateMcqAndGlobalResponses(value) {
    const { sections } = this.createForm.getRawValue();
    const fieldType = value.values.length > 4 ? 'DD' : 'VI';
    sections.forEach((section) => {
      const { questions } = section;
      questions.forEach((que) => {
        if (
          value.id === que.value.id &&
          (que.fieldType === 'VI' || que.fieldType === 'DD')
        ) {
          que.value = value;
          que.fieldType = fieldType;
        }
      });
    });

    this.createForm.patchValue({ sections });
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value ? value.length - 3 : -1;
  }

  importQuestions(): void {
    const dialogRef = this.dialog.open(ImportQuestionsModalComponent, {
      data: { selectedFormData: '', openImportQuestionsSlider: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedFormData = result.selectedFormData;
      this.selectedFormData?.sections.forEach((section) => {
        section.questions.forEach((question, index) => {
          if (question.id.includes('EVIDENCE')) {
            section.questions.splice(index, 1);
          }
        });
      });

      this.openAppSider$ = of(result.openImportQuestionsSlider);
      this.cdrf.markForCheck();
    });
  }

  cancelSlider() {
    this.openAppSider$ = of(false);
  }

  updateAllChecked(checked, question, section) {
    question.checked = checked;
    const countOfChecked = section.questions.filter(
      (per) => per.checked
    ).length;
    if (countOfChecked === 0 || countOfChecked !== section.questions.length)
      section.checked = false;
    if (countOfChecked === section.questions.length) section.checked = true;
  }

  setAllChecked(checked, section) {
    section.checked = checked;
    if (section.questions == null) {
      return;
    }
    section.questions.forEach((t) => (t.checked = checked));
  }

  fewComplete(section) {
    if (section.questions === null) {
      return false;
    }
    const checkedCount = section.questions.filter((p) => p.checked).length;

    return checkedCount > 0 && checkedCount !== section.questions.length;
  }

  useForm() {
    const newArray = [];
    this.selectedFormData.sections.forEach((section) => {
      if (section.checked === true) {
        newArray.push(section);
      }
      if (section.checked === false) {
        const newQuestion = [];
        section.questions.forEach((question) => {
          if (question.checked === true) {
            newQuestion.push(question);
          }
        });
        if (newQuestion.length) {
          const filteredSection = {
            name: section.name,
            questions: newQuestion
          };
          newArray.push(filteredSection);
        }
      }
    });
    newArray.forEach((section) => {
      const { name, questions } = section;
      const control = this.createForm.get('sections') as FormArray;
      this.addSection(control.length, null, name);
      const sc = control.length;
      const questionsControl = (
        this.createForm.get('sections') as FormArray
      ).controls[sc - 1].get('questions') as FormArray;
      questionsControl.removeAt(0);
      questions.forEach((question, index) => {
        questionsControl.insert(
          index,
          this.initQuestion(sc, index + 1, this.getCounter(), question)
        );
      });
    });
    this.createForm.patchValue({ isPublishedTillSave: false });
    this.openAppSider$ = of(false);
  }

  uploadGlobalResponses(event: any) {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: []
    };
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.spinner.show();
    this.rdfService
      .importExcelFile$(formData, 'forms/responses/upload', info)
      .subscribe((globalResponses) => {
        this.spinner.hide();
        if (globalResponses.length) {
          globalResponses.forEach((globalResponse) => {
            this.createEditGlobalResponse = true;
            this.createGlobalDataset = true;
            const { id, type, values, name, fileName } = globalResponse;
            if (type === 'globalResponse') {
              this.createEditGlobalResponse$.next({
                type: 'create',
                responseType: type,
                response: {
                  id,
                  values,
                  name
                }
              });
            } else {
              this.createGlobalDataset$.next({
                type: 'create',
                responseType: type,
                response: {
                  id,
                  values,
                  name,
                  fileName
                }
              });
            }
          });
          this.toaster.show({
            text: `Global responses uploaded successfully`,
            type: 'success'
          });
        }
      });
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  openAddFilter(sectionIndex: number, questionIndex: number, openOnFieldClick) {
    const questionsControl = this.getQuestions(
      this.getSections(this.createForm)[sectionIndex]
    );
    const selectedQuestion = questionsControl[questionIndex].value;
    if (openOnFieldClick && Object.keys(selectedQuestion.value).length === 4) {
      return;
    }
    this.showFilterSection[sectionIndex + 1][questionIndex + 1] = true;
  }

  handleFilterDetails(data: any) {
    const {
      dependsOn,
      children,
      location,
      latitudeColumn,
      longitudeColumn,
      radius,
      pins,
      autoSelectColumn,
      question
    } = data;
    question.get('value').setValue({
      ...question.value.value,
      dependsOn,
      children,
      location,
      latitudeColumn,
      longitudeColumn,
      radius,
      pins,
      autoSelectColumn
    });
    this.updateDependentChildrenHierarchy();
  }

  updateDependentChildrenHierarchy() {
    this.children = {};
    this.getGlobalDatasetQuestions();
    this.globalDatasetQuestions.forEach((ques) => {
      this.children[ques.value.id] = [];
      this.getChildrenHierarchy(ques, [ques.value.value.responseType]);
      ques.get('value').setValue({
        ...ques.value.value,
        children: this.children[ques.value.id]
      });
    });
  }

  getGlobalDatasetQuestions() {
    let allSectionQuestions = [];
    this.getSections(this.createForm).forEach((section) => {
      const { questions: que } = section.controls;
      allSectionQuestions = allSectionQuestions.concat(que.controls);
    });

    this.globalDatasetQuestions = allSectionQuestions.filter((question) => {
      const {
        value: { globalDataset },
        fieldType
      } = question.value;
      return fieldType === 'DD' && globalDataset;
    });
  }

  getChildrenHierarchy(question, responseTypes) {
    const {
      value: { id: currId },
      id: qid
    } = question.value;

    const directDependents = this.globalDatasetQuestions
      .map((ques) => {
        const {
          value: { dependsOn, responseType, id }
        } = ques.value;
        if (currId === id && responseTypes.includes(dependsOn)) {
          this.children[qid].push(responseType);
          return responseType;
        }
      })
      .filter((responseType) => responseType);

    if (directDependents.length) {
      this.getChildrenHierarchy(question, directDependents);
    }
  }

  openDependencyModal(sectionIndex: number, question: any) {
    const {
      value: { value },
      position: { value: position },
      id: { value: qid }
    } = question.controls;
    const { id } = value;
    const sectionsControl = this.getSections(this.createForm);
    let dialogRef;
    let globalDataset;
    this.globalDatasetsData$.subscribe(({ data }) => {
      globalDataset = data.find((dataset) => dataset.id === id);
      dialogRef = this.dialog.open(AddDependencyModalComponent, {
        data: {
          globalDataset,
          selectedQuestion: question.value,
          questions: sectionsControl[sectionIndex].controls.questions.value
        }
      });
    });
    dialogRef.afterClosed().subscribe((dependencies) => {
      if (dependencies) {
        const {
          location,
          latitudeColumn,
          longitudeColumn,
          radius,
          pins,
          questions
        } = dependencies;
        question.get('value').setValue({
          ...value,
          location,
          latitudeColumn,
          longitudeColumn,
          radius,
          pins
        });
        const questionsObj = questions.map((ques) => {
          const { name, responseType, dependentResponseType } = ques;
          return {
            fieldType: 'DD',
            position: '',
            required: false,
            multi: false,
            name,
            value: {
              id,
              name,
              responseType,
              dependentResponseType,
              parentDependencyQuestionId: qid
            }
          };
        });

        const questionsControl =
          sectionsControl[sectionIndex].controls.questions;
        questions.forEach((ques, index) => {
          questionsControl.insert(
            index,
            this.initQuestion(
              sectionIndex + 1,
              index + 1,
              this.getCounter(),
              ques
            )
          );
        });
        this.createForm.patchValue({ isPublishedTillSave: false });
      }
    });
  }

  showReponseTypeOverlay(secIndex, queIndex, tabIndex) {
    this.showTableResponseType[secIndex + 1][queIndex + 1][tabIndex + 1] =
      !this.showTableResponseType[secIndex + 1][queIndex + 1][tabIndex + 1];
  }
}
