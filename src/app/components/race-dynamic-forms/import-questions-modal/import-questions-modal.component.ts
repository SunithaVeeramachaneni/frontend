import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { defaultLimit } from 'src/app/app.constants';
import { RdfService } from '../services/rdf.service';

interface SearchEvent {
  data: 'search' | 'load' | 'infiniteScroll';
}

@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss']
})
export class ImportQuestionsModalComponent implements OnInit {
  searchKey = '';
  skip = 0;
  limit = defaultLimit;
  lastScrollLeft = 0;
  formsListTotalCount = 0;
  formsListLoadedCount = 0;
  fetchFormsListInprogress = false;

  searchForm: FormGroup;

  formsOnLoadSearch$: Observable<any>; //new BehaviorSubject<any>({} as any);
  formListOnScroll$: Observable<any>;
  forms$: Observable<any>;
  formsData$: Observable<any>;
  deleteForm$ = new BehaviorSubject<any>({} as any);
  duplicateForm$ = new BehaviorSubject<any>({} as any);
  selectedItem;
  selectedForm;
  disableSelectBtn = true;
  private fetchForms$: ReplaySubject<SearchEvent> =
    new ReplaySubject<SearchEvent>(2);

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private rdfService: RdfService
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.fetchForms$.next({ data: 'load' });

    const initial = { data: [] };

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.fetchForms();
      })
    );

    this.formListOnScroll$ = this.fetchForms$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.fetchForms();
        } else {
          return of([]);
        }
      })
    );

    this.formsData$ = combineLatest([
      this.formsOnLoadSearch$,
      this.deleteForm$,
      this.duplicateForm$,
      this.formListOnScroll$
    ]).pipe(
      map(([formsList, deleteForm, duplicateForm, scroll]) => {
        if (Object.keys(deleteForm).length) {
          initial.data = initial.data.filter(
            (form) => form.id !== deleteForm.id
          );
          return initial;
        }

        if (Object.keys(duplicateForm).length) {
          initial.data.splice(0, 0, duplicateForm);
        }
        if (Object.keys(scroll).length) {
          formsList = formsList.concat(scroll);
        }
        initial.data = formsList;
        this.skip = initial.data.length;

        initial?.data?.forEach((form) => {
          let temp = 0;
          form?.sections?.forEach((section) => {
            temp += section.questions.length;
          });
          form.countOfQues = temp;
        });

        return initial;
      })
    );
  }

  onFormsListScrolled(event: any) {
    const element = event.target;
    const isBottomReached =
      Math.abs(element.scrollHeight) -
        Math.abs(element.scrollTop) -
        Math.abs(element.clientHeight) <=
      1;

    const documentScrollLeft = element.scrollLeft;
    if (this.lastScrollLeft !== documentScrollLeft) {
      this.lastScrollLeft = documentScrollLeft;
      return;
    }

    if (isBottomReached) {
      if (!(this.formsListLoadedCount < this.formsListTotalCount)) {
        return;
      }
      if (this.fetchFormsListInprogress) return;
      this.fetchForms$.next({ data: 'infiniteScroll' });
    }
  }

  fetchForms() {
    this.fetchFormsListInprogress = true;

    return this.rdfService
      .getForms$({
        skip: this.skip,
        limit: this.limit,
        isActive: true,
        searchKey: this.searchForm.get('search').value
      })
      .pipe(
        mergeMap((formsResp: any) => {
          this.fetchFormsListInprogress = false;
          formsResp.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          if (formsResp.count) {
            this.formsListTotalCount = formsResp.count;
          }
          this.formsListLoadedCount += formsResp.data.length;
          return of(formsResp.data);
        })
      );
  }

  selectListItem(form, index) {
    this.selectedForm = form;
    this.selectedItem = index;
    this.disableSelectBtn = false;
  }

  selectFormElement() {
    this.selectedForm?.sections?.forEach((sec) => {
      sec.checked = false;
      sec?.questions?.forEach((que) => {
        que.checked = false;
      });
    });
    this.data.selectedFormData = this.selectedForm;
    this.data.openImportQuestionsSlider = true;
    this.dialogRef.close(this.data);
  }
}
