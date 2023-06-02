import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { FormMetadata, TableEvent } from '../../../../interfaces';

import { graphQLDefaultMaxLimit } from '../../../../app.constants';
import { RaceDynamicFormService } from '../../services/rdf.service';
import { getFormMetadata, State } from 'src/app/forms/state';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';

@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss']
})
export class ImportQuestionsModalComponent implements OnInit, OnDestroy {
  searchForm: FormControl;
  skip = 0;
  limit = graphQLDefaultMaxLimit;
  selectedForm;
  selectedItem;
  disableSelectBtn = true;
  forms$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  authoredFormDetail;
  nextToken = '';
  fetchType = 'load';
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(7).fill(0).map((v, i) => i);
  private onDestroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private raceDynamicFormService: RaceDynamicFormService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
    this.raceDynamicFormService.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.getDisplayedForms();

    this.formMetadata$ = this.store
      .select(getFormMetadata)
      .pipe(tap((formMetadata) => (this.formMetadata = formMetadata)));
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getForms();
      })
    );

    const onScrollForms$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as GetFormList[]);
        }
      })
    );

    const initial = {
      columns: [],
      data: []
    };
    this.forms$ = combineLatest([formsOnLoadSearch$, onScrollForms$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          initial.data = rows.filter((row) => row.id !== this.formMetadata.id);
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data.length;
        return initial;
      })
    );
  }

  getForms() {
    return this.raceDynamicFormService
      .getFormsList$({
        next: this.nextToken,
        limit: this.limit,
        searchKey: this.searchForm.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.nextToken = next;
          return of(rows);
        })
      );
  }

  selectListItem(form, index) {
    this.selectedItem = index;
    this.disableSelectBtn = false;

    this.raceDynamicFormService
      .getAuthoredFormDetailByFormId$(form.id)
      .pipe(
        map((authoredFormDetail) => {
          this.data.selectedFormName = form.name;
          const filteredForm = JSON.parse(authoredFormDetail.pages);
          let sectionData;
          const pageData = filteredForm.map((page) => {
            sectionData = page.sections.map((section) => {
              const questionsArray = [];
              page.questions.forEach((question) => {
                if (section.id === question.sectionId) {
                  questionsArray.push(question);
                }
              });
              return { ...section, questions: questionsArray };
            });
            return { ...page, sections: sectionData };
          });
          return pageData;
        })
      )
      .subscribe((response) => {
        this.selectedForm = response;
      });
  }

  selectFormElement() {
    this.selectedForm?.forEach((page) => {
      page.sections.forEach((sec) => {
        sec.checked = false;
        sec.questions.forEach((que) => {
          que.checked = false;
        });
      });
    });
    this.data.selectedFormData = this.selectedForm;
    this.data.openImportQuestionsSlider = true;
    this.dialogRef.close(this.data);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
