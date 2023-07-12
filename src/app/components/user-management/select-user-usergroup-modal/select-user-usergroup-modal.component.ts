import {
  Inject,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Count,
  LoadEvent,
  Role,
  SearchEvent,
  TableEvent,
  User,
  UserDetails,
  UserTable
} from 'src/app/interfaces';
import { UsersService } from '../services/users.service';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { defaultLimit, routingUrls } from 'src/app/app.constants';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  of
} from 'rxjs';
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
import { UserGroupService } from '../services/user-group.service';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
import { ToastService } from 'src/app/shared/toast';
@Component({
  selector: 'app-select-user-usergroup-modal',
  templateUrl: './select-user-usergroup-modal.component.html',
  styleUrls: ['./select-user-usergroup-modal.component.scss']
})
export class SelectUserUsergroupModalComponent implements OnInit {
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
    }
  ];
  readonly routingUrls = routingUrls;
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
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };

  dataSource: MatTableDataSource<any>;
  users$: Observable<UserTable>;
  alluserCount$: Observable<number>;
  userCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  userListCount$: Observable<number>;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  fetchUserGroupUsers$: Observable<any>;
  selectedUserCountUpdate$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  initialSelectedUserCount$: Observable<number>;
  selectedUsersCount$: Observable<number>;
  skip = 0;
  plantId;
  next = '';
  limit = defaultLimit;
  roles;
  searchUser: FormControl;
  selectedUsers = [];
  allUsersList = [];
  addNewGroup: Observable<number>;
  type: string;
  fetchType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectUserUsergroupModalComponent>,
    private usersService: UsersService,
    private userGroupService: UserGroupService,
    private roleService: RolesPermissionsService,
    private commonService: CommonService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchUsers$.next({ data: 'load' });
    this.fetchUsers$.next({} as TableEvent);
    console.log(this.data);
    if (this.data?.type === 'update') {
      this.type = 'update';
      this.fetchUserGroupUsers$ = this.userGroupService.getAllUsersUserGroup(
        this.data?.userGroupId
      );
    } else {
      this.type = 'create';
      this.fetchUserGroupUsers$ = of([]);
    }
    this.searchUser = new FormControl('');
    this.searchUser.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchUsers$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.getDisplayedUsers();
    this.configOptions.allColumns = this.columns;
    this.permissionsList$ = this.roleService.getPermissions$();
    this.rolesList$ = this.roleService.getRolesWithPermissions$({
      includePermissions: true
    });
  }

  getDisplayedUsers() {
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        return this.getUsersList();
      })
    );

    const onScrollUsers$ = this.fetchUsers$.pipe(
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
    this.users$ = combineLatest([
      usersOnLoadSearch$,
      onScrollUsers$,
      this.fetchUserGroupUsers$
    ]).pipe(
      map(([users, scrollData, groupUsers]) => {
        console.log(groupUsers);
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          };
          console.log('loa data :', scrollData);
          users.map((user) => {
            if (
              groupUsers?.items.some((grp) => grp?.users?.email === user?.email)
            ) {
              user.isSelected = true;
            }
            return user;
          });
          initial.data = users;
        } else {
          console.log('Scroll data :', scrollData);
          scrollData.map((user) => {
            if (
              groupUsers?.items.some((grp) => grp?.users?.email === user?.email)
            ) {
              user.isSelected = true;
            }
            return user;
          });

          initial.data = initial.data.concat(scrollData);
        }

        // console.log(initial);
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        this.selectedUsers = initial?.data?.filter((user) => user.isSelected);
        this.allUsersList = initial.data;
        return initial;
      })
    );
  }

  getUsersList = () =>
    this.userGroupService
      .listDynamoUsers$({
        limit: this.limit,
        searchKey: this.searchUser.value,
        plantId: this.data.plantId,
        fetchType: this.fetchType,
        next: this.next
      })
      .pipe(
        mergeMap((resp: any) => {
          console.log(resp);
          this.reloadAllUsersCount(resp.count);
          this.next = resp.next;
          return of(resp.items);
        }),
        map((data) => {
          const rows = data?.map((item) => {
            if (item.firstName && item.lastName) {
              item.user = item.firstName + ' ' + item.lastName;
            } else {
              item.user = '';
            }
            return item;
          });
          return rows;
        })
      );

  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };

  rowLevelActionHandler = (event) => {
    const { data, action } = event;
    switch (action) {
      case 'toggleAllRows':
        let allSelected = false;
        let users = [];
        users = this.allUsersList;

        if (
          this.selectedUsers.length === 0 ||
          this.selectedUsers.length !== users.length
        ) {
          allSelected = true;
          this.selectedUsers = users;
        } else {
          allSelected = false;
          this.selectedUsers = [];
        }
        this.selectedUsersCount$ = of(this.selectedUsers.length);

        break;

      case 'toggleRowSelect':
        const index = this.selectedUsers.findIndex(
          (user) => user.id === data.id
        );
        if (index !== -1) {
          this.selectedUsers = this.selectedUsers.filter(
            (user) => user.id !== data.id
          );
          this.selectedUserCountUpdate$.next(-1);
        } else {
          this.selectedUsers.push(data);
          this.selectedUserCountUpdate$.next(1);
        }
        this.selectedUsersCount$ = of(this.selectedUsers.length);
        break;
      default:
      // do nothing
    }
  };
  onCancel(): void {
    this.dialogRef.close({
      isBack: true
    });
  }

  onCreate(): void {
    const selectedUserId = [];
    this.selectedUsers.forEach((user) => {
      selectedUserId.push(user.id);
    });

    const newUserGroup = {
      name: this.data.name,
      description: this.data.description,
      plantId: this.data.plantId,
      users: selectedUserId,
      searchTerm: `${this.data.name.toLowerCase()} ${this.data.description.toLowerCase()}`
    };

    this.userGroupService
      .createUserGroup$(newUserGroup, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((data) => {
        this.userGroupService.addUpdateDeleteCopyUserGroup = true;
        this.userGroupService.userGroupActions$.next({
          action: 'add',
          group: data
        });
      });
    this.dialogRef.close({
      isBack: false
    });
  }
  reloadAllUsersCount(rawCount: number) {
    this.userListCount$ = of(rawCount);
    this.alluserCount$ = combineLatest([
      this.userListCount$,
      this.userCountUpdate$
    ]).pipe(
      map(([initial, update]) => {
        initial += update;
        return initial;
      })
    );
  }
  updateUsers() {
    const selectedUserIds = this.selectedUsers.map((user) => user.id);
    this.userGroupService
      .selectUnselectGroupMembers$(this.data?.userGroupId, selectedUserIds)
      .subscribe();
  }
}
