import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
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

import {
  CellClickActionEvent,
  TableEvent,
  FormTableUpdate,
  Permission,
  UserInfo
} from 'src/app/interfaces';
import {
  permissions as perms,
  graphQLDefaultLimit,
  graphQLDefaultFilterLimit,
  routingUrls
} from 'src/app/app.constants';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { generateCopyNumber, generateCopyRegex } from '../utils/utils';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UsersService } from '../../user-management/services/users.service';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
import { PositionsService } from '../services/positions.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CreatePositionsComponent } from '../create-positions/create-positions.component';
import { UM_POSITION_FILTERS } from '../../race-dynamic-form/race-dynamic-forms.constants';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit, OnDestroy {
  public menuState = 'out';
  public columnConfigMenuState = 'out';
  submissionSlider = 'out';
  isPopoverOpen = false;
  filterJson: any[] = [];
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Name',
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
      groupable: true,
      titleStyle: { 'font-weight': '500', 'font-size': '90%' },
      hasSubtitle: true,
      subtitleColumn: 'description',
      showMenuOptions: false,
      subtitleStyle: {
        color: 'darkgray'
      },
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      order: 2,
      searchable: true,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: { 'font-weight': '500', 'font-size': '90%' },
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'formsTable',
    rowsExpandable: false,
    enablePagination: false,
    enableRowsSelection: false,
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
        'background-color': '#FFCC00',
        color: '#000000'
      },
      published: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      }
    }
  };
  filter: any = {
    plant: ''
  };
  currentUserPlantId: string;
  dataSource: MatTableDataSource<any>;
  positions$: Observable<any>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as GetFormList
    });
  skip = 0;
  limit = graphQLDefaultLimit;

  searchPosition: FormControl;
  addCopyFormCount = false;
  positionListCount$: Observable<number>;
  positionListCountRaw$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  positionListCountUpdate$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  ghostLoading = new Array(15).fill(0).map((v, i) => i);
  nextToken = '';
  selectedForm: GetFormList = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  formsList$: Observable<any>;
  allPositions = [];
  lastPublishedBy = [];
  lastPublishedOn = [];
  lastModifiedBy = [];
  authoredBy = [];
  plantsIdNameMap = {};
  plants = [];
  createdBy = [];
  additionalDetailFilterData = {};
  triggerCountUpdate = false;
  readonly perms = perms;
  private onDestroy$ = new Subject();
  userInfo$: Observable<UserInfo>;
  dataFetchingComplete = false;

  constructor(
    private readonly positionService: PositionsService,
    private columnConfigService: ColumnConfigurationService,
    private headerService: HeaderService,
    private router: Router,
    private dialog: MatDialog,
    private usersService: UsersService,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef,
    private loginService: LoginService,
    private plantsService: PlantService
  ) {}
  ngOnInit(): void {
    this.headerService.setHeaderTitle(routingUrls.positions.title);
    this.positionService.fetchPositions$.next({ data: 'load' });
    this.positionService.fetchPositions$.next({} as TableEvent);
    this.searchPosition = new FormControl('');
    this.searchPosition.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value: string) => {
          this.positionService.fetchPositions$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));

    this.getDisplayedForms();
    this.positionListCount$ = combineLatest([
      this.positionListCountRaw$,
      this.positionListCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.triggerCountUpdate) {
          count += update;
          this.triggerCountUpdate = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.columnConfigService.moduleFilterConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.filterJson = UM_POSITION_FILTERS;
      });
    this.loginService.loggedInUserInfo$
      .pipe()
      .subscribe(({ permissions = [] }) =>
        this.prepareMenuActions(permissions)
      );

      this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [], plantId }) => {
        this.currentUserPlantId = plantId;
        this.plantsService.setUserPlantIds(plantId);
        this.filter.plant = plantId;
        this.prepareMenuActions(permissions);
      })
    );
    this.populateFilter();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'author':
      case 'plant':
      case 'formStatus':
      case 'lastPublishedBy':
      case 'publishedDate':
      case 'responses':
        this.showFormDetail(row);
        break;
      default:
    }
  };

  getDisplayedForms(): void {
    
    const formsOnLoadSearch$ = this.positionService.fetchPositions$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getPositions();
      })
    );
    const onScrollPositions$ = this.positionService.fetchPositions$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          if(this.nextToken){
            return this.getPositions();
          }
        } else {
          return of([] as GetFormList[]);
        }
      })
    );
    const plants$ = this.plantService.fetchAllPlants$();

    const initial = {
      columns: this.columns,
      data: []
    };
    let cominedResult = [];
    this.positions$ = combineLatest([formsOnLoadSearch$, onScrollPositions$, plants$]).pipe(
      map(([rows, scrollData, plants]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          this.dataFetchingComplete = true;
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }
        cominedResult = initial.data.map((pos) => {
          const correspondingPlant = (plants?.items || []).find((plnt) => plnt?.id === pos?.plantId);
          return { ...pos, plant: correspondingPlant?.name || '' };
        });
        this.allPositions = cominedResult;
        this.dataSource = new MatTableDataSource(this.allPositions);
        this.skip = this.allPositions.length;
        return initial;
      })
    );
  }

  getPositions() {
    const columnConfigFilter = cloneDeep(this.filter);

    const hasColumnConfigFilter = Object.keys(columnConfigFilter)?.length || 0;

      return (
        this.positionService.getPositionsList$(
          {
            next: this.nextToken,
            limit: hasColumnConfigFilter ? graphQLDefaultFilterLimit : this.limit,
            searchKey: this.searchPosition.value,
            
            fetchType: this.fetchType
          },
          this.filter
        ) as Observable<any>
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          if (count !== undefined) {
            this.positionListCountRaw$.next(count);
          }
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.positionListCount$ = of(0);
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) =>
          data.map((item) => {
            if (item.plantId) {
              item = {
                ...item,
                plant: item.plant
              };
            } else {
              item = { ...item, plant: '' };
            }
            return item;
          })
        )
      );
  }

  handleTableEvent = (event): void => {
    this.positionService.fetchPositions$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];
    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_POSITIONS')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  rowLevelActionHandler(event) {
    const { action, data } = event;
    if (action === 'edit') {
      const dialogRef = this.dialog.open(CreatePositionsComponent, { data : { action, ...data} });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          this.cdrf.detectChanges();
          this.positionService.fetchPositions$.next({ data: 'load' });
        }
      });
    }
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
  }
  onCloseColumnConfig() {
    this.columnConfigMenuState = 'out';
  }

  populateFilter() {
    combineLatest([
      this.usersService.getUsersInfo$(),
      this.plantsService.fetchLoggedInUserPlants$().pipe(
        tap((plants) => {
          this.plants = plants.map((plant) => {
            const { id, name, plantId } = plant;
            this.plantsIdNameMap[`${plantId} - ${name}`] = id;
            return `${plantId} - ${name}`;
          });
          this.filterJson = [
            {
              column: 'plant',
              items: this.plants,
              label: 'Plant',
              type: 'select',
              value: ''
            }
          ];
        })
      )
    ]).subscribe(([usersList, { items: plantsList }]) => {
      this.createdBy = usersList
        .map((user) => `${user.firstName} ${user.lastName}`)
        .sort();
      this.lastModifiedBy = usersList.map(
        (user) => `${user.firstName} ${user.lastName}`
      );
      this.setFilters();
    });
  }

  applyFilter(data: any) {
    for (const item of data) {
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value];
      } else {
        this.filter[item.column] = item.value;
      }
    }
    this.nextToken = '';
    this.isLoading$.next(true);
    this.positionService.fetchPositions$.next({ data: 'load' });
  }
  createPosition() {
    const data = { action: 'create'};
    const dialogRef = this.dialog.open(CreatePositionsComponent, { data });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.cdrf.detectChanges();
        this.positionService.fetchPositions$.next({ data: 'load' });
      }
    });
  }
  setFilters() {
    for (const item of this.filterJson) {
      switch (item.column) {
        case 'plant':
          item.items = this.plants;
          break;
        default:
          if (!item?.items?.length) {
            item.items = this.additionalDetailFilterData[item.column]
              ? this.additionalDetailFilterData[item.column]
              : [];
          }
          break;
      }
    }
  }
  resetFilter() {
    this.filter = {
      plant: ''
    };
    this.nextToken = '';
    this.isLoading$.next(true);
    this.positionService.fetchPositions$.next({ data: 'load' });
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  private showFormDetail(row: GetFormList): void {
    this.selectedForm = row;
    this.menuState = 'in';
  }

  showColumnConfig(): void {
    this.columnConfigMenuState = 'in';
  }
  private generateCopyFormName(form: GetFormList, rows: GetFormList[]) {
    if (rows?.length > 0) {
      const listCopyNumbers: number[] = [];
      const regex: RegExp = generateCopyRegex(form?.name);
      rows?.forEach((row) => {
        const matchObject = row?.name?.match(regex);
        if (matchObject) {
          listCopyNumbers.push(parseInt(matchObject[1], 10));
        }
      });
      const newIndex: number = generateCopyNumber(listCopyNumbers);
      const newName = `${form?.name} Copy(${newIndex})`;
      return {
        newName
      };
    }
    return null;
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
