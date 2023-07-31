import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, BehaviorSubject, of, Subject } from 'rxjs';
import {
  catchError,
  filter,
  tap,
  map,
  mergeMap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';

import { downloadFile } from 'src/app/shared/utils/fileUtils';
import {
  defaultLimit,
  permissions as perms,
  routingUrls
} from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Permission,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';

import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';

import { UsersService } from 'src/app/components/user-management/services/users.service';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ResponseSetService } from '../services/response-set.service';
import { ToastService } from 'src/app/shared/toast';
import { MatDialog } from '@angular/material/dialog';
import { UploadResponseModalComponent } from '../../../../shared/components/upload-response-modal/upload-response-modal.component';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-responses-list',
  templateUrl: './responses-list.component.html',
  styleUrls: ['./responses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesListComponent implements OnInit, OnDestroy {
  readonly perms = perms;
  public userInfo$: Observable<UserInfo>;

  public allResponseSets: any[] = [];
  public allResponseSets$: Observable<any>;
  public responseSets$: Observable<any>;
  public dataSource: MatTableDataSource<any>;

  public isControlModeView: boolean;
  public globaResponseAddOrEditOpenState = 'out';
  public isGlobalResponseOpen = false;
  public responseToBeEdited = null;

  public responseSetCount$: Observable<number>;
  public responseSetCountUpdate$: BehaviorSubject<number> = new BehaviorSubject(
    0
  );

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public columns: Column[] = [
    {
      id: 'name',
      displayName: 'Title',
      type: 'string',
      order: 1,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000'
      },
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'responseCount',
      displayName: 'Responses',
      type: 'number',
      order: 2,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000'
      },
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'creator',
      displayName: 'Created By',
      type: 'string',
      order: 3,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'updatedAt',
      displayName: 'Last Modified',
      type: 'timeAgo',
      order: 3,
      controlType: 'string',
      showMenuOptions: false,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];

  public configOptions: ConfigOptions = {
    tableID: 'responsesTable',
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
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      published: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      }
    }
  };
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  public searchResponseSet: FormControl;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  private addEditDeleteResponseSet: boolean;
  private addEditDeleteResponseSet$: BehaviorSubject<any> =
    new BehaviorSubject<any>({
      action: null,
      form: {} as any
    });

  private skip = 0;
  private limit = defaultLimit;
  private fetchType = 'load';
  private nextToken = '';
  private onDestroy$ = new Subject();

  constructor(
    private responseSetService: ResponseSetService,
    private usersService: UsersService,
    private loginService: LoginService,
    private toast: ToastService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(routingUrls.globalResponse.title)
      )
    );
    this.searchResponseSet = new FormControl('');
    this.responseSetService.fetchResponses$.next({ data: 'load' });
    this.responseSetService.fetchResponses$.next({} as TableEvent);
    this.allResponseSets$ = this.responseSetService.fetchAllGlobalResponses$();
    this.responseSetCount$ = combineLatest([
      this.responseSetCount$,
      this.responseSetCountUpdate$
    ]).pipe(map(([count, countUpdate]) => count + countUpdate));

    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    this.getDisplayedResponseSets();

    this.searchResponseSet.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.responseSetService.fetchResponses$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
  }

  getDisplayedResponseSets = () => {
    const responseSetOnLoadSearch$ =
      this.responseSetService.fetchResponses$.pipe(
        filter(({ data }) => data === 'load' || data === 'search'),
        switchMap(({ data }) => {
          this.skip = 0;
          this.nextToken = '';
          this.fetchType = data;
          return this.getResponseSets();
        })
      );

    const onScrollResponseSets$ = this.responseSetService.fetchResponses$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getResponseSets();
        } else {
          return of([]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: [] as any
    };
    this.responseSets$ = combineLatest([
      responseSetOnLoadSearch$,
      this.addEditDeleteResponseSet$,
      onScrollResponseSets$,
      this.usersService.getUsersInfo$()
    ]).pipe(
      map(([rows, addEditData, scrollData, users]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 140px)'
          };

          initial.data = rows.map((item) => ({
            ...item,
            responseCount: JSON.parse(item?.values)?.length,
            createdBy: item?.createdBy || '',
            creator: this.usersService.getUserFullName(item?.createdBy)
          }));
        } else {
          if (this.addEditDeleteResponseSet) {
            const { form } = addEditData;
            switch (addEditData.action) {
              case 'create':
                initial.data = [
                  {
                    ...form,
                    responseCount: JSON.parse(form.values).length,
                    creator: this.usersService.getUserFullName(form.createdBy)
                  },
                  ...initial.data
                ];
                break;
              case 'update':
                const updatedIdx = initial.data.findIndex(
                  (item) => item.id === form.id
                );
                initial.data[updatedIdx] = {
                  ...form,
                  creator: this.usersService.getUserFullName(form.createdBy),
                  responseCount: JSON.parse(form.values).length,
                  updatedAt: new Date().toISOString()
                };
                break;
              case 'delete':
                initial.data = initial.data.filter(
                  (item) => item.id !== form.id
                );
                break;
              default:
              // Do nothing
            }

            this.addEditDeleteResponseSet = false;
          } else
            initial.data = initial.data.concat(
              scrollData.map((item) => ({
                ...item,
                responseCount: JSON.parse(item?.values)?.length,
                createdBy: item.createdBy || '',
                creator: this.usersService.getUserFullName(item?.createdBy)
              }))
            );
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  };

  getResponseSets() {
    return this.responseSetService
      .fetchResponseSetList$({
        next: this.nextToken,
        limit: this.limit,
        searchKey: this.searchResponseSet.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.responseSetCount$ = of(count);
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.responseSetCount$ = of(0);
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  addManually = () => {
    this.isControlModeView = false;
    this.globaResponseAddOrEditOpenState = 'in';
    this.isGlobalResponseOpen = !this.isGlobalResponseOpen;
    this.responseToBeEdited = null;
  };

  handleGlobalResponseChange = (event) => {
    const { actionType: action, responseSet } = event;
    this.addEditDeleteResponseSet = true;
    this.isGlobalResponseOpen = false;
    this.responseToBeEdited = null;
    this.globaResponseAddOrEditOpenState = 'out';
    if (action !== 'cancel') {
      this.addEditDeleteResponseSet$.next({
        action,
        form: responseSet
      });
    }
  };

  handleTableEvent = (event): void => {
    this.responseSetService.fetchResponses$.next(event);
  };

  handleSlideState = (event) => {};

  configOptionsChangeHandler = (event): void => {};

  rowLevelActionHandler = ({ data, action }) => {
    switch (action) {
      case 'edit':
        this.responseToBeEdited = data;
        this.globaResponseAddOrEditOpenState = 'in';
        this.isGlobalResponseOpen = true;
        this.isControlModeView = false;
        break;
      case 'delete':
        if (data.refCount > 0) {
          this.toast.show({
            text: 'Global Response Set already in use!',
            type: 'warning'
          });
        } else
          this.responseSetService
            .deleteResponseSet$({
              id: data.id,
              // eslint-disable-next-line no-underscore-dangle
              _version: data._version
            })
            .subscribe(() => {
              this.addEditDeleteResponseSet = true;
              this.addEditDeleteResponseSet$.next({
                action: 'delete',
                form: data
              });
              this.toast.show({
                text: 'Global Response Set deleted successfully!',
                type: 'success'
              });
            });
        break;
      default:
    }
  };

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'responseCount':
      case 'creator':
      case 'updatedAt':
        this.showRepsonseSetDetail(row);
        break;
      default:
    }
  };

  showRepsonseSetDetail = (row) => {
    this.isControlModeView = true;
    this.isGlobalResponseOpen = true;
    this.globaResponseAddOrEditOpenState = 'in';
    this.responseToBeEdited = row;
  };

  onCloseResponseSetDetailedView = (event) => {
    this.globaResponseAddOrEditOpenState = event.status;
    if (event.data !== '') {
      this.responseToBeEdited = event.data;
      this.globaResponseAddOrEditOpenState = 'in';
    }
  };

  onCloseGlobalResponseAddOrEditState = (event) =>
    (this.globaResponseAddOrEditOpenState = event);

  prepareMenuActions = (permissions: Permission[]) => {
    const menuActions = [];
    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'UPDATE_GLOBAL_RESPONSES'
      )
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'DELETE_GLOBAL_RESPONSES'
      )
    ) {
      menuActions.push({
        title: 'Delete',
        action: 'delete'
      });
    }

    this.configOptions = {
      ...this.configOptions,
      rowLevelActions: {
        ...this.configOptions.rowLevelActions,
        menuActions
      },
      displayActionsColumn: menuActions.length > 0
    };
  };

  uploadFile(event) {
    const file = event.target.files[0];
    const deleteReportRef = this.dialog.open(UploadResponseModalComponent, {
      data: {
        file,
        type: 'response-set'
      },
      disableClose: true
    });

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res.data) {
        this.getResponseSets();
        this.addEditDeleteResponseSet = true;
        this.nextToken = '';
        this.responseSetService.fetchResponses$.next({ data: 'load' });
        this.responseSetCount$ = this.responseSetService.getResponseSetCount$();
        this.toast.show({
          text: 'Response Set  uploaded successfully!',
          type: 'success'
        });
      }
    });
  }
  exportAsXLSX(): void {
    this.responseSetService
      .downloadSampleResponseSetTemplate()
      .pipe(
        tap((data) => {
          downloadFile(data, 'Response-Set_Sample_Template');
        })
      )
      .subscribe();
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
