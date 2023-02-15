/* eslint-disable no-underscore-dangle */
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
  forkJoin,
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
import { MatDialog } from '@angular/material/dialog';

import { CellClickActionEvent, Count, TableEvent } from 'src/app/interfaces';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import {
  CreateUnitListMutation,
  GetUnitMeasumentQuery,
  UpdateUnitListMutation,
  UpdateUnitMeasumentMutation
} from 'src/app/API.service';
import { UnitMeasurementService } from '../services';
import { EditUnitPopupComponent } from '../edit-unit-popup/edit-unit-popup.component';
import { UnitOfMeasurementDeleteModalComponent } from '../uom-delete-modal/uom-delete-modal.component';
import { LoadEvent, SearchEvent } from './../../../../interfaces/events';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { ErrorHandlerService } from 'src/app/shared/error-handler/error-handler.service';
import { groupBy } from 'lodash-es';

export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'setAsDefault' | 'status' | null;
  form: GetUnitMeasumentQuery;
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
        color: '#3D5AFE'
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
  limit = defaultLimit;
  searchUom: FormControl;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  unitOfMeasurements$: Observable<{
    columns: Column[];
    data: GetUnitMeasumentQuery[];
  }>;
  fetchUOM$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  unitAddOrEditOpenState = 'out';
  unitEditData: any = null;
  private allUnitData: GetUnitMeasumentQuery[] = [];
  constructor(
    private readonly toast: ToastService,
    private readonly unitMeasurementService: UnitMeasurementService,
    public readonly dialog: MatDialog,
    private errorHandlerService: ErrorHandlerService
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
          return of([] as GetUnitMeasumentQuery[]);
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
        this.skip = initial.data.length;
        this.allUnitData = initial.data;
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
        catchError((err) => {
          this.formsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          this.errorHandlerService.handleError(err);
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

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Set as Default',
        action: 'setAsDefault'
      },
      {
        title: 'Edit',
        action: 'edit'
      }
      // {
      //   icon: 'delete',
      //   title: 'Delete',
      //   action: 'delete'
      // }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  addManually(): void {
    this.unitEditData = null;
    this.unitAddOrEditOpenState = 'in';
  }

  showUnitDetail(row: GetUnitMeasumentQuery): void {
    const result: GetUnitMeasumentQuery[] = this.allUnitData?.filter(
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
    this.unitMeasurementService.uploadExcel(formData).subscribe(
      (resp: any) => {
        if (resp?.data) {
          for (const [key, value] of Object.entries(
            groupBy(resp?.data, 'name')
          )) {
            this.unitMeasurementService
              .getSingleUnitListByName$(key)
              .subscribe(({ items }) => {
                if (items?.length > 0) {
                  this.createUpdateUnitListItems(items[0], value as any);
                } else {
                  this.unitMeasurementService
                    .CreateUnitList$({
                      name: key
                    })
                    .subscribe((response: CreateUnitListMutation) => {
                      if (response) {
                        this.createUpdateUnitListItems(response, value as any);
                      }
                    });
                }
              });
          }
        }
      },
      (err) => this.errorHandlerService.handleError(err)
    );
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  private createUpdateUnitListItems(
    response: CreateUnitListMutation | UpdateUnitListMutation,
    units: any[]
  ) {
    const unitObservables = [];
    units?.forEach(
      (element: {
        id: string | number;
        description: string;
        symbol: string;
        version?: number | null;
      }) => {
        if (response && element?.description && element?.symbol) {
          unitObservables.push(
            this.unitMeasurementService.createUnitOfMeasurement$({
              unitlistID: response?.id,
              description: element?.description || '',
              searchTerm: `${element?.description?.toLowerCase() || ''} ${
                response?.name?.toLowerCase() || ''
              }`,
              symbol: element?.symbol || ''
            })
          );
        }
      }
    );
    forkJoin(unitObservables).subscribe(
      () => {
        this.nextToken = '';
        this.fetchUOM$.next({ data: 'load' });
      },
      (err) => this.errorHandlerService.handleError(err)
    );
  }

  private onDeleteUnit(data: GetUnitMeasumentQuery): void {
    const deleteReportRef = this.dialog.open(
      UnitOfMeasurementDeleteModalComponent,
      {
        data
      }
    );

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.unitMeasurementService
          .updateUnitMeasurement$({
            id: data.id,
            isDeleted: true,
            _version: data._version
          })
          .subscribe(
            (result: UpdateUnitMeasumentMutation) => {
              if (result) {
                this.addEditCopyForm$.next({
                  action: 'delete',
                  form: result
                });
              }
            },
            (err) => this.errorHandlerService.handleError(err)
          );
      }
    });
  }

  private onSetIsDefault(unit: GetUnitMeasumentQuery): void {
    if (this.allUnitData?.length === 0) {
      return;
    }
    this.unitMeasurementService
      .updateUnitMeasurement$({
        id: unit?.id,
        isDefault: true,
        _version: unit._version
      })
      .subscribe(
        (res: GetUnitMeasumentQuery) => {
          if (res) {
            this.updateListAfterIsDefault(res, unit);
          }
        },
        (err) => this.errorHandlerService.handleError(err)
      );
  }

  private onEditUnit(data: GetUnitMeasumentQuery): void {
    this.unitMeasurementService.getUnitLists().subscribe((units) => {
      const deleteReportRef = this.dialog.open(EditUnitPopupComponent, {
        data: {
          ...data,
          units
        }
      });

      deleteReportRef.afterClosed().subscribe((res) => {
        if (res?.action === 'save') {
          const unit: any = { ...data };
          if (res?.unitType !== unit?.unitType) {
            const changedUnitType = res?.units?.find(
              (u) => u?.name === res?.unitType
            );

            this.unitMeasurementService
              .updateUnitMeasurement$({
                id: res?.id,
                symbol: res?.symbol,
                description: res?.description,
                isActive: res?.isActive === null ? true : res?.isActive,
                searchTerm: `${res?.description?.toLowerCase()} ${res?.name?.toLowerCase()}`,
                _version: res?._version,
                unitlistID: changedUnitType
                  ? changedUnitType?.id
                  : res.unitlistID
              })
              .subscribe(
                (result: UpdateUnitMeasumentMutation) => {
                  if (result) {
                    this.nextToken = '';
                    this.fetchUOM$.next({ data: 'load' });
                  }
                },
                (err) => this.errorHandlerService.handleError(err)
              );
          } else {
            this.unitMeasurementService
              .updateUnitList$({
                id: res?.unitList?.id,
                name: res?.unitType || res?.unitList?.name,
                _version: res?.unitList?._version
              })
              .subscribe(() => {
                this.unitMeasurementService
                  .updateUnitMeasurement$({
                    id: res?.id,
                    symbol: res?.symbol,
                    description: res?.description,
                    isActive: res?.isActive === null ? true : res?.isActive,
                    searchTerm: `${res?.description?.toLowerCase()} ${res?.name?.toLowerCase()}`,
                    _version: res?._version
                  })
                  .subscribe(
                    (result: UpdateUnitMeasumentMutation) => {
                      if (result) {
                        this.addEditCopyForm$.next({
                          action: 'edit',
                          form: result
                        });
                      }
                    },
                    (err) => this.errorHandlerService.handleError(err)
                  );
              });
          }
        }
      });
    });
  }

  private updateListAfterIsDefault(
    res: GetUnitMeasumentQuery,
    unit: GetUnitMeasumentQuery
  ): void {
    const result: GetUnitMeasumentQuery[] = this.allUnitData?.filter(
      (d) => d?.unitlistID === unit?.unitlistID && d?.id !== unit?.id
    );
    if (result && Object.keys(result)?.length > 0) {
      const unitObservables = [];
      result?.forEach((element: GetUnitMeasumentQuery) => {
        unitObservables.push(
          this.unitMeasurementService.updateUnitMeasurement$({
            id: element?.id,
            isDefault: false,
            _version: element?._version
          })
        );
      });
      if (unitObservables?.length > 0) {
        forkJoin(unitObservables).subscribe(
          () => {
            this.addEditCopyForm$.next({
              action: 'setAsDefault',
              form: res
            });
          },
          (err) => this.errorHandlerService.handleError(err)
        );
      } else {
        this.addEditCopyForm$.next({
          action: 'setAsDefault',
          form: res
        });
      }
    }
  }

  private onChangeStatus(unit: GetUnitMeasumentQuery): void {
    this.unitMeasurementService
      .updateUnitMeasurement$({
        id: unit?.id,
        isActive: unit?.isActive ? false : true,
        _version: unit?._version
      })
      .subscribe(
        (result: UpdateUnitMeasumentMutation) => {
          if (result) {
            this.addEditCopyForm$.next({
              action: 'status',
              form: result
            });
          }
        },
        (err) => this.errorHandlerService.handleError(err)
      );
  }
}
