import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap
} from 'rxjs/operators';
import {
  CellClickActionEvent,
  Count,
  LoadEvent,
  SearchEvent,
  TableEvent,
  UserDetails,
  UserInfo,
  UserTable
} from 'src/app/interfaces';
import { defaultLimit, superAdminText } from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from 'src/app/shared/toast';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../login/services/login.service';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../user-management/services/users.service';

interface UserTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  user: UserDetails;
}

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormListComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'user',
      displayName: 'Recents',
      type: 'string',
      order: 1,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
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
      displayName: 'Owner',
      type: 'string',
      isMultiValued: true,
      order: 2,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'email',
      displayName: 'Status',
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
      titleStyle: {
        background: '#f8f7b0',
        borderRadius: '100px',
        float: 'left',
        padding: '8px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'title',
      displayName: 'Last Published',
      type: 'string',
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
      id: 'createdAt',
      displayName: 'Last Published By At',
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
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  configOptions: ConfigOptions = {
    tableID: 'formsTable',
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
  selectedForms = [];
  allFormsList = [];
  dataSource: MatTableDataSource<any>;
  forms$: Observable<UserTable>;
  formsCount$: Observable<Count>;
  addEditDeleteForm$: BehaviorSubject<UserTableUpdate> =
    new BehaviorSubject<UserTableUpdate>({
      action: null,
      user: {} as UserDetails
    });
  formCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  loggedInUserInfo$: Observable<UserInfo>;
  searchForm: FormControl;
  addEditDeleteForm = false;
  addDeleteFormCount = false;
  isPopoverOpen = false;
  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private toast: ToastService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();
    this.getDisplayedForms();

    this.formsCount$ = combineLatest([
      this.formsCount$,
      this.formCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addDeleteFormCount) {
          count.count += update;
          this.addDeleteFormCount = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.loggedInUserInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(() => this.prepareMenuActions())
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
        this.openEditAddFormModal(event.row);
        break;
      default:
    }
  };

  openEditAddFormModal(form = {} as any) {
    this.toast.show({
      text: 'Form created successfully!',
      type: 'success'
    });
  }

  openDeleteFormModal(form: any) {
    this.toast.show({
      text: 'Form deactivated successfully!',
      type: 'success'
    });
  }

  getDisplayedForms() {
    const formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.getUsers();
      })
    );

    const onScrollUsers$ = this.fetchForms$.pipe(
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
    this.forms$ = combineLatest([
      formsOnLoadSearch$,
      this.addEditDeleteForm$,
      onScrollUsers$
    ]).pipe(
      map(([users, update, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 150px)'
          };
          initial.data = users;
        } else {
          if (this.addEditDeleteForm) {
            const { user, action } = update;
            switch (action) {
              case 'add':
                this.skip += 1;
                this.addDeleteFormCount = true;
                this.formCountUpdate$.next(+1);
                initial.data = initial.data.concat(scrollData);
                break;
              case 'delete':
                this.skip -= 1;
                this.addDeleteFormCount = true;
                this.formCountUpdate$.next(-1);
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
                  }
                }
            }
            this.addEditDeleteForm = false;
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getUsers = () =>
    this.usersService
      .getUsers$({
        skip: this.skip,
        limit: this.limit,
        isActive: true,
        searchKey: this.searchForm.value,
        includeRoles: true
      })
      .pipe(
        mergeMap((resp: any) => {
          this.formsCount$ = of({ count: resp.count });
          return of(resp.rows);
        }),
        mergeMap((resp: UserDetails[]) => {
          resp = resp.map((user) =>
            this.usersService.prepareUser(user, user.roles)
          );
          return of(resp);
        })
      );

  rowLevelActionHandler = (event) => {
    const { data, action } = event;
    switch (action) {
      case 'delete':
        this.openDeleteFormModal(data);
        break;

      case 'edit':
        this.openEditAddFormModal(data);
        break;

      case 'toggleAllRows':
        let allSelected = false;
        let forms = [];
        forms = this.allFormsList.filter(
          (user) => user.title !== superAdminText
        );

        if (
          this.selectedForms.length === 0 ||
          this.selectedForms.length !== forms.length
        ) {
          allSelected = true;
          this.selectedForms = forms;
        } else {
          allSelected = false;
          this.selectedForms = [];
        }
        break;

      case 'toggleRowSelect':
        const index = this.selectedForms.findIndex(
          (form) => form.id === data.id
        );
        if (index !== -1) {
          this.selectedForms = this.selectedForms.filter(
            (form) => form.id !== data.id
          );
        } else {
          this.selectedForms.push(data);
        }
        break;
      default:
    }
  };

  handleTableEvent = (event) => {
    this.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event) => {
    console.log('event', event);
  };

  prepareMenuActions() {
    const menuActions = [
      {
        title: 'Edit',
        action: 'edit'
      },
      {
        title: 'Delete',
        action: 'delete'
      }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  applyFilters() {
    this.isPopoverOpen = false;
  }

  clearFilters() {
    this.isPopoverOpen = false;
  }
}
