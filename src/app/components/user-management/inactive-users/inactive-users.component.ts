import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import {
  Count,
  LoadEvent,
  Role,
  SearchEvent,
  TableEvent,
  UserDetails,
  UserTable
} from 'src/app/interfaces';
import { UsersService } from '../services/users.service';
import { defaultLimit } from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { routingUrls } from 'src/app/app.constants';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users.component.html',
  styleUrls: ['./inactive-users.component.scss']
})
export class InactiveUsersComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'user',
      displayName: 'User',
      type: 'string',
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
      id: 'updatedAt',
      displayName: 'Inactive Since',
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
    },
    {
      id: 'createdAt',
      displayName: 'Created At',
      type: 'date',
      order: 5,
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
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };

  dataSource: MatTableDataSource<any>;
  users$: Observable<UserTable>;
  userCount$: Observable<Count>;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  skip = 0;
  limit = defaultLimit;
  roles;
  searchUser: FormControl;

  constructor(
    private usersService: UsersService,
    private roleService: RolesPermissionsService,
    private commonService: CommonService,
    private headerService: HeaderService
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
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(routingUrls.inActiveUsers.title)
      )
    );

    this.getDisplayedUsers();
    this.getUserCount();
    this.usersService.getRoles$().subscribe((roles) => {
      this.roles = roles;
    });
    this.configOptions.allColumns = this.columns;
    this.permissionsList$ = this.roleService.getPermissions$();
    this.rolesList$ = this.roleService.getRolesWithPermissions$();
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
    this.users$ = combineLatest([usersOnLoadSearch$, onScrollUsers$]).pipe(
      map(([users, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          }; // To fix dynamic table height issue post search with no records & then remove search with records
          initial.data = users;
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getUsers = () =>
    this.usersService.getUsers$({
      skip: this.skip,
      limit: this.limit,
      isActive: false,
      searchKey: this.searchUser.value
    });

  getUserCount = () => {
    this.userCount$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() =>
        this.usersService.getUsersCount$({
          isActive: false,
          searchKey: this.searchUser.value
        })
      )
    );
  };

  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };
}
