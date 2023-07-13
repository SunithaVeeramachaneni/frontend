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
  Subject,
  Subscription,
  timer
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
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
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { DatePipe } from '@angular/common';
import { formConfigurationStatus } from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormScheduleConfigurationService } from './../services/form-schedule-configuration.service';
import {
  ScheduleConfigEvent,
  ScheduleConfigurationComponent
} from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.component';
import { UsersService } from '../../user-management/services/users.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';

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
    scheduledAt: '',
    shiftId: ''
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
      id: 'questions',
      displayName: 'Questions',
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
    },
    {
      id: 'scheduleDates',
      displayName: 'Starts - Ends',
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
  plantMapSubscription: Subscription;
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
  allPlants: any;
  allShifts: any;
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  roundPlanDetail: any;
  assigneeDetails: AssigneeDetails;
  plantsIdNameMap = {};
  plantTimezoneMap = {};
  userFullNameByEmail = {};
  shiftIdNameMap = {};

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
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();
  private scheduleConfigEvent: Subscription;
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService,
    private router: Router,
    private formScheduleConfigurationService: FormScheduleConfigurationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private plantService: PlantService,
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
    this.formCategory = new FormControl('all');
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value: string) => {
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
      .pipe(
        tap((configs) => {
          this.formScheduleConfigurations = configs;
        })
      );

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
      this.shiftService.fetchAllShifts$(),
      this.plantService.fetchAllPlants$(),
      this.users$
    ]).pipe(
      map(([forms, scrollData, formScheduleConfigurations, shifts, plants]) => {
        shifts?.items?.forEach((shift) => {
          this.shiftIdNameMap[shift.id] = shift.name;
        });
        this.allPlants = plants;
        this.allShifts = shifts?.items?.filter((s) => s?.isActive) || [];
        for (const item of this.filterJson) {
          if (item.column === 'shiftId') {
            item.items = Object.values(this.shiftIdNameMap);
          }
        }
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
        this.initial.data = this.formattingForms(this.initial.data);
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
            (form: ScheduleFormDetail) =>
              form.schedule && form.schedule !== 'Ad-Hoc'
          );
        } else if (formCategory === 'unscheduled') {
          filteredForms = forms.data
            .filter(
              (form: ScheduleFormDetail) =>
                !form.schedule || form.schedule === 'Ad=Hoc'
            )
            .map((item) => {
              item.schedule = '';
              return item;
            });
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
          if (item && this.userFullNameByEmail[item] !== undefined) {
            this.assignedTo.push(this.userFullNameByEmail[item].fullName);
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

    this.activatedRoute.params.subscribe(() => {
      this.hideFormDetail = true;
      this.hideScheduleConfig = true;
    });

    this.activatedRoute.queryParams.subscribe(({ formId = '' }) => {
      this.formId = formId;
      this.fetchForms$.next({ data: 'load' });
      this.isLoading$.next(true);
    });

    this.configOptions.allColumns = this.columns;
    this.populatePlantsforFilter();
    this.getFilter();
  }

  formattingForms(forms) {
    return forms.map((form) => {
      let shift = '';
      if (this.formScheduleConfigurations[form.id]?.shiftDetails) {
        Object.keys(this.formScheduleConfigurations[form.id]?.shiftDetails).map(
          (shiftId) => {
            shift += this.shiftIdNameMap[shiftId] + ',';
          }
        );
        form.shift = shift;
      }
      return form;
    });
  }

  getFormsList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      formId: this.formId,
      formType: formConfigurationStatus.standalone
    };

    return this.raceDynamicFormService
      .getFormsForScheduler$(obj, this.filter)
      .pipe(
        tap(({ next, scheduledCount, unscheduledCount }) => {
          this.nextToken = next !== undefined ? next : null;
          if (scheduledCount !== undefined) {
            this.formsCount = {
              scheduled: scheduledCount,
              unscheduled: unscheduledCount
            };
          }
          this.isLoading$.next(false);
        })
      );
  }

  handleTableEvent = (event): void => {
    this.fetchForms$.next(event);
  };

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;

    const activeShifts = this.prepareActiveShifts(row);
    switch (columnId) {
      case 'schedule':
        if (!row.schedule) {
          this.openScheduleConfigHandler({ ...row, shifts: activeShifts });
        } else {
          this.openFormHandler({ ...row, shifts: activeShifts });
        }
        break;
      case 'forms':
        if (row.forms !== this.placeHolder) {
          this.selectTab.emit({ index: 1, queryParams: { id: row?.id } });
        } else {
          this.openFormHandler({ ...row, shifts: activeShifts });
        }
        break;
      default:
        this.openFormHandler({ ...row, shifts: activeShifts });
    }
  };

  prepareActiveShifts(form: any) {
    const selectedPlant = this.allPlants?.items?.find(
      (plant) => plant.id === form.plantId
    );
    const selectedShifts = JSON.parse(selectedPlant?.shifts);
    const activeShifts = this.allShifts?.filter((data) =>
      selectedShifts.some((shift) => shift?.id === data?.id)
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
    this.formDetail = { ...row };
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  formDetailActionHandler() {
    this.router.navigate([`/forms/edit/${this.formDetail.id}`]);
  }

  openScheduleConfigHandler(row: any) {
    this.scheduleFormDetail = { ...row };
    const dialogRef = this.dialog.open(ScheduleConfigurationComponent, {
      disableClose: true,
      backdropClass: 'schedule-configuration-modal',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {
        formDetail: this.scheduleFormDetail,
        hidden: this.hideScheduleConfig,
        moduleName: 'RDF',
        assigneeDetails: this.assigneeDetails
      }
    });
    this.hideScheduleConfig = false;
    this.closeFormHandler();
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
                  forms: count
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
              formsScheduleConfiguration,
              data.plantId
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
          scheduled: this.formsCount.scheduled + 1,
          unscheduled: this.formsCount.unscheduled - 1
        };
      }
      this.nextToken = '';
      this.fetchForms$.next({ data: 'load' });
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
        this.openFormHandler({ ...data, shifts: activeShifts });
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
            formScheduleConfigurations[form?.id],
            form.plantId
          ),
          forms: form.forms || this.placeHolder,
          assignedTo: this.getAssignedTo(formScheduleConfigurations[form.id]),
          assignedToEmail: this.getAssignedToEmail(
            formScheduleConfigurations[form.id]
          )
        };
      }
      return {
        ...form,
        scheduleDates: this.placeHolder,
        forms: this.placeHolder,
        assignedTo: this.placeHolder
      };
    });
  }

  getFormattedScheduleDates(
    formScheduleConfiguration: FormScheduleConfiguration,
    plantId
  ) {
    const { scheduleEndType, scheduleEndOn, endDate, scheduleType } =
      formScheduleConfiguration;
    let formatedStartDate =
      scheduleType === 'byFrequency'
        ? this.plantTimezoneMap[plantId]?.timeZoneIdentifier
          ? localToTimezoneDate(
              new Date(formScheduleConfiguration.startDate),
              this.plantTimezoneMap[plantId],
              dateFormat
            )
          : this.datePipe.transform(
              formScheduleConfiguration.startDate,
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
            : this.datePipe.transform(scheduleEndOn, dateFormat)
          : scheduleEndType === 'after'
          ? this.plantTimezoneMap[plantId]?.timeZoneIdentifier
            ? localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[plantId],
                dateFormat
              )
            : this.datePipe.transform(endDate, dateFormat)
          : 'Never'
        : '';
    if (scheduleType === 'byDate') {
      const scheduleDates = formScheduleConfiguration.scheduleByDates.map(
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

  populatePlantsforFilter() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      plants.items.forEach((plant) => {
        this.plantsIdNameMap[`${plant.plantId} - ${plant.name}`] = plant.id;
      });

      for (const item of this.filterJson) {
        if (item.column === 'plant') {
          item.items = plants.items.map(
            (plant) => `${plant.plantId} - ${plant.name}`
          );
        }
      }
    });
  }

  applyFilters(data: any): void {
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value] ?? '';
      } else if (item.column === 'shiftId' && item.value) {
        const foundEntry = Object.entries(this.shiftIdNameMap).find(
          ([key, val]) => val === item.value
        );
        this.filter[item.column] = foundEntry[0];
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
      scheduledAt: '',
      shiftId: ''
    };
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }
}
