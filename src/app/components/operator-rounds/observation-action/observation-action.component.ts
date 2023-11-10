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
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import { ObservationsService } from 'src/app/forms/services/observations.service';
import { IssuesActionsViewComponent } from 'src/app/forms/components/issues-actions-view/issues-actions-view.component';
import { AppService } from 'src/app/shared/services/app.services';

@Component({
  selector: 'app-observation-action',
  templateUrl: './observation-action.component.html',
  styleUrls: ['./observation-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ObservationActionComponent implements OnInit, OnDestroy {
  @Input() moduleName;
  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => {
        this.userFullNameByEmail = this.userService.getUsersInfo();
        this.assigneeDetails = { users };
      })
    );
  }
  @Input() actions;
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  assigneeDetails: AssigneeDetails;
  plantTimezoneMap = {};
  partialColumns: Partial<Column>[] = [
    {
      id: 'TITLE',
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
      subtitleColumn: 'DESCRIPTION',
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
      id: 'PRIORITY',
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
      id: 'STATUS',
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
      id: 'SHIFT',
      displayName: 'Shift',
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
    asset: '',
    plant: '',
    priority: '',
    status: '',
    dueDate: '',
    assignedTo: '',
    userPlant: ''
  };
  plants = [];
  plantsIdNameMap: any = {};
  status: any = {};
  selectedStatus: string;
  get pendingStatusCount() {
    return this.initial.data.filter(
      (data) => data.STATUS.toLowerCase() === this.status.pending
    ).length;
  }
  get raisedStatusCount() {
    return this.initial.data.filter(
      (data) => data.STATUS.toLowerCase() === this.status.raised
    ).length;
  }
  get resolvedStatusCount() {
    return this.initial.data.filter(
      (data) => data.STATUS.toLowerCase() === this.status.resolved
    ).length;
  }
  readonly perms = perms;
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly observationsService: ObservationsService,
    private readonly loginService: LoginService,
    private readonly userService: UsersService,
    private plantService: PlantService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private appService: AppService
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
      tap(({ permissions = [], plantId = null }) => {
        this.plantService.setUserPlantIds(plantId);
        this.filter.userPlant = plantId;
        this.prepareMenuActions(permissions);
      })
    );
    this.getFilter();
    this.configOptions.allColumns = this.columns;
    this.selectedStatus = 'pending';
    this.status = {
      pending: 'open',
      raised: 'raised',
      resolved: 'resolved'
    };
    this.displayActions();
  }

  displayActions(): void {
    this.initial = {
      columns: this.columns,
      data: []
    };

    const { rows } = this.observationsService.formateGetObservationResponse(
      this.actions,
      'action'
    );

    this.initial.data = this.formatActions(rows);
    this.configOptions = {
      ...this.configOptions,
      tableHeight: 'calc(100vh - 115px)'
    };

    const filteredData = this.initial.data.filter(
      (data) => data.STATUS.toLowerCase() === this.status.pending
    );
    this.dataSource = new MatTableDataSource(filteredData);
  }

  formatActions(actions) {
    return actions.map((action) => {
      const { ASSIGNEE, createdBy } = action;
      return {
        ...action,
        dueDateDisplay: this.formatDate(action.DUEDATE, action),
        assignedToDisplay: ASSIGNEE,
        createdBy: createdBy
      };
    });
  }

  formatDate(date, action) {
    if (date === '') return '';
    if (this.plantTimezoneMap[action?.plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[action.plantId],
        dateTimeFormat4
      );
    }
    return format(new Date(date), dateTimeFormat4);
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

    // this.configOptions.rowLevelActions.menuActions = menuActions;
    // this.configOptions.displayActionsColumn = menuActions.length ? true : false;
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
        moduleName: this.moduleName,
        isSHR: true
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
    if (!this.filter.userPlant) {
      this.filter.userPlant = this.plantService.getUserPlantIds();
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
      asset: '',
      userPlant: this.plantService.getUserPlantIds(),
      plant: '',
      priority: '',
      status: '',
      dueDate: '',
      assignedTo: ''
    };
    this.observationsService.actionsNextToken = '';
    this.observationsService.fetchActions$.next({ data: 'load' });
  }

  onStatusClick(status: string): void {
    this.selectedStatus = status;
    let filteredData;

    switch (status) {
      case 'pending':
        filteredData = this.initial.data.filter(
          (data) => data.STATUS.toLowerCase() === this.status.pending
        );
        break;
      case 'raised':
        filteredData = this.initial.data.filter(
          (data) => data.STATUS.toLowerCase() === this.status.raised
        );
        break;
      case 'resolved':
        filteredData = this.initial.data.filter(
          (data) => data.STATUS.toLowerCase() === this.status.resolved
        );
        break;

      default:
        break;
    }
    this.dataSource.data = filteredData;
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
