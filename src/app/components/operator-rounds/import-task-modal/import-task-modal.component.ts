import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { ImportTasksSliderComponent } from '../import-tasks-slider/import-tasks-slider.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
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
export class ImportTaskModalComponent implements OnInit {
  searchRoundPlan: FormControl;
  skip = 0;
  fetchType = 'load';
  limit = defaultLimit;
  nextToken = '';
  // NodeId = '';
  roundPlans$: Observable<any>;
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(7).fill(0).map((v, i) => i);
  selectedRoundPlan;
  selectedItem;
  openImportTasksSlider;

  disableSelectBtn = true;

  constructor(
    public dialogRef: MatDialogRef<ImportTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
    this.operatorRoundsService.fetchForms$.next({} as any);

    this.searchRoundPlan = new FormControl('');
    this.searchRoundPlan.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
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
    const formList = this.operatorRoundsService
      // .getFormsList$(
      //   {
      //     nextToken: this.nextToken,
      //     limit: this.limit,
      //     searchKey: this.searchRoundPlan.value,
      //     fetchType: this.fetchType
      //   },
      //   'All'
      // )
      .getRoundPlanListByNodeId$(this.data.NodeId)
      .pipe(
        map((response) => {
          return response;
        })
      );
    return formList;
  }

  selectFormElement = () => {
    this.openImportTasksSlider = true;
    const selectedRoundPlanData = JSON.parse(
      JSON.stringify(this.selectedRoundPlan)
    );
    const dialogRef = this.dialog.open(ImportTasksSliderComponent, {
      data: {
        selectedFormData: selectedRoundPlanData.filteredForm,
        selectedFormName: selectedRoundPlanData.formName,
        selectedFormNode: selectedRoundPlanData.node
      }
    });
  };

  selectListItem(form, index) {
    this.selectedItem = index;

    this.operatorRoundsService
      .getAuthoredFormDetailByFormId$(form.id)
      .pipe(
        map((authoredFormDetail) => {
          console.log(authoredFormDetail);
          const formName = form.name;
          const node = JSON.parse(authoredFormDetail.hierarchy);
          const filteredForm = authoredFormDetail.subForms;
          let formDetails = {
            filteredForm,
            formName,
            node
          };
          return formDetails;
          // const pageData = filteredForm.map((page) => {
          //   sectionData = page.sections.map((section) => {
          //     const questionsArray = [];
          //     page.questions.forEach((question) => {
          //       if (section.id === question.sectionId) {
          //         questionsArray.push(question);
          //       }
          //     });
          //     return { ...section, questions: questionsArray };
          //   });
          //   return { ...page, sections: sectionData };
          // });
          // return pageData;
        })
      )
      .subscribe((response) => {
        this.selectedRoundPlan = response;
        this.disableSelectBtn = false;
      });
  }
}
