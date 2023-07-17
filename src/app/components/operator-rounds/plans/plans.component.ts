/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  Subject,
  Subscription,
  timer
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  catchError,
  startWith,
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
  RowLevelActionEvent,
  RoundPlanScheduleConfigurationObj,
  RoundPlanScheduleConfiguration,
  RoundPlanDetailResponse,
  RoundPlanDetail,
  SelectTab,
  UserDetails,
  AssigneeDetails
} from 'src/app/interfaces';
import {
  dateFormat,
  graphQLDefaultLimit,
  permissions as perms
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { LoginService } from '../../login/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { DatePipe } from '@angular/common';
import { formConfigurationStatus } from 'src/app/app.constants';
import { UsersService } from '../../user-management/services/users.service';
import {
  ScheduleConfig,
  ScheduleConfigEvent,
  ScheduleConfigurationComponent
} from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.component';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';
import { MatDialog } from '@angular/material/dialog';
import { graphQLDefaultMaxLimit } from 'src/app/app.constants';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class PlansComponent implements OnInit, OnDestroy {
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
  filterJson = [];
  filter = {
    plant: '',
    schedule: '',
    assignedTo: '',
    scheduledAt: '',
    shifts: '',
    roundPlanId: ''
  };
  assignedTo: string[] = [];
  schedules: string[] = [];
  assigneeDetails: AssigneeDetails;
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'locations',
      displayName: 'Location',
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
      groupable: false,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'assets',
      displayName: 'Assets',
      type: 'number',
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
      id: 'tasks',
      displayName: 'Tasks',
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
      controlType: 'button',
      controlValue: 'Schedule',
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
      id: 'rounds',
      displayName: 'Rounds Generated',
      type: 'number',
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
      titleStyle: { color: '#3d5afe' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'assignedTo',
      displayName: 'Assigned To',
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'scheduleDates',
      displayName: 'Starts - Ends',
      type: 'string',
      controlType: 'string',
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
  filteredRoundPlans$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchPlans$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  roundPlanCounts = {
    scheduled: 0,
    unscheduled: 0
  };
  nextToken = '';
  formDetailState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  activeShifts$: Observable<any>;
  roundPlanDetail: RoundPlanDetail;
  plantMapSubscription: Subscription;
  scheduleRoundPlanDetail: RoundPlanDetail;
  zIndexDelay = 0;
  zIndexScheduleDelay = 0;
  scheduleConfigState = 'out';
  roundPlanScheduleConfigurations: RoundPlanScheduleConfigurationObj = {};
  scheduleTypes = { day: 'daily', week: 'weekly', month: 'monthly' };
  initial: any;
  hideRoundPlanDetail: boolean;
  hideScheduleConfig: boolean;
  placeHolder = '_ _';
  planCategory: FormControl;
  roundPlanId: string;
  plants = [];
  plantsIdNameMap = {};
  userFullNameByEmail = {};
  plantTimezoneMap = {};
  activeShiftIdMap = {};
  selectedRoundConfig: any;
  shiftObj: any = {};

  allPlants: any;
  allShifts: any;
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  private _users$: Observable<UserDetails[]>;
  private destroy$ = new Subject();
  private scheduleConfigEvent: Subscription;
  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private router: Router,
    private rpscService: RoundPlanScheduleConfigurationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef,
    private shiftService: ShiftService,
    private dialog: MatDialog,
    private readonly scheduleConfigurationService: ScheduleConfigurationService
  ) {}

  ngOnInit(): void {
    this.scheduleConfigEvent =
      this.scheduleConfigurationService.scheduleConfigEvent.subscribe(
        (value) => {
          if (value) {
            this.scheduleConfigEventHandler(value);
          }
        }
      );

    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.activeShifts$ = this.shiftService.getShiftsList$({
      next: '',
      limit: graphQLDefaultLimit,
      searchKey: '',
      fetchType: 'load'
    });
    this.planCategory = new FormControl('all');
    this.fetchPlans$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap(() => {
          this.fetchPlans$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    const roundPlanScheduleConfigurations$ = this.rpscService
      .fetchRoundPlanScheduleConfigurations$()
      .pipe(
        tap((configs) => {
          this.roundPlanScheduleConfigurations = configs;
        })
      );

    const roundPlansOnLoadSearch$ = this.fetchPlans$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getRoundPlanList();
      })
    );

    const onScrollRoundPlans$ = this.fetchPlans$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getRoundPlanList();
        } else {
          return of({} as RoundPlanDetailResponse);
        }
      })
    );

    this.initial = {
      columns: this.columns,
      data: []
    };
    const roundPlans$ = combineLatest([
      roundPlansOnLoadSearch$,
      onScrollRoundPlans$,
      roundPlanScheduleConfigurations$,
      this.plantService.fetchAllPlants$(),
      this.shiftService.fetchAllShifts$(),
      this.users$
    ]).pipe(
      map(
        ([
          roundPlans,
          scrollData,
          roundPlanScheduleConfigurations,
          plants,
          shifts
        ]) => {
          shifts?.items?.forEach((value) => {
            this.activeShiftIdMap[value.id] = value.name;
          });
          this.allPlants = plants;
          this.allShifts = shifts.items.filter((s) => s.isActive);
          this.isLoading$.next(false);
          if (this.skip === 0) {
            this.initial.data = this.formatRoundPlans(
              roundPlans.rows,
              roundPlanScheduleConfigurations
            );
          } else {
            this.initial.data = this.initial.data.concat(
              this.formatRoundPlans(
                scrollData.rows,
                roundPlanScheduleConfigurations
              )
            );
          }
          this.initial.data = this.formattingPlans(this.initial.data);
          this.skip = this.initial.data.length;
          return this.initial;
        }
      )
    );

    this.filteredRoundPlans$ = combineLatest([
      roundPlans$,
      this.planCategory.valueChanges.pipe(startWith('all'))
    ]).pipe(
      map(([roundPlans, planCategory]) => {
        let filteredRoundPlans = [];
        this.configOptions = {
          ...this.configOptions,
          tableHeight: 'calc(100vh - 150px)'
        };
        if (planCategory === 'scheduled') {
          filteredRoundPlans = roundPlans.data.filter(
            (roundPlan: RoundPlanDetail) =>
              roundPlan.schedule && roundPlan.schedule !== 'Ad-Hoc'
          );
        } else if (planCategory === 'unscheduled') {
          filteredRoundPlans = roundPlans.data
            .filter(
              (roundPlan: RoundPlanDetail) =>
                !roundPlan.schedule || roundPlan.schedule === 'Ad-Hoc'
            )
            .map((item) => {
              item.schedule = '';
              return item;
            });
        } else {
          filteredRoundPlans = roundPlans.data;
        }
        const uniqueAssignTo = filteredRoundPlans
          ?.map((item) => item?.assignedTo)
          .filter((value, index, self) => self.indexOf(value) === index);

        const uniqueSchedules = filteredRoundPlans
          ?.map((item) => item?.schedule)
          .filter((value, index, self) => self?.indexOf(value) === index);

        if (uniqueSchedules?.length > 0) {
          uniqueSchedules?.filter(Boolean).forEach((item) => {
            if (item && !this.schedules.includes(item)) {
              this.schedules.push(item);
            }
          });
        }

        if (uniqueAssignTo?.length > 0) {
          uniqueAssignTo?.filter(Boolean).forEach((item) => {
            if (item && !this.assignedTo.includes(item) && item !== '_ _') {
              this.assignedTo.push(item);
            }
          });
        }

        for (const item of this.filterJson) {
          if (item.column === 'assignedTo') {
            item.items = this.assignedTo;
          }
          if (item.column === 'schedule') {
            item.items = this.schedules;
          }
          if (item.column === 'shiftId') {
            item.items = Object.values(this.activeShiftIdMap);
          }
        }
        this.dataSource = new MatTableDataSource(filteredRoundPlans);
        return { ...roundPlans, data: filteredRoundPlans };
      })
    );

    this.activatedRoute.params.subscribe((params) => {
      this.hideRoundPlanDetail = true;
      this.hideScheduleConfig = true;
    });

    this.activatedRoute.queryParams.subscribe(({ roundPlanId = '' }) => {
      this.roundPlanId = roundPlanId;
      this.fetchPlans$.next({ data: 'load' });
      this.isLoading$.next(true);
    });

    this.configOptions.allColumns = this.columns;

    this.getAllRoundPlans();
  }

  formattingPlans(plans) {
    return plans.map((plan) => {
      let shift = '';
      if (this.roundPlanScheduleConfigurations[plan.id]?.shiftDetails) {
        Object.keys(
          this.roundPlanScheduleConfigurations[plan.id]?.shiftDetails
        ).map((shiftId) => {
          shift += this.activeShiftIdMap[shiftId] + ',';
        });
        plan.shift = shift;
      }
      return plan;
    });
  }

  getRoundPlanList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      roundPlanId: this.roundPlanId
    };
    this.isLoading$.next(true);
    return this.operatorRoundsService
      .getPlansList$({ ...obj, ...this.filter })
      .pipe(
        tap(({ scheduledCount, unscheduledCount, next }) => {
          this.isLoading$.next(false);
          this.nextToken = next !== undefined ? next : null;
          const { scheduled, unscheduled } = this.roundPlanCounts;
          this.roundPlanCounts = {
            ...this.roundPlanCounts,
            scheduled:
              scheduledCount !== undefined ? scheduledCount : scheduled,
            unscheduled:
              unscheduledCount !== undefined ? unscheduledCount : unscheduled
          };
        })
      );
  }

  getAllRoundPlans() {
    this.operatorRoundsService.fetchAllPlansList$().subscribe((plansList) => {
      const objectKeys = Object.keys(plansList);
      if (objectKeys.length > 0) {
        const uniquePlants = plansList.rows
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
          if (item.column === 'plant') {
            item.items = this.plants;
          }
        }
      }
    });
  }

  handleTableEvent = (event): void => {
    this.fetchPlans$.next(event);
  };

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    const activeShifts = this.prepareActiveShifts(row);
    switch (columnId) {
      case 'schedule':
        if (!row.schedule) {
          this.openScheduleConfigHandler({ ...row, shifts: activeShifts });
        } else {
          this.openRoundPlanHandler({ ...row, shifts: activeShifts });
        }
        break;
      case 'rounds':
        if (row.rounds !== this.placeHolder) {
          this.selectTab.emit({ index: 1, queryParams: { id: row.id } });
        } else {
          this.openRoundPlanHandler({ ...row, shifts: activeShifts });
        }
        break;
      default:
        this.openRoundPlanHandler({ ...row, shifts: activeShifts });
    }
  };

  prepareActiveShifts(plan: any) {
    const selectedPlant = this.allPlants?.items?.find(
      (plant) => plant.id === plan.plantId
    );
    const selectedShifts = JSON.parse(selectedPlant?.shifts);
    const activeShifts = this.allShifts.filter((data) =>
      selectedShifts?.some((shift) => shift.id === data.id)
    );
    return activeShifts;
  }

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [
      {
        title: 'Show Details',
        action: 'showDetails'
      },
      {
        title: 'Show Rounds',
        action: 'showRounds',
        condition: {
          operand: this.placeHolder,
          operation: 'notContains',
          fieldName: 'rounds'
        }
      }
    ] as any;

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        perms.scheduleRoundPlan
      )
    ) {
      menuActions.push({
        title: 'Schedule',
        action: 'schedule',
        condition: {
          operand: this.placeHolder,
          operation: 'isFalsy',
          fieldName: 'schedule'
        }
      });
      menuActions.push({
        title: 'Modify Schedule',
        action: 'schedule',
        condition: {
          operand: this.placeHolder,
          operation: 'isTruthy',
          fieldName: 'schedule'
        }
      });
    } else {
      this.configOptions.allColumns = this.configOptions.allColumns.filter(
        (column: Column) => column.id !== 'schedule'
      );
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  closeRoundPlanHandler() {
    this.roundPlanDetail = null;
    this.formDetailState = 'out';
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexDelay = 0;
          this.hideRoundPlanDetail = true;
        })
      )
      .subscribe();
  }

  openRoundPlanHandler(row: RoundPlanDetail): void {
    this.hideRoundPlanDetail = false;
    this.scheduleConfigEventHandler({ slideInOut: 'out' });
    this.roundPlanDetail = { ...row };
    this.formDetailState = 'in';
    this.zIndexDelay = 400;
    this.selectedRoundConfig = this.roundPlanScheduleConfigurations;
  }

  roundPlanDetailActionHandler() {
    this.router.navigate([`/operator-rounds/edit/${this.roundPlanDetail.id}`]);
  }

  openScheduleConfigHandler(row: RoundPlanDetail) {
    this.scheduleRoundPlanDetail = { ...row };
    const dialogRef = this.dialog.open(ScheduleConfigurationComponent, {
      disableClose: true,
      backdropClass: 'schedule-configuration-modal',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {
        roundPlanDetail: this.scheduleRoundPlanDetail,
        hidden: this.hideScheduleConfig,
        moduleName: 'OPERATOR_ROUNDS',
        assigneeDetails: this.assigneeDetails
      }
    });
    this.hideScheduleConfig = false;
    this.closeRoundPlanHandler();
    this.scheduleConfigState = 'in';
    this.zIndexScheduleDelay = 400;

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.actionType === 'scheduleConfig') {
        delete data?.actionType;
        this.scheduleConfigHandler(data);
      }
      if (data?.actionType === 'scheduleConfigEvent') {
        delete data?.actionType;
        this.scheduleConfigEventHandler(data);
      }
    });
  }

  scheduleConfigEventHandler(event: ScheduleConfigEvent) {
    const { slideInOut: state, viewRounds, mode } = event;
    this.scheduleConfigState = state;

    if (mode === 'create') {
      const roundPlanId = this.scheduleRoundPlanDetail.id;
      this.operatorRoundsService
        .getRoundsCountByRoundPlanId$(roundPlanId)
        .pipe(
          tap(({ count = 0 }) => {
            this.initial.data = this.dataSource.data.map((data) => {
              if (data.id === roundPlanId) {
                return {
                  ...data,
                  rounds: count
                };
              }
              return data;
            });
            this.dataSource = new MatTableDataSource(this.initial.data);
            this.cdrf.detectChanges();
          })
        )
        .subscribe();
    }

    timer(400)
      .pipe(
        tap(() => {
          this.zIndexScheduleDelay = 0;
          this.hideScheduleConfig = true;
          if (viewRounds) {
            this.selectTab.emit({
              index: 1,
              queryParams: { id: this.scheduleRoundPlanDetail.id }
            });
          }
          this.scheduleRoundPlanDetail = null;
        })
      )
      .subscribe();
  }

  scheduleConfigHandler(scheduleConfig) {
    const { roundPlanScheduleConfiguration, mode } =
      scheduleConfig as ScheduleConfig;
    this.roundPlanScheduleConfigurations[
      roundPlanScheduleConfiguration.roundPlanId
    ] = roundPlanScheduleConfiguration;
    if (
      roundPlanScheduleConfiguration &&
      Object.keys(roundPlanScheduleConfiguration).length &&
      roundPlanScheduleConfiguration.id !== ''
    ) {
      this.initial.data = this.dataSource.data.map((data) => {
        if (data.id === this.scheduleRoundPlanDetail.id) {
          return {
            ...data,
            schedule: this.getFormatedSchedule(roundPlanScheduleConfiguration),
            scheduleDates: this.getFormatedScheduleDates(
              roundPlanScheduleConfiguration,
              data.plantId
            ),
            assignedTo: this.getAssignedTo(roundPlanScheduleConfiguration),
            assigneeToEmail: this.getAssignedToEmail(
              roundPlanScheduleConfiguration
            )
          };
        }
        return data;
      });
      this.dataSource = new MatTableDataSource(this.initial.data);
      if (mode === 'create') {
        this.roundPlanCounts = {
          ...this.roundPlanCounts,
          scheduled: this.roundPlanCounts.scheduled + 1,
          unscheduled: this.roundPlanCounts.unscheduled - 1
        };
        if (this.planCategory.value === 'unscheduled') {
          this.planCategory.patchValue('unscheduled');
        }
      }
    }
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    const activeShifts = this.prepareActiveShifts(data);
    switch (action) {
      case 'schedule':
        this.openScheduleConfigHandler({ ...data, shifts: activeShifts });
        break;
      case 'showDetails':
        this.openRoundPlanHandler({ ...data, shifts: activeShifts });
        break;
      case 'showRounds':
        this.selectTab.emit({ index: 1, queryParams: { id: data.id } });
        break;
      default:
      // do nothing
    }
  };

  formatRoundPlans(
    roundPlans: RoundPlanDetail[],
    roundPlanScheduleConfigurations: RoundPlanScheduleConfigurationObj
  ) {
    return roundPlans.map((roundPlan) => {
      if (roundPlanScheduleConfigurations[roundPlan.id]) {
        return {
          ...roundPlan,
          scheduleDates: this.getFormatedScheduleDates(
            roundPlanScheduleConfigurations[roundPlan.id],
            roundPlan.plantId
          ),
          rounds: roundPlan.rounds || this.placeHolder,
          assignedTo: this.getAssignedTo(
            roundPlanScheduleConfigurations[roundPlan.id]
          ),
          assigneeToEmail: this.getAssignedToEmail(
            roundPlanScheduleConfigurations[roundPlan.id]
          )
        };
      }
      return {
        ...roundPlan,
        scheduleDates: this.placeHolder,
        rounds: this.placeHolder,
        assignedTo: this.placeHolder
      };
    });
  }

  getFormatedScheduleDates(
    roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration,
    plantId
  ) {
    const { scheduleEndType, scheduleEndOn, endDate, scheduleType } =
      roundPlanScheduleConfiguration;
    let formatedStartDate =
      scheduleType === 'byFrequency'
        ? this.plantTimezoneMap[plantId]?.timeZoneIdentifier
          ? localToTimezoneDate(
              new Date(roundPlanScheduleConfiguration.startDate),
              this.plantTimezoneMap[plantId],
              dateFormat
            )
          : this.datePipe.transform(
              new Date(roundPlanScheduleConfiguration.startDate),
              dateFormat
            )
        : '';
    let formatedEndDate =
      scheduleType === 'byFrequency'
        ? scheduleEndType === 'on'
          ? this.plantTimezoneMap[plantId]?.timeZoneIdentifier
            ? localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[plantId],
                dateFormat
              )
            : this.datePipe.transform(new Date(scheduleEndOn), dateFormat)
          : scheduleEndType === 'after'
          ? this.plantTimezoneMap[plantId]?.timeZoneIdentifier
            ? localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[plantId],
                dateFormat
              )
            : this.datePipe.transform(new Date(endDate), dateFormat)
          : 'Never'
        : '';

    if (scheduleType === 'byDate') {
      const scheduleDates = roundPlanScheduleConfiguration.scheduleByDates.map(
        (scheduleByDate) => new Date(scheduleByDate.date).getTime()
      );
      scheduleDates.sort();
      formatedStartDate = this.plantTimezoneMap[plantId]?.timeZoneIdentifier
        ? localToTimezoneDate(
            new Date(scheduleDates[0]),
            this.plantTimezoneMap[plantId],
            dateFormat
          )
        : this.datePipe.transform(scheduleDates[0], dateFormat);
      formatedEndDate = this.plantTimezoneMap[plantId]?.timeZoneIdentifier
        ? localToTimezoneDate(
            new Date(scheduleDates[scheduleDates.length - 1]),
            this.plantTimezoneMap[plantId],
            dateFormat
          )
        : this.datePipe.transform(
            scheduleDates[scheduleDates.length - 1],
            dateFormat
          );
    }

    return formatedStartDate !== ''
      ? `${formatedStartDate} - ${formatedEndDate}`
      : this.placeHolder;
  }

  getFormatedSchedule(
    roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration
  ) {
    const { repeatEvery, scheduleType, repeatDuration } =
      roundPlanScheduleConfiguration;
    return scheduleType === 'byFrequency'
      ? repeatEvery === 'day'
        ? repeatDuration === 1
          ? 'Daily'
          : `Every ${repeatDuration} days`
        : repeatEvery === 'week'
        ? repeatDuration === 1
          ? 'Weekly'
          : `Every ${repeatDuration} weeks`
        : repeatDuration === 1
        ? 'Monthly'
        : `Every ${repeatDuration} months`
      : 'Custom Dates';
  }

  getAssignedTo(
    roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration
  ) {
    const { assignmentDetails: { value } = {} } =
      roundPlanScheduleConfiguration;
    return value ? this.userService.getUserFullName(value) : this.placeHolder;
  }

  getAssignedToEmail(
    roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration
  ) {
    const { assignmentDetails: { value } = {} } =
      roundPlanScheduleConfiguration;
    return value ?? '';
  }

  getFilter() {
    this.operatorRoundsService.getPlanFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  getFullNameToEmailArray(data?: any) {
    const emailArray = [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    data.forEach((data: any) => {
      emailArray.push(
        Object.keys(this.userFullNameByEmail).find(
          (email) => this.userFullNameByEmail[email].fullName === data
        )
      );
    });
    return emailArray;
  }

  applyFilters(data: any): void {
    this.isPopoverOpen = false;
    for (const item of data) {
      switch (item.column) {
        case 'plant':
          this.filter[item.column] = this.plantsIdNameMap[item.value] ?? '';
          break;
        case 'shiftId':
          const foundEntry = Object.entries(this.activeShiftIdMap).find(
            ([key, val]) => val === item.value
          );
          this.filter[item.column] = foundEntry[0];
          break;
        case 'assignedTo':
          this.filter[item.column] = this.getFullNameToEmailArray(item.value);
          break;
        default:
          this.filter[item.column] = item.value;
          break;
      }
    }
    this.nextToken = '';
    this.fetchPlans$.next({ data: 'load' });
  }

  resetFilter(): void {
    this.isPopoverOpen = false;
    this.filter = {
      plant: '',
      schedule: '',
      assignedTo: '',
      scheduledAt: '',
      shifts: '',
      roundPlanId: ''
    };
    this.nextToken = '';
    this.fetchPlans$.next({ data: 'load' });
  }
}
