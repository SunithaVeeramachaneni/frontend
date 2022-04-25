import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Count, TableEvent, UserDetails, UserTable } from 'src/app/interfaces';
import { UsersService } from './users.service';
import { defaultLimit } from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { routingUrls } from 'src/app/app.constants';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { update } from 'lodash';
import { Buffer } from 'buffer';
import { MatDialog } from '@angular/material/dialog';
import { ReportDeleteModalComponent } from '../../dashboard/report-delete-modal/report-delete-modal.component';
import { AddEditUserModalComponent } from './add-edit-user-modal/add-edit-user-modal.component';
import { UserService } from 'angular-auth-oidc-client/lib/user-data/user.service';

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
  columns = [
    {
      displayName: 'User',
      type: 'string',
      name: 'user',
      filterType: 'string',
      order: 1,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Role',
      type: 'string',
      name: 'displayRoles',
      filterType: 'string',
      order: 2,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Email',
      type: 'string',
      name: 'email',
      filterType: 'string',
      order: 3,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Created On',
      type: 'string',
      name: 'createdOn',
      filterType: 'date',
      order: 4,
      sticky: false,
      visible: true
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
          action: 'deactivate'
        }
      ]
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: []
  };
  dataSource: MatTableDataSource<any>;
  users$: Observable<UserTable>;
  userCount$: Observable<Count>;
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
    private commonService: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.commonService.setHeaderTitle(routingUrls.rolesPermissions.title)
      )
    );
    this.getDisplayedUsers();
    this.getUserCount();
    this.usersService.getRoles$().subscribe((roles) => {
      this.roles = roles;
    });
  }

  openEditAddUserModal(user = {} as UserDetails) {
    const openEditAddUserModalRef = this.dialog.open(
      AddEditUserModalComponent,
      {
        data: {
          user,
          roles: this.roles
        }
      }
    );
    openEditAddUserModalRef.afterClosed().subscribe((resp) => {
      if (!resp.user) return;
      this.userTableUpdate$.next({
        action: resp.action,
        user: this.usersService.prepareUser(resp.user, resp.user.roles)
      });
    });
  }

  getDisplayedUsers() {
    const initialUsers$ = this.usersService.getUsers$({
      skip: this.skip,
      limit: this.limit
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
            this.usersService.createUser$(user).subscribe();
            this.skip += 1;
            this.userCountUpdate$.next(+1);
            users.unshift(user);
            this.dataSource = new MatTableDataSource(users);
            break;
          case 'deactivate':
            this.usersService.deactivateUser$(user).subscribe();
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
        const initial: UserTable = {
          columns: this.columns,
          data: users
        };
        if (this.skip === 0) {
          this.configOptions = this.usersService.updateConfigOptionsFromColumns(
            this.columns,
            this.configOptions
          );
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
      limit: this.limit
      // searchKey: this.searchValue
    });

  getUserCount = () => {
    this.userCount$ = this.usersService.getUsersCount$();
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
    console.log('event.action');
    switch (event.action) {
      case 'deactivate':
        this.userTableUpdate$.next({
          action: event.action,
          user: event.data
        });
        break;
      case 'edit':
        this.openEditAddUserModal(event.data);
        break;
      default:
      // do nothing
    }
  };
  handleTableEvent = (event) => {
    console.log('event', event);
  };
  configOptionsChangeHandler = (event) => {
    console.log('event', event);
  };
}
