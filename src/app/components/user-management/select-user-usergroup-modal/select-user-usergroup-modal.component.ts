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
import { Observable, ReplaySubject, combineLatest, of } from 'rxjs';
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
  userCount$: Observable<Count>;
  permissionsList$: Observable<any>;
  rolesList$: Observable<Role[]>;
  skip = 0;
  plantId;
  next = '';
  limit = defaultLimit;
  roles;
  searchUser: FormControl;
  selectedUsers = [];
  allUsersList = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectUserUsergroupModalComponent>,
    private usersService: UsersService,
    private userGroupService: UserGroupService,
    private roleService: RolesPermissionsService,
    private commonService: CommonService
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

    this.configOptions.allColumns = this.columns;
    this.permissionsList$ = this.roleService.getPermissions$();
    this.rolesList$ = this.roleService.getRolesWithPermissions$({
      includePermissions: true
    });

    const { name, description, plantId, dialogText } = this.data;

    console.log(name);
    console.log(description);
    console.log(plantId);
    this.getUsersList().subscribe((response) => console.log(response));
  }

  getDisplayedUsers() {
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.getUsersList();
      })
    );

    const onScrollUsers$ = this.fetchUsers$.pipe(
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

        // console.log(initial);
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
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
        next: this.next
      })
      .pipe(
        mergeMap((resp: any) => {
          this.userCount$ = of({ count: resp.count });
          return of(resp.items);
        }),
        // mergeMap((resp: UserDetails[]) => {
        //   resp = resp?.map((user) =>
        //     this.usersService.prepareUser(user, user.roles)
        //   );
        //   return of(resp);
        // }),
        map((data) => {
          const rows = data.map((item) => {
            if (item.firstName && item.lastName) {
              item.user = item.firstName + ' ' + item.lastName;
            } else {
              item.user = '';
            }
            return item;
          });
          return rows;
        }),
        tap((selectedUserId) => (this.allUsersList = selectedUserId))
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
          console.log(this.selectedUsers);
        } else {
          allSelected = false;
          // this.selectedUsers = [];
        }
        break;

      case 'toggleRowSelect':
        const index = this.selectedUsers.findIndex(
          (user) => user.id === data.id
        );
        console.log(index);
        if (index !== -1) {
          this.selectedUsers = this.selectedUsers.filter(
            (user) => user.id !== data.id
          );
        } else {
          this.selectedUsers.push(data);
          console.log(data);
        }
        break;
      default:
      // do nothing
    }
  };
  onCancel(): void {
    this.dialogRef.close();
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
      users: selectedUserId
    };

    this.userGroupService
      .createUserGroup$(newUserGroup, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((users) => {
        console.log(users);
      });
  }
}
