/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { uniqBy } from 'lodash-es';

import {
  graphQLDefaultLimit,
  permissions as perms,
  routingUrls
} from 'src/app/app.constants';
import {
  CellClickActionEvent,
  FormTableUpdate,
  Permission,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { LocationService } from '../services/location.service';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { LoginService } from 'src/app/components/login/services/login.service';
import { slideInOut } from 'src/app/animations';
import { UploadResponseModalComponent } from '../../../../shared/components/upload-response-modal/upload-response-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { PlantService } from '../../plants/services/plant.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class LocationsListComponent implements OnInit, OnDestroy {
  readonly perms = perms;
  allParentsLocations: any = { data: [] };
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
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'locationId',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      order: 2,
      showMenuOptions: false,
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasSubtitle: true,
      subtitleColumn: 'plantId',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      }
    },
    {
      id: 'description',
      displayName: 'Description',
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
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'model',
      displayName: 'Model',
      type: 'number',
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
      id: 'parent',
      displayName: 'Parent',
      type: 'string',
      controlType: 'string',
      order: 5,
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
      titleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      subtitleColumn: 'parentID',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      }
    }
  ];

  configOptions: ConfigOptions = {
    tableID: 'locationsTable',
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

  dataSource: MatTableDataSource<any>;
  searchLocation: FormControl;
  openLocationDetailedView = 'out';
  locationAddOrEditOpenState = 'out';
  locationEditData;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(12).fill(0).map((v, i) => i);

  locations$: Observable<any>;
  allPlants$: Observable<any>;
  locationsCount$: Observable<number>;
  locationsCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  locationsListCount$: Observable<number>;

  addEditCopyDeleteLocations = false;
  addEditCopyDeleteLocations$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  selectedLocation;

  skip = 0;
  limit = graphQLDefaultLimit;
  fetchType = 'load';
  nextToken = '';
  userInfo$: Observable<UserInfo>;
  parentInformation: any;

  isPopoverOpen = false;
  filterJson = [];
  filter = {
    plant: ''
  };
  allPlants: any[] = [];
  dataFetchingComplete = false;

  plants = [];
  plantsIdNameMap = {};
  currentRouteUrl$: Observable<string>;
  currentUserPlantId: string;
  readonly routingUrls = routingUrls;
  private onDestroy$ = new Subject();

  constructor(
    private locationService: LocationService,
    private plantsService: PlantService,
    private readonly toast: ToastService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.locations.title))
    );
    this.locationService.fetchLocations$.next({ data: 'load' });
    this.locationService.fetchLocations$.next({} as TableEvent);
    this.allPlants$ = this.plantsService.fetchLoggedInUserPlants$().pipe(
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
    );
    this.searchLocation = new FormControl('');

    this.searchLocation.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value: string) => {
          this.locationService.fetchLocations$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedLocations();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [], plantId }) => {
        this.currentUserPlantId = plantId;
        this.prepareMenuActions(permissions);
      })
    );
  }

  getDisplayedLocations(): void {
    const locationsOnLoadSearch$ = this.locationService.fetchLocations$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getLocations();
      })
    );

    const onScrollLocations$ = this.locationService.fetchLocations$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getLocations();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.locations$ = combineLatest([
      locationsOnLoadSearch$,
      this.addEditCopyDeleteLocations$,
      onScrollLocations$,
      this.locationService.fetchAllLocations$(),
      this.allPlants$
    ]).pipe(
      map(
        ([
          rows,
          { form, action },
          scrollData,
          { items: allLocations = [] },
          allPlants = []
        ]) => {
          this.allPlants = allPlants.filter((plant) => !plant._deleted);
          this.allParentsLocations.data = uniqBy(
            [...(this.allParentsLocations?.data || []), ...allLocations],
            'id'
          ).filter((location) => !location._deleted);
          this.dataFetchingComplete = true;
          if (this.skip === 0) {
            this.configOptions = {
              ...this.configOptions,
              tableHeight: 'calc(100vh - 140px)'
            };
            initial.data = this.injectPlantAndParentInfo(rows, allPlants);
          } else if (this.addEditCopyDeleteLocations) {
            const newForm = this.injectPlantAndParentInfo([form], allPlants);
            switch (action) {
              case 'delete':
                initial.data = initial.data.filter((d) => d.id !== form.id);
                this.toast.show({
                  text: 'Location deleted successfully!',
                  type: 'success'
                });
                break;
              case 'add':
                initial.data = [...newForm, ...initial.data];
                this.allParentsLocations = {
                  data: [...newForm, ...this.allParentsLocations.data]
                };
                break;
              case 'edit':
                let formIdx = initial.data.findIndex(
                  (item) => item.id === form.id
                );
                initial.data[formIdx] = newForm[0];
                formIdx = this.allParentsLocations.data.findIndex(
                  (item) => item.id === form.id
                );
                this.allParentsLocations.data[formIdx] = newForm[0];
                break;
              default:
              //Do nothing
            }
            this.addEditCopyDeleteLocations = false;
          } else {
            initial.data = initial.data.concat(
              this.injectPlantAndParentInfo(scrollData, allPlants)
            );
          }
          this.skip = initial.data.length;
          this.dataSource = new MatTableDataSource(initial.data);
          this.cdrf.markForCheck();
          return initial;
        }
      )
    );
  }

  applyFilters(data: any): void {
    this.isLoading$.next(true);
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        const plantsID = this.plantsIdNameMap[item.value];
        this.filter[item.column] = plantsID;
      }
    }
    this.nextToken = '';
    this.locationService.fetchLocations$.next({ data: 'load' });
  }

  clearFilters(): void {
    this.isLoading$.next(true);
    this.isPopoverOpen = false;
    this.filter = {
      plant: ''
    };
    this.locationService.fetchLocations$.next({ data: 'load' });
  }

  getLocations() {
    return (
      this.locationService.getLocationsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchTerm: this.searchLocation.value,
          fetchType: this.fetchType
        },
        this.filter
      ) as Observable<any>
    ).pipe(
      map(({ count, rows, next }) => {
        this.nextToken = next;
        if (count !== undefined && count !== null) {
          this.reloadLocationCount(count);
        }
        this.isLoading$.next(false);
        return rows;
      }),
      catchError(() => {
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  addOrUpdateLocation(locationData) {
    this.isLoading$.next(true);
    if (locationData?.status === 'add') {
      this.addEditCopyDeleteLocations = true;
      if (this.searchLocation.value) {
        this.locationService.fetchLocations$.next({ data: 'search' });
      } else {
        this.addEditCopyDeleteLocations$.next({
          action: 'add',
          form: locationData.data
        });
      }
      this.toast.show({
        text: 'Location created successfully!',
        type: 'success'
      });
      this.locationsCountUpdate$.next(1);
    } else if (locationData?.status === 'edit') {
      this.addEditCopyDeleteLocations = true;
      if (this.searchLocation.value) {
        this.locationService.fetchLocations$.next({ data: 'search' });
      } else {
        this.addEditCopyDeleteLocations$.next({
          action: 'edit',
          form: locationData.data
        });
        this.allParentsLocations.data = this.allParentsLocations.data.map(
          (loc) => (loc.id === locationData.data.id ? locationData.data : loc)
        );
        this.toast.show({
          text: 'Location updated successfully!',
          type: 'success'
        });
      }
    }
    this.nextToken = '';
    this.locationService.fetchLocations$.next({ data: 'load' });
  }

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(permissions, 'UPDATE_LOCATION')
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    if (
      this.loginService.checkUserHasPermission(permissions, 'COPY_LOCATION')
    ) {
      menuActions.push({
        title: 'Copy',
        action: 'copy'
      });
    }

    // if (
    //   this.loginService.checkUserHasPermission(permissions, 'DELETE_LOCATION')
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
    this.locationService.fetchLocations$.next(event);
  };

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.locationEditData = { locationData: data, isCopy: false };
        this.locationAddOrEditOpenState = 'in';
        break;
      case 'delete':
        this.deleteLocation(data);
        break;
      case 'copy':
        this.locationEditData = { locationData: data, isCopy: true };
        this.locationAddOrEditOpenState = 'in';
        break;
      default:
    }
  };

  configOptionsChangeHandler = (event): void => {};

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'plant':
      case 'description':
      case 'model':
      case 'parent':
        this.showLocationDetail(row);
        break;
      default:
    }
  };

  deleteLocation(location: any): void {
    const deleteData = {
      id: location.id,
      _version: location._version
    };
    this.locationService.deleteLocation$(deleteData).subscribe((data: any) => {
      this.addEditCopyDeleteLocations$.next({
        action: 'delete',
        form: data
      });
      this.addEditCopyDeleteLocations = true;
      this.locationsCountUpdate$.next(-1);
    });
  }

  addManually() {
    this.locationAddOrEditOpenState = 'in';
    this.locationEditData = null;
  }

  showLocationDetail(row: GetFormList): void {
    this.selectedLocation = row;
    this.openLocationDetailedView = 'in';
  }

  onCloseLocationAddOrEditOpenState(event) {
    this.locationAddOrEditOpenState = event;
  }

  onCloseLocationDetailedView(event) {
    this.openLocationDetailedView = event.status;
    if (event.data !== '') {
      this.locationEditData = { locationData: event.data };
      this.locationAddOrEditOpenState = 'in';
    }
  }

  exportAsXLSX(): void {
    this.locationService
      .downloadSampleLocationTemplate()
      .pipe(
        tap((data) => {
          downloadFile(data, 'Location_Sample_Template');
        })
      )
      .subscribe();
  }

  downloadExportedLocations(): void {
    this.toast.show({
      type: 'info',
      text: 'Preparing Data for Export, might take upto 1 min...'
    });
    this.locationService
      .downloadExportedLocations(this.currentUserPlantId)
      .pipe(
        tap((data) => {
          downloadFile(data, 'Exported_Locations');
        })
      )
      .subscribe(
        () => {
          this.toast.show({
            type: 'success',
            text: 'Data Exported Successfully!'
          });
        },
        () => {
          this.toast.show({
            type: 'warning',
            text: 'Error while exporting data!'
          });
        }
      );
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().subscribe((allLocations) => {
      const objectKeys = Object.keys(allLocations);
      if (objectKeys.length > 0) {
        this.parentInformation = allLocations.items.filter(
          (location) => !location._deleted
        );
        this.allParentsLocations.data = this.parentInformation;
      } else {
        this.allParentsLocations.data = [];
      }
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const dialogRef = this.dialog.open(UploadResponseModalComponent, {
      data: {
        file,
        type: 'locations'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res.data) {
        this.getAllLocations();
        this.nextToken = '';
        this.addEditCopyDeleteLocations = true;
        this.isLoading$.next(true);
        this.locationsCountUpdate$.next(res.successCount);
        this.locationService.fetchLocations$.next({ data: 'load' });
        this.toast.show({
          text: 'Locations uploaded successfully!',
          type: 'success'
        });
      }
    });
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  injectPlantAndParentInfo = (scrollData, allPlants) => {
    const tableData = scrollData.map((data) => {
      const plantInfo = allPlants.find((plant) => plant.id === data.plantsID);
      if (plantInfo) {
        Object.assign(data, {
          plant: plantInfo.name,
          plantId: plantInfo.plantId
        });
      }
      if (data.parentId) {
        const parent = this.allParentsLocations.data.find(
          (d) => d.id === data.parentId
        );

        if (parent) {
          Object.assign(data, {
            parent: parent.name,
            parentID: parent.locationId
          });
        } else Object.assign(data, { parent: '', parentId: '' });
      }

      return data;
    });

    return tableData;
  };

  reloadLocationCount(rawCount: number) {
    this.locationsListCount$ = of(rawCount);
    this.locationsCount$ = combineLatest([
      this.locationsListCount$,
      this.locationsCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addEditCopyDeleteLocations) {
          count += update;
          this.addEditCopyDeleteLocations = false;
        }
        return count;
      })
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
