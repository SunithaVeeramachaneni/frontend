/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { RdfService } from '../services/rdf.service';
import { fieldTypeOperatorMapping } from '../utils/fieldOperatorMappings';

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit {
  fieldOperators: any;

  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  filteredFieldTypes: any = [this.fieldType];

  public logicsForm: FormGroup;

  private _question: any;

  @Input() set question(question: any) {
    console.log('question,', question);

    question.controls.logics.controls.forEach((logic) => {
      if (!logic.value.logicTitle) {
        logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
      }
    });

    this.logicsForm = this.fb.group({
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
    private rdfService: RdfService
  ) {}

  ngOnInit() {
    this.logicsForm.get('logics').valueChanges.subscribe((data) => {
      console.log('value changed', data);
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

  operatorChanged(logic, event) {
    logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    this.cdrf.detectChanges();
  }
  operand2Changed(logic, event) {
    logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
  }

  triggerMenuAction(action: string, logic: any): void {
    logic.value.logicTitle = `${logic.value.operator} ${logic.value.operand2}`;
    let expression = '';
    if (action === 'ask_questions') {
      const isEmpty = logic.value.operand2.length ? true : false;
      if (isEmpty) {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(E) ${this.question.value.id} EQ MANDIT IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }
      logic.patchValue({
        ...logic.value,
        action: 'Ask Questions',
        expression
      });
      // TODO: add questions to logic...
      logic.controls.questions.push(
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
    } else if (action === 'hide') {
      const isEmpty = logic.value.operand2.length ? true : false;
      if (isEmpty) {
        expression = `1:(HI) ${this.question.value.id} IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(HI) ${this.question.value.id} IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }
      logic.patchValue({
        ...logic.value,
        action: 'Hide Questions',
        expression
      });
    } else if (action === 'ask_evidence') {
      const isEmpty = logic.value.operand2.length ? true : false;
      if (isEmpty) {
        expression = `1:(E) ${this.question.value.id} MANDIT IF FIELD_2 ${logic.value.operator} EMPTY`;
      } else {
        expression = `1:(E) ${this.question.value.id} MANDIT IF FIELD_2 ${logic.value.operator} (V)${logic.value.operand2}`;
      }
      logic.patchValue({
        ...logic.value,
        action: 'Ask Evidence',
        expression
      });
    }
    this.cdrf.detectChanges();
  }

  getQuestionsOfLogic(logic) {
    //    return form.controls.questions.controls;
    return logic.controls.questions.controls;
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
