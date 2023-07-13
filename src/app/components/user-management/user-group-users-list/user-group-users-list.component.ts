/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChange,
  SimpleChanges
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
import { defaultLimit } from 'src/app/app.constants';
import { format } from 'date-fns';
import { SelectUserUsergroupModalComponent } from '../select-user-usergroup-modal/select-user-usergroup-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserModalComponent } from '../remove-user-modal/remove-user-modal.component';
import { LoginService } from '../../login/services/login.service';
interface UsersListActions {
  action: 'delete' | null;
  id: any[];
}

@Component({
  selector: 'app-user-group-users-list',
  templateUrl: './user-group-users-list.component.html',
  styleUrls: ['./user-group-users-list.component.scss']
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
  userCount: number;
  limit = 500;
  next = '';
  selectedUsers = [];
  allUsersList = [];
  selectedCount = 0;

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
      id: 'displayRoles',
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
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
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
    private loginService: LoginService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userGroupId.currentValue) {
      this.disableBtn = false;
      this._userGroupId = changes.userGroupId?.currentValue;
      this._userGroupName = changes.userGroupName?.currentValue;
      if (changes.userGroupPlantId) {
        this._userGroupPlantId = changes.userGroupPlantId?.currentValue;
      }
      this.skip = 0;
      this.getAllUsers();
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.disableBtn = true;
      this._userGroupName = '';
    }
  }

  ngOnInit(): void {
    this.fetchUsers$.next({ data: 'load' });
    this.fetchUsers$.next({} as TableEvent);
    this.searchUser = new FormControl('');
    this.searchUser.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchUsers$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getAllUsers();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  getAllUsers() {
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.fetchType = data;
        return this.getUsersList();
      })
    );
    const usersOnScroll$ = this.fetchUsers$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getUsersList();
        } else {
          return of([] as UserDetails[]);
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
      this.userListActions$
    ]).pipe(
      map(([users, scrollData, { action, id }]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 200px)'
          }; // To fix dynamic table height issue post search with no records & then remove search with records
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
                text: 'Member deleted successfully'
              });
          }
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        console.log('Initial check :', initial);
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        this.allUsersList = initial.data;
        return initial;
      })
    );
  }

  getUsersList = () =>
    this.userGroupService
      .listUserGroupUsers(
        {
          limit: this.limit,
          nextToken: this.next,
          fetchType: this.fetchType,
          searchKey: this.searchUser.value
        },
        this.userGroupId
      )
      .pipe(
        tap((data) => console.log(data)),
        mergeMap((resp: any) => {
          this.userCount = resp.count;
          this.userGroupService.usersCount$.next({
            groupId: this._userGroupId,
            count: this.userCount
          });
          this.next = resp.next;
          return of(resp.items);
        }),

        map((data) => {
          const rows = data.map((item) => {
            if (item?.users.firstName && item?.users.lastName) {
              item.user = item?.users.firstName + ' ' + item?.users.lastName;
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
            return item;
          });
          return rows;
        })
      );

  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];
    if (
      this.loginService.checkUserHasPermission(permissions, 'DELETE_USER_GROUP')
    ) {
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
    console.log('event :', event);
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
        this.userGroupService
          .deleteUserGroupMembers([id], this.userGroupId)
          .subscribe(() => {
            this.userAddEdit = true;
            this.userListActions$.next({ action: 'delete', id: [id] });
            this.userCount -= 1;
            this.userGroupService.usersListEdit = true;
            this.userGroupService.usersCount$.next({
              groupId: this._userGroupId,
              count: this.userCount
            });
          });
      }
    });
  }
  removeMultipleMembers() {
    console.log('In remove multiple user');
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
}
