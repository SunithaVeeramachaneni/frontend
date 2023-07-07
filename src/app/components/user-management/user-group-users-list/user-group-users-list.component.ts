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

@Component({
  selector: 'app-user-group-users-list',
  templateUrl: './user-group-users-list.component.html',
  styleUrls: ['./user-group-users-list.component.scss']
})
export class UserGroupUsersListComponent implements OnInit, OnChanges {
  @Input() userGroupId: string;
  @Input() userGroupPlantId: string;
  userCount$: Observable<Count>;
  limit: number = defaultLimit;
  next = '';

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
    tableHeight: 'calc(100vh-50px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;
  allUsers$: Observable<any>;
  searchUser: FormControl;
  searchUser$: Observable<any>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  _userGroupId: string;
  _userGroupPlantId: string;
  skip = 0;

  constructor(
    private userGroupService: UserGroupService,
    private toast: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.userGroupId.currentValue) {
      this.userGroupPlantId = changes.userGroupPlantId.currentValue;

      this.getAllUsers();
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
        tap((data) => {
          this.isLoading$.next(true);
        })
      )
      .subscribe();
    this.configOptions.allColumns = this.columns;
  }

  getAllUsers() {
    const usersOnLoadSearch$ = this.fetchUsers$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => this.getUsersList())
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
    this.allUsers$ = combineLatest([usersOnLoadSearch$, usersOnScroll$]).pipe(
      map(([users, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh-50px)'
          }; // To fix dynamic table height issue post search with no records & then remove search with records
          initial.data = users;
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        // console.log(initial);
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      }),
      tap((data) => console.log(data))
    );
  }

  getUsersList = () =>
    this.userGroupService
      .listDynamoUsers$({
        limit: this.limit,
        searchKey: this.searchUser.value,
        plantId: this.userGroupPlantId,
        next: this.next
      })
      .pipe(
        mergeMap((resp: any) => {
          this.userCount$ = of({ count: resp.count });
          return of(resp.items);
        }),

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
        })
      );

  handleTableEvent = (event) => {
    console.log(event);
    this.fetchUsers$.next(event);
  };
  rowLevelActionHandler($event) {}
}
