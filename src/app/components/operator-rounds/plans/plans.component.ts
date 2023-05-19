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
  timer
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
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
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { DatePipe } from '@angular/common';
import {
  ScheduleConfig,
  ScheduleConfigEvent
} from '../round-plan-schedule-configuration/round-plan-schedule-configuration.component';
import { formConfigurationStatus } from 'src/app/app.constants';
import { UsersService } from '../../user-management/services/users.service';

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
    scheduledAt: ''
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
      id: 'locations',
      displayName: 'Location',
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
      id: 'tasks',
      displayName: 'Tasks',
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
      id: 'schedule',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'button',
      controlValue: 'Schedule',
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
      id: 'rounds',
      displayName: 'Rounds Generated',
      type: 'number',
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
      id: 'scheduleDates',
      displayName: 'Starts - Ends',
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
  roundPlanDetail: RoundPlanDetail;
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
  userFullNameByEmail: {};
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  private _users$: Observable<UserDetails[]>;

  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private rpscService: RoundPlanScheduleConfigurationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.planCategory = new FormControl('all');
    this.fetchPlans$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
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
      .pipe(tap((configs) => (this.roundPlanScheduleConfigurations = configs)));

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
      this.users$
    ]).pipe(
      map(([roundPlans, scrollData, roundPlanScheduleConfigurations]) => {
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
        this.skip = this.initial.data.length;
        return this.initial;
      })
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
            (roundPlan: RoundPlanDetail) => roundPlan.schedule
          );
        } else if (planCategory === 'unscheduled') {
          filteredRoundPlans = roundPlans.data.filter(
            (roundPlan: RoundPlanDetail) => !roundPlan.schedule
          );
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

  getRoundPlanList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      roundPlanId: this.roundPlanId
    };

    return this.operatorRoundsService
      .getPlansList$({ ...obj, ...this.filter })
      .pipe(
        tap(({ scheduledCount, unscheduledCount, next }) => {
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

  ngOnDestroy(): void {}

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'schedule':
        if (!row.schedule) {
          this.openScheduleConfigHandler(row);
        } else {
          this.openRoundPlanHandler(row);
        }
        break;
      case 'rounds':
        if (row.rounds !== this.placeHolder) {
          this.selectTab.emit({ index: 1, queryParams: { id: row.id } });
        } else {
          this.openRoundPlanHandler(row);
        }
        break;
      default:
        this.openRoundPlanHandler(row);
    }
  };

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
    this.store.dispatch(FormConfigurationActions.resetPages());
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
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.roundPlanDetail = { ...row };
    this.formDetailState = 'in';
    this.zIndexDelay = 400;
  }

  roundPlanDetailActionHandler() {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/operator-rounds/edit/${this.roundPlanDetail.id}`]);
  }

  openScheduleConfigHandler(row: RoundPlanDetail) {
    this.hideScheduleConfig = false;
    this.closeRoundPlanHandler();
    this.scheduleRoundPlanDetail = { ...row };
    this.scheduleConfigState = 'in';
    this.zIndexScheduleDelay = 400;
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

  scheduleConfigHandler(scheduleConfig: ScheduleConfig) {
    const { roundPlanScheduleConfiguration, mode } = scheduleConfig;
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
              roundPlanScheduleConfiguration
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
    switch (action) {
      case 'schedule':
        this.openScheduleConfigHandler(data);
        break;
      case 'showDetails':
        this.openRoundPlanHandler(data);
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
          schedule: this.getFormatedSchedule(
            roundPlanScheduleConfigurations[roundPlan.id]
          ),
          scheduleDates: this.getFormatedScheduleDates(
            roundPlanScheduleConfigurations[roundPlan.id]
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
    roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration
  ) {
    const { scheduleEndType, scheduleEndOn, endDate, scheduleType } =
      roundPlanScheduleConfiguration;
    const formatedStartDate =
      scheduleType === 'byFrequency'
        ? this.datePipe.transform(
            roundPlanScheduleConfiguration.startDate,
            'MMM dd, yy'
          )
        : '';
    const formatedEndDate =
      scheduleType === 'byFrequency'
        ? scheduleEndType === 'on'
          ? this.datePipe.transform(scheduleEndOn, 'MMM dd, yy')
          : scheduleEndType === 'after'
          ? this.datePipe.transform(endDate, 'MMM dd, yy')
          : 'Never'
        : '';

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
    let emailArray = [];
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
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value] ?? '';
      } else if (item.type !== 'date' && item.value) {
        this.filter[item.column] = item.value ?? '';
      } else if (item.type === 'date' && item.value) {
        this.filter[item.column] = item.value.toISOString();
      } else {
        this.filter[item.column] = item.value ?? '';
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
      scheduledAt: ''
    };
    this.nextToken = '';
    this.fetchPlans$.next({ data: 'load' });
  }
}
