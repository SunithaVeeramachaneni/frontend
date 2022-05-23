import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  Count,
  Role,
  TableEvent,
  UserDetails,
  UserTable
} from 'src/app/interfaces';
import { UsersService } from '../services/users.service';
import { defaultLimit } from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { routingUrls } from 'src/app/app.constants';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CommonService } from 'src/app/shared/services/common.service';

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
  fetchUsers$: BehaviorSubject<TableEvent> = new BehaviorSubject<TableEvent>(
    {} as TableEvent
  );
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
  userCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  roles;

  constructor(
    private usersService: UsersService,
    private roleService: RolesPermissionsService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.commonService.setHeaderTitle(routingUrls.inActiveUsers.title)
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
    const initialUsers$ = this.usersService.getUsers$({
      skip: this.skip,
      limit: this.limit,
      isActive: false
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

    this.users$ = combineLatest([initialUsers$, onScrollUsers$]).pipe(
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
      isActive: false
    });

  getUserCount = () => {
    this.userCount$ = this.usersService.getUsersCount$({ isActive: false });
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

  handleTableEvent = (event) => {
    this.fetchUsers$.next(event);
  };
}
