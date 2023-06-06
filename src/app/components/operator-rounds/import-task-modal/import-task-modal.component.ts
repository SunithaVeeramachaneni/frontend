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
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { defaultLimit } from 'src/app/app.constants';
import {
  getFormMetadata,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { FormMetadata } from 'src/app/interfaces/form-configuration';

@Component({
  selector: 'app-import-task-modal',
  templateUrl: './import-task-modal.component.html',
  styleUrls: ['./import-task-modal.component.scss']
})
export class ImportTaskModalComponent implements OnInit, OnDestroy {
  searchRoundPlan: FormControl;
  skip = 0;
  fetchType = 'load';
  limit = defaultLimit;
  nextToken = '';
  roundPlans$: Observable<any>;
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(7).fill(0).map((v, i) => i);
  selectedRoundPlan;
  selectedItem;
  disableSelectBtn = true;
  private destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ImportTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
    this.operatorRoundsService.fetchForms$.next({} as any);

    this.searchRoundPlan = new FormControl('');
    this.searchRoundPlan.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap(() => {
          this.operatorRoundsService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.getDisplayedRoundPlans();
    this.formMetadata$ = this.store
      .select(getFormMetadata)
      .pipe(tap((formMetadata) => (this.formMetadata = formMetadata)));
  }

  getDisplayedRoundPlans = () => {
    const roundPlansOnLoadSearch$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        return this.getForms();
      })
    );

    const onScrollRoundPlans$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as any[]);
        }
      })
    );

    const initial = {
      columns: [],
      data: []
    };
    this.roundPlans$ = combineLatest([
      roundPlansOnLoadSearch$,
      onScrollRoundPlans$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          initial.data = rows.filter((row) => row.id !== this.formMetadata.id);
        } else {
          initial.data = initial.data.concat(
            scrollData.filter((data) => data.id !== this.formMetadata.id)
          );
        }

        this.skip = initial.data.length;
        return initial;
      })
    );
  };

  getForms() {
    return this.operatorRoundsService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchRoundPlan.value,
          fetchType: this.fetchType
        },
        'All'
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.nextToken = next;
          return of(rows);
        })
      );
  }

  selectFormElement = () => {
    this.selectedRoundPlan?.forEach((page) => {
      page.sections.forEach((sec) => {
        sec.checked = false;
        sec.questions.forEach((que) => {
          que.checked = false;
        });
      });
    });
    this.data.selectedFormData = this.selectedRoundPlan;
    this.data.openImportQuestionsSlider = true;
    this.dialogRef.close(this.data);
  };

  selectListItem(form, index) {
    this.selectedItem = index;
    this.disableSelectBtn = false;

    this.operatorRoundsService
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
        this.selectedRoundPlan = response;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
