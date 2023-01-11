import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { FormMetadata, TableEvent } from '../../../interfaces';

import { defaultLimit } from '../../../app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { GetFormListQuery } from '../../../API.service';
import { getFormDetails, getFormMetadata, State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';

interface SearchEvent {
  data: 'search' | 'load' | 'infiniteScroll';
}

@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss']
})
export class ImportQuestionsModalComponent implements OnInit {
  searchForm: FormControl;
  skip = 0;
  limit = defaultLimit;
  selectedForm;
  selectedItem;
  disableSelectBtn = true;
  forms$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  authoredFormDetail;
  nextToken = '';

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
        tap(() => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.getDisplayedForms();
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.getForms();
      })
    );

    const onScrollForms$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getForms();
        } else {
          return of([] as GetFormListQuery[]);
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
          initial.data = rows;
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
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchForm.value
      })
      .pipe(
        mergeMap(({ rows, nextToken }) => {
          this.nextToken = nextToken;
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
        map((formData) => {
          if (formData.length) {
            console.log(form);
            this.data.selectedFormName = form.name;
            const filteredForm = JSON.parse(formData[0].pages);
            let sectionData;
            let pageData;
            pageData = filteredForm.map((page) => {
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
          }
        })
      )
      .subscribe((response) => {
        this.selectedForm = response;
        console.log(response);
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
}
