/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
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

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onValueChanged: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onLogicDelete: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAskEvidence: EventEmitter<any> = new EventEmitter();

  fieldOperators: any;

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];

  dropDownTypes = ['DD', 'VI', 'DDM'];

  public logicsForm: FormGroup;

  private _question: any;

  @Input() set question(question: any) {
    question.controls.logics.controls.forEach((logic) => {
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
              fieldType.type !== 'DDM'
          );
        })
      )
      .subscribe();
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
        result.selectedQuestions.forEach((q) => {
          control.push(this.fb.control(q));
        });
        logic.patchValue({
          action: result.type,
          mandateQuestions: logic.value.mandateQuestions,
          validationMessage: result.validationMessage
        });
      } else if (result.type === 'HIDE') {
        const control = logic.get('hideQuestions') as FormArray;
        result.selectedQuestions.forEach((q) => {
          control.push(this.fb.control(q));
        });
        logic.patchValue({
          action: result.type,
          hideQuestions: logic.value.hideQuestions
        });
      }
    });
  }

  askEvidence(question, logic, index) {
    logic.value.action = 'ask_evidence';
    logic.value.askEvidence = true;

    this.cdrf.detectChanges();
    logic.patchValue({ action: 'ask_evidence', askEvidence: true });
    this.onAskEvidence.emit({ index, questionId: question.value.id });
    // Add expression for ask Evidence
    // logic.value.askEvidence = '<QUESTIONID_INDEX_EVIDENCE>'
    // `${questionId}_${event.index}_EVIDENCE`
  }

  removeEvidence(logic) {
    logic.value.askEvidence = false;
    this.cdrf.detectChanges();
    logic.patchValue({ askEvidence: false });
  }

  triggerMenuAction(action: string, logic: any): void {
    const logicSymbol = this.fieldOperators.find(
      (op) => op.code === logic.value.operator
    );
    if (logicSymbol) {
      logic.value.logicTitle = `${logicSymbol.symbol} ${logic.value.operand2}`;
    } else {
      logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    }

    let expression = '';
    if (action === 'mandate_questions') {
      const isEmpty = logic.value.operand2.length ? false : true;
      if (isEmpty) {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }

      let logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      if (logicSymbol) {
        logicTitleTemp = `${logicSymbol.symbol} ${logic.value.operand2}`;
      } else {
        logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      }
      logic.value.logicTitle = logicTitleTemp;
      logic.patchValue({
        logicTitle: logicTitleTemp,
        action: 'Mandate Questions',
        expression
      });
    } else if (action === 'ask_questions') {
      logic.hasAskQuestions = true;
      const isEmpty = logic.value.operand2.length ? false : true;
      if (isEmpty) {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }
      const control = logic.get('questions') as FormArray;
      control.push(
        this.fb.group({
          id: [`QID_ADD_LOGIC`],
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
        action: 'Ask Questions',
        expression
      });
    } else if (action === 'hide') {
      const isEmpty = logic.value.operand2.length ? false : true;
      if (isEmpty) {
        expression = `1:(HI) ${this.question.value.id} IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(HI) ${this.question.value.id} IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }

      let logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      if (logicSymbol) {
        logicTitleTemp = `${logicSymbol.symbol} ${logic.value.operand2}`;
      } else {
        logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      }
      logic.value.logicTitle = logicTitleTemp;

      logic.patchValue({
        ...logic.value,
        logicTitle: logicTitleTemp,
        action: 'Hide Questions',
        expression
      });
    } else if (action === 'ask_evidence') {
      const isEmpty = logic.value.operand2.length ? false : true;
      if (isEmpty) {
        expression = `1:(E) ${this.question.value.id} MANDIT IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(E) ${this.question.value.id} MANDIT IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }

      let logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      if (logicSymbol) {
        logicTitleTemp = `${logicSymbol.symbol} ${logic.value.operand2}`;
      } else {
        logicTitleTemp = `${logic.value.operator} ${logic.value.operand2}`;
      }
      logic.value.logicTitle = logicTitleTemp;

      logic.patchValue({
        ...logic.value,
        logicTitle: logicTitleTemp,
        action: 'Ask Evidence',
        expression,
        askEvidence: true
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

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }
  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }
}
