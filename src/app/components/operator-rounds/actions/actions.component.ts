/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { format } from 'date-fns';
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
  AssigneeDetails,
  CellClickActionEvent,
  LoadEvent,
  Permission,
  RowLevelActionEvent,
  SearchEvent,
  TableEvent,
  UserDetails,
  UserInfo
} from 'src/app/interfaces';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { LoginService } from '../../login/services/login.service';
import { IssuesActionsDetailViewComponent } from '../issues-actions-detail-view/issues-actions-detail-view.component';
import { RoundPlanObservationsService } from '../services/round-plan-observation.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ActionsComponent implements OnInit {
  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => (this.assigneeDetails = { users }))
    );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  assigneeDetails: AssigneeDetails;
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
        width: '280px',
        color: '#212121'
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'createdBy',
      displayName: 'Raised By',
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
    tableID: 'actionsTable',
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
        color: '#FF3B30'
      },
      medium: {
        color: '#FF9500'
      },
      low: {
        color: ' #8A8A8C'
      },
      'to-do': {
        'background-color': '#fde2e1',
        color: '#b76262'
      },
      open: {
        'background-color': '#fde2e1',
        color: '#b76262'
      },
      resolved: {
        'background-color': '#EEFFF1',
        color: '#2C9E53'
      },
      'in-progress': {
        'background-color': '#FFEAC9',
        color: '#a5570e'
      }
    }
  };
  dataSource: MatTableDataSource<any>;
  actions$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchActions$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = defaultLimit;
  searchAction: FormControl;
  actionsCount$: Observable<number>;
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  initial: any;
  isModalOpened = false;
  readonly perms = perms;
  private _users$: Observable<UserDetails[]>;

  constructor(
    private readonly roundPlanObservationsService: RoundPlanObservationsService,
    private readonly loginService: LoginService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchActions$.next({ data: 'load' });
    this.fetchActions$.next({} as TableEvent);
    this.searchAction = new FormControl('');
    this.searchAction.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchActions$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.displayActions();
    this.configOptions.allColumns = this.columns;
  }

  displayActions(): void {
    const actionsOnLoadSearch$ = this.fetchActions$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getActionsList();
      })
    );

    const onScrollActions$ = this.fetchActions$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getActionsList();
        } else {
          return of([]);
        }
      })
    );

    this.initial = {
      columns: this.columns,
      data: []
    };
    this.actions$ = combineLatest([
      actionsOnLoadSearch$,
      onScrollActions$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 20px)'
          };
          this.initial.data = rows;
        } else {
          this.initial.data = this.initial.data.concat(scrollData);
        }
        this.skip = this.initial.data.length;
        this.initial.data.map((item) => {
          item.preTextImage.image = '/assets/maintenance-icons/actionsIcon.svg';
          return item;
        });
        this.dataSource = new MatTableDataSource(this.initial.data);
        return this.initial;
      })
    );
  }

  getActionsList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchKey: this.searchAction.value,
      type: 'action'
    };

    return this.roundPlanObservationsService.getObservations$(obj).pipe(
      mergeMap(({ rows, next, count }) => {
        this.nextToken = next;
        this.isLoading$.next(false);
        this.actionsCount$ = of(count);
        return of(rows as any[]);
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  handleTableEvent = (event): void => {
    this.fetchActions$.next(event);
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
    if (this.isModalOpened) {
      return;
    }
    this.isModalOpened = true;
    const dialogRef = this.dialog.open(IssuesActionsDetailViewComponent, {
      data: { ...row, users$: this.users$ },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe((resp) => {
      this.isModalOpened = false;
      if (resp && Object.keys(resp).length) {
        const { id, status, priority, dueDate, assignedTo } = resp.data;
        this.initial.data = this.dataSource.data.map((data) => {
          if (data.id === id) {
            return {
              ...data,
              status,
              priority,
              dueDate: format(new Date(dueDate), 'dd MMM, yyyy'),
              assignedTo
            };
          }
          return data;
        });
        this.dataSource = new MatTableDataSource(this.initial.data);
        this.cdrf.detectChanges();
      }
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
