/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isEqual } from 'date-fns';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';
import { fieldTypeOperatorMapping } from 'src/app/shared/utils/fieldOperatorMappings';
import { getQuestionLogics, State } from '../../state';

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit {
  @Output() logicEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() set questionId(id: string) {
    this._questionId = id;
  }
  get questionId() {
    return this._questionId;
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
  checkBoxResponses = ['true', 'false'];
  dropdownValues = [
    { title: 'option1', code: 'option1' },
    { title: 'option2', code: 'option2' }
  ];

  private _pageIndex: number;
  private _questionId: string;
  private _fieldType: string;

  constructor(private store: Store<State>, private fb: FormBuilder) {}

  ngOnInit() {
    let logicsFormArray = [];
    this.store
      .select(getQuestionLogics(this.pageIndex, this.questionId))
      .subscribe((logicsT) => {
        // eslint-disable-next-line arrow-body-style
        logicsFormArray = logicsT.map((logic) => {
          return this.fb.group({
            id: logic.id || '',
            questionId: logic.questionId || '',
            pageIndex: logic.pageIndex || 0,
            operator: logic.operator || '',
            operand1: logic.operand1 || '',
            operand2: logic.operand2 || '',
            action: logic.action || '',
            logicTitle: logic.logicTitle || '',
            expression: logic.expression || '',
            questions: this.fb.array([]),
            mandateQuestions: this.fb.array([]),
            hideQuestions: this.fb.array([]),
            validationMessage: logic.validationMessage || ''
          });
        });
        this.logicsForm = this.fb.group({
          logics: this.fb.array(logicsFormArray)
        });
        console.log(this.logicsForm.getRawValue());
      });

    this.logicsForm
      .get('logics')
      .valueChanges.pipe(
        pairwise(),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          curr.forEach((q) => {
            if (!isEqual(curr, prev)) {
              curr = curr.map((logic) => {
                if (!logic.logicTitle || !logic.logicTitle.length) {
                  const logicSymbol = this.fieldOperators.find(
                    (op) => op.code === logic.operator
                  );
                  if (logicSymbol) {
                    logic.logicTitle = `${logicSymbol.symbol} ${logic.operand2}`;
                  } else {
                    logic.logicTitle = `${logic.operator} ${logic.operand2}`;
                  }
                }
                return logic;
              });
              // console.log(curr);
              this.logicEvent.emit({
                questionId: this.questionId,
                pageIndex: this.pageIndex,
                type: 'update',
                logics: curr
              });
            }
          });
        })
      )
      .subscribe();
  }

  deleteLogic(logicId, questionId, pageIndex) {
    this.logicEvent.emit({ logicId, questionId, pageIndex, type: 'delete' });
  }

  getLogicsList() {
    const logicList = (this.logicsForm.get('logics') as FormArray).controls;
    return logicList;
  }
}
