/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChange,
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
import { CommonService } from 'src/app/shared/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { UserGroupService } from '../services/user-group.service';
import { ToastService } from 'src/app/shared/toast';
import {
  Count,
  LoadEvent,
  Permission,
  RowLevelActionEvent,
  SearchEvent,
  TableEvent,
  UserDetails
} from 'src/app/interfaces';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { format } from 'date-fns';
import { SelectUserUsergroupModalComponent } from '../select-user-usergroup-modal/select-user-usergroup-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserModalComponent } from '../remove-user-modal/remove-user-modal.component';
import { LoginService } from '../../login/services/login.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { DomSanitizer } from '@angular/platform-browser';
import { defaultProfilePic, graphQLDefaultLimit } from 'src/app/app.constants';
interface UsersListActions {
  action: 'delete' | null;
  id: any[];
}

@Component({
  selector: 'app-user-group-users-list',
  templateUrl: './user-group-users-list.component.html',
  styleUrls: ['./user-group-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupUsersListComponent implements OnInit, OnChanges {
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

  userListActions$: BehaviorSubject<UsersListActions> =
    new BehaviorSubject<UsersListActions>({ action: null, id: [] });
  userAddEdit = false;
  disableBtn = true;
  userCount = 0;
  limit = graphQLDefaultLimit;
  next = '';
  selectedUsers = [];
  allUsersList = [];
  selectedCount = 0;
  plantName;

  columns: Column[] = [
    {
      id: 'user',
      displayName: 'User',
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
      id: 'roles',
      displayName: 'Role',
      type: 'string',
      controlType: 'string',
      order: 2,
      hasSubtitle: false,
      showMenuOptions: true,
      subtitleColumn: '',
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: { color: '#3D5AFE' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: true
    },
    {
      id: 'email',
      displayName: 'Email',
      type: 'string',
      controlType: 'string',
      order: 3,
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
      id: 'validThrough',
      displayName: 'Valid Through',
      type: 'string',
      controlType: 'string',
      order: 3,
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
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      order: 3,
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
  fetchUsers$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
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
  // searchUser$: Observable<any>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  ghostLoading = new Array(8).fill(0).map((v, i) => i);
  skip = 0;
  fetchType: string;
  userInfo$: any;
  private _userGroupId: string;
  private _userGroupPlantId: string;
  private _userGroupName: string;

  constructor(
    private userGroupService: UserGroupService,
    private dialog: MatDialog,
    private toast: ToastService,
    private loginService: LoginService,
    private plantService: PlantService,
    private sant: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userGroupId.currentValue) {
      this.disableBtn = false;
      this._userGroupId = changes.userGroupId?.currentValue;
      this._userGroupName = changes.userGroupName?.currentValue;
      if (changes.userGroupPlantId) {
        this._userGroupPlantId = changes.userGroupPlantId?.currentValue;
      }
      this.fetchUsers$.next({ data: 'load' });
      this.fetchUsers$.next({} as TableEvent);
      this.getAllUsers();
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.isLoading$.next(false);
      this.disableBtn = true;
      this._userGroupName = '';
    }
    this.selectedUsers = [];
    this.selectedCount = 0;
    this.userCount = 0;
  }

  ngOnInit(): void {
    this.fetchUsers$.next({ data: 'load' });
    this.fetchUsers$.next({} as TableEvent);
    this.searchUser = new FormControl('');
    this.loginService.loggedInUserInfo$
      .pipe(
        tap(({ permissions = [] }) => {
          this.prepareMenuActions(permissions);
        })
      )
      .subscribe();
    this.getAllUsers();
    this.configOptions.allColumns = this.columns;
    this.isLoading$.next(true);
  }

  getAllUsers() {
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.fetchType = data;
        this.skip = 0;
        this.next = '';
        this.isLoading$.next(true);
        return this.getUsersList();
      })
    );
    const usersOnScroll$ = this.fetchUsers$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = data;
          return this.getUsersList();
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
          initial.data = users;
        } else if (this.userAddEdit) {
          switch (action) {
            case 'delete':
              id.forEach((data) => {
                initial.data = initial?.data?.filter(
                  (user) => user.id !== data
                );
              });
              this.toast.show({
                type: 'success',
                text: 'User removed successfully'
              });
          }
          this.userAddEdit = false;
          this.fetchUsers$.next({ data: 'load' });
          this.fetchUsers$.next({} as TableEvent);
          this.getAllUsers();
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        this.allUsersList = initial.data;
        return initial;
      })
    );
  }

  getUsersList() {
    if (this.userGroupId) {
      return this.userGroupService
        .listUserGroupUsers$(
          {
            limit: this.limit,
            nextToken: this.next,
            fetchType: this.fetchType,
            searchKey: this.searchUser.value
          },
          this.userGroupId
        )
        .pipe(
          mergeMap((resp: any) => {
            this.isLoading$.next(false);
            if (resp?.count !== null && resp?.count !== undefined) {
              this.userCount = resp.count;
            }
            this.userGroupService.usersListEdit = true;
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.userCount
            });
            this.next = resp.next;

            return of(resp.items);
          }),

          map((data) => {
            if (data && data.length) {
              const rows = data?.map((item) => {
                if (item?.users.firstName && item?.users.lastName) {
                  item.user =
                    item?.users.firstName + ' ' + item?.users.lastName;
                } else {
                  item.user = '';
                }
                if (item?.users.email) {
                  item.email = item?.users.email ?? '';
                }
                if (item?.users?.validThrough) {
                  item.validThrough = format(
                    new Date(item?.users?.validThrough),
                    'dd.MM.yy'
                  );
                } else {
                  item.validThrough = '';
                }
                if (item?.users?.roles) {
                  const rolesNames = [];
                  item?.users?.roles?.forEach((role) => {
                    rolesNames.push(role?.name);
                  });
                  item.roles = rolesNames?.toString();
                } else {
                  item.roles = '';
                }
                item.plant = this.plantName;
                item.preTextImage = {
                  style: {
                    width: '30px',
                    height: '30px',
                    'border-radius': '50%',
                    display: 'block',
                    padding: '0px 10px'
                  },
                  image: this.getImageSrc(item?.users?.profileImage),
                  condition: true
                };
                return item;
              });
              return rows;
            } else {
              return [];
            }
          })
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
    this.fetchUsers$.next(event);
  };

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sant.bypassSecurityTrustResourceUrl(base64Image);
    } else {
      return this.sant.bypassSecurityTrustResourceUrl(defaultProfilePic);
    }
  };

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];
    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_ASSET')) {
      menuActions.push({
        title: 'Remove User',
        action: 'delete'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  deleteUserGroupUsers() {}

  selectUnselectUsers() {
    const openSelectUserRef = this.dialog.open(
      SelectUserUsergroupModalComponent,
      {
        data: {
          type: 'update',
          plantId: this._userGroupPlantId,
          userGroupId: this._userGroupId,
          name: this._userGroupName
        }
      }
    );

    openSelectUserRef.afterClosed().subscribe((data) => {
      const { returnType } = data;
      if (returnType === 'done') {
        this.fetchUsers$.next({ data: 'load' });
        this.fetchUsers$.next({} as TableEvent);
        this.skip = 0;
        this.userGroupService.usersListEdit = true;
        this.getAllUsers();
      }
    });
  }
  rowLevelActionHandler(event) {
    const { data, action } = event;
    switch (action) {
      case 'toggleAllRows':
        let selectedAll = false;
        const users = this.allUsersList;
        if (
          this.selectedUsers.length === 0 ||
          this.selectedUsers.length !== users.length
        ) {
          selectedAll = true;
          this.selectedUsers = users;
        } else {
          selectedAll = false;
          this.selectedUsers = [];
        }
        this.selectedCount = this.selectedUsers.length;
        break;
      case 'toggleRowSelect':
        const index = this.selectedUsers.findIndex(
          (user) => user.id === data.id
        );
        if (index !== -1) {
          this.selectedUsers = this.selectedUsers.filter(
            (user) => user.id !== data.id
          );
        } else {
          this.selectedUsers.push(data);
        }
        this.selectedCount = this.selectedUsers.length;
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
        type: 'single'
      }
    });
    removeUserModalRef.afterClosed().subscribe((resp) => {
      const { response } = resp;
      if (response === 'yes') {
        const id = data?.id;
        this.isLoading$.next(true);
        this.userGroupService
          .deleteUserGroupMembers([id], this.userGroupId)
          .subscribe(() => {
            this.userAddEdit = true;
            this.userListActions$.next({ action: 'delete', id: [id] });
            this.userCount -= 1;
            this.userGroupService.usersListEdit = true;
            this.isLoading$.next(false);
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.userCount
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
          text: 'multiple'
        }
      }
    );
    removeMultipleUserModelRef.afterClosed().subscribe((resp) => {
      const { response } = resp;
      if (response === 'yes') {
        const idList = this.selectedUsers.map((user) => user.id);
        this.userGroupService
          .deleteUserGroupMembers(idList, this.userGroupId)
          .subscribe(() => {
            this.selectedUsers = [];
            this.selectedCount = this.selectedUsers.length;
            this.userAddEdit = true;
            this.userListActions$.next({ action: 'delete', id: idList });
            this.userCount -= idList.length;
            this.userGroupService.usersListEdit = true;
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.userCount
            });
          });
      }
    });
  }
  onCancelFooter() {
    this.fetchUsers$.next({ data: 'load' });
    this.fetchUsers$.next({} as TableEvent);
    this.getAllUsers();
    this.selectedUsers = [];
    this.skip = 0;
    this.selectedCount = this.selectedUsers.length;
  }
}
