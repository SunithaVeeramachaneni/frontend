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
  dateFormat2,
  dateTimeFormat3,
  permissions as perms,
  dateFormat5,
  hourFormat,
  statusColors
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
  filter = {
    status: '',
    schedule: '',
    assignedTo: '',
    dueDate: '',
    plant: ''
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
      titleStyle: { width: '125px' },
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
      titleStyle: { width: '125px' },
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
      id: 'status',
      displayName: 'Status',
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
  inspections$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchInspection$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  plantMapSubscription: Subscription;
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

  plants = [];
  plantsIdNameMap = {};

  initial = {
    columns: this.columns,
    data: []
  };
  sliceCount = 100;
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
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe((data) => {
        this.plantTimezoneMap = data;
      });

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
      this.users$
    ]).pipe(
      map(([inspections, scrollData]) => {
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
            assignedTo: inspectionDetail?.assignedTo
              ? this.userService.getUserFullName(inspectionDetail.assignedTo)
              : '',
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
              assignedTo: this.userService.getUserFullName(
                inspectionDetail.assignedTo
              ),
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
    switch (columnId) {
      case 'assignedTo':
        const pos = document
          .getElementById(`${row.id}`)
          .getBoundingClientRect();
        this.assigneePosition = {
          top: `${pos?.top + 7}px`,
          left: `${pos?.left - 15}px`
        };
        if (row.status !== 'submitted') this.trigger.toArray()[0].openMenu();
        this.selectedFormInfo = row;
        break;
      case 'dueDateDisplay':
        this.selectedDate = { ...this.selectedDate, date: row.dueDate };
        if (this.plantTimezoneMap[row?.plantId]?.timeZoneIdentifier) {
          const dueDate = new Date(
            formatInTimeZone(
              row.dueDate,
              this.plantTimezoneMap[row.plantId].timeZoneIdentifier,
              dateTimeFormat3
            )
          );
          this.selectedDate = { ...this.selectedDate, date: dueDate };
        }
        if (row.status !== 'submitted') this.trigger.toArray()[1].openMenu();
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
      !this.loginService.checkUserHasPermission(permissions, 'SCHEDULE_FORM')
    ) {
      if (this.columns[3]?.controlType) {
        this.columns[3].controlType = 'string';
      }
      if (this.columns[6]?.controlType) {
        this.columns[6].controlType = 'string';
      }
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
      } else if (item.type !== 'date' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.type === 'date' && item.value) {
        this.filter[item.column] = item.value.toISOString();
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
      plant: ''
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

  dateChangeHandler(dueDate: Date) {
    const { inspectionId, assignedToEmail, plantId, ...rest } =
      this.selectedFormInfo;
    const dueDateDisplayFormat = format(dueDate, dateFormat2);
    if (this.plantTimezoneMap[plantId]?.timeZoneIdentifier) {
      const time = localToTimezoneDate(
        this.selectedFormInfo.dueDate,
        this.plantTimezoneMap[plantId],
        hourFormat
      );
      dueDate = zonedTimeToUtc(
        format(dueDate, dateFormat5) + ` ${time}`,
        this.plantTimezoneMap[plantId].timeZoneIdentifier
      );
    }
    this.raceDynamicFormService
      .updateInspection$(
        inspectionId,
        { ...rest, inspectionId, dueDate },
        'due-date'
      )
      .pipe(
        tap((resp: any) => {
          if (Object.keys(resp).length) {
            this.dataSource.data = this.dataSource.data.map((data) => {
              if (data.inspectionId === inspectionId) {
                return {
                  ...data,
                  dueDate,
                  dueDateDisplay: dueDateDisplayFormat,
                  inspectionDBVersion: resp.inspectionDBVersion + 1,
                  inspectionDetailDBVersion: resp.inspectionDetailDBVersion + 1,
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

  dueDateClosedHandler() {
    this.trigger.toArray()[1].closeMenu();
  }
  formatDate(date, plantId) {
    if (this.plantTimezoneMap[plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[plantId],
        dateFormat2
      );
    }
    return format(new Date(date), dateFormat2);
  }
}
