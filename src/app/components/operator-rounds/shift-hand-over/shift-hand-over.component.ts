/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { routingUrls } from 'src/app/app.constants';
import {
  graphQLDefaultLimit,
  permissions as perms,
  graphQLDefaultFilterLimit
} from 'src/app/app.constants';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  CellClickActionEvent,
  Count,
  FormTableUpdate,
  Permission,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError,
  takeUntil
} from 'rxjs/operators';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { ShrService } from '../services/shr.service';
import { FormControl } from '@angular/forms';
import { cloneDeep, omit } from 'lodash-es';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../user-management/services/users.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { MatTableDataSource } from '@angular/material/table';
import { LocationService } from '../../master-configurations/locations/services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { ShiftHandOverModalComponent } from '../shift-hand-over-modal/shift-hand-over-modal.component';
import { slideInOut } from 'src/app/animations';
import { SHRColumnConfiguration } from 'src/app/interfaces/shr-column-configuration';

@Component({
  selector: 'app-shift-hand-over',
  templateUrl: './shift-hand-over.component.html',
  styleUrls: ['./shift-hand-over.component.scss'],
  animations: [slideInOut]
})
export class ShiftHandOverComponent implements OnInit {
  readonly perms = perms;
  public menuState = 'out';
  status: any[] = ['Not-Started', 'Completed', 'Ongoing'];
  handOverStatus: any[] = ['Draft', 'Submitted'];

  searchPosition: FormControl;
  userInfo$: Observable<UserInfo>;
  units: [];
  columns: Column[] = [
    {
      id: 'shiftNames',
      displayName: 'Shift',
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
        fontWeight: 500
      },
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'unit',
      displayName: 'Unit',
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
      titleStyle: {
        fontWeight: 500
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'shiftStatus',
      displayName: 'Shift Status',
      type: 'string',
      controlType: 'string',
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
        height: '24px'
      },
      subtitleStyle: {},
      hasConditionalStyles: true,
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'shiftSupervisor',
      displayName: 'Shift Supervisor',
      type: 'string',
      controlType: 'string',
      order: 4,
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
    },
    {
      id: 'handoverStatus',
      displayName: 'Handover Status',
      type: 'string',
      controlType: 'string',
      order: 5,
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
      hasConditionalStyles: true,
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'submittedOn',
      displayName: 'Submitted On',
      type: 'number',
      controlType: 'string',
      order: 6,
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
      titleStyle: {
        fontWeight: 500
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'incomingSupervisor',
      displayName: 'Accepted By',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
      order: 7,
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
      titleStyle: {
        fontWeight: 500
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'acceptedOn',
      displayName: 'Accepted On',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
      order: 8,
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
      titleStyle: {
        fontWeight: 500
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];
  ghostLoading = new Array(15).fill(0).map((v, i) => i);
  dataFetchingComplete = false;

  configOptions: ConfigOptions = {
    tableID: 'formsTable',
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
      'not-started': {
        color: '#92400E'
      },
      completed: {
        color: '#2C9E53'
      },
      ongoing: {
        color: '#FF9800'
      },
      submitted: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      },
      draft: {
        'background-color': '#FFCC00',
        color: '#000000'
      }
    }
  };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  skip = 0;
  limit = graphQLDefaultLimit;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as GetFormList
    });
  fetchType = 'load';
  selectedForm: GetFormList = null;
  nextToken = '';
  shrListCountRaw$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  shrListCount$: Observable<number>;
  public columnConfigMenuState = 'out';
  forms$: Observable<any>;
  allForms = [];
  dataSource: MatTableDataSource<any>;
  isArchived = '';
  incomingSupervisorId = '';
  shrConfigColumns: SHRColumnConfiguration[] = [];
  private onDestroy$ = new Subject();

  constructor(
    private headerService: HeaderService,
    private shrService: ShrService,
    private router: Router,
    private usersService: UsersService,
    private plantService: PlantService,
    private locationService: LocationService,
    private dialog: MatDialog
  ) {}
  //  this.headerService.setHeaderTitle(routingUrls?.shiftHandOvers?.title);
  ngOnInit(): void {
    this.headerService.setHeaderTitle(routingUrls?.shiftHandOvers?.title);
    this.shrService.fetchShr$.next({ data: 'load' });
    this.shrService.fetchShr$.next({} as TableEvent);
    this.searchPosition = new FormControl('');
    this.searchPosition.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value: string) => {
          this.shrService.fetchShr$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.shrService.fetchShr$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getForms();
      })
    );

    const onScrollForms$ = this.shrService.fetchShr$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as GetFormList[]);
        }
      })
    );
    const units$ = this.locationService.fetchAllLocations$();
    const initial = {
      columns: this.columns,
      data: []
    };
    let cominedResult = [];
    this.forms$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$,
      units$
    ]).pipe(
      map(([rows, scrollData, units]) => {
        this.dataFetchingComplete = true;
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }
        cominedResult = initial.data.map((shr) => {
          const unitName = (units?.items || []).find(
            (unit) => unit?.id === shr?.unitId
          );
          return { ...shr, unit: unitName?.name || '--' };
        });
        this.allForms = cominedResult;
        this.dataSource = new MatTableDataSource(this.allForms);
        this.skip = this.allForms.length;
        return initial;
      })
    );
  }

  receiveData(shrConfig: SHRColumnConfiguration[]) {
    this.shrConfigColumns = shrConfig;
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    row.shrConfigColumns = this.shrConfigColumns;
    switch (columnId) {
      case 'shiftNames':
      case 'unitId':
      case 'shiftStatus':
      case 'shiftSupervisor':
      case 'handoverStatus':
      case 'submittedOn':
      case 'incomingSupervisor':
      case 'acceptedOn':
        this.dialog.open(ShiftHandOverModalComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
          panelClass: 'full-screen-modal',
          disableClose: true,
          data: row
        });
        break;
      default:
    }
  };

  getForms() {
    const columnConfigFilter = cloneDeep('');

    const hasColumnConfigFilter = Object.keys(columnConfigFilter)?.length || 0;

    return this.shrService
      .getShiftHandOverList$(
        {
          // next: this.nextToken,
          limit: hasColumnConfigFilter ? graphQLDefaultFilterLimit : this.limit,
          searchKey: this.searchPosition.value,
          fetchType: this.fetchType
          // isArchived: this.isArchived,
          // incomingSupervisorId: this.incomingSupervisorId
        }
        // this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          if (count !== undefined) {
            this.shrListCountRaw$.next(count);
          }
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.shrListCount$ = of(0);
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) =>
          data.map((item) => {
            return item;
          })
        )
      );
  }

  handleTableEvent = (event): void => {
    this.shrService.fetchShr$.next(event);
  };

  prepareMenuActions() {
    const menuActions = [];

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : true;
    this.configOptions = { ...this.configOptions };
  }

  showColumnConfig(): void {
    this.columnConfigMenuState = 'in';
  }

  onCloseColumnConfig() {
    this.columnConfigMenuState = 'out';
  }
}
