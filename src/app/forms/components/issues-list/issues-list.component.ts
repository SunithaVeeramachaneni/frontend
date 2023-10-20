/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
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
  permissions as perms,
  dateTimeFormat4
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
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { UsersService } from 'src/app/components/user-management/services/users.service';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class IssuesListComponent implements OnInit, OnDestroy {
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
  @Input() moduleName;
  @Input() isNotificationAlert;
  @Input() entityId;
  @Input() entityType;
  assigneeDetails: AssigneeDetails;
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
        color: '#000000',
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
      id: 'notificationInfo',
      displayName: 'Notification No.',
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
    }
  ];
  columns: Column[] = [];
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
  issues$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  skip = 0;
  plantMapSubscription: Subscription;
  limit = graphQLDefaultLimit;
  searchIssue: FormControl;
  menuState = 'out';
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  issuesCount$: Observable<number>;
  initial: any;
  isModalOpened = false;
  placeHolder = '_ _';
  plantTimezoneMap = {};
  readonly perms = perms;
  userFullNameByEmail: any;
  isPopoverOpen = false;

  filterJson = [];
  filter = {
    title: '',
    location: '',
    asset: '',
    plant: '',
    priority: '',
    status: '',
    dueDate: '',
    assignedTo: ''
  };
  plants = [];
  plantsIdNameMap: any = {};
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly observationsService: ObservationsService,
    private readonly loginService: LoginService,
    private plantService: PlantService,
    private readonly dialog: MatDialog,
    private readonly cdrf: ChangeDetectorRef,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.configOptions = {
      ...this.configOptions,
      tableHeight: this.isNotificationAlert
        ? 'calc(100vh - 115px)'
        : 'calc(100vh - 435px)'
    };
    this.columns = this.observationsService.updateConfigOptionsFromColumns(
      this.partialColumns
    );
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.observationsService.fetchIssues$.next({ data: 'load' });
    this.observationsService.fetchIssues$.next({} as TableEvent);
    this.searchIssue = new FormControl('');
    this.searchIssue.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.observationsService.fetchIssues$.next({
            data: 'search'
          });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [], plantId = null }) => {
        this.plantService.setUserPlantIds(plantId);
        this.filter.plant = plantId;
        this.prepareMenuActions(permissions);
      })
    );
    this.getFilter();
    this.displayIssues();
    this.configOptions.allColumns = this.columns;
  }

  displayIssues(): void {
    const issuesOnLoadSearch$ = this.observationsService.fetchIssues$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.observationsService.issuesNextToken = '';
        this.fetchType = data;
        return this.getIssuesList();
      })
    );

    const onScrollIssues$ = this.observationsService.fetchIssues$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (
          data === 'infiniteScroll' &&
          this.observationsService.issuesNextToken !== null
        ) {
          this.fetchType = 'infiniteScroll';
          return this.getIssuesList();
        } else {
          return of([]);
        }
      })
    );

    this.initial = {
      columns: this.columns,
      data: []
    };
    this.issues$ = combineLatest([
      issuesOnLoadSearch$,
      onScrollIssues$,
      this.users$
    ]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: this.isNotificationAlert
              ? 'calc(100vh - 115px)'
              : 'calc(100vh - 435px)'
          };
          this.initial.data = this.formatIssues(rows);
        } else {
          this.initial.data = this.initial.data.concat(
            this.formatIssues(scrollData)
          );
        }
        this.skip = this.initial.data.length;
        this.initial.data = this.initial.data.map((data) => {
          data.notificationInfo = this.isNotificationNumber(
            data.notificationInfo
          )
            ? data.notificationInfo
            : this.placeHolder;
          return data;
        });
        this.dataSource = new MatTableDataSource(this.initial.data);
        return this.initial;
      })
    );
  }

  isNotificationNumber(notificationInfo) {
    if (!notificationInfo || notificationInfo.split(' ').length > 1) {
      return false;
    }
    return true;
  }

  formatIssues(issues) {
    return issues.map((issue) => {
      const { assignedTo } = issue;
      return {
        ...issue,
        dueDateDisplay: this.formatDate(issue.dueDate, issue),
        assignedToDisplay:
          assignedTo !== null
            ? this.observationsService.formatUsersDisplay(assignedTo)
            : assignedTo
      };
    });
  }

  formatDate(date, issue) {
    if (date === '') return '';
    if (this.plantTimezoneMap[issue?.plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[issue.plantId],
        dateTimeFormat4
      );
    }
    return format(new Date(date), dateTimeFormat4);
  }

  getIssuesList() {
    const obj = {
      next: this.observationsService.issuesNextToken,
      limit: this.limit,
      searchKey: this.searchIssue.value,
      type: 'issue',
      moduleName: this.moduleName
    };
    const filterObj = { entityId: '', entityType: '', ...this.filter };
    if (this.entityId && this.entityType) {
      filterObj.entityType = this.entityType;
      filterObj.entityId = this.entityId;
    }
    return this.observationsService.getObservations$(obj, filterObj).pipe(
      mergeMap(({ rows, next, count, filters }) => {
        this.observationsService.issuesNextToken = next;
        this.isLoading$.next(false);
        this.issuesCount$ = of(count ?? 0);
        this.observationsService.issues$.next({ rows, next, count, filters });
        this.filterJson = this.observationsService.prepareFilterData(
          filters,
          this.filterJson
        );

        for (const item of this.filterJson) {
          if (item.column === 'plant') {
            item.items = this.plants;
          }
        }
        return of(rows as any[]);
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  handleTableEvent = (event): void => {
    this.observationsService.fetchIssues$.next(event);
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
        totalCount$: this.issuesCount$,
        allData: this.initial?.data || [],
        next: this.observationsService.issuesNextToken,
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
        const {
          id,
          status,
          priority,
          dueDate,
          assignedToDisplay,
          assignedTo,
          notificationInfo
        } = resp.data;
        this.initial.data = this.dataSource.data.map((data) => {
          if (data.id === id) {
            return {
              ...data,
              status,
              notificationInfo: this.isNotificationNumber(notificationInfo)
                ? notificationInfo
                : this.placeHolder,
              priority,
              dueDate: dueDate
                ? format(new Date(dueDate), 'MMM dd, yyyy hh:mm a')
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
    if (this.searchIssue.value) {
      this.searchIssue.patchValue('');
    }
    for (const item of data) {
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value];
      } else if (item.type === 'date' && item.value) {
        this.filter[item.column] = item.value.toISOString();
      } else if (item.column === 'assignedTo' && item.value) {
        this.filter[item.column] = this.getFullNameToEmailArray(item.value);
      } else {
        this.filter[item.column] = item.value ?? '';
      }
    }
    this.observationsService.issuesNextToken = '';
    this.observationsService.fetchIssues$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isLoading$.next(true);
    this.isPopoverOpen = false;
    this.filter = {
      title: '',
      location: '',
      asset: '',
      plant: this.plantService.getUserPlantIds(),
      priority: '',
      status: '',
      dueDate: '',
      assignedTo: ''
    };
    this.observationsService.issuesNextToken = '';
    this.observationsService.fetchIssues$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getFilter(): void {
    this.observationsService
      .getFormsFilter()
      .pipe(
        switchMap((res: any) => {
          this.filterJson = res;
          return this.plantService.fetchLoggedInUserPlants$().pipe(
            tap((plants) => {
              this.plants = plants
                .map((plant) => {
                  this.plantsIdNameMap[`${plant.plantId}`] = plant.plantId;
                  return `${plant.plantId}`;
                })
                .sort();
            })
          );
        })
      )
      .subscribe();
  }
}
