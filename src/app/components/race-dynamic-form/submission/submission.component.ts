import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import {
  TableEvent,
  LoadEvent,
  SearchEvent,
  CellClickActionEvent
} from 'src/app/interfaces';
import { defaultLimit } from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { GetFormListQuery } from 'src/app/API.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class SubmissionComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Name',
      type: 'string',
      order: 1,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: { 'font-weight': '500', 'font-size': '90%' },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      preTextImageConfig: {
        logoAvialable: false,
        style: {
          width: '40px',
          height: '40px',
          marginRight: '10px'
        }
      },
      hasPostTextImage: false,
      postTextImageConfig: {}
    },
    {
      id: 'status',
      displayName: 'Status',
      type: 'string',
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
      titleStyle: {
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        width: '90px',
        height: '25px',
        background: '#FEF3C7',
        color: '#92400E',
        borderRadius: '12px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'submittedBy',
      displayName: 'Owner',
      type: 'string',
      isMultiValued: true,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'responses',
      displayName: 'Responses',
      type: 'string',
      order: 4,
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
      id: 'updatedAt',
      displayName: 'Modified',
      type: 'string',
      order: 5,
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
      id: 'createdAt',
      displayName: 'Submitted',
      type: 'string',
      order: 6,
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
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'formsTable',
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
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;
  formSubmissions$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = defaultLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  submissionFormsListCount$: Observable<number>;
  nextToken = '';
  public menuState = 'out';
  ghostLoading = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  submissionDetail: any;
  fetchType = 'load';
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.fetchForms$.next({ data: 'search' }))
      )
      .subscribe();
    this.submissionFormsListCount$ =
      this.raceDynamicFormService.getSubmissionFormsListCount$();
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getSubmissionFormsList();
      })
    );

    const onScrollForms$ = this.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getSubmissionFormsList();
        } else {
          return of([] as GetFormListQuery[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.formSubmissions$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 20px)'
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

  getSubmissionFormsList() {
    return this.raceDynamicFormService
      .getSubmissionFormsList$({
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchForm.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ rows, nextToken }) => {
          this.nextToken = nextToken;
          return of(rows);
        }),
        catchError(() => of([]))
      );
  }

  handleTableEvent = (event): void => {
    this.fetchForms$.next(event);
  };

  applyFilters(): void {
    this.isPopoverOpen = false;
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
  }

  ngOnDestroy(): void {}

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    if (this.submissionDetail && this.submissionDetail.id == event.row.id) {
      this.menuState = this.menuState === 'out' ? 'in' : 'out';
    } else {
      this.menuState = 'in';
    }
    this.submissionDetail = event.row;
  };
}
