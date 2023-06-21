/* eslint-disable no-underscore-dangle */
import {
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
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  skipWhile
} from 'rxjs/operators';
import { defaultLimit, permissions as perms } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Count,
  FormTableUpdate,
  Permission,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { LoginService } from 'src/app/components/login/services/login.service';
import { PlantService } from '../services/plant.service';
import { slideInOut } from 'src/app/animations';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { PlantTableUpdate } from 'src/app/interfaces/master-data-management/plants';
@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class PlantListComponent implements OnInit, OnDestroy {
  readonly perms = perms;
  userInfo$: Observable<UserInfo>;

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
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: 'plantId',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plantId',
      displayName: 'Plant Id',
      type: 'string',
      controlType: 'string',
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
      id: 'countryDisplay',
      displayName: 'Country',
      type: 'string',
      controlType: 'string',
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
      id: 'timeZoneDisplay',
      displayName: 'Time Zone',
      type: 'string',
      controlType: 'string',
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
    },
    {
      id: 'state',
      displayName: 'State',
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'zipCode',
      displayName: 'Zip Code',
      type: 'number',
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
      groupable: true,
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'shiftNames',
      displayName: 'Shift',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
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
    }
  ];

  configOptions: ConfigOptions = {
    tableID: 'plantsTable',
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

  searchPlant: FormControl;
  dataSource: MatTableDataSource<any>;
  openPlantDetailedView = 'out';
  plantAddOrEditOpenState = 'out';
  plantEditData;
  plantMasterData = {};

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(12).fill(0).map((v, i) => i);

  plants$: Observable<any>;
  plantsCount$: Observable<Count>;
  plantsCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  addEditCopyDeletePlants = false;
  addEditCopyDeletePlants$: BehaviorSubject<PlantTableUpdate> =
    new BehaviorSubject<PlantTableUpdate>({
      action: null,
      form: {} as any
    });
  selectedPlant;

  skip = 0;
  limit = defaultLimit;
  fetchType = 'load';
  nextToken = '';
  parentInformation: any;
  private onDestroy$ = new Subject();

  constructor(
    private loginService: LoginService,
    private readonly toast: ToastService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.fetchPlants$.next({ data: 'load' });
    this.plantService.getPlantMasterData();
    this.plantService.fetchPlants$.next({} as TableEvent);
    this.searchPlant = new FormControl('');

    this.searchPlant.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.plantService.fetchPlants$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedPlants();
    this.plantsCount$ = combineLatest([
      this.plantsCount$,
      this.plantsCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addEditCopyDeletePlants) {
          count.count += update;
          this.addEditCopyDeletePlants = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  formatTimeZoneMapping(data, plantMasterData) {
    if (data.country && plantMasterData[data.country])
      data.countryDisplay = plantMasterData[data.country].countryName;
    if (data.timeZone) data.timeZoneDisplay = data.timeZone.utcOffset;
    return data;
  }

  getDisplayedPlants(): void {
    const plantsOnLoadSearch$ = this.plantService.fetchPlants$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getPlants();
      })
    );

    const onScrollPlants$ = this.plantService.fetchPlants$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getPlants();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.plants$ = combineLatest([
      plantsOnLoadSearch$,
      this.addEditCopyDeletePlants$,
      onScrollPlants$,
      this.plantService.plantMasterData$.pipe(
        skipWhile((val) => !Object.keys(val).length)
      )
    ]).pipe(
      map(([rows, { form, action }, scrollData, plantMasterData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 140px)'
          };
          initial.data = rows.map((row) =>
            this.formatTimeZoneMapping(row, plantMasterData)
          );
          initial.data = rows;
        } else if (this.addEditCopyDeletePlants) {
          switch (action) {
            case 'delete':
              initial.data = initial.data.filter((d) => d.id !== form.id);
              this.toast.show({
                text: 'Plant deleted successfully!',
                type: 'success'
              });
              break;
            case 'add':
              form = this.formatTimeZoneMapping(form, plantMasterData);
              initial.data = [form, ...initial.data];
              break;
            case 'edit':
              form = this.formatTimeZoneMapping(form, plantMasterData);
              initial.data = [
                form,
                ...initial.data.filter((item) => item.id !== form.id)
              ];
              break;
            default:
            // Do nothing
          }
          this.addEditCopyDeletePlants = false;
        } else {
          scrollData = scrollData.map((row) =>
            this.formatTimeZoneMapping(row, plantMasterData)
          );
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getPlants() {
    return this.plantService
      .getPlantsList$({
        next: this.nextToken,
        limit: this.limit,
        searchKey: this.searchPlant.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.plantsCount$ = of({ count });
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.plantsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  addOrUpdatePlant(plantData) {
    if (plantData.data.id && plantData.data.timeZone) {
      const timeZoneMapping = this.plantService.plantTimeZoneMapping$.value;
      timeZoneMapping[plantData.data.id] = plantData.data.timeZone;
      this.plantService.plantTimeZoneMapping$.next(timeZoneMapping);
    }
    if (plantData.status === 'add') {
      this.addEditCopyDeletePlants = true;
      if (this.searchPlant.value) {
        this.plantService.fetchPlants$.next({ data: 'search' });
      } else {
        this.addEditCopyDeletePlants$.next({
          action: 'add',
          form: plantData.data
        });
      }
      this.toast.show({
        text: 'Plant created successfully!',
        type: 'success'
      });
    } else if (plantData.status === 'edit') {
      this.addEditCopyDeletePlants = true;
      if (this.searchPlant.value) {
        this.plantService.fetchPlants$.next({ data: 'search' });
      } else {
        this.addEditCopyDeletePlants$.next({
          action: 'edit',
          form: plantData.data
        });
        this.toast.show({
          text: 'Plant updated successfully!',
          type: 'success'
        });
      }
    }
    this.plantService.fetchPlants$.next({ data: 'load' });
  }

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_PLANT')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    // if (
    //   this.loginService.checkUserHasPermission(permissions, 'DELETE_PLANT')
    // ) {
    //   menuActions.push({
    //     title: 'Delete',
    //     action: 'delete'
    //   });
    // } Implementation is done but required validations based on parent

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  handleTableEvent = (event): void => {
    this.plantService.fetchPlants$.next(event);
  };

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.plantEditData = { ...data };
        this.plantAddOrEditOpenState = 'in';
        break;
      case 'delete':
        this.deletePlant(data);
        break;
      default:
    }
  };

  configOptionsChangeHandler = (event): void => {};

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'plantId':
      case 'country':
      case 'zipCode':
      case 'state':
        this.showPlantDetail(row);
        break;
      default:
    }
  };

  deletePlant(plant: any): void {
    const deleteData = {
      id: plant.id,
      // eslint-disable-next-line no-underscore-dangle
      _version: plant._version
    };
    this.plantService.deletePlant$(deleteData).subscribe((data: any) => {
      this.addEditCopyDeletePlants$.next({
        action: 'delete',
        form: data
      });
    });
  }

  addManually() {
    this.plantAddOrEditOpenState = 'in';
    this.plantEditData = null;
  }

  showPlantDetail(row: GetFormList): void {
    this.selectedPlant = row;
    this.openPlantDetailedView = 'in';
  }

  onClosePlantAddOrEditOpenState(event) {
    this.plantAddOrEditOpenState = event;
  }

  onClosePlantDetailedView(event) {
    this.openPlantDetailedView = event.status;
    if (event.data !== '') {
      this.plantEditData = event.data;
      this.plantAddOrEditOpenState = 'in';
    }
  }
  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
