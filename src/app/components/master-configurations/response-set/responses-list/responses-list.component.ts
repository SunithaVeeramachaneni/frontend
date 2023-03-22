import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import {
  catchError,
  filter,
  tap,
  map,
  mergeMap,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State, getResponseSets } from 'src/app/forms/state';

import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';

import { LoginService } from 'src/app/components/login/services/login.service';
import { ResponseSetService } from '../services/response-set.service';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  FormTableUpdate,
  Permission,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-responses-list',
  templateUrl: './responses-list.component.html',
  styleUrls: ['./responses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesListComponent implements OnInit {
  readonly perms = perms;
  public filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  public userInfo$: Observable<UserInfo>;

  public allResponseSets: any[] = [];
  public allResponseSets$: Observable<any>;
  public responseSets$: Observable<any>;
  public dataSource: MatTableDataSource<any>;

  public selectedResponseSet: any;
  public globalResponseEditData: any;
  public openResponseSetDetailedView = 'out';
  public globaResponseAddOrEditOpenState = 'out';

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

  public searchResponseSet: FormControl;
  private addEditDeleteResponseSet: boolean;
  private addEditDeleteResponseSet$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  private skip = 0;
  private limit = defaultLimit;
  private fetchType = 'load';
  private nextToken = '';

  constructor(
    private responseSetService: ResponseSetService,
    private loginService: LoginService,
    private store: Store<State>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchResponseSet = new FormControl('');
    this.responseSetService.fetchResponses$.next({ data: 'load' });
    this.responseSetService.fetchResponses$.next({} as TableEvent);
    this.allResponseSets$ = this.responseSetService.fetchAllGlobalResponses$();
    this.responseSetCount$ = combineLatest([
      this.responseSetCount$,
      this.responseSetCountUpdate$
    ]).pipe(map(([count, countUpdate]) => count + countUpdate));

    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    this.searchResponseSet.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.responseSetService.fetchResponses$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
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
        searchKey: this.searchResponseSet.value,
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

  addManually = () => {};

  addOrEditGlobalResponse = (responseData) => {
    if (responseData?.status === 'add' || responseData?.status === 'edit') {
      this.addEditDeleteResponseSet = true;
      if (this.searchResponseSet.value) {
        this.responseSetService.fetchResponses$.next({ data: 'search' });
      } else {
        this.addEditDeleteResponseSet$.next({
          action: responseData.status,
          form: responseData.data
        });
      }
    }
  };

  handleTableEvent = (event): void => {
    this.responseSetService.fetchResponses$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  rowLevelActionHandler = ({ data, action }) => {
    switch (action) {
      case 'edit':
        this.globalResponseEditData = data;
        this.globaResponseAddOrEditOpenState = 'in';
        break;
      default:
    }
  };

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'responseCount':
      case 'createdBy':
      case 'updatedAt':
        this.showRepsonseSetDetail(row);
        break;
      default:
    }
  };

  showRepsonseSetDetail = (row) => {
    this.selectedResponseSet = row;
    this.openResponseSetDetailedView = 'in';
  };

  onCloseResponseSetDetailedView = (event) => {
    this.openResponseSetDetailedView = event.status;
    if (event.data !== '') {
      this.globalResponseEditData = event.data;
      this.globaResponseAddOrEditOpenState = 'in';
    }
  };

  onCloseGlobalResponseAddOrEditState = (event) =>
    (this.globaResponseAddOrEditOpenState = event);

  prepareMenuActions = (permissions: Permission[]) => {
    const menuActions = [];
    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'UPDATE_GLOBAL_RESPONSES'
      )
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    this.configOptions = {
      ...this.configOptions,
      rowLevelActions: {
        ...this.configOptions.rowLevelActions,
        menuActions
      },
      displayActionsColumn: menuActions.length > 0
    };
  };
}
