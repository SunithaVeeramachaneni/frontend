/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  defaultLimit,
  permissions as perms,
  routingUrls
} from 'src/app/app.constants';
import {
  CellClickActionEvent,
  LoadEvent,
  Permission,
  SearchEvent,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ShiftService } from '../services/shift.service';
import { slideInOut } from 'src/app/animations';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ShiftListComponent implements OnInit, OnDestroy {
  readonly perms = perms;
  userInfo$: Observable<UserInfo>;

  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Shift Name',
      type: 'string',
      controlType: 'string',
      order: 1,
      searchable: true,
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
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'startAndEndTime',
      displayName: 'Start & End Time',
      type: 'string',
      controlType: 'string',
      order: 2,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'isActive',
      displayName: 'Active',
      type: 'string',
      controlType: 'slide-toggle',
      order: 3,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: false,
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
    tableID: 'shiftsTable',
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
    groupLevelColors: [],
    conditionalStyles: {}
  };

  searchShift: FormControl;
  dataSource: MatTableDataSource<any>;
  openShiftDetailedView = 'out';
  shiftAddOrEditOpenState = 'out';
  shiftEditData;
  shiftMode = 'CREATE';
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  fetchShifts$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  shifts$: Observable<any>;

  addEditCopyDeleteShifts = false;
  addEditCopyDeleteShifts$: BehaviorSubject<any> = new BehaviorSubject<any>({
    action: null,
    shift: {} as any
  });
  selectedShift;

  skip = 0;
  limit = defaultLimit;
  nextToken = '';
  parentInformation: any;
  private onDestroy$ = new Subject();

  constructor(
    private loginService: LoginService,
    private readonly toast: ToastService,
    private shiftService: ShiftService,
    private cdrf: ChangeDetectorRef,
    private commonService: CommonService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.shifts.title))
    );
    this.fetchShifts$.next({ data: 'load' });
    this.fetchShifts$.next({} as TableEvent);
    this.searchShift = new FormControl('');

    this.searchShift.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.fetchShifts$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedShifts();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  getDisplayedShifts(): void {
    const shiftsOnLoadSearch$ = this.fetchShifts$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        this.nextToken = '';
        return this.getShifts();
      })
    );

    const onScrollShifts$ = this.fetchShifts$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getShifts();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.shifts$ = combineLatest([
      shiftsOnLoadSearch$,
      this.addEditCopyDeleteShifts$,
      onScrollShifts$
    ]).pipe(
      map(([rows, { shift, action }, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 140px)'
          };
          if (this.addEditCopyDeleteShifts && action === 'add') {
            initial.data = [shift, ...initial.data];
          } else {
            initial.data = rows;
          }
        } else if (this.addEditCopyDeleteShifts) {
          switch (action) {
            case 'add':
              initial.data = [shift, ...initial.data];
              break;
            case 'edit':
              const idx = initial.data.findIndex((d) => d?.id === shift?.id);
              if (idx !== -1) {
                initial.data[idx] = {
                  ...initial.data[idx],
                  ...shift
                };
              }
              break;
            default:
            // Do nothing
          }
          this.addEditCopyDeleteShifts = false;
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getShifts() {
    return this.shiftService
      .getShiftsList$({
        next: this.nextToken,
        limit: this.limit,
        searchTerm: this.searchShift.value
      })
      .pipe(
        mergeMap(({ items, next }) => {
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(items);
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  addOrUpdateShift(shiftData) {
    if (shiftData?.status === 'add') {
      this.addEditCopyDeleteShifts = true;
      this.addEditCopyDeleteShifts$.next({
        action: 'add',
        shift: shiftData?.data
      });
      this.toast.show({
        text: 'Shift created successfully!',
        type: 'success'
      });
    } else if (shiftData?.status === 'edit') {
      this.addEditCopyDeleteShifts = true;
      this.addEditCopyDeleteShifts$.next({
        action: 'edit',
        shift: shiftData?.data
      });
      this.toast.show({
        text: 'Shift updated successfully!',
        type: 'success'
      });
    }
  }

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_SHIFT')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  handleTableEvent = (event): void => {
    this.fetchShifts$.next(event);
  };

  rowLevelActionHandler = (event): void => {
    const { data, action } = event;
    switch (action) {
      case 'edit':
        this.shiftMode = 'EDIT';
        this.shiftEditData = { ...data };
        this.selectedShift = { ...data };
        this.openShiftDetailedView = 'in';
        break;
      default:
    }
  };

  configOptionsChangeHandler = (event): void => {};

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'startAndEndTime':
      case 'startTime':
      case 'endTime':
        this.showShiftDetail(row);
        break;
      case 'isActive':
        this.selectedShift = row;
        break;
      default:
    }
  };

  addManually() {
    this.openShiftDetailedView = 'in';
    this.shiftEditData = null;
    this.selectedShift = null;
    this.shiftMode = 'CREATE';
  }

  showShiftDetail(row): void {
    this.shiftMode = 'VIEW';
    this.selectedShift = row;
    this.openShiftDetailedView = 'in';
  }

  onCloseShiftAddOrEditOpenState(event) {
    this.openShiftDetailedView = event;
  }
  onShiftModeUpdate(event) {
    this.shiftMode = event.mode;
    this.shiftEditData = event.data;
  }

  onCloseShiftDetailedView(event) {
    this.openShiftDetailedView = event.status;
    if (event.data !== '') {
      this.shiftEditData = event.data;
      this.selectedShift = event.data;
      this.shiftAddOrEditOpenState = 'in';
      this.cdrf.detectChanges();
    }
  }

  onToggleChangeHandler(event) {
    const shiftData = {
      name: this.selectedShift.name,
      startTime: this.selectedShift.startTime,
      endTime: this.selectedShift.endTime,
      isActive: event
    };
    this.shiftService
      .updateShift$(shiftData, this.selectedShift.id)
      .subscribe((result) => {
        if (Object.keys(result).length > 0) {
          this.addEditCopyDeleteShifts = true;
          this.addEditCopyDeleteShifts$.next({
            action: 'edit',
            shift: {
              ...this.selectedShift,
              isActive: event,
              startAndEndTime: `${this.selectedShift.startTime} - ${this.selectedShift.endTime}`
            }
          });
          this.toast.show({
            text: 'Shift updated successfully!',
            type: 'success'
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
