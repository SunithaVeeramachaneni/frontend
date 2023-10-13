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
  UserDetails,
  UserGroup,
  ErrorInfo
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
    assignedToDisplay: '',
    scheduledAt: '',
    shiftId: ''
  };
  assignedTo: any[] = [];
  schedules: string[] = [];
  partialColumns: Partial<Column>[] = [
    {
      id: 'name',
      displayName: 'Name',
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
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      titleStyle: {
        'overflow-wrap': 'anywhere'
      }
    },
    {
      id: 'shift',
      displayName: 'Shift',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true
    },
    {
      id: 'questions',
      displayName: 'Questions',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true
    },
    {
      id: 'scheduleType',
      displayName: 'Schedule',
      type: 'string',
      controlType: 'button',
      controlValue: 'Schedule',
      sortable: true,
      visible: true,
      titleStyle: {
        'overflow-wrap': 'anywhere'
      }
    },
    {
      id: 'forms',
      displayName: 'Inspection Generated',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true,
      titleStyle: { color: '#3d5afe' }
    },
    {
      id: 'assignedToDisplay',
      displayName: 'Assigned To',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      titleStyle: { 'overflow-wrap': 'anywhere' }
    },
    {
      id: 'scheduleDates',
      displayName: 'Starts - Ends',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      titleStyle: { 'overflow-wrap': 'anywhere' }
    }
  ];
  columns: Column[] = [];
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
  assigneeDetailsFiltered: AssigneeDetails;
  userGroupsIdMap = {};
  plantsIdNameMap = {};
  plantTimezoneMap = {};
  userFullNameByEmail = {};
  shiftIdNameMap = {};
  allForms = [];

  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$
      .pipe(
        tap((users) => {
          this.assigneeDetails = {
            ...this.assigneeDetails,
            users
          };
          this.assigneeDetailsFiltered = {
            ...this.assigneeDetails
          };
          this.userFullNameByEmail = this.userService.getUsersInfo();
        })
      )
      .pipe(
        tap(() => {
          this.assignedTo = this.assignedTo.filter(
            (item) => item.type !== 'user'
          );
          for (const key in this.userFullNameByEmail) {
            if (this.userFullNameByEmail.hasOwnProperty(key)) {
              this.assignedTo.push({
                type: 'user',
                value: this.userFullNameByEmail[key]
              });
            }
          }
        })
      );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
  @Input() set userGroups$(userGroups$: Observable<UserGroup[]>) {
    this._userGroups$ = userGroups$.pipe(
      tap((userGroups: any) => {
        this.assigneeDetails = {
          ...this.assigneeDetails,
          userGroups: userGroups.items
        };
        this.assigneeDetailsFiltered = {
          ...this.assigneeDetails
        };
        this.assignedTo = this.assignedTo.filter(
          (item) => item.type !== 'userGroup'
        );
        userGroups?.items?.map((userGroup) => {
          this.userGroupsIdMap[userGroup.id] = userGroup;
          this.assignedTo.push({
            type: 'userGroup',
            value: userGroup
          });
        });
      })
    );
  }
  get userGroups$(): Observable<UserGroup[]> {
    return this._userGroups$;
  }
  private _users$: Observable<UserDetails[]>;
  private _userGroups$: Observable<UserGroup[]>;
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
    this.columns = this.raceDynamicFormService.updateConfigOptionsFromColumns(
      this.partialColumns
    );
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
    let filterJson = [];
    const forms$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$,
      formScheduleConfigurations$,
      this.shiftService.fetchAllShifts$(),
      this.plantService.fetchAllPlants$().pipe(
        tap((plants) => {
          plants.items.forEach((plant) => {
            this.plantsIdNameMap[`${plant.plantId} - ${plant.name}`] = plant.id;
          });

          for (const item of filterJson) {
            if (item.column === 'plant') {
              item.items = plants.items
                .map((plant) => `${plant.plantId} - ${plant.name}`)
                .sort();
            }
          }
        })
      ),
      this.users$,
      this.userGroups$,
      this.raceDynamicFormService.getFormsFilter().pipe(
        tap((res) => {
          filterJson = res;
        })
      )
    ])
      .pipe(
        map(
          ([forms, scrollData, formScheduleConfigurations, shifts, plants]) => {
            this.isLoading$.next(false);
            shifts?.items
              ?.filter((s) => s?.isActive)
              ?.forEach((shift) => {
                this.shiftIdNameMap[shift.id] = shift.name;
              });
            this.allPlants = plants;
            this.allShifts = shifts?.items?.filter((s) => s?.isActive) || [];

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

            for (const item of filterJson) {
              if (item.column === 'assignedToDisplay') {
                item.items = this.assignedTo.sort();
              }
              if (item.column === 'shiftId') {
                item.items = Object.values(this.shiftIdNameMap).sort();
              }
            }

            return this.initial;
          }
        )
      )
      .pipe(tap(() => (this.filterJson = filterJson)));

    this.filteredForms$ = combineLatest([
      forms$,
      this.formCategory.valueChanges.pipe(startWith('all'))
    ])
      .pipe(
        map(([forms, formCategory]) => {
          let filteredForms = [];
          this.allForms = forms.data;
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
                  !form.schedule || form.schedule === 'Ad-Hoc'
              )
              .map((item) => {
                item.schedule = '';
                return item;
              });
          } else {
            filteredForms = forms.data;
          }

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

          for (const item of filterJson) {
            if (item.column === 'schedule') {
              item.items = this.schedules.sort();
            }
          }
          this.dataSource = new MatTableDataSource(filteredForms);
          return { ...forms, data: filteredForms };
        })
      )
      .pipe(tap(() => (this.filterJson = filterJson)));

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
  }

  formattingForms(forms) {
    return forms.map((form) => {
      let shift = '';
      if (this.formScheduleConfigurations[form.id]?.shiftDetails) {
        Object.keys(this.formScheduleConfigurations[form.id]?.shiftDetails).map(
          (shiftId) => {
            if (shiftId !== 'null') {
              shift += this.shiftIdNameMap[shiftId] + ',';
            }
          }
        );
        if (shift) {
          form.shift = shift.substring(0, shift.length - 1);
        }
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
    if (this.fetchType !== 'infiniteScroll') {
      this.isLoading$.next(true);
    }
    return this.raceDynamicFormService
      .getFormsForScheduler$(obj, {
        ...this.filter,
        assignedToDisplay:
          typeof this.filter.assignedToDisplay === 'object'
            ? JSON.stringify(this.filter.assignedToDisplay)
            : this.filter.assignedToDisplay
      })
      .pipe(
        tap(({ next, scheduledCount, unscheduledCount }) => {
          this.nextToken = next !== undefined ? next : null;
          if (scheduledCount !== undefined) {
            this.formsCount = {
              scheduled: scheduledCount,
              unscheduled: unscheduledCount
            };
          }
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
      case 'scheduleType':
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
          fieldName: 'scheduleType'
        }
      });
      menuActions.push({
        title: 'Modify Schedule',
        action: 'schedule',
        condition: {
          operand: this.placeHolder,
          operation: 'isTruthy',
          fieldName: 'scheduleType'
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
    this.formDetail = { ...row, formId: row.id };
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
      if (data?.actionType === 'scheduleFailure') {
        delete data?.actionType;
        if (data.mode === 'create') {
          const info: ErrorInfo = { displayToast: false, failureResponse: {} };
          this.formScheduleConfigurationService
            .fetchFormScheduleConfigurationByFormId$(
              data.formsScheduleConfiguration.formId,
              info
            )
            .subscribe((resp) => {
              if (Object.keys(resp).length) {
                data.formsScheduleConfiguration.id = resp.id;
                this.scheduleConfigHandler(data);
              }
            });
        } else {
          this.scheduleConfigHandler(data);
        }
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
            this.initial.data = this.allForms.map((data) => {
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
              queryParams: { id: this.scheduleFormDetail?.id }
            });
          }
          this.scheduleFormDetail = null;
        })
      )
      .subscribe();
  }

  getAssignedTo(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { type, value } = {} } =
      formsScheduleConfiguration;
    return type === 'user' && value
      ? this.userService.getUserFullName(value)
      : this.placeHolder;
  }

  getAssignedToDisplay(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { type, value } = {} } =
      formsScheduleConfiguration;
    return type === 'user' && value
      ? this.userService.getUserFullName(value)
      : type === 'userGroup' && value
      ? this.userGroupsIdMap[value.split(',')[0]]?.name
      : this.placeHolder;
  }

  getAssignedToEmail(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { type, value } = {} } =
      formsScheduleConfiguration;
    return type === 'user' && value ? value : '';
  }

  getUserGroupsIds(formsScheduleConfiguration: FormScheduleConfiguration) {
    const { assignmentDetails: { type, value } = {} } =
      formsScheduleConfiguration;
    return type === 'userGroup' && value ? value : '';
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
      this.initial.data = this.allForms.map((data) => {
        if (data?.id === this.scheduleFormDetail?.id) {
          return {
            ...data,
            schedule: this.getFormattedSchedule(formsScheduleConfiguration),
            scheduleDates: this.getFormattedScheduleDates(
              formsScheduleConfiguration,
              data.plantId
            ),
            assignedTo: this.getAssignedTo(formsScheduleConfiguration),
            assignedToDisplay: this.getAssignedToDisplay(
              formsScheduleConfiguration
            ),
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
          scheduleDates: this.getFormattedScheduleDates(
            formScheduleConfigurations[form?.id],
            form.plantId
          ),
          forms: form.forms || this.placeHolder,
          assignedTo: this.getAssignedTo(formScheduleConfigurations[form.id]),
          assignedToDisplay: this.getAssignedToDisplay(
            formScheduleConfigurations[form.id]
          ),
          userGroupsIds: this.getUserGroupsIds(
            formScheduleConfigurations[form.id]
          ),
          assignedToEmail: this.getAssignedToEmail(
            formScheduleConfigurations[form.id]
          )
        };
      }
      return {
        ...form,
        scheduleDates: this.placeHolder,
        forms: form.forms || this.placeHolder,
        assignedTo: this.placeHolder,
        assignedToDisplay: this.placeHolder
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

  getUserGroupNameToIdsArray(data: any) {
    const userGroupIdsArray = [];
    data?.forEach((name: any) => {
      userGroupIdsArray.push(
        Object.keys(this.userGroupsIdMap).find(
          (id) => this.userGroupsIdMap[id].name === name
        )
      );
    });
    return userGroupIdsArray;
  }

  getPlantNameToPlantId(data: any) {
    const plantIdArray = [];
    data?.forEach((name: any) => {
      plantIdArray.push(this.plantsIdNameMap[name]);
    });
    return plantIdArray;
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
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value] ?? '';
      } else if (item.column === 'shiftId' && item.value) {
        const foundEntry = Object.entries(this.shiftIdNameMap).find(
          ([key, val]) => val === item.value
        );
        this.filter[item.column] = foundEntry[0];
      } else if (item.column === 'assignedToDisplay') {
        if (item.value) {
          if (item.value[0].type === 'user') {
            this.filter[item.column] = {
              type: 'user',
              value: this.getFullNameToEmailArray(
                item.value.map((user) => user.value.fullName)
              )
            };
          }
          if (item.value[0].type === 'userGroup') {
            this.filter[item.column] = {
              type: 'userGroup',
              value: this.getUserGroupNameToIdsArray(
                item.value.map((userGroup) => userGroup.value.name)
              )
            };
          }
          if (item.value[0].type === 'plant') {
            this.filter[item.column] = {
              type: 'plant',
              value: this.getPlantNameToPlantId(item.value.map((p) => p.plant))
            };
          }
        }
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
      assignedToDisplay: '',
      scheduledAt: '',
      shiftId: ''
    };
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }
}
