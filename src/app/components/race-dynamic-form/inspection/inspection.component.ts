/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
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
  InspectionDetail,
  SelectTab,
  RowLevelActionEvent,
  UserDetails,
  AssigneeDetails
} from 'src/app/interfaces';
import {
  formConfigurationStatus,
  graphQLDefaultLimit,
  permissions as perms
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

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class InspectionComponent implements OnInit, OnDestroy {
  @Output() selectTab: EventEmitter<SelectTab> = new EventEmitter<SelectTab>();
  @ViewChild('assigneeMenuTrigger') assigneeMenuTrigger: MatMenuTrigger;
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
  filter = {
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
      id: 'dueDate',
      displayName: 'Due Date',
      type: 'string',
      controlType: 'date-picker',
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
        dependentFieldValues: ['to-do', 'open', 'in-progress'],
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
        'background-color': '#D1FAE5',
        color: '#065f46'
      },
      'in-progress': {
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      open: {
        'background-color': '#FEE2E2',
        color: '#991B1B'
      },
      'to-do': {
        'background-color': '#FEE2E2',
        color: '#991B1B'
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
  limit = graphQLDefaultLimit;
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
  zIndexDelay = 0;
  hideInspectionDetail: boolean;
  formId: string;

  plants = [];
  plantsIdNameMap = {};

  initial = {
    columns: this.columns,
    data: []
  };
  readonly perms = perms;
  readonly formConfigurationStatus = formConfigurationStatus;
  private _users$: Observable<UserDetails[]>;
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private loginService: LoginService,
    private store: Store<State>,
    private router: Router,
    private toastService: ToastService,
    private cdrf: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchInspection$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.getFilter();
    this.getAllInspections();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
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
              nextToken: string | null;
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
            tableHeight: 'calc(80vh - 20px)'
          };
          this.initial.data = inspections?.rows?.map((inspectionDetail) => ({
            ...inspectionDetail,
            dueDate: inspectionDetail.dueDate
              ? new Date(inspectionDetail.dueDate)
              : '',
            assignedTo: this.raceDynamicFormService.getUserFullName(
              inspectionDetail.assignedTo
            )
          }));
        } else {
          this.initial.data = this.initial.data.concat(
            scrollData.rows?.map((inspectionDetail) => ({
              ...inspectionDetail,
              dueDate: inspectionDetail.dueDate
                ? new Date(inspectionDetail.dueDate)
                : '',
              assignedTo: this.raceDynamicFormService.getUserFullName(
                inspectionDetail.assignedTo
              )
            }))
          );
        }

        if (this.filter?.schedule?.length > 0) {
          this.initial.data = this.dataSource?.data?.filter((d) =>
            this.filter.schedule.includes(d?.schedule)
          );
        }
        this.skip = this.initial.data.length;
        this.dataSource = new MatTableDataSource(this.initial.data);
        return this.initial;
      })
    );

    this.activatedRoute.params.subscribe(() => {
      this.hideInspectionDetail = true;
    });

    this.activatedRoute.queryParams.subscribe(({ formId = '' }) => {
      this.formId = formId;
      this.fetchInspection$.next({ data: 'load' });
      this.isLoading$.next(true);
    });

    this.configOptions.allColumns = this.columns;
  }

  getInspectionsList() {
    const obj = {
      nextToken: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      formId: this.formId
    };
    return this.raceDynamicFormService
      .getInspectionsList$({ ...obj, ...this.filter })
      .pipe(
        tap(({ count, nextToken }) => {
          this.nextToken = nextToken !== undefined ? nextToken : null;
          this.inspectionsCount =
            count !== undefined ? count : this.inspectionsCount;
          this.isLoading$.next(false);
        })
      );
  }
  getAllInspections() {
    this.raceDynamicFormService.fetchAllRounds$().subscribe((formsList) => {
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
      const uniquePlants = formsList
        .map((item) => {
          if (item.plant) {
            this.plantsIdNameMap[item.plant] = item.plantId;
            return item.plant;
          }
          return '';
        })
        .filter((value, index, self) => self.indexOf(value) === index);
      for (const item of uniquePlants) {
        if (item) {
          this.plants.push(item);
        }
      }

      for (const item of this.filterJson) {
        if (item.column === 'assignedTo') {
          item.items = this.assignedTo;
        } else if (item.column === 'plant') {
          item.items = this.plants;
        }
        for (const item of this.filterJson) {
          if (item.column === 'assignedTo') {
            item.items = this.assignedTo;
          }
          if (item.column === 'schedule') {
            item.items = this.schedules;
          }
        }
      }
    });
  }

  handleTableEvent = (event): void => {
    this.fetchInspection$.next(event);
  };

  ngOnDestroy(): void {}

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
        if (row.status !== 'submitted') this.assigneeMenuTrigger.openMenu();
        this.selectedForm = row;
        break;
      case 'dueDate':
        this.selectedForm = row;
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

  formsDetailActionHandler() {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/forms/edit/${this.selectedForm.id}`]);
  }

  getFilter() {
    this.raceDynamicFormService.getInspectionFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  applyFilters(data: any): void {
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        const plantId = this.plantsIdNameMap[item.value];
        this.filter[item.column] = plantId;
      } else if (item.type !== 'date' && item.value) {
        this.filter[item.column] = item.value;
      } else if (item.type === 'date' && item.value) {
        this.filter[item.column] = item.value.toISOString();
      }
    }
    if (
      !this.filter.assignedTo &&
      !this.filter.dueDate &&
      this.filter?.schedule?.length > 0
    ) {
      this.initial.data = this.dataSource?.data?.filter((d) =>
        this.filter.schedule.includes(d?.schedule)
      );
      this.dataSource = new MatTableDataSource(this.initial.data);
    } else {
      this.nextToken = '';
      this.fetchInspection$.next({ data: 'load' });
    }
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
    this.filter = {
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
    const { inspectionId } = this.selectedForm;
    this.raceDynamicFormService
      .updateInspection$(
        inspectionId,
        { ...this.selectedForm, assignedTo },
        'assigned-to'
      )
      .pipe(
        tap((resp) => {
          if (Object.keys(resp).length) {
            this.initial.data = this.dataSource.data.map((data) => {
              if (data.inspectionId === inspectionId) {
                return {
                  ...data,
                  assignedTo:
                    this.raceDynamicFormService.getUserFullName(assignedTo),
                  inspectionDBVersion: resp.inspectionDBVersion + 1,
                  inspectionDetailDBVersion: resp.inspectionDetailDBVersion + 1
                };
              }
              return data;
            });
            this.dataSource = new MatTableDataSource(this.initial.data);
            this.cdrf.detectChanges();
            this.toastService.show({
              type: 'success',
              text: 'Assigned to updated successfully'
            });
          }
        })
      )
      .subscribe();
  }

  onChangeDueDateHandler(dueDate: Date) {
    const { inspectionId } = this.selectedForm;
    this.raceDynamicFormService
      .updateInspection$(
        inspectionId,
        { ...this.selectedForm, dueDate },
        'due-date'
      )
      .pipe(
        tap((resp) => {
          if (Object.keys(resp).length) {
            this.initial.data = this.dataSource.data.map((data) => {
              if (data.inspectionId === inspectionId) {
                return {
                  ...data,
                  dueDate,
                  inspectionDBVersion: resp.inspectionDBVersion + 1,
                  inspectionDetailDBVersion: resp.inspectionDetailDBVersion + 1
                };
              }
              return data;
            });
            this.dataSource = new MatTableDataSource(this.initial.data);
            this.toastService.show({
              type: 'success',
              text: 'Due date updated successfully'
            });
          }
        })
      )
      .subscribe();
  }
}
