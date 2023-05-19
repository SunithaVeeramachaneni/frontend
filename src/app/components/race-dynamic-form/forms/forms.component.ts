/* eslint-disable no-underscore-dangle */
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
  SelectTab,
  FormsDetailResponse,
  FormScheduleConfigurationObj,
  ScheduleFormDetail,
  FormScheduleConfiguration,
  AssigneeDetails,
  UserDetails
} from 'src/app/interfaces';
import {
  dateFormat,
  graphQLDefaultLimit,
  permissions as perms
} from 'src/app/app.constants';
import { LoginService } from '../../login/services/login.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { DatePipe } from '@angular/common';
import { formConfigurationStatus } from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormScheduleConfigurationService } from './../services/form-schedule-configuration.service';
import { ScheduleConfigEvent } from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.component';
import { UsersService } from '../../user-management/services/users.service';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class FormsComponent implements OnInit, OnDestroy {
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
      titleStyle: {
        'overflow-wrap': 'anywhere'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'questions',
      displayName: 'Questions',
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
      id: 'schedule',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'button',
      controlValue: 'Schedule',
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
      titleStyle: {
        'overflow-wrap': 'anywhere'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'forms',
      displayName: 'Inspection Generated',
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
      titleStyle: { 'overflow-wrap': 'anywhere' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'scheduleDates',
      displayName: 'Starts - Ends',
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
      titleStyle: { 'overflow-wrap': 'anywhere' },
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
  filteredForms$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  formsCount = {
    scheduled: 0,
    unscheduled: 0
  };
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  formDetail: ScheduleFormDetail;
  scheduleFormDetail: ScheduleFormDetail;
  zIndexDelay = 0;
  zIndexScheduleDelay = 0;
  scheduleConfigState = 'out';
  formScheduleConfigurations: FormScheduleConfigurationObj = {};
  scheduleTypes = { day: 'daily', week: 'weekly', month: 'monthly' };
  initial: any;
  hideFormDetail: boolean;
  hideScheduleConfig: boolean;
  placeHolder = '_ _';
  formCategory: FormControl;
  formId: string;
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  roundPlanDetail: any;
  assigneeDetails: AssigneeDetails;

  plants = [];
  plantsIdNameMap = {};

  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => (this.assigneeDetails = { users }))
    );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  private _users$: Observable<UserDetails[]>;
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private formScheduleConfigurationService: FormScheduleConfigurationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.formCategory = new FormControl('all');
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
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

    const formScheduleConfigurations$ = this.formScheduleConfigurationService
      .fetchFormScheduleConfigurations$()
      .pipe(tap((configs) => (this.formScheduleConfigurations = configs)));

    const formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getFormsList();
      })
    );

    const onScrollForms$ = this.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getFormsList();
        } else {
          return of({} as FormsDetailResponse);
        }
      })
    );

    this.initial = {
      columns: this.columns,
      data: []
    };
    const forms$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$,
      formScheduleConfigurations$,
      this.users$
    ]).pipe(
      map(([forms, scrollData, formScheduleConfigurations]) => {
        if (this.skip === 0) {
          this.initial.data = this.formatForms(
            forms.rows,
            formScheduleConfigurations
          );
        } else {
          this.initial.data = this.initial.data.concat(
            this.formatForms(scrollData.rows, formScheduleConfigurations)
          );
        }
        this.skip = this.initial.data.length;
        return this.initial;
      })
    );

    this.filteredForms$ = combineLatest([
      forms$,
      this.formCategory.valueChanges.pipe(startWith('all'))
    ]).pipe(
      map(([forms, formCategory]) => {
        let filteredForms = [];
        this.configOptions = {
          ...this.configOptions,
          tableHeight: 'calc(100vh - 150px)'
        };
        if (formCategory === 'scheduled') {
          filteredForms = forms.data.filter(
            (form: ScheduleFormDetail) => form.schedule
          );
        } else if (formCategory === 'unscheduled') {
          filteredForms = forms.data.filter(
            (form: ScheduleFormDetail) => !form.schedule
          );
        } else {
          filteredForms = forms.data;
        }

        const uniqueAssignTo = filteredForms
          ?.map((item) => item?.assignedToEmail)
          .filter((value, index, self) => self.indexOf(value) === index);

        const uniqueSchedules = filteredForms
          ?.map((item) => item?.schedule)
          .filter((value, index, self) => self?.indexOf(value) === index);

        if (uniqueSchedules?.length > 0) {
          uniqueSchedules?.filter(Boolean).forEach((item) => {
            if (item && !this.schedules.includes(item)) {
              this.schedules.push(item);
            }
          });
        }

        for (const item of uniqueAssignTo) {
          if (item && !this.assignedTo.includes(item)) {
            this.assignedTo.push(item);
          }
        }
        for (const item of this.filterJson) {
          if (item.column === 'assignedTo') {
            item.items = this.assignedTo;
          }
          if (item.column === 'schedule') {
            item.items = this.schedules;
          }
        }
        this.dataSource = new MatTableDataSource(filteredForms);
        return { ...forms, data: filteredForms };
      })
    );

    this.activatedRoute.params.subscribe((params) => {
      this.hideFormDetail = true;
      this.hideScheduleConfig = true;
    });

    this.activatedRoute.queryParams.subscribe(({ formId = '' }) => {
      this.formId = formId;
      this.fetchForms$.next({ data: 'load' });
      this.isLoading$.next(true);
    });

    this.configOptions.allColumns = this.columns;
    this.getAllForms();
    this.getFilter();
  }

  getFormsList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      formId: this.formId
    };

    return this.raceDynamicFormService
      .getFormQuestionsFormsList$(obj, this.filter)
      .pipe(
        tap(({ scheduledCount, unscheduledCount, next }) => {
          this.nextToken = next !== undefined ? next : null;
          const { scheduled, unscheduled } = this.formsCount;
          this.formsCount = {
            ...this.formsCount,
            scheduled:
              scheduledCount !== undefined ? scheduledCount : scheduled,
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

  ngOnDestroy(): void {}

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'schedule':
        if (!row.schedule) {
          this.openScheduleConfigHandler(row);
        } else {
          this.openFormHandler(row);
        }
        break;
      case 'forms':
        if (row.forms !== this.placeHolder) {
          this.selectTab.emit({ index: 1, queryParams: { id: row?.id } });
        } else {
          this.openFormHandler(row);
        }
        break;
      default:
        this.openFormHandler(row);
    }
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [
      {
        title: 'Show Details',
        action: 'showDetails'
      },
      {
        title: 'Show Inspections',
        action: 'showInspections',
        condition: {
          operand: this.placeHolder,
          operation: 'notContains',
          fieldName: 'forms'
        }
      }
    ];

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
        (column: Column) => column?.id !== 'schedule'
      );
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  closeFormHandler() {
    this.formDetail = null;
    this.menuState = 'out';
    this.store.dispatch(FormConfigurationActions.resetPages());
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexDelay = 0;
          this.hideFormDetail = true;
        })
      )
      .subscribe();
  }

  openFormHandler(row: ScheduleFormDetail): void {
    this.hideFormDetail = false;
    this.scheduleConfigEventHandler({ slideInOut: 'out' });
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.formDetail = { ...row };
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  formDetailActionHandler() {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/forms/edit/${this.formDetail.id}`]);
  }

  openScheduleConfigHandler(row: any) {
    this.hideScheduleConfig = false;
    this.closeFormHandler();
    this.scheduleFormDetail = { ...row };
    this.scheduleConfigState = 'in';
    this.zIndexScheduleDelay = 400;
  }

  scheduleConfigEventHandler(event: ScheduleConfigEvent) {
    const { slideInOut: state, viewForms, mode } = event;
    this.scheduleConfigState = state;
    if (mode === 'create') {
      this.raceDynamicFormService
        .getFormsCountByFormId$(this.scheduleFormDetail?.id)
        .pipe(
          tap(({ count = 0 }) => {
            this.initial.data = this.dataSource?.data?.map((data) => {
              if (data.id === this.scheduleFormDetail?.id) {
                return {
                  ...data,
                  rounds: count
                };
              }
              return data;
            });
            this.dataSource = new MatTableDataSource(this.initial.data);
          })
        )
        .subscribe();
    }
    timer(400)
      .pipe(
        tap(() => {
          this.zIndexScheduleDelay = 0;
          this.hideScheduleConfig = true;
          if (viewForms) {
            this.selectTab.emit({
              index: 1,
              queryParams: { id: this.scheduleFormDetail.id }
            });
          }
          this.scheduleFormDetail = null;
        })
      )
      .subscribe();
  }

  getAssignedTo(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { value } = {} } = formsScheduleConfiguration;
    return value
      ? this.userService.getUserFullName(value) ?? ''
      : this.placeHolder;
  }

  getAssignedToEmail(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { value } = {} } = formsScheduleConfiguration;
    return value ?? '';
  }

  scheduleConfigHandler(scheduleConfig) {
    const { formsScheduleConfiguration, mode } = scheduleConfig;
    this.formScheduleConfigurations[formsScheduleConfiguration?.formId] =
      formsScheduleConfiguration;
    if (
      formsScheduleConfiguration &&
      Object.keys(formsScheduleConfiguration)?.length &&
      formsScheduleConfiguration.id !== ''
    ) {
      this.initial.data = this.dataSource?.data?.map((data) => {
        if (data?.id === this.scheduleFormDetail?.id) {
          return {
            ...data,
            schedule: this.getFormattedSchedule(formsScheduleConfiguration),
            scheduleDates: this.getFormattedScheduleDates(
              formsScheduleConfiguration
            ),
            assignedTo: this.getAssignedTo(formsScheduleConfiguration),
            assignedToEmail: this.getAssignedToEmail(formsScheduleConfiguration)
          };
        }
        return data;
      });
      this.dataSource = new MatTableDataSource(this.initial?.data);
      if (mode === 'create') {
        this.formsCount = {
          ...this.formsCount,
          scheduled: this.formsCount.scheduled + 1,
          unscheduled: this.formsCount.unscheduled - 1
        };
      }
      this.nextToken = '';
      this.fetchForms$.next({ data: 'load' });
    }
  }

  viewFormsHandler(id: any) {
    this.selectTab.emit({ index: 1, queryParams: { id } });
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    switch (action) {
      case 'schedule':
        this.openScheduleConfigHandler(data);
        break;
      case 'showDetails':
        this.openFormHandler(data);
        break;
      case 'showInspections':
        this.selectTab.emit({ index: 1, queryParams: { id: data.id } });
        break;
      default:
    }
  };

  formatForms(
    forms: ScheduleFormDetail[],
    formScheduleConfigurations: FormScheduleConfigurationObj
  ) {
    return forms?.map((form) => {
      if (formScheduleConfigurations[form?.id]) {
        return {
          ...form,
          schedule: this.getFormattedSchedule(
            formScheduleConfigurations[form?.id]
          ),
          scheduleDates: this.getFormattedScheduleDates(
            formScheduleConfigurations[form?.id]
          ),
          assignedTo: this.getAssignedTo(formScheduleConfigurations[form.id]),
          assignedToEmail: this.getAssignedToEmail(
            formScheduleConfigurations[form.id]
          )
        };
      }
      return {
        ...form,
        scheduleDates: this.placeHolder,
        operator: this.placeHolder
      };
    });
  }

  getFormattedScheduleDates(
    formScheduleConfiguration: FormScheduleConfiguration
  ) {
    const { scheduleEndType, scheduleEndOn, endDate, scheduleType } =
      formScheduleConfiguration;
    const formatedStartDate =
      scheduleType === 'byFrequency'
        ? this.datePipe.transform(
            formScheduleConfiguration.startDate,
            dateFormat
          )
        : '';
    const formatedEndDate =
      scheduleType === 'byFrequency'
        ? scheduleEndType === 'on'
          ? this.datePipe.transform(scheduleEndOn, dateFormat)
          : scheduleEndType === 'after'
          ? this.datePipe.transform(endDate, dateFormat)
          : 'Never'
        : '';

    return formatedStartDate !== ''
      ? `${formatedStartDate} - ${formatedEndDate}`
      : this.placeHolder;
  }

  getFormattedSchedule(formScheduleConfiguration: FormScheduleConfiguration) {
    const { repeatEvery, scheduleType, repeatDuration } =
      formScheduleConfiguration;
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

  getFilter() {
    this.raceDynamicFormService.getFormsFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  getAllForms() {
    this.raceDynamicFormService
      .fetchAllSchedulerForms$()
      .subscribe((formsList) => {
        const objectKeys = Object.keys(formsList);
        if (objectKeys.length > 0) {
          const uniquePlants = formsList.rows
            .map((item) => {
              if (item.plantId) {
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
    this.fetchForms$.next({ data: 'load' });
  }
  clearFilters(): void {
    this.isPopoverOpen = false;
    this.filter = {
      plant: '',
      schedule: '',
      assignedTo: '',
      scheduledAt: ''
    };
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }
}
