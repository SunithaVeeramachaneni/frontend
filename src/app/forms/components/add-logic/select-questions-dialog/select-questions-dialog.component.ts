import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { operatorSymbolMap } from 'src/app/shared/utils/fieldOperatorMappings';
import {
  getPage,
  getQuestionByQuestionID,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Observable } from 'rxjs';
import { Page, Question } from 'src/app/interfaces';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-questions-dialog',
  templateUrl: 'select-questions-dialog.component.html',
  styleUrls: ['./select-questions-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectQuestionsDialogComponent implements OnInit {
  sections = [];
  selectedQuestions = [];
  operatorSymbolMap = {};
  question$: Observable<Question>;
  page$: Observable<Page>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.operatorSymbolMap = operatorSymbolMap;
    this.selectedQuestions = [];
    this.sections = [];

    this.question$ = this.store.select(
      getQuestionByQuestionID(this.data.pageIndex, this.data.questionId)
    );

    this.page$ = this.store
      .select(getPage(this.data.pageIndex, this.data.subFormId))
      .pipe(
        tap((pageObj) => {
          const page = Object.assign({}, pageObj);
          const hideQuestion = page.logics
            .map((logic) => logic.hideQuestions)
            .flat();
          const mandateQuestion = page.logics
            .map((logic) => logic.mandateQuestions)
            .flat();
          page.sections.map((section) => {
            const sectionQuestions = page.questions.filter((q) => {
              if (q.required === false) {
                return this.data.viewMode === 'HIDE'
                  ? q.sectionId === section.id &&
                      !mandateQuestion.includes(q.id)
                  : q.sectionId === section.id && !hideQuestion.includes(q.id);
              }
            });

            this.sections.push({
              ...section,
              questions: sectionQuestions || []
            });
          });
        })
      );

    if (this.data.viewMode === 'MANDATE') {
      const mandatedQuestions = this.data.logic.mandateQuestions || [];
      this.selectedQuestions = this.selectedQuestions.concat(mandatedQuestions);
    } else if (this.data.viewMode === 'HIDE') {
      const hideQuestions = this.data.logic.hideQuestions || [];
      this.selectedQuestions = this.selectedQuestions.concat(hideQuestions);
    }
  }

  selectQuestion(checked: boolean, questionId: string) {
    if (checked) {
      if (this.selectedQuestions.indexOf(questionId) < 0) {
        this.selectedQuestions.push(questionId);
      }
    } else {
      const index = this.selectedQuestions.indexOf(questionId);
      if (index > -1) {
        this.selectedQuestions.splice(index, 1);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close({
      selectedQuestions: this.selectedQuestions,
      type: this.data.viewMode
    });
  }
}
