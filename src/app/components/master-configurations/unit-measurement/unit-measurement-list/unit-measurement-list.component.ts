import { LoadEvent, SearchEvent } from './../../../../interfaces/events';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import { CellClickActionEvent, Count, TableEvent } from 'src/app/interfaces';
import { defaultLimit } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { GetFormListQuery } from 'src/app/API.service';
import { UnitMeasurementService } from '../services/unit-measurement.service';

export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'setAsDefault' | null;
  form: GetFormListQuery;
}

@Component({
  selector: 'app-unit-measurement-list',
  templateUrl: './unit-measurement-list.component.html',
  styleUrls: ['./unit-measurement-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class UnitMeasurementListComponent implements OnInit {
  public menuState = 'out';
  submissionSlider = 'out';

  columns: Column[] = [
    {
      id: 'unitType',
      displayName: 'UMO',
      type: 'string',
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
      subtitleColumn: '',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'noOfUnits',
      displayName: 'No. of Unit',
      type: 'number',
      isMultiValued: true,
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
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'description',
      displayName: 'Description',
      type: 'string',
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
      id: 'symbol',
      displayName: 'Symbol',
      type: 'string',
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
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'isDeleted',
      displayName: 'Status',
      type: 'string',
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
      hasPostTextImage: false,
      hasConditionalStyles: true
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
    groupByColumns: ['unitType', 'noOfUnits'],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: [],
    conditionalStyles: {}
  };
  dataSource: MatTableDataSource<any>;
  formsCount$: Observable<Count>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  formCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  searchUom: FormControl;
  addCopyFormCount = false;
  isPopoverOpen = false;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  selectedForm: GetFormListQuery = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  unitOfMeasurements$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchUOM$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  openUomDetailedView = 'out';
  unitAddOrEditOpenState = 'out';
  unitEditData: any;
  selectedUnit: any;
  constructor(
    private readonly toast: ToastService,
    private readonly unitMeasurementService: UnitMeasurementService
  ) {}

  ngOnInit(): void {
    this.fetchUOM$.next({ data: 'load' });
    this.fetchUOM$.next({} as TableEvent);
    this.searchUom = new FormControl('');
    this.searchUom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchUOM$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'isDeleted':
        this.showLocationDetail(row);
        break;
      default:
    }
  };

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchUOM$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        return this.getUnitOfMeasurementList();
      })
    );

    const onScrollForms$ = this.fetchUOM$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getUnitOfMeasurementList();
        } else {
          return of([] as GetFormListQuery[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.unitOfMeasurements$ = combineLatest([
      formsOnLoadSearch$,
      this.addEditCopyForm$,
      onScrollForms$
    ]).pipe(
      map(([rows, form, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 105px)'
          };
          initial.data = rows;
        } else {
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            this.toast.show({
              text: 'Form archive successfully!',
              type: 'success'
            });
          }
          if (form.action === 'setAsDefault') {
            this.toast.show({
              text: 'UOM set as default successfully!',
              type: 'success'
            });
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getUnitOfMeasurementList() {
    return this.unitMeasurementService
      .getUnitOfMeasurementList$({
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchUom.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, nextToken }) => {
          this.formsCount$ = of({ count });
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.unitEditData = data;
        this.unitAddOrEditOpenState = 'in';
        break;
      case 'setAsDefault':
        this.onSetIsDefault(data);
        break;
      case 'delete':
        this.onDeleteUnit(data);
        break;
    }
  };

  handleTableEvent = (event): void => {
    this.fetchUOM$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(): void {
    const menuActions = [
      {
        icon: 'star',
        title: 'Set as Default',
        action: 'setAsDefault'
      },
      {
        icon: 'edit',
        title: 'Edit',
        action: 'edit'
      },
      {
        icon: 'delete',
        title: 'Delete',
        action: 'delete'
      }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  addManually() {
    this.unitAddOrEditOpenState = 'in';
  }

  showLocationDetail(row: any): void {
    this.selectedUnit = row;
    this.openUomDetailedView = 'in';
  }

  onCloseLocationAddOrEditOpenState(event) {
    this.unitAddOrEditOpenState = event;
  }

  onCloseLocationDetailedView(event) {
    this.openUomDetailedView = event.status;
    if (event.data !== '') {
      this.unitEditData = event.data;
      this.unitAddOrEditOpenState = 'in';
    }
  }

  addOrUpdateUnit(locationData) {
    if (locationData?.status === 'add') {
      this.toast.show({
        text: 'Unit of Measurement created successfully!',
        type: 'success'
      });
    } else if (locationData?.status === 'edit') {
      this.toast.show({
        text: 'Unit of Measurement updated successfully!',
        type: 'success'
      });
    }
  }

  onCloseUnitDetailedView(event) {
    this.openUomDetailedView = event.status;
    if (event.data !== '') {
      this.unitEditData = event.data;
      this.unitAddOrEditOpenState = 'in';
    }
  }

  private onDeleteUnit(unit: any) {}

  private onSetIsDefault(unit: any) {
    this.unitMeasurementService
      .updateUnitMeasurement$({
        id: unit.id,
        isDefault: false
      })
      .subscribe((res: any) => {
        this.addEditCopyForm$.next({
          action: 'setAsDefault',
          form: res
        });
      });
  }
}
