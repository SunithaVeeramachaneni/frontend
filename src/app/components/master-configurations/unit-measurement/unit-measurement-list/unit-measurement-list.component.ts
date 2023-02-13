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
import { AppService } from 'src/app/shared/services/app.services';
import { downloadFile } from 'src/app/shared/utils/fileUtils';

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
      displayName: 'UOM',
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
      hasSubtitle: true,
      showMenuOptions: false,
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      subtitleColumn: 'isDefaultText',
      titleStyle: {},
      subtitleStyle: {
        background: 'rgba(103, 58, 183, 0.2)'
      },
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
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
      id: 'isActive',
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
    conditionalStyles: {}
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
    private _appService: AppService
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
            tableHeight: 'calc(80vh - 105px)'
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
            this.toast.show({
              text: 'UOM edited successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'status') {
            this.toast.show({
              text: 'UOM status changed successfully!',
              type: 'success'
            });
            form.action = null;
          } else if (form.action === 'setAsDefault') {
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
        icon: 'star',
        title: 'Set as Default',
        action: 'setAsDefault'
      },
      {
        icon: 'edit',
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
    this.fetchUOM$.next({ data: 'load' });
  }

  addOrUpdateUnit(data): void {
    if (data?.status === 'add') {
      this.toast.show({
        text: 'Unit of Measurement created successfully!',
        type: 'success'
      });
    } else if (data?.status === 'edit') {
      this.toast.show({
        text: 'Unit of Measurement updated successfully!',
        type: 'success'
      });
    }
  }

  exportAsXLSX(): void {
    this.unitMeasurementService
      .downloadSampleAssetTemplate()
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
    this.unitMeasurementService.uploadExcel(formData).subscribe((resp: any) => {
      if (resp?.data) {
        // TODO: Need to check is handled properly or not.
        for (const [key, value] of Object.entries(resp?.data)) {
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
    });
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
    );
    forkJoin(unitObservables).subscribe(() => {});
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
          .subscribe((result: UpdateUnitMeasumentMutation) => {
            if (result) {
              this.addEditCopyForm$.next({
                action: 'delete',
                form: result
              });
            }
          });
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
      .subscribe((res: GetUnitMeasumentQuery) => {
        if (res) {
          this.updateListAfterIsDefault(res, unit);
        }
      });
  }

  private onEditUnit(data: GetUnitMeasumentQuery): void {
    const deleteReportRef = this.dialog.open(EditUnitPopupComponent, {
      data
    });

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res?.action === 'save') {
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
              .subscribe((result: UpdateUnitMeasumentMutation) => {
                if (result) {
                  this.addEditCopyForm$.next({
                    action: 'edit',
                    form: result
                  });
                  this.fetchUOM$.next({ data: 'load' });
                }
              });
          });
      }
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
        forkJoin(unitObservables).subscribe(() => {
          this.addEditCopyForm$.next({
            action: 'setAsDefault',
            form: res
          });
          this.fetchUOM$.next({ data: 'load' });
        });
      } else {
        this.addEditCopyForm$.next({
          action: 'setAsDefault',
          form: res
        });
        this.fetchUOM$.next({ data: 'load' });
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
      .subscribe((result: UpdateUnitMeasumentMutation) => {
        if (result) {
          this.addEditCopyForm$.next({
            action: 'status',
            form: result
          });
          this.fetchUOM$.next({ data: 'load' });
        }
      });
  }
}
