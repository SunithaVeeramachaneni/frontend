/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { isEqual } from 'lodash-es';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';

import { RdfService } from '../services/rdf.service';
import { fieldTypeOperatorMapping } from '../utils/fieldOperatorMappings';
import { SelectQuestionsDialogComponent } from './select-questions-dialog/select-questions-dialog.component';
import { RaiseNotificationDailogComponent } from './raise-notification-dailog/raise-notification-dailog.component';

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onValueChanged: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onLogicDelete: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAskEvidence: EventEmitter<any> = new EventEmitter();
  @Input() formId: string;

  fieldOperators: any;

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];

  dropDownTypes = ['DD', 'VI', 'DDM', 'CB'];

  public checkBoxResponses = ['true', 'false'];

  public logicsForm: FormGroup;

  private _question: any;

  @Input() set question(question: any) {
    question.controls.logics.controls.forEach((logic) => {
      this.fieldOperators = fieldTypeOperatorMapping[question.value.fieldType];
      if (!logic.value.logicTitle) {
        const logicSymbol = this.fieldOperators.find(
          (op) => op.code === logic.value.operator
        );
        if (logicSymbol) {
          logic.value.logicTitle = `${logicSymbol.symbol} ${logic.value.operand2}`;
        } else {
          logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
        }
      }
    });

    this.logicsForm = this.fb.group({
      counter: [1],
      logics: question.controls.logics
    });
    this.fieldOperators = fieldTypeOperatorMapping[question.value.fieldType];
    this._question = question ? question : ({} as any);
    this.cdrf.detectChanges();
  }

  get question(): any {
    return this._question;
  }

  constructor(
    private cdrf: ChangeDetectorRef,
    private fb: FormBuilder,
    private rdfService: RdfService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.logicsForm
      .get('logics')
      .valueChanges.pipe(
        pairwise(),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          curr.forEach((q) => {
            if (!isEqual(curr, prev)) {
              this.onValueChanged.emit(curr);
            }
          });
        })
      )
      .subscribe();

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
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fieldOperators =
      fieldTypeOperatorMapping[changes.question.currentValue.value.fieldType];
    this.cdrf.detectChanges();
  }

  get logics(): FormArray {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.logicsForm.get('logics') as FormArray;
  }
  getLogicsList() {
    return (this.logicsForm.get('logics') as FormArray).controls;
  }

  getCounter() {
    this.logicsForm
      .get('counter')
      .setValue(this.logicsForm.get('counter').value + 1);
    return this.logicsForm.get('counter').value;
  }

  deleteLogic(logic, index) {
    this.onLogicDelete.emit({ index });
  }

  operatorChanged(logic, event) {
    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.value.operator
    );
    if (logicSymbol) {
      logic.value.logicTitle = `${logicSymbol.symbol} ${logic.value.operand2}`;
    } else {
      logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    }
    this.cdrf.detectChanges();
  }
  operand2Changed(logic, event) {
    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.value.operator
    );
    if (logicSymbol) {
      logic.value.logicTitle = `${logicSymbol.symbol} ${logic.value.operand2}`;
    } else {
      logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    }
    this.cdrf.detectChanges();
  }

  openRaiseNotificationsDialog(question, logic, index) {
    const dialogRef = this.dialog.open(RaiseNotificationDailogComponent, {
      restoreFocus: false,
      disableClose: true,
      hasBackdrop: false,
      width: '60%',
      data: { logic: logic.value, question: question.value }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const {
        notification: { triggerInfo, triggerWhen }
      } = result;
      logic.value.action = result.type;
      this.cdrf.detectChanges();
      logic.patchValue({
        action: result.type,
        raiseNotification: true,
        triggerInfo,
        triggerWhen
      });
      logic.value.raiseNotification = true;
      logic.value.triggerInfo = triggerInfo;
      logic.value.triggerWhen = triggerWhen;
    });
  }

  openSelectQuestionsDialog(question, logic, viewMode = 'MANDATE') {
    const dialogRef = this.dialog.open(SelectQuestionsDialogComponent, {
      restoreFocus: false,
      disableClose: true,
      hasBackdrop: false,
      width: '60%',
      data: { logic: logic.value, viewMode, question: question.value }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      logic.value.action = result.type;
      this.cdrf.detectChanges();

      if (result.type === 'MANDATE') {
        const control = logic.get('mandateQuestions') as FormArray;
        const controlRaw = control.getRawValue();
        result.selectedQuestions.forEach((q) => {
          if (controlRaw.indexOf(q) < 0) {
            control.push(this.fb.control(q));
          }
        });
        controlRaw
          .slice()
          .reverse()
          .forEach((question, index) => {
            if (!result.selectedQuestions.includes(question)) {
              control.removeAt(controlRaw.length - 1 - index);
            }
          });
        logic.patchValue({
          action: result.type,
          mandateQuestions: result.selectedQuestions,
          validationMessage: result.validationMessage
        });
        logic.value.mandateQuestions = result.selectedQuestions;
      } else if (result.type === 'HIDE') {
        const control = logic.get('hideQuestions') as FormArray;
        const controlRaw = control.getRawValue();
        result.selectedQuestions.forEach((q) => {
          if (controlRaw.indexOf(q) < 0) {
            control.push(this.fb.control(q));
          }
        });
        controlRaw
          .slice()
          .reverse()
          .forEach((question, index) => {
            if (!result.selectedQuestions.includes(question)) {
              control.removeAt(controlRaw.length - 1 - index);
            }
          });
        logic.patchValue({
          action: result.type,
          hideQuestions: result.selectedQuestions
        });
        logic.value.hideQuestions = result.selectedQuestions;
      }
    });
  }

  askEvidence(question, logic, index) {
    logic.value.action = 'ask_evidence';
    logic.value.askEvidence = `${question.value.id}_${index}_EVIDENCE`;
    this.cdrf.detectChanges();
    logic.patchValue({
      action: 'ask_evidence',
      askEvidence: `${question.value.id}_${index}_EVIDENCE`
    });
    this.onAskEvidence.emit({ index, questionId: question.value.id });
  }

  removeEvidence(logic) {
    logic.value.askEvidence = false;
    this.cdrf.detectChanges();
    logic.patchValue({ askEvidence: false });
  }

  triggerMenuAction(
    action: string,
    question: any,
    logic: any,
    index: number
  ): void {
    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.value.operator
    );
    if (logicSymbol) {
      logic.value.logicTitle = `${logicSymbol.symbol} ${logic.value.operand2}`;
    } else {
      logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    }
    logic.value.action = 'ask_questions';
    this.cdrf.detectChanges();

    if (action === 'ask_questions') {
      logic.hasAskQuestions = true;
      const control = logic.get('questions') as FormArray;
      let questionId = `${question.value.id}_AQ_${new Date().getTime()}`;
      const maxLength = 20;
      if (questionId && questionId?.length > maxLength) {
        questionId = questionId.slice(0, maxLength);
      }
      control.push(
        this.fb.group({
          id: [questionId],
          name: [''],
          fieldType: ['TF'],
          position: [''],
          required: [false],
          multi: [false],
          value: ['TF'],
          isPublished: [false],
          isPublishedTillSave: [false],
          logics: this.fb.array([])
        })
      );

      let logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      if (logicSymbol) {
        logicTitleTemp = `${logicSymbol.symbol} ${logic.value.operand2}`;
      } else {
        logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      }
      logic.value.logicTitle = logicTitleTemp;
      logic.patchValue({
        logicTitle: logicTitleTemp,
        action: 'ask_questions'
        // expression
      });
    }
    this.cdrf.detectChanges();
    this.cdrf.markForCheck();
  }

  onLogicQuestionValueChanged(logic: any, event: any[]) {
    const control = logic.get('questions') as FormArray;
    control.setValue(event);

    const logics = this.logicsForm.get('logics') as FormArray;
    this.onValueChanged.emit(logics.getRawValue());

    // // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < logics.value.length; i++) {
      if (
        logics.value[i].operator === logic.value.operator &&
        logics.value[i].operand2 === logic.value.operand2
      ) {
        logics.controls[i].patchValue({ questions: event });
      }
    }
  }

  onLogicQuestionDelete(logic: any, event: any) {
    const control = logic.get('questions') as FormArray;
    control.removeAt(event.index);

    const logics = this.logicsForm.get('logics') as FormArray;
    this.onValueChanged.emit(logics.getRawValue());
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
