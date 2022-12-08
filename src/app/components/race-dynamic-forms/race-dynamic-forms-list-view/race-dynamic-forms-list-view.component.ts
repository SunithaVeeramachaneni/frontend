import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { ToastService } from 'src/app/shared/toast';
import { RdfService } from '../services/rdf.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultLimit } from 'src/app/app.constants';

interface SearchEvent {
  data: 'search' | 'load' | 'infiniteScroll';
}

@Component({
  selector: 'app-race-dynamic-forms-list-view',
  templateUrl: './race-dynamic-forms-list-view.component.html',
  styleUrls: ['./race-dynamic-forms-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceDynamicFormsListViewComponent implements OnInit {
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
  uploadForm$ = new BehaviorSubject<any>({} as any);

  private fetchForms$: ReplaySubject<SearchEvent> =
    new ReplaySubject<SearchEvent>(2);

  constructor(
    private rdfService: RdfService,
    private toaster: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
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
      this.formListOnScroll$,
      this.uploadForm$
    ]).pipe(
      map(([formsList, deleteForm, duplicateForm, scroll, uploadForms]) => {
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

        if (uploadForms.length) {
          uploadForms.forEach((form) => initial.data.splice(0, 0, form));
        }
        initial.data = formsList;
        this.skip = initial.data.length;
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
      .getFormsAppSync$({
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

  deleteForm(form: any) {
    of(form)
      .pipe(
        mergeMap(({ isPublished }) => {
          if (isPublished) {
            return this.rdfService.deactivateAbapForm$(form).pipe(
              mergeMap((resp) => {
                if (resp === null) {
                  return this.deleteFromFromMongo(form);
                }
                return of({});
              })
            );
          } else {
            return this.deleteFromFromMongo(form);
          }
        })
      )
      .subscribe();
  }

  deleteFromFromMongo(form) {
    return this.rdfService.appSyncDeleteForm$(form).pipe(
      tap((deleteFrom) => {
        if (Object.keys(deleteFrom).length) {
          this.toaster.show({
            text: `Form ${form.name} deleted successfully`,
            type: 'success'
          });
          this.deleteForm$.next(deleteFrom);
        }
      })
    );
  }

  editForm(form) {
    this.router.navigate(['rdf-forms/edit', form.id], {
      state: { data: form }
    });
  }

  duplicateForm(form) {
    return this.rdfService
      .duplicateForm$(form)
      .pipe(
        tap((newForm) => {
          if (Object.keys(newForm).length) {
            this.toaster.show({
              text: `Form ${newForm.name} copied successfully`,
              type: 'success'
            });
            this.duplicateForm$.next(newForm);
          }
        })
      )
      .subscribe();
  }

  uploadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    this.rdfService
      .importExcelFile$(formData, 'forms/upload')
      .subscribe((data) => {
        const newData = data.map((form) => {
          const id = form._id;
          const newForm = {
            ...form,
            id
          };
          delete newForm._id;
          return newForm;
        });
        this.uploadForm$.next(newData);
      });
  };

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }
}
