import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  timer
} from 'rxjs';
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
  CellClickActionEvent,
  Permission,
  UserInfo,
  RowLevelActionEvent
} from 'src/app/interfaces';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import { GetFormListQuery } from 'src/app/API.service';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { LoginService } from '../../login/services/login.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class PlansComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Name',
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
        color: '#000000'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    /* {
      id: 'floc',
      displayName: 'F.Loc',
      type: 'number',
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
    }, */
    /* {
      id: 'assets',
      displayName: 'Assets',
      type: 'number',
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }, */
    /* {
      id: 'tasks',
      displayName: 'Tasks',
      type: 'number',
      controlType: 'string',
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
    }, */
    {
      id: 'schedule',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'button',
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
    /* {
      id: 'roundsGenerated',
      displayName: 'Rounds Generated',
      type: 'number',
      controlType: 'string',
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
    }, */
    /* {
      id: 'operator',
      displayName: 'Operator',
      type: 'string',
      controlType: 'string',
      order: 7,
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
    },*/
    {
      id: 'start',
      displayName: 'Start - Ends',
      type: 'string',
      controlType: 'string',
      order: 8,
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
    tableID: 'plansTable',
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
  dataSource: MatTableDataSource<any>;
  roundPlans$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = defaultLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  roundPlansCount$: Observable<number>;
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  roundPlanDetail: GetFormListQuery = null;
  scheduleRoundPlanDetail: GetFormListQuery = null;
  zIndexDelay = 0;
  zIndexScheduleDelay = 0;
  openScheduleConfig$: Observable<boolean>;
  scheduleConfigState = 'out';
  readonly perms = perms;

  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchForms$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.roundPlansCount$ =
      this.operatorRoundsService.getFormsListCount$('Published');
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.displayRoundPlans();
    this.configOptions.allColumns = this.columns;
  }

  displayRoundPlans(): void {
    const roundPlansOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getRoundPlanList();
      })
    );

    const onScrollRoundPlans$ = this.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getRoundPlanList();
        } else {
          return of([] as GetFormListQuery[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.roundPlans$ = combineLatest([
      roundPlansOnLoadSearch$,
      onScrollRoundPlans$
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
        const newData = initial.data.map((element) => {
          element = { schedule: 'Schedule', ...element };
          return element;
        });
        initial.data = newData;
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getRoundPlanList() {
    const obj = {
      nextToken: this.nextToken,
      limit: this.limit,
      searchKey: this.searchForm.value,
      fetchType: this.fetchType
    };

    return this.operatorRoundsService.getFormsList$(obj, 'Published').pipe(
      mergeMap(({ rows, nextToken }) => {
        this.nextToken = nextToken;
        this.isLoading$.next(false);
        return of(rows as any);
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
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
    const { columnId, row } = event;
    switch (columnId) {
      case 'schedule':
        this.openScheduleConfigHandler(row);
        break;
      default:
        this.openRoundPlanHandler(event.row);
    }
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [
      {
        title: 'Show Details',
        action: 'showDetails'
      }
    ];

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        perms.scheduleRounds
      )
    ) {
      menuActions.push({
        title: 'Schedule',
        action: 'schedule'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  closeRoundPlanHandler() {
    this.roundPlanDetail = null;
    this.menuState = 'out';
    this.store.dispatch(FormConfigurationActions.resetPages());
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexDelay = 0;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }

  openRoundPlanHandler(row: GetFormListQuery): void {
    this.closeScheduleConfigHandler('out');
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.roundPlanDetail = row;
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  roundPlanDetailActionHandler(event) {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/operator-rounds/edit/${this.roundPlanDetail.id}`]);
  }

  openScheduleConfigHandler(row: GetFormListQuery) {
    this.closeRoundPlanHandler();
    this.scheduleRoundPlanDetail = row;
    this.scheduleConfigState = 'in';
    this.zIndexScheduleDelay = 400;
  }

  closeScheduleConfigHandler(event: string) {
    this.scheduleRoundPlanDetail = null;
    this.scheduleConfigState = event;
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexScheduleDelay = 0;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    switch (action) {
      case 'schedule':
        this.openScheduleConfigHandler(data);
        break;
      case 'showDetails':
        this.openRoundPlanHandler(data);
        break;
      default:
      // do nothing
    }
  };
}
