import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RaceDynamicFormService } from '../../services/rdf.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { graphQLDefaultLimit } from 'src/app/app.constants';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { ToastService } from 'src/app/shared/toast';
import { TableEvent } from 'src/app/interfaces';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-affected-forms-modal',
  templateUrl: './template-affected-forms-modal.component.html',
  styleUrls: ['./template-affected-forms-modal.component.scss']
})
export class TemplateAffectedFormsModalComponent implements OnInit {
  ghostLoading = new Array(8).fill(0).map((v, i) => i);
  nextToken = '';
  fetchType = 'load';
  searchForm: FormControl;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  formsListCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  forms$: Observable<any>;
  skip = 0;
  limit = graphQLDefaultLimit;
  affectedFormsCount: Number;
  affectedForms: any[];
  allAffectedForms: any[];
  formLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  dataSource: MatTableDataSource<any>;
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Form Name',
      type: 'string',
      controlType: 'string',
      order: 1,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        display: 'block',
        'white-space': 'wrap',
        'max-width': '350px',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      order: 2,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      controlType: 'string',
      order: 3,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        width: '80px',
        height: '24px',
        background: '#FEF3C7',
        color: '#92400E',
        borderRadius: '12px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'affectedFormsTable',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: '400px',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FFCC00',
        color: '#000000'
      },
      published: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      }
    }
  };

  private onDestroy$ = new Subject();

  constructor(
    private store: Store<State>,
    private toastService: ToastService,
    private router: Router,
    private raceDynamicFormService: RaceDynamicFormService,
    public dialogRef: MatDialogRef<TemplateAffectedFormsModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
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
        tap((value: string) => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.configOptions.allColumns = this.columns;
    this.getDisplayedForms();
    this.formsListCount$.subscribe((count) => {
      this.affectedFormsCount = count;
    });
  }

  handleTableEvent = (event): void => {
    this.raceDynamicFormService.fetchForms$.next(event);
  };

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
      columns: this.columns,
      data: []
    };
    this.forms$ = combineLatest([formsOnLoadSearch$, onScrollForms$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 330px)'
          };
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getForms() {
    return this.raceDynamicFormService
      .getAffectedFormList$({
        templateId: this.data.templateId,
        nextToken: this.nextToken,
        limit: this.limit,
        searchTerm: this.searchForm.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, next }) => {
          if (count !== undefined) {
            this.formsListCount$.next(count);
          }
          this.nextToken = next;
          this.formLoaded$.next(true);
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formsListCount$.next(0);
          this.formLoaded$.next(true);
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }
  markTemplateAsReady() {
    this.dialogRef.close();
    this.store.dispatch(
      BuilderConfigurationActions.updateIsFormDetailPublished({
        isFormDetailPublished: true
      })
    );
    this.router.navigate(['/forms/templates']);
    this.toastService.show({
      type: 'success',
      text: `${this.affectedFormsCount} Forms are updated.`
    });
  }
}
