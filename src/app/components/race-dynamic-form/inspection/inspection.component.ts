/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren
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
  InspectionDetail,
  SelectTab,
  RowLevelActionEvent,
  UserDetails,
  AssigneeDetails,
  ErrorInfo
} from 'src/app/interfaces';
import {
  formConfigurationStatus,
  graphQLRoundsOrInspectionsLimit,
  permissions as perms,
  statusColors,
  dateTimeFormat4,
  dateTimeFormat5
} from 'src/app/app.constants';
import { LoginService } from '../../login/services/login.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { RaceDynamicFormService } from '../services/rdf.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToastService } from 'src/app/shared/toast';
import { PDFPreviewComponent } from 'src/app/forms/components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../user-management/services/users.service';
import { format } from 'date-fns';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { ShiftService } from '../../master-configurations/shifts/services/shift.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShiftDateChangeWarningModalComponent } from 'src/app/forms/components/shift-date-change-warning-modal/shift-date-change-warning-modal.component';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class InspectionComponent implements OnInit, OnDestroy {
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  @Output() selectTab: EventEmitter<SelectTab> = new EventEmitter<SelectTab>();
  @Input() set users$(users$: Observable<UserDetails[]>) {
    this._users$ = users$.pipe(
      tap((users) => (this.assigneeDetails = { users }))
    );
  }
  get users$(): Observable<UserDetails[]> {
    return this._users$;
  }
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
  statusMap = {
    open: 'open',
    submitted: 'submitted',
    assigned: 'assigned',
    partlyOpen: 'partly-open',
    inProgress: 'in-progress',
    overdue: 'overdue'
  };
  filter = {
    status: '',
    schedule: '',
    assignedTo: '',
    dueDate: '',
    plant: '',
    shiftId: '',
    scheduledAt: ''
  };
  assignedTo: string[] = [];
  schedules: string[] = [];
  assigneePosition: any;
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
      controlValue: ',',
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
      titleStyle: { width: '125px' },
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
        dependentFieldValues: [
          'assigned',
          'open',
          'in-progress',
          'partly-open',
          'overdue'
        ],
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
        dependentFieldValues: [
          'assigned',
          'open',
          'in-progress',
          'partly-open',
          'overdue'
        ],
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
      displayName: 'Due',
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
      displayName: 'Responses Completed',
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
      id: 'status',
      displayName: 'Status',
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
        borderRadius: '12px'
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
          'partly-open'
        ],
        displayType: 'text'
      },
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
    tableID: 'inspectionsTable',
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
      'in progress': {
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
      'partly open': {
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
  inspections$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchInspection$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  plantMapSubscription: Subscription;
  allActiveShifts$: Observable<any>;
  limit = graphQLRoundsOrInspectionsLimit;
  searchForm: FormControl;
  isPopoverOpen = false;
  inspectionsCount = 0;
  nextToken = '';
  menuState = 'out';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userInfo$: Observable<UserInfo>;
  selectedForm: InspectionDetail;
  selectedFormInfo: InspectionDetail;
  selectedDate = null;
  zIndexDelay = 0;
  hideInspectionDetail: boolean;
  formId: string;
  inspectionId = '';
  plantTimezoneMap = {};
  selectedStartDate;
  selectedDueDate;
  plants = [];
  plantsIdNameMap = {};
  openMenuStateDueDate = false;
  openMenuStateStartDate = false;

  initial = {
    columns: this.columns,
    data: []
  };
  sliceCount = 100;
  shiftObj = {};
  plantShiftObj = {};
  shiftNameMap = {};
  plantSelected: any;
  plantToShift: any;
  shiftPosition: any;
  assigneeDetailsWithPlant: any = { users: [] };
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  private _users$: Observable<UserDetails[]>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService,
    private cdrf: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private plantService: PlantService,
    private shiftService: ShiftService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe((data) => {
        this.plantTimezoneMap = data;
      });
    this.allActiveShifts$ = this.shiftService.fetchAllShifts$();
    this.fetchInspection$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.getAllInspections();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.fetchInspection$.next({ data: 'search' });
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    const inspectionsOnLoadSearch$ = this.fetchInspection$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        this.dataSource = new MatTableDataSource([]);
        return this.getInspectionsList();
      })
    );

    const onScrollInspections$ = this.fetchInspection$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getInspectionsList();
        } else {
          return of(
            {} as {
              rows: any[];
              count: number;
              next: string | null;
            }
          );
        }
      })
    );

    this.initial = {
      columns: this.columns,
      data: []
    };
    this.inspections$ = combineLatest([
      inspectionsOnLoadSearch$,
      onScrollInspections$,
      this.users$,
      this.shiftService.fetchAllShifts$().pipe(
        tap((shifts) => {
          shifts?.items?.map((shift) => {
            this.shiftObj[shift.id] = shift;
            this.shiftNameMap[shift.id] = shift.name;
          });
        })
      ),
      this.plantService.fetchAllPlants$().pipe(
        tap((plants) => {
          plants?.items?.map((plant) => {
            if (this.commonService.isJson(plant.shifts) && plant.shifts) {
              this.plantShiftObj[plant.id] = JSON.parse(plant.shifts);
            }
          });
        })
      )
    ]).pipe(
      map(([inspections, scrollData]) => {
        for (const item of this.filterJson) {
          if (item.column === 'shiftId') {
            item.items = Object.values(this.shiftNameMap);
          }
        }
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          };
          this.initial.data = inspections?.rows?.map((inspectionDetail) => ({
            ...inspectionDetail,
            dueDateDisplay: this.formatDate(
              inspectionDetail.dueDate,
              inspectionDetail.plantId
            ),
            scheduledAtDisplay: this.formatDate(
              inspectionDetail.scheduledAt,
              inspectionDetail.plantId
            ),
            shift: this.shiftObj[inspectionDetail.shiftId]
              ? this.shiftObj[inspectionDetail.shiftId].name
              : undefined,
            assignedTo: inspectionDetail?.assignedTo
              ? this.userService.getUserFullName(inspectionDetail.assignedTo)
              : '',
            status: inspectionDetail.status.replace('-', ' '),
            assignedToEmail: inspectionDetail.assignedTo || ''
          }));
        } else {
          this.initial.data = this.initial.data.concat(
            scrollData.rows?.map((inspectionDetail) => ({
              ...inspectionDetail,
              dueDateDisplay: this.formatDate(
                inspectionDetail.dueDate,
                inspectionDetail.plantId
              ),
              scheduledAtDisplay: this.formatDate(
                inspectionDetail.schedueledAt,
                inspectionDetail.plantId
              ),
              assignedTo: this.userService.getUserFullName(
                inspectionDetail.assignedTo
              ),
              shift: this.shiftObj[inspectionDetail.shiftId]
                ? this.shiftObj[inspectionDetail.shiftId].name
                : undefined,

              status: inspectionDetail.status.replace('-', ' '),
              assignedToEmail: inspectionDetail.assignedTo || ''
            }))
          );
        }
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
      this.hideInspectionDetail = true;
    });

    this.activatedRoute.queryParams.subscribe(
      ({ formId = '', inspectionId = '' }) => {
        this.formId = formId;
        this.inspectionId = inspectionId;
        this.fetchInspection$.next({ data: 'load' });
        this.isLoading$.next(true);
      }
    );

    this.configOptions.allColumns = this.columns;
  }

  getInspectionsList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      formId: this.formId,
      inspectionId: this.inspectionId
    };
    this.isLoading$.next(true);
    return this.raceDynamicFormService
      .getInspectionsList$({ ...obj, ...this.filter })
      .pipe(
        tap(({ count, next }) => {
          this.nextToken = next !== undefined ? next : null;
          this.inspectionsCount =
            count !== undefined ? count : this.inspectionsCount;
          this.isLoading$.next(false);
        })
      );
  }
  getAllInspections() {
    this.isLoading$.next(true);
    this.raceDynamicFormService.fetchAllInspections$().subscribe(
      (formsList) => {
        this.isLoading$.next(false);
        const objectKeys = Object.keys(formsList);
        if (objectKeys.length > 0) {
          const uniqueAssignTo = formsList
            ?.map((item) => item.assignedTo)
            .filter((value, index, self) => self.indexOf(value) === index);

          if (uniqueAssignTo?.length > 0) {
            uniqueAssignTo?.filter(Boolean).forEach((item) => {
              if (item) {
                this.assignedTo.push(item);
              }
            });
          }

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
            } else if (item.column === 'plant') {
              item.items = this.plants;
            } else if (item.column === 'schedule') {
              item.items = this.schedules;
            } else if (item.column === 'shiftId') {
              item.items = Object.values(this.shiftNameMap);
            }
          }
        }
      },
      () => this.isLoading$.next(true)
    );
  }

  handleTableEvent = (event): void => {
    this.fetchInspection$.next(event);
  };

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    const pos = document.getElementById(`${row.id}`).getBoundingClientRect();
    switch (columnId) {
      case 'assignedTo':
        this.assigneePosition = {
          top: `${pos?.top + 17}px`,
          left: `${pos?.left - 15}px`
        };

        this.assigneeDetailsWithPlant.users = this.assigneeDetails.users.filter(
          (user) =>
            user.plantId && row.plantId ? user.plantId === row.plantId : false
        );
        if (row.status !== 'submitted' && row.status !== 'overdue')
          this.trigger.toArray()[0].openMenu();
        this.selectedFormInfo = row;
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
        if (row.status !== 'submitted') {
          this.openMenuStateDueDate = true;
        } else {
          this.openInspectionHandler(row);
        }
        this.selectedFormInfo = row;
        break;
      case 'shift':
        this.shiftPosition = {
          top: `${pos?.top + 20}px`,
          left: `${pos?.left - 15}px`
        };
        this.plantToShift = this.plantShiftObj;
        this.plantSelected = row.plantId;
        if (row.status !== 'submitted') this.trigger.toArray()[1].openMenu();
        this.selectedFormInfo = row;
        break;
      case 'scheduledAtDisplay':
        this.selectedStartDate = {
          ...this.selectedStartDate,
          date: row.scheduledAt
        };
        if (this.plantTimezoneMap[row?.plantId]?.timeZoneIdentifier) {
          const scheduledAt = new Date(
            formatInTimeZone(
              row.scheduledAt,
              this.plantTimezoneMap[row.plantId].timeZoneIdentifier,
              dateTimeFormat4
            )
          );
          this.selectedStartDate = {
            ...this.selectedStartDate,
            date: scheduledAt
          };
        }

        if (row.status !== 'submitted') {
          this.openMenuStateStartDate = true;
        } else {
          this.openInspectionHandler(row);
        }
        this.selectedFormInfo = row;
        break;
      default:
        this.openInspectionHandler(row);
    }
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [
      {
        title: 'Show Details',
        action: 'showDetails'
      },
      {
        title: 'Show Forms',
        action: 'showForms'
      }
    ];

    if (
      !this.loginService.checkUserHasPermission(
        permissions,
        'SCHEDULE_ROUND_PLAN'
      )
    ) {
      this.columns[12].controlType = 'string';
      this.columns[10].controlType = 'string';
      this.columns[3].controlType = 'string';
      this.columns[5].controlType = 'string';
      this.columns[6].controlType = 'string';
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
    this.store.dispatch(FormConfigurationActions.resetPages());
    timer(400)
      .pipe(
        tap(() => {
          this.hideInspectionDetail = true;
          this.zIndexDelay = 0;
        })
      )
      .subscribe();
  }

  openInspectionHandler(row: InspectionDetail): void {
    this.hideInspectionDetail = false;
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.selectedForm = row;
    this.menuState = 'in';
    this.zIndexDelay = 400;
  }

  formsDetailActionHandler(event) {
    if (event) {
      const { type } = event;
      if (type === 'VIEW_PDF') {
        this.dialog.open(PDFPreviewComponent, {
          data: {
            moduleName: 'RDF',
            roundId: this.selectedForm.id,
            selectedForm: this.selectedForm
          },
          hasBackdrop: false,
          disableClose: true,
          width: '100vw',
          minWidth: '100vw',
          height: '100vh'
        });
      } else if (type === 'DOWNLOAD_PDF') {
        this.downloadPDF(this.selectedForm);
      }
    } else {
      this.store.dispatch(FormConfigurationActions.resetPages());
      this.router.navigate([`/forms/edit/${this.selectedForm.id}`]);
    }
  }

  downloadPDF(selectedForm) {
    const formId = selectedForm.id;
    const inspectionId = selectedForm.inspectionId;

    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };

    this.raceDynamicFormService
      .downloadAttachment$(formId, inspectionId, info)
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

  getFilter() {
    this.raceDynamicFormService.getInspectionFilter().subscribe((res) => {
      this.filterJson = res;
      for (const item of this.filterJson) {
        if (item.column === 'status') {
          item.items = this.status;
        }
      }
    });
  }

  applyFilters(data: any): void {
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        const plantId = this.plantsIdNameMap[item.value];
        this.filter[item.column] = plantId ?? '';
      } else if (item.column === 'shiftId' && item.value) {
        const foundEntry = Object.entries(this.shiftNameMap).find(
          ([key, val]) => val === item.value
        );
        this.filter[item.column] = foundEntry[0];
      } else if (item.column === 'scheduledAt' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.column === 'dueDate' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.type !== 'date' && item.value) {
        this.filter[item.column] = item.value;
      }
    }
    this.nextToken = '';
    this.fetchInspection$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
    this.filter = {
      status: '',
      schedule: '',
      assignedTo: '',
      dueDate: '',
      plant: '',
      shiftId: '',
      scheduledAt: ''
    };
    this.nextToken = '';
    this.fetchInspection$.next({ data: 'load' });
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data } = event;
    switch (action) {
      case 'showDetails':
        this.openInspectionHandler(data);
        break;
      case 'showForms':
        this.selectTab.emit({ index: 0, queryParams: { id: data.id } });
        break;
      default:
      // do nothing
    }
  };

  selectedAssigneeHandler(userDetails: UserDetails) {
    const { email: assignedTo } = userDetails;
    const { inspectionId, assignedToEmail, ...rest } = this.selectedFormInfo;
    let previouslyAssignedTo = this.selectedFormInfo.previouslyAssignedTo || '';
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

    let { status } = this.selectedFormInfo;

    status =
      status.toLowerCase() === 'open'
        ? 'assigned'
        : status.toLowerCase() === 'partly-open'
        ? 'in-progress'
        : status;

    this.raceDynamicFormService
      .updateInspection$(
        inspectionId,
        { ...rest, inspectionId, assignedTo, previouslyAssignedTo, status },
        'assigned-to'
      )
      .pipe(
        tap((resp) => {
          if (Object.keys(resp).length) {
            this.dataSource.data = this.dataSource.data.map((data) => {
              if (data.inspectionId === inspectionId) {
                return {
                  ...data,
                  assignedTo: this.userService.getUserFullName(assignedTo),
                  inspectionDBVersion: resp.inspectionDBVersion + 1,
                  status,
                  assignedToEmail: resp.assignedTo || ''
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

  dateChangeHandler(changedDueDate: Date) {
    const {
      inspectionId,
      assignedToEmail,
      plantId,
      dueDate,
      scheduledAt,
      status,
      locationAndAssetTasksCompleted,
      assignedTo,
      ...rest
    } = this.selectedFormInfo;
    if (changedDueDate.getTime() < new Date(scheduledAt).getTime()) {
      this.toastService.show({
        type: 'warning',
        text: 'DueDate Cannot be less than Start Date'
      });
      return;
    }
    const dueDateDisplayFormat = format(changedDueDate, dateTimeFormat4);

    const dueDateTime = changedDueDate.getTime(); ///curent Date
    let shiftStartDateAndTime: any;
    let shiftEndDateAndTime: any;
    let shiftValidation = true;
    if (this.selectedFormInfo.shiftId) {
      const shiftStartTime =
        this.shiftObj[this.selectedFormInfo.shiftId].startTime;

      const [startNewHours, startNewMinutes] = shiftStartTime
        .split(':')
        .map(Number);
      shiftStartDateAndTime = new Date(
        changedDueDate.getFullYear(),
        changedDueDate.getMonth(),
        changedDueDate.getDate(),
        startNewHours,
        startNewMinutes
      ).getTime();

      const shiftEndTime = this.shiftObj[this.selectedFormInfo.shiftId].endTime;

      const [endNewHours, endNewMinutes] = shiftEndTime.split(':').map(Number);

      shiftEndDateAndTime = new Date(
        changedDueDate.getFullYear(),
        changedDueDate.getMonth(),
        changedDueDate.getDate(),
        endNewHours,
        endNewMinutes
      ).getTime();

      dueDateTime >= shiftStartDateAndTime && dueDateTime <= shiftEndDateAndTime
        ? (shiftValidation = true)
        : (shiftValidation = false);
    } else {
      shiftValidation = true;
    }

    if (shiftValidation) {
      const openDialogModalRef = this.dialog.open(
        ShiftDateChangeWarningModalComponent,
        { data: { type: 'warning' } }
      );
      openDialogModalRef.afterClosed().subscribe((resp) => {
        if (resp) {
          if (
            plantId &&
            this.plantTimezoneMap[plantId] &&
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          ) {
            changedDueDate = zonedTimeToUtc(
              format(changedDueDate, dateTimeFormat5),
              this.plantTimezoneMap[plantId].timeZoneIdentifier
            );
          }
          let changedStatus = status;
          if (status === 'overdue') {
            if (assignedTo) {
              locationAndAssetTasksCompleted > 0
                ? (changedStatus = this.statusMap.inProgress)
                : (changedStatus = this.statusMap.assigned);
            } else {
              locationAndAssetTasksCompleted > 0
                ? (changedStatus = this.statusMap.partlyOpen)
                : (changedStatus = this.statusMap.open);
            }
          }
          let slot = null;
          if (JSON.parse(this.selectedFormInfo.slotDetails)) {
            slot = JSON.parse(this.selectedFormInfo.slotDetails);
            slot.endTime =
              changedDueDate.getHours().toString() +
              ':' +
              changedDueDate.getMinutes().toString();
          }
          slot = JSON.stringify(slot);
          this.raceDynamicFormService
            .updateInspection$(
              inspectionId,
              {
                ...rest,
                assignedToEmail,
                plantId,
                status: changedStatus,
                inspectionId,
                dueDate: changedDueDate,
                scheduledAt,
                locationAndAssetTasksCompleted,
                slotDetails: slot,
                assignedTo
              },
              'due-date'
            )
            .pipe(
              tap((resp: any) => {
                if (Object.keys(resp).length) {
                  this.dataSource.data = this.dataSource.data.map((data) => {
                    if (data.inspectionId === inspectionId) {
                      return {
                        ...data,
                        scheduledAt,
                        dueDate: changedDueDate,
                        dueDateDisplay: this.formatDate(
                          dueDateDisplayFormat,
                          plantId
                        ),
                        status: changedStatus,
                        slotDetails: slot,
                        inspectionDBVersion: resp.inspectionDBVersion + 1,
                        inspectionDetailDBVersion:
                          resp.inspectionDetailDBVersion + 1,
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
                    text: 'Due date updated successfully'
                  });
                }
              })
            )
            .subscribe();
        }
      });
    } else {
      this.dialog.open(ShiftDateChangeWarningModalComponent, {
        data: { type: 'date' }
      });
    }
  }

  startDateChangeHandler(changedScheduledAt: Date) {
    const {
      inspectionId,
      assignedToEmail,
      plantId,
      dueDate,
      scheduledAt,
      status,
      locationAndAssetTasksCompleted,
      assignedTo,
      ...rest
    } = this.selectedFormInfo;
    if (new Date(dueDate).getTime() < changedScheduledAt.getTime()) {
      this.toastService.show({
        type: 'warning',
        text: 'Start Date Cannot be More Than Due Date'
      });
      return;
    }
    let shiftValidation: Boolean = true;

    const startDateDisplayFormat = format(changedScheduledAt, dateTimeFormat4);

    const scheduleTime = changedScheduledAt.getTime(); ///curent Date

    if (this.selectedFormInfo.shiftId) {
      let shfitStartDateAndTime: any;
      let shfitEndDateAndTime: any;
      const shiftStartTime =
        this.shiftObj[this.selectedFormInfo.shiftId].startTime;

      const [startNewHours, startNewMinutes] = shiftStartTime
        .split(':')
        .map(Number);
      shfitStartDateAndTime = new Date(
        changedScheduledAt.getFullYear(),
        changedScheduledAt.getMonth(),
        changedScheduledAt.getDate(),
        startNewHours,
        startNewMinutes
      ).getTime();

      const shiftEndTime = this.shiftObj[this.selectedFormInfo.shiftId].endTime;

      const [endNewHours, endNewMinutes] = shiftEndTime.split(':').map(Number);

      shfitEndDateAndTime = new Date(
        changedScheduledAt.getFullYear(),
        changedScheduledAt.getMonth(),
        changedScheduledAt.getDate(),
        endNewHours,
        endNewMinutes
      ).getTime();

      scheduleTime >= shfitStartDateAndTime &&
      scheduleTime <= shfitEndDateAndTime
        ? (shiftValidation = true)
        : (shiftValidation = false);
    } else {
      shiftValidation = true;
    }

    if (shiftValidation) {
      const data = { type: 'warning' };
      const openDialogModalRef = this.dialog.open(
        ShiftDateChangeWarningModalComponent,
        { data }
      );
      openDialogModalRef.afterClosed().subscribe((resp) => {
        if (resp) {
          if (
            plantId &&
            this.plantTimezoneMap[plantId] &&
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          ) {
            changedScheduledAt = zonedTimeToUtc(
              format(changedScheduledAt, dateTimeFormat5),
              this.plantTimezoneMap[plantId].timeZoneIdentifier
            );
          }
          let changedStatus = status;
          if (status === 'overdue') {
            if (assignedTo) {
              locationAndAssetTasksCompleted > 0
                ? (changedStatus = this.statusMap.inProgress)
                : (changedStatus = this.statusMap.assigned);
            } else {
              locationAndAssetTasksCompleted > 0
                ? (changedStatus = this.statusMap.partlyOpen)
                : (changedStatus = this.statusMap.open);
            }
          }
          let slot = null;
          if (JSON.parse(this.selectedFormInfo.slotDetails)) {
            slot = JSON.parse(this.selectedFormInfo.slotDetails);
            slot.startTime =
              changedScheduledAt.getHours().toString() +
              ':' +
              changedScheduledAt.getMinutes().toString();
          }

          slot = JSON.stringify(slot);
          this.raceDynamicFormService
            .updateInspection$(
              inspectionId,
              {
                ...rest,
                status: changedStatus,
                locationAndAssetTasksCompleted,
                inspectionId,
                assignedTo,
                slotDetails: slot,
                scheduledAt: changedScheduledAt,
                dueDate
              },
              'start-date'
            )
            .pipe(
              tap((resp: any) => {
                if (Object.keys(resp).length) {
                  this.dataSource.data = this.dataSource.data.map((data) => {
                    if (data.inspectionId === inspectionId) {
                      return {
                        ...data,
                        scheduledAt: changedScheduledAt,
                        status: changedStatus,
                        scheduledAtDisplay: this.formatDate(
                          startDateDisplayFormat,
                          plantId
                        ),
                        slotDetails: slot,
                        inspectionDBVersion: resp.inspectionDBVersion + 1,
                        inspectionDetailDBVersion:
                          resp.inspectionDetailDBVersion + 1,
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
      this.dialog.open(ShiftDateChangeWarningModalComponent, {
        data: { type: 'date' }
      });
    }
  }

  shiftChangeHandler(shift) {
    const {
      inspectionId,
      assignedToEmail,
      plantId,
      locationAndAssetTasksCompleted,
      assignedTo,
      scheduledAt,
      dueDate,
      slotDetails,
      status,
      ...rest
    } = this.selectedFormInfo;
    const shiftId = shift.id;

    const [endNewHours, endNewMinutes] = shift.endTime.split(':').map(Number);
    const [startNewHours, startNewMinutes] = shift.startTime
      .split(':')
      .map(Number);
    let shiftStartDateAndTime: Date;
    let shiftEndDateAndTime: Date;
    if (status !== 'overdue') {
      const shiftStart = this.selectedFormInfo.scheduledAt;
      const shiftEnd = this.selectedFormInfo.dueDate;
      shiftStartDateAndTime = new Date(
        new Date(shiftStart).getFullYear(),
        new Date(shiftStart).getMonth(),
        new Date(shiftStart).getDate(),
        startNewHours,
        startNewMinutes
      );

      shiftEndDateAndTime = new Date(
        new Date(shiftEnd).getFullYear(),
        new Date(shiftEnd).getMonth(),
        new Date(shiftEnd).getDate(),
        endNewHours,
        endNewMinutes
      );
    } else {
      shiftStartDateAndTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        startNewHours,
        startNewMinutes
      );
      shiftEndDateAndTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        endNewHours,
        endNewMinutes
      );
    }

    if (shiftEndDateAndTime.getTime() < shiftStartDateAndTime.getTime()) {
      shiftEndDateAndTime.setDate(shiftEndDateAndTime.getDate() + 1);
    }

    const openDialogModalRef = this.dialog.open(
      ShiftDateChangeWarningModalComponent,
      { data: { type: 'warning' } }
    );
    openDialogModalRef.afterClosed().subscribe((resp) => {
      if (resp) {
        if (
          plantId &&
          this.plantTimezoneMap[plantId] &&
          this.plantTimezoneMap[plantId].timeZoneIdentifier
        ) {
          shiftStartDateAndTime = zonedTimeToUtc(
            format(shiftStartDateAndTime, dateTimeFormat5),
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          );
          shiftEndDateAndTime = zonedTimeToUtc(
            format(shiftEndDateAndTime, dateTimeFormat5),
            this.plantTimezoneMap[plantId].timeZoneIdentifier
          );
        }

        let changedStatus = status;
        if (status === 'overdue') {
          if (assignedTo) {
            locationAndAssetTasksCompleted > 0
              ? (changedStatus = this.statusMap.inProgress)
              : (changedStatus = this.statusMap.assigned);
          } else {
            locationAndAssetTasksCompleted > 0
              ? (changedStatus = this.statusMap.partlyOpen)
              : (changedStatus = this.statusMap.open);
          }
        }
        let slot;
        if (JSON.parse(this.selectedFormInfo.slotDetails)) {
          slot = JSON.parse(this.selectedFormInfo.slotDetails);
          slot.startTime = shift.startTime;
          slot.endTime = shift.endTime;
        }
        slot = JSON.stringify(slot);
        this.raceDynamicFormService
          .updateInspection$(
            inspectionId,
            {
              ...rest,
              inspectionId,
              shiftId,
              scheduledAt: shiftStartDateAndTime,
              dueDate: shiftEndDateAndTime,
              locationAndAssetTasksCompleted,
              assignedTo,
              slotDetails: slot,
              status: changedStatus
            },
            'shift'
          )
          .pipe(
            tap((resp: any) => {
              if (Object.keys(resp).length) {
                this.dataSource.data = this.dataSource.data.map((data) => {
                  const shift = this.shiftObj[resp.shiftId].name;
                  if (data.inspectionId === inspectionId) {
                    return {
                      ...data,
                      shift,
                      shiftId,
                      scheduledAt: shiftStartDateAndTime,
                      scheduledAtDisplay: this.formatDate(
                        shiftStartDateAndTime,
                        dateTimeFormat4
                      ),
                      dueDateDisplay: this.formatDate(
                        shiftEndDateAndTime,
                        dateTimeFormat4
                      ),
                      status: changedStatus,
                      slotDetails: slot,
                      dueDate: shiftEndDateAndTime,
                      inspectionDBVersion: resp.inspectionDBVersion + 1,
                      inspectionDetailDBVersion:
                        resp.inspectionDetailDBVersion + 1,
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
    this.openMenuStateDueDate = false;
  }

  startDateClosedHandler() {
    this.openMenuStateStartDate = false;
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
}
