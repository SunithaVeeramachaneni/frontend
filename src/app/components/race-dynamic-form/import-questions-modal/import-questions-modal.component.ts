import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { GetFormListQuery } from 'src/app/API.service';
import { defaultLimit } from 'src/app/app.constants';
import { getFormMetadata, State } from 'src/app/forms/state';
import { FormMetadata, TableEvent } from 'src/app/interfaces';
import { RaceDynamicFormService } from '../services/rdf.service';

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
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private raceDynamicFormService: RaceDynamicFormService,
    private store: Store<State>
  ) {}

  ngOnInit() {
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
        skip: this.skip,
        limit: this.limit,
        searchKey: this.searchForm.value
      })
      .pipe(mergeMap(({ rows }) => of(rows)));
  }

  selectListItem(form, index) {
    this.selectedForm = form;
    console.log(this.selectedForm);
    this.selectedItem = index;
    this.disableSelectBtn = false;

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        this.formMetadata = formMetadata;
      })
    );
    this.formMetadata$.subscribe(console.log);
  }

  selectFormElement() {
    console.log('secelect');
    // this.selectedForm.sections.forEach((sec) => {
    //   sec.checked = false;
    //   sec.questions.forEach((que) => {
    //     que.checked = false;
    //   });
    // });
    // this.data.selectedFormData = this.selectedForm;
    // this.data.openImportQuestionsSlider = true;
    // this.dialogRef.close(this.data);
  }
}
