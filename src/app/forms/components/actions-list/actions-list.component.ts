/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
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
  Subject,
  Subscription
} from 'rxjs';
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
import { slideInOut } from 'src/app/animations';

import {
  graphQLDefaultLimit,
  dateTimeFormat2,
  permissions as perms
} from 'src/app/app.constants';
import {
  AssigneeDetails,
  CellClickActionEvent,
  Permission,
  RowLevelActionEvent,
  TableEvent,
  UserDetails,
  UserInfo
} from 'src/app/interfaces';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { LoginService } from 'src/app/components/login/services/login.service';
import { IssuesActionsViewComponent } from '../issues-actions-view/issues-actions-view.component';
import { ObservationsService } from '../../services/observations.service';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';

@Component({
  selector: 'app-actions-list',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ActionsListComponent implements OnInit, OnDestroy {
  @Input() moduleName;
  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => {
        this.userFullNameByEmail = this.userService.getUsersInfo();
        this.assigneeDetails = { users };
      })
    );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  assigneeDetails: AssigneeDetails;
  plantTimezoneMap = {};
  partialColumns: Partial<Column>[] = [
    {
      id: 'title',
      displayName: 'Title',
      type: 'string',
      controlType: 'string',
      visible: true,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        width: '280px',
        color: '#212121',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true
    },
    {
      id: 'locationAsset',
      displayName: 'Location/Asset',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      titleStyle: {
        'font-size': '100%'
      },
      hasSubtitle: true,
      subtitleColumn: 'locationAssetDescription',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      }
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    },
    {
      id: 'priority',
      displayName: 'Priority',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true,
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
      hasConditionalStyles: true
    },
    {
      id: 'statusDisplay',
      displayName: 'Status',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
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
      hasConditionalStyles: true
    },
    {
      id: 'dueDateDisplay',
      displayName: 'Due Date',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    },
    {
      id: 'assignedToDisplay',
      displayName: 'Assigned To',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true,
      titleStyle: {
        'overflow-wrap': 'anywhere'
      }
    },
    {
      id: 'createdBy',
      displayName: 'Raised By',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    }
  ];
  columns: Column[] = [];
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
    tableHeight: 'calc(100vh - 435px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      high: {
        color: '#F6695E'
      },
      medium: {
        color: '#F4A916'
      },
      low: {
        color: '#8b8b8d'
      },
      shutdown: {
        color: '#000000'
      },
      emergency: {
        color: '#E2190E'
      },
      turnaround: {
        color: '#3C59FE'
      },
      open: {
        'background-color': '#e0e0e0',
        color: '#000000'
      },
      'in progress': {
        'background-color': '#ffcc01',
        color: '#000000'
      },
      resolved: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      },
      overdue: {
        'background-color': '#2C9E53',
        color: '#aa2e24'
      }
    }
  };
  dataSource: MatTableDataSource<any>;
  actions$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  skip = 0;
  limit = graphQLDefaultLimit;
  plantMapSubscription: Subscription;
  searchAction: FormControl;
  actionsCount$: Observable<number>;
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  initial: any;
  isModalOpened = false;
  isPopoverOpen = false;
  userFullNameByEmail: any;
  filterJson = [];
  filter = {
    title: '',
    location: '',
    plant: '',
    priority: '',
    status: '',
    dueDate: '',
    assignedTo: ''
  };
  readonly perms = perms;
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly observationsService: ObservationsService,
    private readonly loginService: LoginService,
    private readonly userService: UsersService,
    private plantService: PlantService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = this.observationsService.updateConfigOptionsFromColumns(
      this.partialColumns
    );
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.observationsService.fetchActions$.next({ data: 'load' });
    this.observationsService.fetchActions$.next({} as TableEvent);
    this.searchAction = new FormControl('');
    this.searchAction.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.observationsService.fetchActions$.next({
            data: 'search'
          });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.getFilter();
    this.displayActions();
    this.configOptions.allColumns = this.columns;
  }

  displayActions(): void {
    const actionsOnLoadSearch$ = this.observationsService.fetchActions$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.observationsService.actionsNextToken = '';
        this.fetchType = data;
        return this.getActionsList();
      })
    );

    const onScrollActions$ = this.observationsService.fetchActions$.pipe(
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
      onScrollActions$,
      this.users$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 435px)'
          };
          this.initial.data = this.formatActions(rows);
        } else {
          this.initial.data = this.initial.data.concat(
            this.formatActions(scrollData)
          );
        }
        this.skip = this.initial.data.length;
        this.dataSource = new MatTableDataSource(this.initial.data);
        return this.initial;
      })
    );
  }

  formatActions(actions) {
    return actions.map((action) => {
      const { assignedTo, createdBy } = action;
      return {
        ...action,
        dueDateDisplay: this.formatDate(action.dueDate, action),
        assignedToDisplay:
          assignedTo !== null
            ? this.observationsService.formatUsersDisplay(assignedTo)
            : assignedTo,
        createdBy: this.userService.getUserFullName(createdBy)
      };
    });
  }

  formatDate(date, action) {
    if (date === '') return '';
    if (this.plantTimezoneMap[action?.plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[action.plantId],
        dateTimeFormat2
      );
    }
    return format(new Date(date), dateTimeFormat2);
  }

  getActionsList() {
    const obj = {
      next: this.observationsService.actionsNextToken,
      limit: this.limit,
      searchKey: this.searchAction.value,
      type: 'action',
      moduleName: this.moduleName
    };

    return this.observationsService.getObservations$(obj, this.filter).pipe(
      mergeMap(({ rows, next, count, filters }) => {
        this.observationsService.actionsNextToken = next;
        this.isLoading$.next(false);
        this.actionsCount$ = of(count ?? 0);
        this.observationsService.actions$.next({ rows, next, count, filters });
        this.filterJson = this.observationsService.prepareFilterData(
          filters,
          this.filterJson
        );
        return of(rows as any[]);
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  handleTableEvent = (event): void => {
    this.observationsService.fetchActions$.next(event);
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
    const dialogRef = this.dialog.open(IssuesActionsViewComponent, {
      data: {
        ...row,
        users$: this.users$,
        totalCount$: this.actionsCount$,
        allData: this.initial?.data || [],
        next: this.observationsService.actionsNextToken,
        limit: this.limit,
        moduleName: this.moduleName
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe((resp) => {
      this.isModalOpened = false;
      if (resp && Object.keys(resp).length) {
        const { id, status, priority, dueDate, assignedToDisplay, assignedTo } =
          resp.data;
        this.initial.data = this.dataSource.data.map((data) => {
          if (data.id === id) {
            return {
              ...data,
              status,
              priority,
              dueDate: dueDate
                ? format(new Date(dueDate), 'dd MMM, yyyy hh:mm a')
                : '',
              assignedToDisplay: assignedToDisplay || '',
              assignedTo: assignedTo || ''
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

  getFullNameToEmailArray(data: any) {
    const emailArray = [];
    data?.forEach((name: any) => {
      emailArray.push(
        Object.keys(this.userFullNameByEmail).find(
          (email) => this.userFullNameByEmail[email].fullName === name
        )
      );
    });
    return emailArray;
  }

  applyFilters(data: any): void {
    this.isLoading$.next(true);
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.type === 'date' && item.value) {
        this.filter[item.column] = item.value.toISOString();
      } else if (item.column === 'assignedTo' && item.value) {
        this.filter[item.column] = this.getFullNameToEmailArray(item.value);
      } else {
        this.filter[item.column] = item.value ?? '';
      }
    }
    this.observationsService.actionsNextToken = '';
    this.observationsService.fetchActions$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isLoading$.next(true);
    this.isPopoverOpen = false;
    if (this.searchAction.value) {
      this.searchAction.patchValue('');
    }
    this.filter = {
      title: '',
      location: '',
      plant: '',
      priority: '',
      status: '',
      dueDate: '',
      assignedTo: ''
    };
    this.observationsService.actionsNextToken = '';
    this.observationsService.fetchActions$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getFilter(): void {
    this.observationsService
      .getFormsFilter()
      .subscribe((res) => (this.filterJson = res));
  }
}
