/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject
} from 'rxjs';
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
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import {
  CellClickActionEvent,
  Count,
  Permission,
  TableEvent,
  UserInfo,
  UnitOfMeasurement
} from 'src/app/interfaces';
import {
  graphQLDefaultLimit,
  permissions as perms,
  routingUrls
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { UnitMeasurementService } from '../services';
import { EditUnitPopupComponent } from '../edit-unit-popup/edit-unit-popup.component';
import { UnitOfMeasurementDeleteModalComponent } from '../uom-delete-modal/uom-delete-modal.component';
import { LoadEvent, SearchEvent } from './../../../../interfaces/events';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { LoginService } from './../../../login/services/login.service';
import { slideInOut } from 'src/app/animations';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';

export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'setAsDefault' | 'status' | null;
  form: UnitOfMeasurement;
}

@Component({
  selector: 'app-unit-measurement-list',
  templateUrl: './unit-measurement-list.component.html',
  styleUrls: ['./unit-measurement-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class UnitMeasurementListComponent implements OnInit, OnDestroy {
  readonly perms = perms;
  columns: Column[] = [
    {
      id: 'unitType',
      displayName: 'Unit Type',
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
        color: '#3D5AFE',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
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
      id: 'noOfUnits',
      displayName: 'No. of Units',
      type: 'number',
      controlType: 'string',
      isMultiValued: true,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'description',
      displayName: 'UOM',
      type: 'string',
      controlType: 'string',
      order: 3,
      hasSubtitle: true,
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      subtitleColumn: 'isDefaultText',
      titleStyle: {},
      subtitleStyle: {
        background: 'rgba(103, 58, 183, 0.2)',
        borderRadius: '30px',
        padding: '4px 10px',
        color: '#673AB7',
        fontWeight: '600',
        marginLeft: '10px'
      },
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'symbol',
      displayName: 'Symbol',
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
      hasPostTextImage: false,
      hasConditionalStyles: false
    },
    {
      id: 'isActive',
      displayName: 'Status',
      type: 'string',
      controlType: 'slide-toggle',
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
      hasPostTextImage: false,
      hasConditionalStyles: false
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
    conditionalStyles: {
      isDefaultText: {
        background: 'none'
      }
    }
  };
  dataSource: MatTableDataSource<any>;
  formsCount$: Observable<Count>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  skip = 0;
  limit = graphQLDefaultLimit;
  searchUom: FormControl;
  ghostLoading = new Array(16).fill(0).map((v, i) => i);
  nextToken = '';
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  unitOfMeasurements$: Observable<{
    columns: Column[];
    data: UnitOfMeasurement[];
  }>;
  fetchUOM$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  unitAddOrEditOpenState = 'out';
  unitEditData: any = null;
  userInfo$: Observable<UserInfo>;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  isPopoverOpen = false;
  filterJson: {
    label: string;
    items: string[];
    column: string;
    type: string;
    value: string;
  }[] = [];
  filter = {
    status: '',
    unitType: '',
    symbol: ''
  };
  private allUnitData: UnitOfMeasurement[] = [];
  private onDestroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    private readonly unitMeasurementService: UnitMeasurementService,
    public readonly dialog: MatDialog,
    private loginService: LoginService,
    private headerService: HeaderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(routingUrls.unitOfMeasurement.title)
      )
    );
    this.fetchUOM$.next({ data: 'load' });
    this.fetchUOM$.next({} as TableEvent);
    this.searchUom = new FormControl('');
    this.searchUom.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.fetchUOM$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getFilter();
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'unitType':
        this.showUnitDetail(row);
        break;
      case 'isActive':
        this.onChangeStatus(row);
        break;
      default:
    }
  };

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchUOM$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
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
          return of([] as UnitOfMeasurement[]);
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
            tableHeight: 'calc(100vh - 140px)'
          };
          initial.data = rows;
        } else {
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            this.toast.show({
              text: 'UOM deleted successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'edit') {
            const currentData = [...(initial?.data || [])];
            const idx = initial?.data?.findIndex(
              (d) => d?.id === form?.form?.id
            );
            if (idx !== -1) {
              if (
                initial?.data[idx]?.unitList?.id === form?.form?.unitList?.id
              ) {
                currentData[idx] = {
                  ...form.form,
                  noOfUnits: initial.data[idx]?.noOfUnits || 0,
                  isDefaultText: initial.data[idx]?.isDefaultText || '',
                  unitType: initial.data[idx]?.unitType || ''
                };
                initial.data = currentData;
              }
            }
            this.toast.show({
              text: 'UOM edited successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'status') {
            const idx = initial?.data?.findIndex(
              (d) => d?.id === form?.form?.id
            );
            const obj = {
              ...initial?.data[idx],
              isActive: form.form.isActive,
              _version: form.form._version
            };
            if (idx !== -1) {
              initial.data[idx] = obj;
            }
            this.toast.show({
              text: 'UOM status changed successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'setAsDefault') {
            initial.data = initial?.data?.map((d) => {
              const obj = { ...d };
              if (obj?.unitlistID === form?.form?.unitlistID) {
                if (obj?.id === form?.form?.id) {
                  obj.isDefault = form.form.isDefault;
                  obj._version = form.form._version;
                  obj.isDefaultText = 'Default';
                } else {
                  obj.isDefault = false;
                  obj.isDefaultText = '';
                }
              }
              return obj;
            });
            this.toast.show({
              text: 'UOM set as default successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'add') {
            this.toast.show({
              text: 'UOM set as default successfully!',
              type: 'success'
            });
            form.action = null;
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }
        this.skip = initial?.data?.length;
        this.allUnitData = initial?.data;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getUnitOfMeasurementList() {
    return this.unitMeasurementService
      .getUnitOfMeasurementList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchUom.value,
          fetchType: this.fetchType
        },
        this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next, filters }) => {
          this.formsCount$ = of({ count });
          this.nextToken = next;
          this.isLoading$.next(false);
          this.prepareFilters(filters);
          return of(rows);
        }),
        catchError((err) => {
          this.formsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          this.unitMeasurementService.handleError(err);
          return of([]);
        })
      );
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.onEditUnit(data);
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

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [
      ...(this.loginService.checkUserHasPermission(
        permissions,
        'UPDATE_UNIT_OF_MEASUREMENT'
      ) && [
        {
          title: 'Set as Default',
          action: 'setAsDefault'
        },
        {
          title: 'Edit',
          action: 'edit'
        }
      ])
    ];

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  addManually(): void {
    this.unitMeasurementService.getUnitTypes().subscribe();
    this.unitEditData = null;
    this.unitAddOrEditOpenState = 'in';
  }

  showUnitDetail(row: UnitOfMeasurement): void {
    const result: UnitOfMeasurement[] = this.allUnitData?.filter(
      (d) => d?.unitlistID === row?.unitlistID
    );
    this.unitEditData = {
      unitList: row?.unitList,
      rows: result
    };
    this.unitAddOrEditOpenState = 'in';
  }

  onCloseUomAddOrEditOpenState(event): void {
    this.unitAddOrEditOpenState = event;
    this.nextToken = '';
    this.fetchUOM$.next({ data: 'load' });
  }

  addOrUpdateUnit(data): void {
    if (data?.status === 'create') {
      this.toast.show({
        text: 'UOM added successfully!',
        type: 'success'
      });
    } else if (data?.status === 'edit') {
      this.toast.show({
        text: 'UOM edited successfully!',
        type: 'success'
      });
    }
    this.unitAddOrEditOpenState = 'out';
    this.nextToken = '';
    this.fetchUOM$.next({ data: 'load' });
  }

  exportAsXLSX(): void {
    this.unitMeasurementService
      .downloadSampleUomTemplate()
      .pipe(
        tap((data) => {
          downloadFile(data, 'UOM_Sample_Template');
        })
      )
      .subscribe();
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.unitMeasurementService.uploadExcel(formData).subscribe(() => {
      this.toast.show({
        text: 'File uploaded successfully!',
        type: 'success'
      });
      this.nextToken = '';
      this.fetchUOM$.next({ data: 'load' });
    });
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  applyFilters(data = []): void {
    if (this.searchUom.value) {
      this.searchUom.patchValue('');
    }
    this.isPopoverOpen = false;
    data?.forEach((item) => (this.filter[item?.column] = item.value ?? ''));
    this.nextToken = '';
    this.fetchUOM$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
    this.filter = {
      status: '',
      unitType: '',
      symbol: ''
    };
    this.nextToken = '';
    this.fetchUOM$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getFilter(): void {
    this.unitMeasurementService
      .getFilter()
      .subscribe((res) => (this.filterJson = res || []));
  }

  private prepareFilters(filters): void {
    this.filterJson?.forEach((item) => {
      if (item?.column === 'status') {
        item.items = filters?.status || [];
      }
      if (item?.column === 'unitType') {
        item.items = filters?.unitTypes || [];
      }
      if (item?.column === 'symbol') {
        item.items = filters?.symbol || [];
      }
    });
  }

  private onDeleteUnit(data: UnitOfMeasurement): void {
    const deleteReportRef = this.dialog.open(
      UnitOfMeasurementDeleteModalComponent,
      {
        data
      }
    );

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.unitMeasurementService
          .deleteUnitOfMeasurement$(data?.id)
          .subscribe((response) => {
            if (Object.keys(response)?.length) {
              this.nextToken = '';
              this.fetchUOM$.next({ data: 'load' });
              this.toast.show({
                text: 'UOM deleted successfully!',
                type: 'success'
              });
            }
          });
      }
    });
  }

  private onSetIsDefault(unit: UnitOfMeasurement): void {
    if (this.allUnitData?.length === 0) {
      return;
    }
    this.unitMeasurementService
      .setAsDefault$(unit?.id, {
        unitlistID: unit?.unitlistID
      })
      .subscribe((response) => {
        if (Object.keys(response)?.length) {
          this.nextToken = '';
          this.fetchUOM$.next({ data: 'load' });
          this.toast.show({
            text: 'UOM set as default successfully!',
            type: 'success'
          });
        }
      });
  }

  private onEditUnit(data: UnitOfMeasurement): void {
    this.unitMeasurementService.getUnitTypes().subscribe((units) => {
      const deleteReportRef = this.dialog.open(EditUnitPopupComponent, {
        data: { ...data, units }
      });

      deleteReportRef.afterClosed().subscribe((res) => {
        if (res?.action === 'save') {
          this.unitMeasurementService
            .editUnitOfMeasurement$(res?.id, {
              symbol: res?.symbol,
              description: res?.description,
              unitType: res?.unitType,
              isActive: res?.isActive
            })
            .subscribe((response) => {
              if (Object.keys(response)?.length) {
                this.nextToken = '';
                this.fetchUOM$.next({ data: 'load' });
                this.toast.show({
                  text: 'UOM edited successfully!',
                  type: 'success'
                });
              }
            });
        }
      });
    });
  }

  private onChangeStatus(unit: UnitOfMeasurement): void {
    this.unitMeasurementService
      .onChangeUomStatus$(unit?.id, {
        isActive: unit?.isActive ? false : true,
        _version: unit?._version
      })
      .subscribe((response) => {
        if (Object.keys(response)?.length) {
          this.nextToken = '';
          this.fetchUOM$.next({ data: 'load' });
          this.toast.show({
            text: 'UOM status changed successfully!',
            type: 'success'
          });
        }
      });
  }
}
