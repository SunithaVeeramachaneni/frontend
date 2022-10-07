/* eslint-disable no-underscore-dangle */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-logic',
  templateUrl: './add-logic.component.html',
  styleUrls: ['./add-logic.component.scss']
})
export class AddLogicComponent implements OnInit {
  private _question: any;

  @Input() set question(question: any) {
    console.log('question,', question);
    this._question = question ? question : ({} as any);
    this.cdrf.detectChanges();
  }
  get question(): any {
    return this._question;
  }

  constructor(private cdrf: ChangeDetectorRef) {}

  ngOnInit() {}
}
