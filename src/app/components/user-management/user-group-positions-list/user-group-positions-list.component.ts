/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  of
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { UserGroupService } from '../services/user-group.service';
import { ToastService } from 'src/app/shared/toast';
import {
  LoadEvent,
  Permission,
  SearchEvent,
  TableEvent
} from 'src/app/interfaces';
import { FormControl } from '@angular/forms';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserModalComponent } from '../remove-user-modal/remove-user-modal.component';
import { LoginService } from '../../login/services/login.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { DomSanitizer } from '@angular/platform-browser';
import { defaultProfilePic, graphQLDefaultLimit } from 'src/app/app.constants';
import { LocationService } from '../../master-configurations/locations/services/location.service';
import { PositionsService } from '../services/positions.service';
import { SelectUserGroupPositionsModalComponent } from '../select-user-group-positions-modal/select-user-group-positions-modal.component';
interface UsersListActions {
  action: 'delete' | null;
  id: any[];
}

@Component({
  selector: 'app-user-group-positions-list',
  templateUrl: './user-group-positions-list.component.html',
  styleUrls: ['./user-group-positions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupPositionsListComponent implements OnInit, OnChanges {
  @Input() set userGroupId(userGroupId: string) {
    this._userGroupId = userGroupId;
  }
  get userGroupId() {
    return this._userGroupId;
  }

  @Input() set userGroupPlantId(userGroupPlantId: string) {
    this._userGroupPlantId = userGroupPlantId;
  }
  get userGroupPlantId() {
    return this._userGroupPlantId;
  }

  @Input() set userGroupName(userGroupName: string) {
    this._userGroupName = userGroupName;
  }
  get userGroupName() {
    return this._userGroupName;
  }

  @Input() set userGroupUnitId(userGroupUnitId: string) {
    this._userGroupUnitId = userGroupUnitId;
  }
  get userGroupUnitId() {
    return this._userGroupUnitId;
  }

  @Input() set userGroupPositionIds(userGroupPositionIds: string) {
    this._userGroupPositionIds = userGroupPositionIds;
  }
  get userGroupPositionIds() {
    return this._userGroupPositionIds;
  }
  @Input() set userGroup(userGroup: string) {
    this._userGroup = userGroup;
  }
  get userGroup() {
    return this._userGroup;
  }

  userListActions$: BehaviorSubject<UsersListActions> =
    new BehaviorSubject<UsersListActions>({ action: null, id: [] });
  positionAddEdit = false;
  disableBtn = true;
  positionCount = 0;
  limit = graphQLDefaultLimit;
  next = '';
  selectedPositions = [];
  allPositionsList = [];
  selectedCount = 0;
  plantName;

  columns: Column[] = [
    {
      id: 'position',
      displayName: 'Positions',
      type: 'string',
      controlType: 'string',
      order: 1,
      hasSubtitle: true,
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
      titleStyle: { 'font-weight': '500' },
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
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
      hasPostTextImage: false
    },
    {
      id: 'units',
      displayName: 'Unit',
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
      hasPostTextImage: true
    }
  ];
  fetchPositions$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  configOptions: ConfigOptions = {
    tableID: 'usersGroupTable',
    rowsExpandable: false,
    enableRowsSelection: true,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 200px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;
  allUsers$: Observable<any>;
  searchUser: FormControl;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  ghostLoading = new Array(8).fill(0).map((v, i) => i);
  skip = 0;
  fetchType: string;
  userInfo$: any;
  allUnitLocations = [];
  private _userGroupId: string;
  private _userGroupPlantId: string;
  private _userGroupName: string;
  private _userGroupUnitId: string;
  private _userGroupPositionIds: string;
  private _userGroup: any;

  constructor(
    private userGroupService: UserGroupService,
    private dialog: MatDialog,
    private toast: ToastService,
    private loginService: LoginService,
    private plantService: PlantService,
    private locationService: LocationService,
    private positionsService: PositionsService,
    private sant: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userGroupId.currentValue) {
      this.disableBtn = false;
      this._userGroupId = changes.userGroupId?.currentValue;
      this._userGroupName = changes.userGroupName?.currentValue;
      this._userGroup = changes.userGroup?.currentValue;
      this._userGroupPositionIds = this._userGroup?.positionIds;
      if (changes.userGroupPlantId) {
        this._userGroupPlantId = changes.userGroupPlantId?.currentValue;
      }
      this.fetchPositions$.next({ data: 'load' });
      this.fetchPositions$.next({} as TableEvent);
      this.getUnitLocations(this._userGroupPlantId);
      this.getAllPositions();
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.isLoading$.next(false);
      this.disableBtn = true;
      this._userGroupName = '';
    }
    this.selectedPositions = [];
    this.selectedCount = 0;
    this.positionCount = 0;
  }

  ngOnInit(): void {
    this.fetchPositions$.next({ data: 'load' });
    this.fetchPositions$.next({} as TableEvent);
    this.searchUser = new FormControl('');
    this.loginService.loggedInUserInfo$
      .pipe(
        tap(({ permissions = [] }) => {
          this.prepareMenuActions(permissions);
        })
      )
      .subscribe();
    this.getAllPositions();
    this.configOptions.allColumns = this.columns;
    this.isLoading$.next(true);
  }

  getAllPositions() {
    const usersOnLoadSearch$ = this.fetchPositions$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.fetchType = data;
        this.skip = 0;
        this.next = '';
        this.isLoading$.next(true);
        return this.getPositionsList();
      })
    );
    const usersOnScroll$ = this.fetchPositions$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = data;
          return this.getPositionsList();
        } else {
          return of([]);
        }
      })
    );
    const initial = {
      columns: this.columns,
      data: []
    };
    this.allUsers$ = combineLatest([
      usersOnLoadSearch$,
      usersOnScroll$,
      this.userListActions$,
      this.plantService.fetchAllPlants$()
    ]).pipe(
      map(([users, scrollData, { action, id }, plant]) => {
        this.plantName = plant?.items.find(
          (data) => data.id === this.userGroupPlantId
        )?.name;

        if (this.skip === 0) {
          initial.data =
            (this._userGroupPositionIds &&
              this._userGroupPositionIds?.split(',').map((pos) => ({
                id: users.find((us) => us.id === pos)?.id,
                position: users.find((us) => us.id === pos)?.name || '',
                units:
                  this.allUnitLocations.find(
                    (unit) => unit.id === this._userGroupUnitId
                  )?.name || '',
                plant: this.plantName
              }))) ||
            [];
        } else if (this.positionAddEdit) {
          switch (action) {
            case 'delete':
              id.forEach((data) => {
                initial.data = initial?.data?.filter((pos) => pos.id !== data);
              });
              this.toast.show({
                type: 'success',
                text: 'Position removed successfully'
              });
          }

          this.positionAddEdit = false;
          this.fetchPositions$.next({ data: 'load' });
          this.fetchPositions$.next({} as TableEvent);
          this.getAllPositions();
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.isLoading$.next(false);
        this.positionCount = initial.data?.length;
        this.userGroupService.usersListEdit = true;
        this.userGroupService.usersCount$.next({
          groupId: this._userGroupId,
          count: this.positionCount
        });
        this.skip = this.positionCount;
        this.dataSource = new MatTableDataSource(initial.data);
        this.allPositionsList = initial.data;
        return initial;
      })
    );
  }

  getPositionsList() {
    if (this.userGroupId) {
      return this.positionsService
        .getPositionsList$(
          {
            limit: this.limit,
            next: this.next,
            fetchType: this.fetchType,
            searchKey: this.searchUser.value
          },
          { plant: this._userGroupPlantId }
        )
        .pipe(
          mergeMap((resp: any) => of(resp.rows || [])),
          map((data) => (data && data.length ? data : []))
        );
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  }

  handleTableEvent = (event) => {
    this.fetchPositions$.next(event);
  };

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];
    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_ASSET')) {
      menuActions.push({
        title: 'Remove Position',
        action: 'delete'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  deleteUserGroupUsers() {}

  selectUnselectPositions() {
    const openSelectUserRef = this.dialog.open(
      SelectUserGroupPositionsModalComponent,
      {
        data: {
          type: 'update',
          plantId: this._userGroupPlantId,
          userGroupId: this._userGroupId,
          name: this._userGroupName,
          unitId: this._userGroupUnitId,
          selectedUserGroup: this._userGroup
        }
      }
    );

    openSelectUserRef.afterClosed().subscribe((data) => {
      const { returnType } = data;
      if (returnType === 'done') {
        this.fetchPositions$.next({ data: 'load' });
        this.fetchPositions$.next({} as TableEvent);
        this.skip = 0;
        this.userGroupService.usersListEdit = true;
        this.getAllPositions();
      }
    });
  }
  rowLevelActionHandler(event) {
    const { data, action } = event;
    switch (action) {
      case 'toggleAllRows':
        let selectedAll = false;
        const positions = this.allPositionsList;
        if (
          this.selectedPositions.length === 0 ||
          this.selectedPositions.length !== positions.length
        ) {
          selectedAll = true;
          this.selectedPositions = positions;
        } else {
          selectedAll = false;
          this.selectedPositions = [];
        }
        this.selectedCount = this.selectedPositions.length;
        break;
      case 'toggleRowSelect':
        const index = this.selectedPositions.findIndex(
          (pos) => pos.id === data.id
        );
        if (index !== -1) {
          this.selectedPositions = this.selectedPositions.filter(
            (pos) => pos.id !== data.id
          );
        } else {
          this.selectedPositions.push(data);
        }
        this.selectedCount = this.selectedPositions.length;
        break;
      case 'delete':
        this.openRemoveUserModaSingleDelete(data);
        break;

      default:
    }
  }
  openRemoveUserModaSingleDelete(data): void {
    const removeUserModalRef = this.dialog.open(RemoveUserModalComponent, {
      data: {
        type: 'single',
        userGroupType: this._userGroup.type
      }
    });
    removeUserModalRef.afterClosed().subscribe((resp) => {
      const { response } = resp;
      if (response === 'yes') {
        const id = data?.id;
        const payload = this._userGroupPositionIds
          ? this._userGroupPositionIds
              .split(',')
              .filter((pos) => pos !== id)
              .join(',')
          : '';
        this.isLoading$.next(true);
        this.userGroupService
          .updateUserGroup$(
            this._userGroupId,
            { positionIds: payload },
            {
              displayToast: true,
              failureResponse: {}
            }
          )
          .subscribe(() => {
            this.positionAddEdit = true;
            this.userGroupService.addUpdateDeleteCopyUserGroup = true;
            this.userGroupService.userGroupActions$.next({
              action: 'edit',
              group: { ...this._userGroup, positionIds: payload }
            });
            this.userListActions$.next({ action: 'delete', id: [id] });
            this.positionCount -= 1;
            this.userGroupService.usersListEdit = true;
            this.isLoading$.next(false);
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.positionCount
            });
          });
      }
    });
  }
  removeMultipleMembers() {
    const removeMultipleUserModelRef = this.dialog.open(
      RemoveUserModalComponent,
      {
        data: {
          text: 'multiple',
          userGroupType: this._userGroup.type
        }
      }
    );
    removeMultipleUserModelRef.afterClosed().subscribe((resp) => {
      const { response } = resp;
      if (response === 'yes') {
        const idList = this.selectedPositions.map((pos) => pos.id);
        const payload = this._userGroupPositionIds
          .split(',')
          .filter((pos) => !idList.includes(pos))
          .join(',');
        this.isLoading$.next(true);
        this.userGroupService
          .updateUserGroup$(
            this._userGroupId,
            { positionIds: payload },
            {
              displayToast: true,
              failureResponse: {}
            }
          )
          .subscribe(() => {
            this.selectedPositions = [];
            this.selectedCount = this.selectedPositions.length;
            this.positionAddEdit = true;
            this.userGroupService.addUpdateDeleteCopyUserGroup = true;
            this.userGroupService.userGroupActions$.next({
              action: 'edit',
              group: { ...this._userGroup, positionIds: payload }
            });
            this.userListActions$.next({ action: 'delete', id: idList });
            this.positionCount -= 1;
            this.userGroupService.usersListEdit = true;
            this.isLoading$.next(false);
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.positionCount
            });
          });
      }
    });
  }
  onCancelFooter() {
    this.fetchPositions$.next({ data: 'load' });
    this.fetchPositions$.next({} as TableEvent);
    this.getAllPositions();
    this.selectedPositions = [];
    this.skip = 0;
    this.selectedCount = this.selectedPositions.length;
  }

  getUnitLocations(selectedPlantId?: string) {
    const selectedPlant = selectedPlantId;
    if (selectedPlant) {
      const unitFilter = {
        plantId: selectedPlant || ''
      };
      this.locationService
        .fetchUnitLocations$(unitFilter)
        .subscribe((units) => {
          this.allUnitLocations = units.items;
        });
    }
  }
}
