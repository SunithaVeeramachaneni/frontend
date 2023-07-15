import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  shareReplay
} from 'rxjs/operators';
import {
  CellClickActionEvent,
  Count,
  LoadEvent,
  Permission,
  Role,
  SearchEvent,
  TableEvent,
  UserDetails,
  UserGroup,
  UserInfo,
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
import { UserGroupService } from '../services/user-group.service';
import { Buffer } from 'buffer';
import { LoginService } from '../../login/services/login.service';
import { FormControl } from '@angular/forms';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { Plant } from 'src/app/interfaces/plant';
import { format } from 'date-fns';
interface UserTableUpdate {
  action: 'add' | 'deactivate' | 'edit' | 'copy' | null;
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
      controlType: 'string',
      order: 1,
      searchable: false,
      sortable: true,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: { 'font-weight': '500', 'font-size': '90%' },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'title',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'displayRoles',
      displayName: 'Role',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
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
      id: 'userGroupsDisplay',
      displayName: 'User Groups',
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
      id: 'email',
      displayName: 'Email',
      type: 'string',
      controlType: 'string',
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
    },
    {
      id: 'validThroughPlaceholder',
      displayName: 'Valid Through',
      type: 'string',
      controlType: 'string',
      order: 5,
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
      id: 'plantIdPlaceholder',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      order: 6,
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
      controlType: 'string',
      order: 7,
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
  fetchUsers$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
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
  selectedUserGroup = null;
  fetchType = 'load';
  nextToken = '';
  dataSource: MatTableDataSource<any>;
  disableDeactivate = false;
  users$: Observable<UserTable>;
  userCount$: Observable<Count>;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  usergroupList$: Observable<UserGroup[]>;
  addEditDeactivateUser$: BehaviorSubject<UserTableUpdate> =
    new BehaviorSubject<UserTableUpdate>({
      action: null,
      user: {} as UserDetails
    });
  userCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  roles;
  usergroup;
  loggedInUserInfo$: Observable<UserInfo>;
  readonly perms = perms;
  searchUser: FormControl;
  addEditDeactivateUser = false;
  addDeactivateUserCount = false;
  plantsList: Plant[];
  plantsObject = {};
  isOpenAddEditModal = false;
  searchUserGroup: FormControl;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private usersService: UsersService,
    private roleService: RolesPermissionsService,
    private userGroupService: UserGroupService,
    public dialog: MatDialog,
    private toast: ToastService,
    private loginService: LoginService,
    private plantService: PlantService
  ) {}

  ngOnInit() {
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
      .subscribe();
    this.getDisplayedUsers();

    this.userCount$ = combineLatest([
      this.userCount$,
      this.userCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addDeactivateUserCount) {
          count.count += update;
          this.addDeactivateUserCount = false;
        }
        return count;
      })
    );

    this.usersService.getRoles$().subscribe((roles) => {
      this.roles = roles;
    });

    this.userGroupService.listAllUserGroups$().subscribe((data) => {
      this.usergroup = data;
    });
    this.configOptions.allColumns = this.columns;
    this.permissionsList$ = this.roleService.getPermissions$();
    this.rolesList$ = this.roleService
      .getRolesWithPermissions$({ includePermissions: true })
      .pipe(shareReplay(1));
    this.loggedInUserInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
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
      case 'userGroups':
      case 'email':
      case 'createdAt':
        this.openEditAddUserModal(event.row);
        break;
      default:
      // do nothing
    }
  };

  openEditAddUserModal(user = {} as UserDetails) {
    if (this.isOpenAddEditModal) return;
    this.isOpenAddEditModal = true;
    const openEditAddUserModalRef = this.dialog.open(
      AddEditUserModalComponent,
      {
        data: {
          user,
          roles: this.roles,
          usergroup: this.usergroup,
          permissionsList$: this.permissionsList$,
          rolesList$: this.rolesList$,
          usergroupList$: this.usergroupList$,
          plantsList: this.plantsList
        }
      }
    );
    openEditAddUserModalRef.afterClosed().subscribe((resp) => {
      this.isOpenAddEditModal = false;
      if (!resp || Object.keys(resp).length === 0 || !resp.user) return;
      if (resp.action === 'edit') {
        this.usersService
          .updateUser$({
            ...resp.user,
            profileImage: Buffer.from(resp.user.profileImage).toString()
          })
          .subscribe((updatedUser) => {
            if (Object.keys(updatedUser).length) {
              this.addEditDeactivateUser = true;
              if (this.searchUser.value) {
                this.fetchUsers$.next({ data: 'search' });
              } else {
                this.addEditDeactivateUser$.next({
                  action: 'edit',
                  user: this.usersService.prepareUser(
                    resp.user,
                    resp.user.roles
                    // resp.user.usergroup
                  )
                });
              }
              this.toast.show({
                text: 'User updated successfully!',
                type: 'success'
              });
            }
          });
      }
      if (resp.action === 'add') {
        const input = resp.user;
        const idArray = input.usergroup.map((obj) => obj.id); // Extract id values
        const idString = idArray.join(','); // Join values with commas
        input.userGroups = idString;
        this.usersService.createUser$(input).subscribe((createdUser) => {
          if (Object.keys(createdUser).length) {
            this.addEditDeactivateUser = true;
            if (this.searchUser.value) {
              this.fetchUsers$.next({ data: 'search' });
            } else {
              this.addEditDeactivateUser$.next({
                action: 'add',
                user: this.usersService.prepareUser(
                  createdUser,
                  resp.user.roles
                )
              });
            }
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
        this.addEditDeactivateUser = true;
        this.addEditDeactivateUser$.next({
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
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.getUsers();
      })
    );

    const onScrollUsers$ = this.fetchUsers$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getUsers();
        } else {
          return of([] as UserDetails[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.users$ = combineLatest([
      usersOnLoadSearch$,
      this.addEditDeactivateUser$,
      onScrollUsers$,
      this.userGroupService.listAllUserGroups$(),
      this.plantService.fetchAllPlants$().pipe(
        tap((data) => {
          this.plantsList = data.items;
          this.plantsObject = this.getPlantsObject(this.plantsList);
        })
      )
    ]).pipe(
      map(([users, update, scrollData, userGroups]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          };
          initial.data = this.formatUsers(users);
        } else {
          if (this.addEditDeactivateUser) {
            const { user, action } = update;
            switch (action) {
              case 'add':
                this.skip += 1;
                this.addDeactivateUserCount = true;
                this.userCountUpdate$.next(+1);
                initial.data = initial.data.concat(scrollData);
                if (user) {
                  initial.data = [user, ...initial.data];
                  initial.data[0].plantIdPlaceholder =
                    this.plantsObject[user.plantId];
                  initial.data[0].validThroughPlaceholder = this.formatDate(
                    user.validThrough
                  );
                }
                break;
              case 'deactivate':
                this.skip -= 1;
                this.addDeactivateUserCount = true;
                this.userCountUpdate$.next(-1);
                if (user.id) {
                  const index = initial.data.findIndex(
                    (iteratedUser) => iteratedUser.id === user.id
                  );
                  if (index > -1) {
                    initial.data.splice(index, 1);
                  }
                }
                break;
              case 'edit':
                if (user.id) {
                  const index = initial.data.findIndex(
                    (iteratedUser) => iteratedUser.id === user.id
                  );
                  if (index > -1) {
                    initial.data[index] = user;
                    initial.data[index].plantIdPlaceholder =
                      this.plantsObject[user.plantId];
                    initial.data[index].validThroughPlaceholder =
                      this.formatDate(user.validThrough);
                  }
                }
            }
            this.addEditDeactivateUser = false;
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }
        initial?.data?.map((data) => {
          const ids = data?.userGroups?.split(',');
          const userGroupNames = [];
          ids?.forEach((id) => {
            const obj = userGroups?.items?.find((g) => g?.id === id);
            userGroupNames.push(obj?.name);
          });
          data.userGroupsDisplay = userGroupNames.toString();
          return data;
        });
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  formatUsers(users) {
    return users.map((user) => {
      user.validThroughPlaceholder = this.formatDate(user.validThrough);
      if (user.plantId) {
        user.plantIdPlaceholder = this.plantsObject[user.plantId];
      }
      return user;
    });
  }

  formatDate(validThrough) {
    if (validThrough) validThrough = format(new Date(validThrough), 'dd.MM.yy');
    return validThrough;
  }

  getPlantsObject(plants) {
    return plants.reduce((acc, cur) => {
      acc[cur.id] = cur.plantId;
      return acc;
    }, {});
  }

  getUsers = () =>
    this.usersService
      .getUsers$({
        skip: this.skip,
        limit: this.limit,
        isActive: true,
        searchKey: this.searchUser.value,
        includeRoles: true
      })
      .pipe(
        mergeMap((resp: any) => {
          this.userCount$ = of({ count: resp.count });
          return of(resp.rows);
        }),
        mergeMap((resp: UserDetails[]) => {
          resp = resp.map((user) =>
            this.usersService.prepareUser(user, user.roles)
          );
          return of(resp);
        }),
        tap((x) => (this.allUsersList = x))
      );

  rowLevelActionHandler = (event) => {
    const { data, action } = event;
    switch (action) {
      case 'deactivate':
        this.openDeleteUserModal(data);
        break;

      case 'edit':
        this.openEditAddUserModal(data);
        break;

      case 'toggleAllRows':
        let allSelected = false;
        let users = [];
        users = this.allUsersList.filter(
          (user) => user.title !== superAdminText
        );

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
              this.addEditDeactivateUser$.next({
                action: 'deactivate',
                user: {
                  id,
                  title: '',
                  email: '',
                  isActive: false,
                  roles: [],
                  usergroup: [],
                  validFrom: '',
                  validThrough: '',
                  plantId: ''
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
  configOptionsChangeHandler = (event) => {};

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_USER')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    if (
      this.loginService.checkUserHasPermission(permissions, 'DEACTIVATE_USER')
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

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }
}
