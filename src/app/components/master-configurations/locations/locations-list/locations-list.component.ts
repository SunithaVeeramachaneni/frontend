import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { LocationService } from '../services/location.service';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { LoginService } from 'src/app/components/login/services/login.service';
import { slideInOut } from 'src/app/animations';
import { UploadResponseModalComponent } from '../../upload-response-modal/upload-response-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class LocationsListComponent implements OnInit {
  readonly perms = perms;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  allParentsLocations: any[] = [];
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
        color: '#000000'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'locationId',
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
      id: 'model',
      displayName: 'Model',
      type: 'number',
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
      id: 'parent',
      displayName: 'Parent',
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
  allLocations$: Observable<any>;
  locationsCount$: Observable<Count>;
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
  limit = defaultLimit;
  fetchType = 'load';
  nextToken = '';
  userInfo$: Observable<UserInfo>;
  parentInformation: any;

  constructor(
    private locationService: LocationService,
    private readonly toast: ToastService,
    private loginService: LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.locationService.fetchLocations$.next({ data: 'load' });
    this.locationService.fetchLocations$.next({} as TableEvent);
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.searchLocation = new FormControl('');

    this.searchLocation.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.locationService.fetchLocations$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    //this.locationsListCount$ = this.locationService.getFormsListCount$();
    this.getDisplayedLocations();
    this.locationsCount$ = combineLatest([
      this.locationsCount$,
      this.locationsCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addEditCopyDeleteLocations) {
          count.count += update;
          this.addEditCopyDeleteLocations = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  getDisplayedLocations(): void {
    const locationsOnLoadSearch$ = this.locationService.fetchLocations$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
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
      this.allLocations$
    ]).pipe(
      map(([rows, form, scrollData, allLocations]) => {
        const { items: unfilteredParentLocations } = allLocations;
        this.allParentsLocations = unfilteredParentLocations.filter(
          (location) => location._deleted !== true
        );
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
              text: 'Location deleted successfully!',
              type: 'success'
            });
            form.action = 'add';
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }
        for (const item of initial.data) {
          if (item.parentId) {
            const parent = this.allParentsLocations.find(
              (d) => d.id === item.parentId
            );
            if (parent) {
              item.parent = parent.name;
            } else {
              item.parent = '';
            }
          }
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getLocations() {
    return this.locationService
      .getLocationsList$({
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchLocation.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, nextToken }) => {
          this.locationsCount$ = of({ count });
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.locationsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  addOrUpdateLocation(locationData) {
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
    } else if (locationData?.status === 'edit') {
      this.addEditCopyDeleteLocations = true;
      if (this.searchLocation.value) {
        this.locationService.fetchLocations$.next({ data: 'search' });
      } else {
        this.addEditCopyDeleteLocations$.next({
          action: 'edit',
          form: locationData.data
        });
        this.toast.show({
          text: 'Location updated successfully!',
          type: 'success'
        });
      }
    }
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
        this.locationEditData = { ...data };
        this.locationAddOrEditOpenState = 'in';
        break;
      case 'delete':
        this.deleteLocation(data);
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
      this.locationEditData = event.data;
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
 getAllLocations() {
      this.locationService.fetchAllLocations$().subscribe((allLocations) => {
        this.parentInformation = allLocations.items.filter(
          (location) => location._deleted !== true
        );
        this.allParentsLocations = this.parentInformation;
      });
    }
  uploadFile(event) {
    const file = event.target.files[0];
    const deleteReportRef = this.dialog.open(UploadResponseModalComponent, {
      data: {
        file,
        type: 'locations'
      },
      disableClose: true
    });
   
    deleteReportRef.afterClosed().subscribe((res) => {
      this.getAllLocations();
      this.addEditCopyDeleteLocations = true;
      this.nextToken = '';
      this.locationService.fetchLocations$.next({ data: 'load' });
      if (res === 'close') {
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
}
