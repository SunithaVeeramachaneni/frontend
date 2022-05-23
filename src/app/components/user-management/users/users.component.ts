import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import {
  CellClickActionEvent,
  Count,
  Role,
  TableEvent,
  UserDetails,
  UserTable
} from 'src/app/interfaces';
import { UsersService } from '../services/users.service';
import { defaultLimit } from 'src/app/app.constants';
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
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '', //'displayRoles',
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: { 'font-weight': '500' },
      subtitleStyle: {}, // { 'font-size': '8pt', color: 'darkgray' },
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
    displayActionsColumn: true,
    rowLevelActions: {
      menuActions: [
        {
          title: 'Edit',
          action: 'edit'
        },
        {
          title: 'Deactivate',
          action: 'deactivate',
          condition: {
            operand: 'Super Admin',
            operation: 'notContains',
            fieldName: 'displayRoles'
          }
        }
      ]
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
   
  };
  selectedUsers = [];
  dataSource: MatTableDataSource<any>;
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

  constructor(
    private usersService: UsersService,
    private roleService: RolesPermissionsService,
    public dialog: MatDialog,
    private toast: ToastService
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
        this.openEditAddUserModal(event.row)
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
            users.unshift(user);
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
    const {data, action} = event;
    switch (action) {
      case 'deactivate':
        this.openDeleteUserModal(data);
        break;
      case 'edit':
        this.openEditAddUserModal(data);
        break;
      case 'toggleRowSelect':
        if(this.selectedUsers.includes(data.id)) 
          this.selectedUsers = this.selectedUsers.filter(userId => userId !== data.id)
          else{
            this.selectedUsers.push(data.id)
          }
        break;
      default:
      // do nothing
    }
  };

  deactivateUsers = () =>{
    this.selectedUsers.forEach(id =>{
      this.usersService.deactivateUser$(id).subscribe((deactivatedUser) => {
        if (Object.keys(deactivatedUser).length) {
        this.userTableUpdate$.next({
          action: 'deactivate',
          user: {id, title: '', email: '', isActive: false, createdAt : new Date(), roles : []}
        });
        this.toast.show({
          text: 'User deactivated successfully!',
          type: 'success'
        });
        this.selectedUsers = [];
      }
      });
    })
  }
  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };
  configOptionsChangeHandler = (event) => {
    // console.log('event', event);
  };
}
