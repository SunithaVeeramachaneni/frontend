import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State, getResponseSets } from 'src/app/forms/state';

import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';

import { ResponseSetService } from '../services/response-set.service';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import { CellClickActionEvent, TableEvent } from 'src/app/interfaces';

@Component({
  selector: 'app-responses-list',
  templateUrl: './responses-list.component.html',
  styleUrls: ['./responses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesListComponent implements OnInit {
  readonly perms = perms;
  public filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  public allResponseSets: any[] = [];
  public allResponseSets$: Observable<any>;
  public responseSets$: Observable<any>;
  public dataSource: MatTableDataSource<any>;

  public responseSetCount$: Observable<number>;
  public responseSetCountUpdate$: BehaviorSubject<number> = new BehaviorSubject(
    0
  );

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public columns: Column[] = [
    {
      id: 'name',
      displayName: 'Title',
      type: 'string',
      order: 1,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'responseCount',
      displayName: '#Response',
      type: 'number',
      order: 2,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'createdBy',
      displayName: 'Created By',
      type: 'string',
      order: 3,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'updatedAt',
      displayName: 'Last Modified',
      type: 'string',
      order: 3,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];

  public configOptions: ConfigOptions = {
    tableID: 'responsesTable',
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
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      published: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      }
    }
  };

  private skip = 0;
  private limit = defaultLimit;
  private fetchType = 'load';
  private nextToken = '';

  constructor(
    private responseSetService: ResponseSetService,
    private store: Store<State>,
    private cdrf: ChangeDetectionStrategy
  ) {}

  ngOnInit(): void {
    this.responseSetService.fetchResponses$.next({ data: 'load' });
    this.responseSetService.fetchResponses$.next({} as TableEvent);
    this.allResponseSets$ = this.responseSetService.fetchAllGlobalResponses$();
    this.responseSetCount$ = combineLatest([
      this.responseSetCount$,
      this.responseSetCountUpdate$
    ]).pipe(map(([count, countUpdate]) => count + countUpdate));

    this.configOptions.allColumns = this.columns;
    // Implement login service
  }

  getDisplayedResponseSets = () => {
    const responseSetOnLoadSearch$ =
      this.responseSetService.fetchResponses$.pipe(
        filter(({ data }) => data === 'load' || data === 'search'),
        switchMap(({ data }) => {
          this.skip = 0;
          this.fetchType = data;
          return this.getResponseSets();
        })
      );

    const onScrollResponseSets$ = this.responseSetService.fetchResponses$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getResponseSets();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: [] as any
    };
    this.responseSets$ = combineLatest([
      responseSetOnLoadSearch$,
      onScrollResponseSets$,
      this.allResponseSets$
    ]).pipe(
      map(([rows, scrollData, allResponseSets]) => {
        const { items: unfilteredResponseSets } = allResponseSets;
        this.allResponseSets = unfilteredResponseSets.filter(
          (item) => !item._deleted
        );
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 140px)'
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
  };

  getResponseSets() {
    return this.responseSetService
      .fetchResponseSetList$({
        nextToken: this.nextToken,
        limit: this.limit,
        //searchKey: this.searchLocation.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, nextToken }) => {
          this.responseSetCount$ = of(count);
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.responseSetCount$ = of(0);
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  handleTableEvent = (event): void => {
    this.responseSetService.fetchResponses$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'model':
      case 'parentId':
        //this.showLocationDetail(row);
        break;
      default:
    }
  };
}
