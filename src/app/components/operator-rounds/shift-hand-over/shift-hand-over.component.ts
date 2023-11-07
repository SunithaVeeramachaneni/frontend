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

@Component({
  selector: 'app-shift-hand-over',
  templateUrl: './shift-hand-over.component.html',
  styleUrls: ['./shift-hand-over.component.css']
})
export class ShiftHandOverComponent implements OnInit {
  readonly perms = perms;
  public menuState = 'out';

  searchPosition: FormControl;
  userInfo$: Observable<UserInfo>;
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
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'unitId',
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
      titleStyle: {},
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
      titleStyle: {},
      subtitleStyle: {},
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
      titleStyle: {},
      subtitleStyle: {},
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
      titleStyle: {},
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
      titleStyle: {},
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];

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
  private onDestroy$ = new Subject();
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

  constructor(
    private headerService: HeaderService,
    private shrService: ShrService,
    private router: Router,
    private usersService: UsersService,
    private plantService: PlantService
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

    const initial = {
      columns: this.columns,
      data: []
    };
    this.forms$ = combineLatest([formsOnLoadSearch$, onScrollForms$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }
        this.allForms = initial.data;
        this.dataSource = new MatTableDataSource(this.allForms);
        console.log("data", this.allForms[11]?.incomingSupervisor?.firstName);
        this.skip = this.allForms.length;
        return initial;
      })
    );
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    // const { columnId, row } = event;
    // switch (columnId) {
    //   case 'shiftId':
    //   // case 'description':
    //   // case 'author':
    //   // case 'plant':
    //   // case 'formStatus':
    //   // case 'lastPublishedBy':
    //   // case 'publishedDate':
    //   // case 'responses':
    //     // this.showFormDetail(row);
    //     break;
    //   default:
    // }
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
            // if (item.plantId) {
            //   item = {
            //     ...item,
            //     plant: item.plant
            //   };
            // } else {
            //   item = { ...item, plant: '' };
            // }
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
}
