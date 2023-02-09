import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { GetFormListQuery } from 'src/app/API.service';
import { defaultLimit } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Count,
  FormTableUpdate,
  TableEvent
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { AssetsService } from '../services/assets.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
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
export class AssetsListComponent implements OnInit {
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Name',
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
      subtitleColumn: 'assetsId',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'description',
      displayName: 'Description',
      type: 'string',
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'model',
      displayName: 'Model',
      type: 'number',
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
      id: 'parentId',
      displayName: 'Parent',
      type: 'timeAgo',
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
      hasPostTextImage: false
    }
  ];

  configOptions: ConfigOptions = {
    tableID: 'assetsTable',
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
    conditionalStyles: {}
  };

  dataSource: MatTableDataSource<any>;
  searchAssets: FormControl;
  openAssetsDetailedView = 'out';
  assetsAddOrEditOpenState = 'out';
  assetsEditData;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(12).fill(0).map((v, i) => i);

  assets$: Observable<any>;
  assetsCount$: Observable<Count>;
  assetsCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  assetsListCount$: Observable<number>;

  addEditCopyDeleteAssets = false;
  addEditCopyDeleteAssets$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  selectedAsset;

  skip = 0;
  limit = defaultLimit;
  fetchType = 'load';
  nextToken = '';

  constructor(
    private assetService: AssetsService,
    private readonly toast: ToastService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.assetService.fetchAssets$.next({ data: 'load' });
    this.assetService.fetchAssets$.next({} as TableEvent);
    this.searchAssets = new FormControl('');

    this.searchAssets.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.assetService.fetchAssets$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    //this.assetsListCount$ = this.assetService.getFormsListCount$();
    this.getDisplayedAssets();

    this.assetsCount$ = combineLatest([
      this.assetsCount$,
      this.assetsCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addEditCopyDeleteAssets) {
          count.count += update;
          this.addEditCopyDeleteAssets = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
  }

  getDisplayedAssets(): void {
    const assetsOnLoadSearch$ = this.assetService.fetchAssets$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        return this.getAssets();
      })
    );

    const onScrollAssets$ = this.assetService.fetchAssets$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getAssets();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.assets$ = combineLatest([
      assetsOnLoadSearch$,
      this.addEditCopyDeleteAssets$,
      onScrollAssets$
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
              text: 'Assets deleted successfully!',
              type: 'success'
            });
            form.action = 'add';
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

  getAssets() {
    return this.assetService
      .getAssetsList$({
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchAssets.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, nextToken }) => {
          this.assetsCount$ = of({ count });
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.assetsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  addOrUpdateAssets(assetData) {
    if (assetData.status === 'add') {
      this.addEditCopyDeleteAssets = true;
      if (this.searchAssets.value) {
        this.assetService.fetchAssets$.next({ data: 'search' });
      } else {
        this.addEditCopyDeleteAssets$.next({
          action: 'add',
          form: assetData.data
        });
      }
      this.toast.show({
        text: 'Asset created successfully!',
        type: 'success'
      });
    } else if (assetData.status === 'edit') {
      this.addEditCopyDeleteAssets = true;
      if (this.searchAssets.value) {
        this.assetService.fetchAssets$.next({ data: 'search' });
      } else {
        this.addEditCopyDeleteAssets$.next({
          action: 'edit',
          form: assetData.data
        });
      }
      this.toast.show({
        text: 'Asset updated successfully!',
        type: 'success'
      });
    }
    this.assetService.fetchAssets$.next({ data: 'load' });
  }

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Edit',
        action: 'edit'
      },
      {
        title: 'Delete',
        action: 'delete'
      }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  handleTableEvent = (event): void => {
    this.assetService.fetchAssets$.next(event);
  };

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.assetsEditData = data;
        this.assetsAddOrEditOpenState = 'in';
        break;
      case 'delete':
        this.deleteAsset(data);
        break;
      default:
    }
  };

  configOptionsChangeHandler = (event): void => {};

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'model':
      case 'parentId':
        this.showAssetDetail(row);
        break;
      default:
    }
  };

  deleteAsset(asset: any): void {
    const deleteData = {
      id: asset.id,
      _version: asset._version
    };
    this.assetService.deleteAssets$(deleteData).subscribe((data: any) => {
      this.addEditCopyDeleteAssets$.next({
        action: 'delete',
        form: data
      });
    });
  }

  addManually() {
    this.assetsAddOrEditOpenState = 'in';
    this.assetsEditData = undefined;
  }

  showAssetDetail(row: GetFormListQuery): void {
    this.selectedAsset = row;
    this.openAssetsDetailedView = 'in';
  }

  onCloseAssetsAddOrEditOpenState(event) {
    this.assetsAddOrEditOpenState = event;
  }

  onCloseLocationDetailedView(event) {
    this.openAssetsDetailedView = event.status;
    if (event.data !== '') {
      this.assetsEditData = event.data;
      this.assetsAddOrEditOpenState = 'in';
    }
  }

  exportAsXLSX(): void {
    this.assetService
      .downloadSampleAssetTemplate()
      .pipe(
        tap((data) => {
          console.log(data);
          downloadFile(data, 'Asset_Sample_Template');
        })
      )
      .subscribe();
  }

  onCloseAssetsDetailedView(event) {
    this.openAssetsDetailedView = event.status;
    if (event.data !== '') {
      this.assetsEditData = event.data;
      this.assetsAddOrEditOpenState = 'in';
    }
  }
}
