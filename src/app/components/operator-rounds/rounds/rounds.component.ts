/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
  ViewChild
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject,
  Subscription,
  timer
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
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
  UserDetails,
  AssigneeDetails,
  ErrorInfo,
  SelectedAssignee
} from 'src/app/interfaces';
import {
  formConfigurationStatus,
  graphQLDefaultLimit,
  graphQLRoundsOrInspectionsLimit,
  dateFormat2,
  dateTimeFormat4,
  permissions as perms,
  dateFormat5,
  hourFormat,
  statusColors
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { LoginService } from '../../login/services/login.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { MatDialog } from '@angular/material/dialog';
import { PDFPreviewComponent } from 'src/app/forms/components/pdf-preview/pdf-preview.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToastService } from 'src/app/shared/toast';
import { UsersService } from '../../user-management/services/users.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { format } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShiftChangeWarningModalComponent } from '../shift-change-warning-modal/shift-change-warning-modal.component';
@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class RoundsComponent implements OnInit, OnDestroy {
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;

  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => {
        this.assigneeDetails = { users };
        this.userFullNameByEmail = this.userService.getUsersInfo();
      })
    );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  @Output() selectTab: EventEmitter<SelectTab> = new EventEmitter<SelectTab>();
  assigneeDetails: AssigneeDetails;
  filterJson = [];
  status = [
    'Open',
    'In-Progress',
    'Submitted',
    'Assigned',
    'Partly-Open',
    'Overdue'
  ];
  filter = {
    status: '',
    schedule: '',
    assignedTo: '',
    dueDate: '',
    plant: ''
  };
  assignedTo: string[] = [];
  schedules: string[] = [];
  shiftObj: any = {};
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
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
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
      id: 'shift',
      displayName: 'Shift',
      type: 'string',
      controlType: 'dropdown',
      controlValue: {
        dependentFieldId: 'status',
        dependentFieldValues: ['to-do', 'open', 'in-progress'],
        displayType: 'text'
      },
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'scheduledAtDisplay',
      displayName: 'Start',
      type: 'string',
      controlType: 'dropdown',
      controlValue: {
        dependentFieldId: 'status',
        dependentFieldValues: ['to-do', 'open', 'in-progress'],
        displayType: 'text'
      },
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
      id: 'dueDateDisplay',
      displayName: 'Due Date',
      type: 'string',
      controlType: 'dropdown',
      controlValue: {
        dependentFieldId: 'status',
        dependentFieldValues: [
          'assigned',
          'open',
          'in-progress',
          'partly-open',
          'overdue'
        ],
        displayType: 'text'
      },
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
    },

    {
      id: 'locationAssetsCompleted',
      displayName: 'Locations/Assets Completed',
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
      id: 'tasksCompleted',
      displayName: 'Tasks Completed',
      type: 'string',
      controlType: 'space-between',
      controlValue: ',',
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
      titleStyle: { width: '125px' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },

    {
      id: 'schedule',
      displayName: 'Schedule',
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
      order: 9,
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
        borderRadius: '12px',
        padding: '0 5px'
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
      controlType: 'dropdown',
      controlValue: {
        dependentFieldId: 'status',
        dependentFieldValues: [
          'assigned',
          'open',
          'in-progress',
          'partly-open',
          'overdue'
        ],
        displayType: 'text'
      },
      order: 10,
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
        'background-color': statusColors.submitted,
        color: statusColors.white
      },
      'in-progress': {
        'background-color': statusColors.inProgress,
        color: statusColors.black
      },
      open: {
        'background-color': statusColors.open,
        color: statusColors.black
      },
      assigned: {
        'background-color': statusColors.assigned,
        color: statusColors.black
      },
      'partly-open': {
        'background-color': statusColors.partlyOpen,
        color: statusColors.black
      },
      overdue: {
        'background-color': statusColors.overdue,
        color: statusColors.white
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
  plantMapSubscription: Subscription;
  limit = graphQLRoundsOrInspectionsLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  roundsCount = 0;
  nextToken = '';
  formDetailState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  selectedRound: RoundDetail;
  selectedRoundInfo: RoundDetail;
  selectedDueDate = null;
  selectedStartDate = null;
  zIndexDelay = 0;
  hideRoundDetail: boolean;
  roundPlanId: string;
  assigneePosition: any;
  shiftPosition: any;
  initial: any;
  plants = [];
  plantsIdNameMap = {};
  userFullNameByEmail = {};
  roundId = '';
  sliceCount = 100;
  plantTimezoneMap = {};
  plantShiftObj: any = {};
  plantSelected: any;
  plantToShift: any;

  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastService: ToastService,
    private userService: UsersService,
    private cdrf: ChangeDetectorRef,
    private plantService: PlantService,
    private shiftSevice: ShiftService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.fetchRounds$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.getAllOperatorRounds();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
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
        this.dataSource = new MatTableDataSource([]);
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

    this.initial = {
      columns: this.columns,
      data: []
    };
    this.rounds$ = combineLatest([
      roundsOnLoadSearch$,
      onScrollRounds$,
      this.users$,
      this.shiftSevice.fetchAllShifts$().pipe(
        tap((shifts) => {
          shifts.items.map((shift) => {
            this.shiftObj[shift.id] = shift;
          });
        })
      ),
      this.plantService.fetchAllPlants$().pipe(
        tap((plants) => {
          plants.items.map((plant) => {
            if (this.commonService.isJson(plant.shifts) && plant.shifts) {
              this.plantShiftObj[plant.id] = JSON.parse(plant.shifts);
              console.log('plantId', plant.plantId);
            }
          });
        })
      )
    ]).pipe(
      map(([rounds, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          };

          this.initial.data = rounds.rows.map((roundDetail) => ({
            ...roundDetail,

            dueDateDisplay: this.formatDate(
              roundDetail.dueDate,
              roundDetail.plantId
            ),
            scheduledAtDisplay: this.formatDate(
              roundDetail.scheduledAt,
              roundDetail.plantId
            ),
            assignedTo: this.userService.getUserFullName(
              roundDetail.assignedTo
            ),
            assignedToEmail: roundDetail.assignedTo
          }));
        } else {
          this.initial.data = this.initial.data.concat(
            scrollData.rows?.map((roundDetail) => ({
              ...roundDetail,

              dueDateDisplay: this.formatDate(
                roundDetail.dueDate,
                roundDetail.plantId
              ),
              scheduledAtDisplay: this.formatDate(
                roundDetail.scheduledAt,
                roundDetail.plantId
              ),
              assignedTo: this.userService.getUserFullName(
                roundDetail.assignedTo
              ),
              assignedToEmail: roundDetail.assignedTo
            }))
          );
        }

        this.initial.data = this.addShift(this.initial.data);
        this.skip = this.initial.data.length;
        // Just a work around to improve the perforamce as we getting more records in the single n/w call. When small chunk of records are coming n/w call we can get rid of slice implementation

        const sliceStart = this.dataSource ? this.dataSource.data.length : 0;
        const dataSource = this.dataSource
          ? this.dataSource.data.concat(
              this.initial.data.slice(sliceStart, sliceStart + this.sliceCount)
            )
          : this.initial.data.slice(sliceStart, this.sliceCount);
        this.dataSource = new MatTableDataSource(dataSource);
        return this.initial;
      })
    );

    this.activatedRoute.params.subscribe(() => {
      this.hideRoundDetail = true;
    });

    this.activatedRoute.queryParams.subscribe(
      ({ roundPlanId = '', roundId = '' }) => {
        this.roundPlanId = roundPlanId;
        this.roundId = roundId;
        this.fetchRounds$.next({ data: 'load' });
        this.isLoading$.next(true);
      }
    );

    this.configOptions.allColumns = this.columns;
  }

  addShift(rounds) {
    return rounds.map((round) => {
      round.shift = this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].name;
      return round;
    });
  }

  getRoundsList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      roundPlanId: this.roundPlanId,
      roundId: this.roundId
    };
    this.isLoading$.next(true);
    return this.operatorRoundsService
      .getRoundsList$({ ...obj, ...this.filter })
      .pipe(
        tap(({ count, next }) => {
          this.nextToken = next !== undefined ? next : null;
          this.roundsCount = count !== undefined ? count : this.roundsCount;
          this.isLoading$.next(false);
        })
      );
  }

  handleTableEvent = (event): void => {
    this.fetchRounds$.next(event);
  };

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  formatDate(date, plantId) {
    if (this.plantTimezoneMap[plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[plantId],
        dateTimeFormat4
      );
    }
    return format(new Date(date), dateTimeFormat4);
  }

  cellClickActionHandler = (event: CellClickActionEvent) => {
    const { columnId, row } = event;
    const pos = document.getElementById(`${row.id}`).getBoundingClientRect();
    switch (columnId) {
      case 'assignedTo':
        this.assigneePosition = {
          top: `${pos?.top + 7}px`,
          left: `${pos?.left - 15}px`
        };
        if (row.status !== 'submitted') this.trigger.toArray()[0].openMenu();
        this.selectedRoundInfo = row;
        break;
      case 'dueDateDisplay':
        this.selectedDueDate = { ...this.selectedDueDate, date: row.dueDate };
        if (this.plantTimezoneMap[row?.plantId]?.timeZoneIdentifier) {
          const dueDate = new Date(
            formatInTimeZone(
              row.dueDate,
              this.plantTimezoneMap[row.plantId].timeZoneIdentifier,
              dateTimeFormat4
            )
          );
          this.selectedDueDate = { ...this.selectedDueDate, date: dueDate };
        }
        if (row.status !== 'submitted') this.trigger.toArray()[2].openMenu();
        this.selectedRoundInfo = row;
        break;
      case 'shift':
        this.shiftPosition = {
          top: `${pos?.top + 7}px`,
          left: `${pos?.left - 15}px`
        };
        // console.log('shift', this.plantShiftObj);
        this.plantToShift = this.plantShiftObj;
        this.plantSelected = row.plantId;
        if (row.status !== 'submitted') this.trigger.toArray()[3].openMenu();
        this.selectedRoundInfo = row;
        break;
      case 'scheduledAtDisplay':
        this.selectedStartDate = {
          ...this.selectedStartDate,
          date: row.scheduledAt
        };
        // if (
        //   row.plantId &&
        //   this.plantTimezoneMap[row.plantId] &&
        //   this.plantTimezoneMap[row.plantId].timeZoneIdentifier
        // ) {
        //   const scheduledAt = new Date(
        //     formatInTimeZone(
        //       row.scheduledAt,
        //       this.plantTimezoneMap[row.plantId].timeZoneIdentifier,
        //       dateTimeFormat4
        //     )
        //   );
        //   this.selectedStartDate = {
        //     ...this.selectedStartDate,
        //     date: scheduledAt
        //   };
        // }

        if (row.status !== 'submitted') this.trigger.toArray()[2].openMenu();
        this.selectedRoundInfo = row;
        break;

      default:
        this.openRoundHandler(row);
    }
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

    if (
      !this.loginService.checkUserHasPermission(
        permissions,
        'SCHEDULE_ROUND_PLAN'
      )
    ) {
      this.columns[3].controlType = 'string';
      this.columns[6].controlType = 'string';
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  onCloseViewDetail() {
    this.selectedRound = null;
    this.formDetailState = 'out';
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
    this.selectedRound = row;
    this.formDetailState = 'in';
    this.zIndexDelay = 400;
  }

  roundsDetailActionHandler(event) {
    if (event) {
      const { type } = event;
      if (type === 'VIEW_PDF') {
        this.dialog.open(PDFPreviewComponent, {
          data: {
            moduleName: 'OPERATOR_ROUNDS',
            roundId: this.selectedRound.id,
            selectedForm: this.selectedRound
          },
          hasBackdrop: false,
          disableClose: true,
          width: '100vw',
          minWidth: '100vw',
          height: '100vh'
        });
      } else if (type === 'DOWNLOAD_PDF') {
        this.downloadPDF(this.selectedRound);
      }
    } else {
      this.store.dispatch(FormConfigurationActions.resetPages());
      this.router.navigate([`/operator-rounds/edit/${this.selectedRound.id}`]);
    }
  }

  downloadPDF(selectedForm) {
    const roundPlanId = selectedForm.id;
    const roundId = selectedForm.roundId;

    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };

    this.operatorRoundsService
      .downloadAttachment$(roundPlanId, roundId, info)
      .subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const aElement = document.createElement('a');
          const fileName =
            selectedForm.name && selectedForm.name?.length
              ? selectedForm.name
              : 'untitled';
          aElement.setAttribute('download', `${fileName}.pdf`);
          const href = URL.createObjectURL(blob);
          aElement.href = href;
          aElement.setAttribute('target', '_blank');
          aElement.click();
          URL.revokeObjectURL(href);
        },
        (err) => {
          this.toastService.show({
            text: 'Error occured while generating PDF!',
            type: 'warning'
          });
        }
      );
  }

  getAllOperatorRounds() {
    this.isLoading$.next(true);
    this.operatorRoundsService.fetchAllRounds$().subscribe(
      (formsList) => {
        this.isLoading$.next(false);
        const objectKeys = Object.keys(formsList);
        if (objectKeys.length > 0) {
          const uniqueAssignTo = formsList
            ?.map((item) => item.assignedTo)
            .filter((value, index, self) => self.indexOf(value) === index);

          const uniqueSchedules = formsList
            ?.map((item) => item?.schedule)
            .filter((value, index, self) => self?.indexOf(value) === index);

          if (uniqueSchedules?.length > 0) {
            uniqueSchedules?.filter(Boolean).forEach((item) => {
              if (item) {
                this.schedules.push(item);
              }
            });
          }
          if (uniqueAssignTo?.length > 0) {
            uniqueAssignTo?.filter(Boolean).forEach((item) => {
              if (item && this.userFullNameByEmail[item] !== undefined) {
                this.assignedTo.push(this.userFullNameByEmail[item].fullName);
              }
            });
          }

          const uniquePlants = formsList
            .map((item) => {
              if (item.plant) {
                this.plantsIdNameMap[item.plant] = item.plantId;
                return item.plant;
              }
              return '';
            })
            .filter((value, index, self) => self.indexOf(value) === index);
          this.plants = [...uniquePlants];

          for (const item of this.filterJson) {
            if (item.column === 'assignedTo') {
              item.items = this.assignedTo;
            } else if (item['column'] === 'plant') {
              item.items = this.plants;
            }
            if (item.column === 'schedule') {
              item.items = this.schedules;
            }
          }
        }
      },
      () => this.isLoading$.next(false)
    );
  }

  getFilter() {
    this.operatorRoundsService.getRoundFilter().subscribe((res) => {
      this.filterJson = res;
      for (const item of this.filterJson) {
        if (item['column'] === 'status') {
          item.items = this.status;
        }
      }
    });
  }

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
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        const plantId = this.plantsIdNameMap[item.value];
        this.filter[item.column] = plantId ?? '';
      } else if (item.column === 'status' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.column === 'schedule' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.column === 'assignedTo' && item.value) {
        this.filter[item.column] = this.getFullNameToEmailArray(item.value);
      } else if (item.column === 'dueDate' && item.value) {
        this.filter[item.column] = item.value.toISOString();
      }
    }
    this.nextToken = '';
    this.fetchRounds$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
    this.filter = {
      status: '',
      schedule: '',
      assignedTo: '',
      dueDate: '',
      plant: ''
    };
    this.nextToken = '';
    this.fetchRounds$.next({ data: 'load' });
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

  selectedAssigneeHandler({ user }: SelectedAssignee) {
    const { email: assignedTo } = user;
    const { roundId, assignedToEmail, ...rest } = this.selectedRoundInfo;
    let previouslyAssignedTo =
      this.selectedRoundInfo.previouslyAssignedTo || '';
    if (assignedTo !== assignedToEmail) {
      previouslyAssignedTo += previouslyAssignedTo.length
        ? `,${assignedToEmail}`
        : assignedToEmail;
    }

    if (previouslyAssignedTo.includes(assignedTo)) {
      previouslyAssignedTo = previouslyAssignedTo
        .split(',')
        .filter((email) => email !== assignedTo)
        .join(',');
    }

    let { status } = this.selectedRoundInfo;
    status = status.toLowerCase() === 'open' ? 'assigned' : status;
    status = status.toLowerCase() === 'partly-open' ? 'in-progress' : status;
    this.operatorRoundsService
      .updateRound$(
        roundId,
        { ...rest, roundId, assignedTo, previouslyAssignedTo, status },
        'assigned-to'
      )
      .pipe(
        tap((resp) => {
          if (Object.keys(resp).length) {
            this.dataSource.data = this.dataSource.data.map((data) => {
              if (data.roundId === roundId) {
                return {
                  ...data,
                  assignedTo: this.userService.getUserFullName(assignedTo),
                  status,
                  roundDBVersion: resp.roundDBVersion + 1,
                  assignedToEmail: resp.assignedTo
                };
              }
              return data;
            });
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.cdrf.detectChanges();
            this.toastService.show({
              type: 'success',
              text: 'Assigned to updated successfully'
            });
          }
        })
      )
      .subscribe();
    this.trigger.toArray()[0].closeMenu();
  }

  dateChangeHandler(dueDate: Date) {
    console.log(
      'shiftdate:',
      this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010']
    );

    const selectedRoundShiftId = this.selectedRoundInfo.shiftId;
    // const startDate = this.shiftObj[this.selectedRoundInfo.shiftId];
    // const startTime =
    //   this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].startTime;
    // const endTime =
    //   this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].endTime.split(':').monthe;

    const { roundId, assignedToEmail, plantId, ...rest } =
      this.selectedRoundInfo;
    const dueDateDisplayFormat = format(dueDate, dateTimeFormat4);
    const dueStartHour = dueDate.getHours().toString();
    const dueStartMinutes = dueDate.getMinutes().toString();
    const data = { type: 'shift' };
    console.log('dueDategetTime:', dueDate.getHours());
    const openDialogModalRef = this.dialog.open(
      ShiftChangeWarningModalComponent,
      { data }
    );
    openDialogModalRef.afterClosed().subscribe((resp) => {
      if (resp) {
        if (
          plantId &&
          this.plantTimezoneMap[plantId] &&
          this.plantTimezoneMap[plantId].timeZoneIdentifier
        ) {
          dueDate = zonedTimeToUtc(
            format(dueDate, dateTimeFormat4),
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          );
        }

        this.operatorRoundsService
          .updateRound$(roundId, { ...rest, roundId, dueDate }, 'due-date')
          .pipe(
            tap((resp: any) => {
              if (Object.keys(resp).length) {
                this.dataSource.data = this.dataSource.data.map((data) => {
                  if (data.roundId === roundId) {
                    return {
                      ...data,
                      dueDate,
                      dueDateDisplay: dueDateDisplayFormat,
                      roundDBVersion: resp.roundDBVersion + 1,
                      roundDetailDBVersion: resp.roundDetailDBVersion + 1,
                      assignedToEmail: resp.assignedTo
                    };
                  }
                  return data;
                });
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.cdrf.detectChanges();
                this.toastService.show({
                  type: 'success',
                  text: 'Due date updated successfully'
                });
              }
            })
          )
          .subscribe();
      }
    });
  }

  startDateChangeHandler(changedScheduledAt: Date) {
    const { roundId, assignedToEmail, plantId, dueDate, scheduledAt, ...rest } =
      this.selectedRoundInfo;

    const startDateDisplayFormat = format(changedScheduledAt, dateTimeFormat4);

    const selectedRoundShiftId = this.selectedRoundInfo.shiftId;
    // const startDate = this.shiftObj[this.selectedRoundInfo.shiftId];
    const scheduleStartHour = changedScheduledAt.getHours().toString();
    const scheduleStartMinutes = changedScheduledAt.getMinutes().toString();

    const endTimeMinutes =
      this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].endTime.split(
        ':'
      )[1];
    const endTimeHour =
      this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].endTime.split(
        ':'
      )[0];

    const startTimeMinutes =
      this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].startTime.split(
        ':'
      )[1];
    const startTimeHour =
      this.shiftObj['c4be1177-9098-4a2b-8f47-7d950a31b010'].startTime.split(
        ':'
      )[0];

    if (
      scheduleStartHour > startTimeHour &&
      scheduleStartHour < endTimeHour &&
      scheduleStartMinutes < endTimeMinutes &&
      scheduleStartMinutes > startTimeMinutes
    ) {
      const data = { type: 'warning' };
      const openDialogModalRef = this.dialog.open(
        ShiftChangeWarningModalComponent,
        { data }
      );
      openDialogModalRef.afterClosed().subscribe((resp) => {
        if (resp) {
          if (
            plantId &&
            this.plantTimezoneMap[plantId] &&
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          ) {
            const time = localToTimezoneDate(
              this.selectedRoundInfo.scheduledAt,
              this.plantTimezoneMap[plantId],
              hourFormat
            );
            changedScheduledAt = zonedTimeToUtc(
              format(scheduledAt, dateFormat5) + ` ${time}`,
              this.plantTimezoneMap[plantId].timeZoneIdentifier
            );
          }

          let changedDueDate = dueDate.setDate(
            dueDate.getDate() +
              Math.abs(changedScheduledAt.getDate() - scheduledAt.getDate())
          );
          this.operatorRoundsService
            .updateRound$(
              roundId,
              { ...rest, roundId, scheduledAt, dueDate },
              'start-date'
            )
            .pipe(
              tap((resp: any) => {
                if (Object.keys(resp).length) {
                  this.dataSource.data = this.dataSource.data.map((data) => {
                    if (data.roundId === roundId) {
                      return {
                        ...data,
                        scheduledAt,
                        dueDate: changedDueDate,
                        scheduledAtDisplay: startDateDisplayFormat,
                        roundDBVersion: resp.roundDBVersion + 1,
                        roundDetailDBVersion: resp.roundDetailDBVersion + 1,
                        assignedToEmail: resp.assignedTo
                      };
                    }
                    return data;
                  });
                  this.dataSource = new MatTableDataSource(
                    this.dataSource.data
                  );
                  this.cdrf.detectChanges();
                  this.toastService.show({
                    type: 'success',
                    text: 'Start Date Updated Successfully'
                  });
                }
              })
            )
            .subscribe();
        }
      });
    } else {
      const data = { type: 'date' };
      this.dialog.open(ShiftChangeWarningModalComponent, { data });
    }
  }

  shiftChangeHandler(shift) {
    const { roundId, assignedToEmail, plantId, ...rest } =
      this.selectedRoundInfo;
    const shiftId = shift.id;

    const openDialogModalRef = this.dialog.open(
      ShiftChangeWarningModalComponent
    );
    openDialogModalRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.operatorRoundsService
          .updateRound$(roundId, { ...rest, roundId, shiftId }, 'shift')
          .pipe(
            tap((resp: any) => {
              if (Object.keys(resp).length) {
                this.dataSource.data = this.dataSource.data.map((data) => {
                  const shift = this.shiftObj[resp.shiftId].name;
                  if (data.roundId === roundId) {
                    return {
                      ...data,
                      shift,
                      roundDBVersion: resp.roundDBVersion + 1,
                      roundDetailDBVersion: resp.roundDetailDBVersion + 1,
                      assignedToEmail: resp.assignedTo
                    };
                  }
                  return data;
                });
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.cdrf.detectChanges();
                this.toastService.show({
                  type: 'success',
                  text: 'Shift Updated Successfully'
                });
              }
            })
          )
          .subscribe();
      }
    });
  }

  dueDateClosedHandler() {
    this.trigger.toArray()[1].closeMenu();
  }
  startDateClosedHandler() {
    this.trigger.toArray()[2].closeMenu();
  }
}
