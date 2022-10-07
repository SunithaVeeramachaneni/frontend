/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

const fieldTypeToOperatorMapping = {
  TF: [
    {
      code: 'NE',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      displayName: 'is'
    }
  ],
  NF: [
    {
      code: 'LT',
      displayName: 'less than'
    },
    {
      code: 'LE',
      displayName: 'less than or equal to'
    },
    {
      code: 'EQ',
      displayName: 'equal to'
    },
    {
      code: 'NE',
      displayName: 'not equal to'
    },
    {
      code: 'GE',
      displayName: 'greater than or equal to'
    },
    {
      code: 'GT',
      displayName: 'greater than'
    }
  ]
};

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit {
  private _question: any;

  @Input() set question(question: any) {
    console.log('question,', question);

    const fieldMeta = fieldTypeToOperatorMapping[question.fieldType];

    this._question = question ? question : ({} as any);
    this.cdrf.detectChanges();
  }
  get question(): any {
    return this._question;
  }

  constructor(private cdrf: ChangeDetectorRef) {}

  ngOnInit() {}
}
