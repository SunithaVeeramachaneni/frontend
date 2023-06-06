/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { merge, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { fieldTypeOperatorMapping } from 'src/app/shared/utils/fieldOperatorMappings';
import {
  getPageWiseLogicSectionAskQuestions,
  getQuestionLogics,
  State
} from '../../state/builder/builder-state.selectors';
import { AddLogicActions } from '../../state/actions';
import { SelectQuestionsDialogComponent } from './select-questions-dialog/select-questions-dialog.component';
import { NumberRangeMetadata } from 'src/app/interfaces';

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLogicComponent implements OnInit, OnDestroy {
  @Input() selectedNodeId: any;
  @Output() logicEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() set questionId(id: string) {
    this._questionId = id;
  }
  get questionId() {
    return this._questionId;
  }

  @Input() set quickResponseValues(values: any) {
    this._quickResponseValues = values.value;
  }
  get quickResponseValues() {
    return this._quickResponseValues;
  }

  @Input() set sectionId(id: string) {
    this._sectionId = id;
  }
  get sectionId() {
    return this._sectionId;
  }

  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }

  @Input() set fieldType(fieldType: string) {
    this.fieldOperators = fieldTypeOperatorMapping[fieldType];
    this._fieldType = fieldType;
  }
  get fieldType() {
    return this._fieldType;
  }

  logicsForm: FormGroup = this.fb.group({
    logics: this.fb.array([])
  });

  fieldOperators: any[] = [];
  dropDownTypes = ['DD', 'VI', 'DDM', 'CB'];
  raiseIssueApplicableFields = ['NF', 'VI', 'RT'];
  checkBoxResponses = ['true', 'false'];
  dropdownValues = [
    { title: 'option1', code: 'option1' },
    { title: 'option2', code: 'option2' }
  ];
  selectedTabIndex: number;
  pageWiseLogicSectionAskQuestions: any;
  questionLogics$: Observable<any>;
  pageWiseLogicSectionAskQuestions$: Observable<any>;

  isAskQuestionFocusId = '';

  private _pageIndex: number;
  private _questionId: string;
  private _quickResponseValues: any;
  private _sectionId: string;
  private _fieldType: string;
  private onDestroy$ = new Subject();

  constructor(
    private store: Store<State>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    let logicsFormArray = [];
    this.pageWiseLogicSectionAskQuestions$ = this.store
      .select(getPageWiseLogicSectionAskQuestions(this.selectedNodeId))
      .pipe(
        tap((pageWiseLogicSectionAskQuestions) => {
          this.pageWiseLogicSectionAskQuestions =
            pageWiseLogicSectionAskQuestions;
        })
      );
    this.questionLogics$ = this.store
      .select(
        getQuestionLogics(this.pageIndex, this.questionId, this.selectedNodeId)
      )
      .pipe(
        tap((logicsT) => {
          // eslint-disable-next-line arrow-body-style
          logicsFormArray = logicsT.map((logic, index) => {
            const mandateQuestions = logic.mandateQuestions;
            const hideQuestions = logic.hideQuestions;
            const askQuestions =
              this.pageWiseLogicSectionAskQuestions[this.pageIndex][logic.id];

            let mandateQuestionsFormArray = [];
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

            let askQuestionsFormArray = [];
            if (askQuestions && askQuestions.length) {
              askQuestionsFormArray = askQuestions.map((aq) => {
                this.fb.group({
                  id: aq.id || '',
                  sectionId: aq.sectionId || '',
                  name: aq.name || '',
                  fieldType: aq.fieldType || 'TF',
                  position: aq.position || '',
                  required: aq.required || false,
                  enableHistory: aq.enableHistory || false,
                  multi: aq.multi || false,
                  value: aq.value || '',
                  isPublished: aq.isPublished || false,
                  isPublishedTillSave: aq.isPublishedTillSave || false,
                  isOpen: aq.isOpen || false,
                  isResponseTypeModalOpen: aq.isResponseTypeModalOpen || false,
                  unitOfMeasurement: aq.unitOfMeasurement || 'None',
                  rangeMetaData: aq.rangeMetaData || ({} as NumberRangeMetadata)
                });
              });
            }

            return this.fb.group({
              id: logic.id || '',
              questionId: logic.questionId || '',
              pageIndex: logic.pageIndex || 0,
              operator: logic.operator || '',
              operand1: logic.operand1 || '',
              operand2: logic.operand2 || '',
              action: logic.action || '',
              mandateAttachment: logic.mandateAttachment || false,
              raiseIssue: logic.raiseIssue || false,
              logicTitle: logic.logicTitle || '',
              expression: logic.expression || '',
              questions: this.fb.array(askQuestionsFormArray),
              mandateQuestions: this.fb.array(mandateQuestionsFormArray),
              hideQuestions: this.fb.array(hideQuestionsFormArray)
            });
          });
          this.logicsForm.setControl('logics', this.fb.array(logicsFormArray));

          merge(
            // eslint-disable-next-line @typescript-eslint/dot-notation
            ...this.logicsForm
              .get('logics')
              ['controls'].map((control, index) => {
                control.valueChanges
                  .pipe(
                    pairwise(),
                    debounceTime(1000),
                    distinctUntilChanged(),
                    takeUntil(this.onDestroy$),
                    tap(([prev, curr]) => {
                      if (!isEqual(curr, prev)) {
                        const logicSymbol = this.fieldOperators.find(
                          (op) => op.code === curr.operator
                        );
                        if (logicSymbol) {
                          curr.logicTitle = `${logicSymbol.symbol} ${curr.operand2}`;
                        } else {
                          curr.logicTitle = `${curr.operator} ${curr.operand2}`;
                        }
                        this.logicEvent.emit({
                          questionId: this.questionId,
                          pageIndex: this.pageIndex,
                          logicIndex: index,
                          type: 'update',
                          logic: curr
                        });
                      }
                    })
                  )
                  .subscribe();
              })
          );
        })
      );
  }

  trackByLogicId(index: number, el: any): number {
    return el.value.id;
  }
  trackByQuestionIndex(index: number, el: any): number {
    return el.id;
  }

  deleteLogic(logicId, questionId, pageIndex) {
    this.logicEvent.emit({ logicId, questionId, pageIndex, type: 'delete' });
  }

  addLogicToQuestion(questionId, pageIndex) {
    this.logicEvent.emit({ questionId, pageIndex, type: 'create' });
  }

  getLogicsList() {
    return (this.logicsForm.get('logics') as FormArray).controls;
  }

  askQuestionEventHandler(event, logic, logicIndex) {
    const { type } = event;
    switch (type) {
      case 'add':
        const newQuestion = {
          id: `AQ_${uuidv4()}`,
          sectionId: `AQ_${logic.id}`,
          name: '',
          fieldType: 'TF',
          position: 0,
          required: false,
          enableHistory: false,
          multi: false,
          value: '',
          isPublished: false,
          isPublishedTillSave: false,
          isOpen: false,
          isResponseTypeModalOpen: false
        };
        this.store.dispatch(
          AddLogicActions.askQuestionsCreate({
            questionId: this.questionId,
            pageIndex: this.pageIndex,
            logicIndex,
            logicId: logic.id,
            question: newQuestion,
            subFormId: this.selectedNodeId
          })
        );
        break;
      case 'update':
        this.store.dispatch(
          AddLogicActions.askQuestionsUpdate({
            questionId: event.question.id,
            pageIndex: event.pageIndex,
            question: event.question,
            subFormId: this.selectedNodeId
          })
        );
        break;
      case 'delete':
        this.store.dispatch(
          AddLogicActions.askQuestionsDelete({
            questionId: event.questionId,
            pageIndex: event.pageIndex,
            subFormId: this.selectedNodeId
          })
        );
        break;
    }
  }

  operand2Changed(logic, event, index) {
    if (event.target && event.target.value) {
      if (logic.operand2 !== event.target.value) {
        logic.operand2 = event.target.value;
      }
    }

    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.operator
    );
    if (logicSymbol) {
      logic.logicTitle = `${logicSymbol.symbol} ${logic.operand2}`;
    } else {
      logic.logicTitle = `${logic.operator} ${logic.operand2}`;
    }
    this.logicEvent.emit({
      questionId: this.questionId,
      pageIndex: this.pageIndex,
      logicIndex: index,
      type: 'update',
      logic
    });
  }

  operatorChanged(logic, index, event) {
    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.operator
    );
    if (logicSymbol) {
      logic.logicTitle = `${logicSymbol.symbol} ${logic.operand2}`;
    } else {
      logic.logicTitle = `${logic.operator} ${logic.operand2}`;
    }
    this.logicEvent.emit({
      questionId: this.questionId,
      pageIndex: this.pageIndex,
      logicIndex: index,
      type: 'update',
      logic
    });
  }

  openSelectQuestionsDialog(logic, index, viewMode = 'MANDATE') {
    const dialogRef = this.dialog.open(SelectQuestionsDialogComponent, {
      restoreFocus: false,
      disableClose: true,
      hasBackdrop: true,
      width: '60%',
      data: {
        logic,
        viewMode,
        pageIndex: this.pageIndex,
        questionId: this.questionId,
        subFormId: this.selectedNodeId
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result.type === 'MANDATE') {
        logic.mandateQuestions = result.selectedQuestions;
        logic.action = result.type;
      } else if (result.type === 'HIDE') {
        logic.hideQuestions = result.selectedQuestions;
        logic.action = result.type;
      }

      this.logicEvent.emit({
        questionId: this.questionId,
        pageIndex: this.pageIndex,
        logicIndex: index,
        type: 'update',
        logic
      });
    });
  }
  triggerMenuAction(action, index, logic) {
    this.logicEvent.emit({
      questionId: this.questionId,
      pageIndex: this.pageIndex,
      logicIndex: index,
      type: 'ask_question_create',
      logic
    });
  }
  mandateAttachment(action, index, logic) {
    logic.mandateAttachment = true;
    this.logicEvent.emit({
      questionId: this.questionId,
      pageIndex: this.pageIndex,
      logicIndex: index,
      type: 'update',
      logic
    });
  }
  raiseIssue(action, index, logic) {
    logic.raiseIssue = true;
    this.logicEvent.emit({
      questionId: this.questionId,
      pageIndex: this.pageIndex,
      logicIndex: index,
      type: 'update',
      logic
    });
  }

  onTabChanged(event) {
    const clickedIndex = event.index;
    this.selectedTabIndex = clickedIndex;
    this.cdrf.detectChanges();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setIsAskQuestionFocusId(id) {
    this.isAskQuestionFocusId = id;
  }
}
