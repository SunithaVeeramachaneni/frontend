import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnDestroy,
  Output
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
  map,
  switchMap,
  tap
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
  RoundDetail,
  RoundDetailResponse,
  SelectTab,
  RowLevelActionEvent,
  UserDetails
} from 'src/app/interfaces';
import {
  formConfigurationStatus,
  graphQLDefaultLimit,
  permissions as perms
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { LoginService } from '../../login/services/login.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';

@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class RoundsComponent implements OnInit, OnDestroy {
  @Input() users$: Observable<UserDetails[]>;
  @Output() selectTab: EventEmitter<SelectTab> = new EventEmitter<SelectTab>();
  filterJson = [];
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
    {
      id: 'locationAssetsCompleted',
      displayName: 'Locations/Assets Completed',
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'tasksCompleted',
      displayName: 'Tasks Completed',
      type: 'string',
      controlType: 'space-between',
      controlValue: ',',
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
      titleStyle: { width: '125px' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'dueDate',
      displayName: 'Due Date',
      type: 'string',
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'schedule',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'string',
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'status',
      displayName: 'Status',
      type: 'string',
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
      groupable: false,
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
    },
    {
      id: 'assignedTo',
      displayName: 'Assigned To',
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'roundsTable',
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
      submitted: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      },
      'in-progress': {
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      open: {
        'background-color': '#FEE2E2',
        color: '#991B1B'
      }
    }
  };
  dataSource: MatTableDataSource<any>;
  rounds$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchRounds$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  roundsCount = 0;
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  selectedForm: RoundDetail;
  zIndexDelay = 0;
  hideRoundDetail: boolean;
  roundPlanId: string;
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchRounds$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchRounds$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    const roundsOnLoadSearch$ = this.fetchRounds$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getRoundsList();
      })
    );

    const onScrollRounds$ = this.fetchRounds$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getRoundsList();
        } else {
          return of({} as RoundDetailResponse);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.rounds$ = combineLatest([
      roundsOnLoadSearch$,
      onScrollRounds$,
      this.users$
    ]).pipe(
      map(([rounds, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 20px)'
          };
          initial.data = rounds.rows.map((roundDetail) => ({
            ...roundDetail,
            assignedTo: this.operatorRoundsService.getUserFullName(
              roundDetail.assignedTo
            )
          }));
        } else {
          initial.data = initial.data.concat(
            scrollData.rows.map((roundDetail) => ({
              ...roundDetail,
              assignedTo: this.operatorRoundsService.getUserFullName(
                roundDetail.assignedTo
              )
            }))
          );
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );

    this.activatedRoute.params.subscribe(() => {
      this.hideRoundDetail = true;
    });

    this.activatedRoute.queryParams.subscribe(({ roundPlanId = '' }) => {
      this.roundPlanId = roundPlanId;
      this.fetchRounds$.next({ data: 'load' });
      this.isLoading$.next(true);
    });

    this.configOptions.allColumns = this.columns;
  }

  getRoundsList() {
    const obj = {
      nextToken: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      roundPlanId: this.roundPlanId
    };

    return this.operatorRoundsService.getRoundsList$(obj).pipe(
      tap(({ count, nextToken }) => {
        this.nextToken = nextToken !== undefined ? nextToken : null;
        this.roundsCount = count !== undefined ? count : this.roundsCount;
        this.isLoading$.next(false);
      })
    );
  }

  handleTableEvent = (event): void => {
    this.fetchRounds$.next(event);
  };

  ngOnDestroy(): void {}

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    this.openRoundHandler(event.row);
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [
      {
        title: 'Show Details',
        action: 'showDetails'
      },
      {
        title: 'Show Plan',
        action: 'showPlans'
      }
    ];

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
    this.store.dispatch(FormConfigurationActions.resetPages());
    timer(400)
      .pipe(
        tap(() => {
          this.hideRoundDetail = true;
          this.zIndexDelay = 0;
        })
      )
      .subscribe();
  }

  openRoundHandler(row: RoundDetail): void {
    this.hideRoundDetail = false;
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.selectedForm = row;
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  roundsDetailActionHandler() {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/operator-rounds/edit/${this.selectedForm.id}`]);
  }

  getFilter() {
    this.operatorRoundsService.getRoundFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  applyFilters(data: any): void {
    this.isPopoverOpen = false;
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    switch (action) {
      case 'showDetails':
        this.openRoundHandler(data);
        break;
      case 'showPlans':
        this.selectTab.emit({ index: 0, queryParams: { id: data.id } });
        break;
      default:
      // do nothing
    }
  };
}
