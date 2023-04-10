/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { slideInOut } from 'src/app/animations';

import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  LoadEvent,
  Permission,
  RowLevelActionEvent,
  SearchEvent,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { LoginService } from '../../login/services/login.service';
import { IssuesActionsDetailViewComponent } from '../issues-actions-detail-view/issues-actions-detail-view.component';
import { RoundPlanObservationsService } from '../services/round-plan-observation.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class IssuesComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'title',
      displayName: 'Title',
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
      id: 'locationAsset',
      displayName: 'Location/Asset',
      type: 'string',
      controlType: 'string',
      order: 2,
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-size': '100%'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'locationAssetDescription',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'priority',
      displayName: 'Priority',
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
      titleStyle: {
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        height: '24px',
        color: '#ff4033',
        borderRadius: '12px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'status',
      displayName: 'Status',
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
        right: '15px',
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
      id: 'dueDate',
      displayName: 'Due Date',
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
      groupable: true,
      titleStyle: {
        display: 'inline-block',
        width: 'max-content'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'notificationNumber',
      displayName: 'Notification No.',
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'assignee',
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'issuesTable',
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
      high: {
        color: '#ff4033'
      },
      medium: {
        color: '#ffab46'
      },
      low: {
        color: '#98989a'
      },
      open: {
        'background-color': '#fde2e1',
        color: '#b76262'
      },
      'in-progress': {
        'background-color': '#FFEAC9',
        color: '#a5570e'
      }
    }
  };
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  dataSource: MatTableDataSource<any>;
  issues$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchIssues$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = defaultLimit;
  searchIssue: FormControl;
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  selectedData = null;
  zIndexDelay = 0;
  issuesCount$: Observable<number>;
  readonly perms = perms;
  constructor(
    private readonly roundPlanObservationsService: RoundPlanObservationsService,
    private readonly loginService: LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchIssues$.next({ data: 'load' });
    this.fetchIssues$.next({} as TableEvent);
    this.searchIssue = new FormControl('');
    this.searchIssue.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchIssues$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.displayIssues();
    this.configOptions.allColumns = this.columns;
  }

  displayIssues(): void {
    const issuesOnLoadSearch$ = this.fetchIssues$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getIssuesList();
      })
    );

    const onScrollIssues$ = this.fetchIssues$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getIssuesList();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.issues$ = combineLatest([issuesOnLoadSearch$, onScrollIssues$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 240px)'
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

  getIssuesList() {
    const obj = {
      nextToken: this.nextToken,
      limit: this.limit,
      searchKey: this.searchIssue.value,
      type: 'issue'
    };

    return this.roundPlanObservationsService.getObservations$(obj).pipe(
      mergeMap(({ rows, nextToken, count }) => {
        this.nextToken = nextToken;
        this.isLoading$.next(false);
        this.issuesCount$ = of(count);
        return of(rows as any[]);
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  handleTableEvent = (event): void => {
    this.fetchIssues$.next(event);
  };

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      default:
        this.openModal(row);
    }
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        perms.viewORObservations
      )
    ) {
      menuActions.push({
        title: 'Show Details',
        action: 'showDetails'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  openModal(row: GetFormList): void {
    this.dialog.open(IssuesActionsDetailViewComponent, {
      data: row,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    switch (action) {
      case 'showDetails':
        this.openModal(data);
        break;
      default:
    }
  };
}
