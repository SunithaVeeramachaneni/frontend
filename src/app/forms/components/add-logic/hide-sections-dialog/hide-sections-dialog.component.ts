import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { operatorDisplayNameMap } from 'src/app/shared/utils/fieldOperatorMappings';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Page, Question } from 'src/app/interfaces';
import { tap } from 'rxjs/operators';
import {
  getPage,
  getQuestionByID,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';

@Component({
  selector: 'app-hide-sections-dialog',
  templateUrl: './hide-sections-dialog.component.html',
  styleUrls: ['./hide-sections-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HideSectionsDialogComponent implements OnInit {
  sections = [];
  operatorDisplayNameMap = {};
  selectedSections = [];
  question$: Observable<Question>;
  question: Question;
  page$: Observable<Page>;
  isPageOpen: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.operatorDisplayNameMap = operatorDisplayNameMap;

    const { pageIndex, sectionId, questionId, subFormId } = this.data;

    this.question$ = this.store.select(
      getQuestionByID(pageIndex, sectionId, questionId, subFormId)
    );

    this.page$ = this.store.select(getPage(pageIndex, subFormId)).pipe(
      tap((pageObj) => {
        const page = Object.assign({}, pageObj);
        this.sections = page.sections.filter((s) => s.id !== sectionId);
      })
    );

    const hiddenSections = this.data.logic.hideSections || [];
    this.selectedSections = this.selectedSections.concat(hiddenSections);
  }

  selectSection(checked: boolean, sectionId: string) {
    if (checked) {
      if (this.selectedSections.indexOf(sectionId) < 0) {
        this.selectedSections.push(sectionId);
      }
    } else {
      const index = this.selectedSections.indexOf(sectionId);
      if (index > -1) {
        this.selectedSections.splice(index, 1);
      }
    }
  }

  togglePageIsOpenState() {
    this.isPageOpen = !this.isPageOpen;
  }

  close() {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close({
      selectedSections: this.selectedSections
    });
  }
}
