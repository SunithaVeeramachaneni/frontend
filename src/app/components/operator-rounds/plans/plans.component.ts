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
  RoundPlanResponse,
  RoundPlan
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
import { ScheduleConfig } from '../round-plan-schedule-configuration/round-plan-schedule-configuration.component';
import { formConfigurationStatus } from 'src/app/app.constants';

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
    {
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
    },
    {
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
    },
    {
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
    },
    {
      id: 'schedule',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'button',
      controlValue: 'Schedule',
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
    {
      id: 'rounds',
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
      titleStyle: { color: '#3d5afe' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
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
    },
    {
      id: 'scheduleDates',
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
  filteredRoundPlans$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
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
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  roundPlanDetail: RoundPlan;
  scheduleRoundPlanDetail: RoundPlan;
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
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private readonly operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private cdrf: ChangeDetectorRef,
    private rpscService: RoundPlanScheduleConfigurationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.planCategory = new FormControl('all');
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

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    const roundPlanScheduleConfigurations$ = this.rpscService
      .fetchRoundPlanScheduleConfigurations$()
      .pipe(tap((configs) => (this.roundPlanScheduleConfigurations = configs)));

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
          return of({} as RoundPlanResponse);
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
      roundPlanScheduleConfigurations$
    ]).pipe(
      map(([roundPlans, scrollData, roundPlanScheduleConfigurations]) => {
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
          tableHeight: 'calc(80vh - 20px)'
        };
        if (planCategory === 'scheduled') {
          filteredRoundPlans = roundPlans.data.filter(
            (roundPlan: RoundPlan) => roundPlan.schedule
          );
        } else if (planCategory === 'unscheduled') {
          filteredRoundPlans = roundPlans.data.filter(
            (roundPlan: RoundPlan) => !roundPlan.schedule
          );
        } else {
          filteredRoundPlans = roundPlans.data;
        }
        this.dataSource = new MatTableDataSource(filteredRoundPlans);
        return { ...roundPlans, data: filteredRoundPlans };
      })
    );

    this.activatedRoute.params.subscribe((params) => {
      this.hideRoundPlanDetail = true;
      this.hideScheduleConfig = true;
      this.cdrf.detectChanges();
    });

    this.configOptions.allColumns = this.columns;
  }

  getRoundPlanList() {
    const obj = {
      nextToken: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType
    };

    return this.operatorRoundsService.getPlansList$(obj).pipe(
      tap(({ scheduledCount, unscheduledCount, nextToken }) => {
        this.nextToken = nextToken !== undefined ? nextToken : null;
        const { scheduled, unscheduled } = this.roundPlanCounts;
        this.roundPlanCounts = {
          ...this.roundPlanCounts,
          scheduled: scheduledCount !== undefined ? scheduledCount : scheduled,
          unscheduled:
            unscheduledCount !== undefined ? unscheduledCount : unscheduled
        };
        this.isLoading$.next(false);
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
        if (!row.schedule) {
          this.openScheduleConfigHandler(row);
        } else {
          this.openRoundPlanHandler(row);
        }
        break;
      case 'rounds':
        if (row.rounds !== this.placeHolder) {
          this.router.navigate(['/operator-rounds/scheduler/1']);
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
          this.hideRoundPlanDetail = true;
          this.cdrf.detectChanges();
        })
      )
      .subscribe();
  }

  openRoundPlanHandler(row: RoundPlan): void {
    this.hideRoundPlanDetail = false;
    this.closeScheduleConfigHandler('out');
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.roundPlanDetail = { ...row };
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  roundPlanDetailActionHandler() {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/operator-rounds/edit/${this.roundPlanDetail.id}`]);
  }

  openScheduleConfigHandler(row: RoundPlan) {
    this.hideScheduleConfig = false;
    this.closeRoundPlanHandler();
    this.scheduleRoundPlanDetail = { ...row };
    this.scheduleConfigState = 'in';
    this.zIndexScheduleDelay = 400;
  }

  closeScheduleConfigHandler(state: string) {
    this.scheduleRoundPlanDetail = null;
    this.scheduleConfigState = state;
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexScheduleDelay = 0;
          this.hideScheduleConfig = true;
          this.cdrf.detectChanges();
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
      default:
      // do nothing
    }
  };

  formatRoundPlans(
    roundPlans: RoundPlan[],
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
          operator: roundPlan.operator || this.placeHolder
        };
      }
      return {
        ...roundPlan,
        scheduleDates: this.placeHolder,
        rounds: this.placeHolder,
        operator: this.placeHolder
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
}
