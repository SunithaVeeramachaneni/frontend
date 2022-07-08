import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import {
  CellClickActionEvent,
  Count,
  Permission,
  Role,
  TableEvent,
  UserDetails,
  UserTable
} from 'src/app/interfaces';
import { UsersService } from '../services/users.service';
import {
  defaultLimit,
  permissions as perms,
  superAdminText
} from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from 'src/app/shared/toast';
import { routingUrls } from 'src/app/app.constants';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';
import { AddEditUserModalComponent } from '../add-edit-user-modal/add-edit-user-modal.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CommonService } from 'src/app/shared/services/common.service';

interface UserTableUpdate {
  action: 'add' | 'deactivate' | 'edit' | 'copy' | null;
  user: UserDetails;
}

interface ModalInput {
  roles: any;
  user: UserDetails;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'user',
      displayName: 'User',
      type: 'string',
      order: 1,
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: { 'font-weight': '500' },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'title',
      subtitleStyle: {
        'font-size': '8pt',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'displayRoles',
      displayName: 'Role',
      type: 'string',
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
      id: 'createdAt',
      displayName: 'Created At',
      type: 'date',
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
  readonly routingUrls = routingUrls;
  currentRouteUrl$: Observable<string>;
  fetchUsers$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );
  configOptions: ConfigOptions = {
    tableID: 'usersTable',
    rowsExpandable: false,
    enableRowsSelection: true,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    enableRowLevelActions: {
      condition: {
        operation: 'notContains',
        operand: superAdminText,
        fieldName: 'displayRoles'
      }
    },
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  selectedUsers = [];
  allUsersList = [];
  dataSource: MatTableDataSource<any>;
  disableDeactivate = false;
  users$: Observable<UserTable>;
  userCount$: Observable<Count>;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  userTableUpdate$: BehaviorSubject<UserTableUpdate> =
    new BehaviorSubject<UserTableUpdate>({
      action: null,
      user: {} as UserDetails
    });
  userCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  roles;
  permissions$: Observable<Permission[]>;
  readonly perms = perms;

  constructor(
    private usersService: UsersService,
    private roleService: RolesPermissionsService,
    public dialog: MatDialog,
    private toast: ToastService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getDisplayedUsers();
    this.getUserCount();
    this.usersService.getRoles$().subscribe((roles) => {
      this.roles = roles;
    });
    this.configOptions.allColumns = this.columns;
    this.permissionsList$ = this.roleService.getPermissions$();
    this.rolesList$ = this.roleService
      .getRolesWithPermissions$()
      .pipe(shareReplay(1));
    this.permissions$ = this.commonService.permissionsAction$.pipe(
      tap((permissions) => this.prepareMenuActions(permissions))
    );
  }

  cellClickActionHandler = (event: CellClickActionEvent) => {
    const {
      columnId,
      row: { id }
    } = event;
    switch (columnId) {
      case 'user':
      case 'roles':
      case 'email':
      case 'createdAt':
        this.openEditAddUserModal(event.row);
        break;
      default:
      // do nothing
    }
  };

  openEditAddUserModal(user = {} as UserDetails) {
    const openEditAddUserModalRef = this.dialog.open(
      AddEditUserModalComponent,
      {
        data: {
          allusers: this.allUsersList,
          user,
          roles: this.roles,
          permissionsList$: this.permissionsList$,
          rolesList$: this.rolesList$
        }
      }
    );
    openEditAddUserModalRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0 || !resp.user) return;
      if (resp.action === 'edit') {
        this.usersService.updateUser$(resp.user).subscribe((updatedUser) => {
          if (Object.keys(updatedUser).length) {
            this.userTableUpdate$.next({
              action: 'edit',
              user: this.usersService.prepareUser(resp.user, resp.user.roles)
            });
            this.toast.show({
              text: 'User updated successfully!',
              type: 'success'
            });
          }
        });
      }
      if (resp.action === 'add') {
        this.usersService.createUser$(resp.user).subscribe((createdUser) => {
          if (Object.keys(createdUser).length) {
            this.userTableUpdate$.next({
              action: 'add',
              user: this.usersService.prepareUser(createdUser, resp.user.roles)
            });
            this.toast.show({
              text: 'User created successfully!',
              type: 'success'
            });
          }
        });
      }
    });
  }

  openDeleteUserModal(user: UserDetails) {
    const openDeleteUserModalRef = this.dialog.open(UserDeleteModalComponent, {
      data: {
        user
      }
    });
    openDeleteUserModalRef.afterClosed().subscribe((resp) => {
      if (!resp) return;
      this.usersService.deactivateUser$(user.id).subscribe((deletedUser) => {
        this.userTableUpdate$.next({
          action: 'deactivate',
          user
        });
        this.toast.show({
          text: 'User deactivated successfully!',
          type: 'success'
        });
      });
    });
  }

  getDisplayedUsers() {
    const initialUsers$ = this.usersService.getUsers$({
      skip: this.skip,
      limit: this.limit,
      isActive: true
      // searchKey: this.searchValue
    });

    const onScrollUsers$ = this.fetchUsers$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getUsers();
        } else {
          return of([] as UserDetails[]);
        }
      })
    );

    const updatedUsers$ = combineLatest([
      initialUsers$,
      this.userTableUpdate$
    ]).pipe(
      map(([users, update]) => {
        const { user, action } = update;
        switch (action) {
          case 'add':
            this.skip += 1;
            this.userCountUpdate$.next(+1);
            users.push(user);
            this.dataSource = new MatTableDataSource(users);
            break;
          case 'deactivate':
            this.skip -= 1;
            this.userCountUpdate$.next(-1);
            if (user.id) {
              const index = users.findIndex(
                (iteratedUser) => iteratedUser.id === user.id
              );
              if (index > -1) {
                users.splice(index, 1);
                this.dataSource = new MatTableDataSource(users);
              }
            }
            break;
          case 'edit':
            if (user.id) {
              this.usersService.updateUser$(user).subscribe();
              const index = users.findIndex(
                (iteratedUser) => iteratedUser.id === user.id
              );
              if (index > -1) {
                users[index] = user;
                this.dataSource = new MatTableDataSource(users);
              }
            }
        }
        this.allUsersList = users;
        return users;
      })
    );
    this.users$ = combineLatest([updatedUsers$, onScrollUsers$]).pipe(
      map(([users, scrollData]) => {
        const initial = {
          columns: this.columns,
          data: users
        };
        if (this.skip === 0) {
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data ? initial.data.length : this.skip;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getUsers = () =>
    this.usersService.getUsers$({
      skip: this.skip,
      limit: this.limit,
      isActive: true
      // searchKey: this.searchValue
    });

  getUserCount = () => {
    this.userCount$ = this.usersService.getUsersCount$({ isActive: true });
    this.userCount$ = combineLatest([
      this.userCount$,
      this.userCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        count.count += update;
        return count;
      })
    );
  };

  rowLevelActionHandler = (event) => {
    const { data, action } = event;
    switch (action) {
      case 'deactivate':
        this.openDeleteUserModal(data);
        break;
      case 'edit':
        this.openEditAddUserModal(data);
        break;
      case 'toggleRowSelect':
        const index = this.selectedUsers.findIndex(
          (user) => user.id === data.id
        );
        if (index !== -1) {
          this.selectedUsers = this.selectedUsers.filter(
            (user) => user.id !== data.id
          );

          if (data.displayRoles.includes(superAdminText))
            this.disableDeactivate = false;
        } else {
          this.selectedUsers.push(data);
          if (data.displayRoles.includes(superAdminText))
            this.disableDeactivate = true;
        }
        break;
      default:
      // do nothing
    }
  };

  deactivateUsers = () => {
    const openDeleteUserModalRef = this.dialog.open(UserDeleteModalComponent, {
      data: {
        multiDeactivate: {
          selctedUsers: this.selectedUsers
        }
      }
    });
    this.selectedUsers.forEach((selectUser) => {
      const id = selectUser.id;
      openDeleteUserModalRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.usersService.deactivateUser$(id).subscribe((deactivatedUser) => {
            if (Object.keys(deactivatedUser).length) {
              this.userTableUpdate$.next({
                action: 'deactivate',
                user: {
                  id,
                  title: '',
                  email: '',
                  isActive: false,
                  roles: []
                }
              });
              this.toast.show({
                text: 'User deactivated successfully!',
                type: 'success'
              });
              this.selectedUsers = [];
            }
          });
        }
      });
    });
  };
  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };
  configOptionsChangeHandler = (event) => {
    // console.log('event', event);
  };

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (this.commonService.checkUserHasPermission(permissions, 'UPDATE_USER')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    if (
      this.commonService.checkUserHasPermission(permissions, 'DEACTIVATE_USER')
    ) {
      menuActions.push({
        title: 'Deactivate',
        action: 'deactivate',
        condition: {
          operand: superAdminText,
          operation: 'notContains',
          fieldName: 'displayRoles'
        }
      });
    }

    this.configOptions.rowLevelActions.menuActions = [
      ...this.configOptions.rowLevelActions.menuActions,
      ...menuActions
    ];
    this.configOptions.displayActionsColumn = this.configOptions.rowLevelActions
      .menuActions.length
      ? true
      : false;
    this.configOptions = { ...this.configOptions };
  }
}
