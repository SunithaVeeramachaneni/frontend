/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError,
  takeUntil
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import {
  TableEvent,
  LoadEvent,
  SearchEvent,
  RoundPlan,
  Permission
} from 'src/app/interfaces';
import {
  graphQLDefaultLimit,
  routingUrls,
  permissions as perms
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { MatDialog } from '@angular/material/dialog';
import { ArchivedDeleteModalComponent } from '../archived-delete-modal/archived-delete-modal.component';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { LoginService } from '../../login/services/login.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';

interface FormTableUpdate {
  action: 'restore' | 'delete' | null;
  form: RoundPlan;
}

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.scss']
})
export class ArchivedListComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Round Plans',
      type: 'string',
      controlType: 'string',
      order: 1,
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
        'font-size': '90%',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
      order: 2,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'isArchivedAt',
      displayName: 'Archived',
      type: 'timeAgo',
      controlType: 'string',
      isMultiValued: true,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'publishedDate',
      displayName: 'Last Published',
      type: 'timeAgo',
      controlType: 'string',
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
  configOptions: ConfigOptions = {
    tableID: 'formsTable',
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
  formArchived$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  archivedFormsListCount$: Observable<number>;
  archivedFormsListCountRaw$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  archivedFormsListCountUpdate$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  nextToken = '';
  public menuState = 'out';
  ghostLoading = Array.from(Array(13).keys());
  submissionDetail: any;
  fetchType = 'load';
  restoreDeleteForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as RoundPlan
    });
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  isPopoverOpen = false;
  filterJson = [];
  filter = {
    plant: ''
  };
  plantsIdNameMap = {};
  plants = [];
  currentRouteUrl$: Observable<string>;
  triggerCountUpdate = false;
  userInfo$: Observable<any>;
  readonly routingUrls = routingUrls;
  private destroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    public dialog: MatDialog,
    private readonly operatorRoundsService: OperatorRoundsService,
    private commonService: CommonService,
    private headerService: HeaderService,
    private loginService: LoginService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(
          routingUrls.roundPlanArchivedForms.title
        )
      )
    );
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap(() => this.fetchForms$.next({ data: 'search' }))
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.getFilter();
    this.archivedFormsListCount$ = combineLatest([
      this.archivedFormsListCountRaw$,
      this.archivedFormsListCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.triggerCountUpdate) {
          count += update;
          this.triggerCountUpdate = false;
        }
        return count;
      })
    );
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.nextToken = '';
        this.fetchType = data;
        return this.getArchivedList();
      })
    );

    const onScrollForms$ = this.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getArchivedList();
        } else {
          return of([] as GetFormList[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.formArchived$ = combineLatest([
      formsOnLoadSearch$,
      onScrollForms$,
      this.restoreDeleteForm$
    ]).pipe(
      map(([rows, scrollData, { form, action }]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          initial.data = rows;
        } else {
          if (action === 'restore') {
            initial.data = initial.data.filter((d) => d.id !== form.id);
            this.toast.show({
              text: 'Plan restored successfully!',
              type: 'success'
            });
            action = null;
          }
          if (action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.id);
            this.toast.show({
              text: 'Round delete successfully!',
              type: 'success'
            });
            action = null;
          }
          initial.data = initial.data.concat(scrollData);
        }
        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getArchivedList() {
    return this.operatorRoundsService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        'All',
        true,
        this.filter
      )
      .pipe(
        mergeMap(({ rows, next, count }) => {
          if (count !== undefined) {
            this.archivedFormsListCountRaw$.next(count);
          }
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) =>
          data.map((item) => {
            if (item?.plantId) {
              item = {
                ...item,
                plant: `${item?.plant?.plantId} - ${item?.plant?.name}`
              };
            } else {
              item = { ...item, plant: '' };
            }
            return item;
          })
        )
      );
  }

  handleTableEvent = (event): void => {
    this.fetchForms$.next(event);
  };

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        perms.restoreArchivedOR
      )
    ) {
      menuActions.push({
        action: 'restore',
        title: 'Restore'
      });
    }

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        perms.deleteArchivedOR
      )
    ) {
      menuActions.push({
        action: 'delete',
        title: 'Delete'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'restore':
        this.onRestoreForm(data);
        break;

      case 'delete':
        this.onDeleteForm(data);
        break;
      default:
    }
  };

  getFilter() {
    this.operatorRoundsService
      .getArchivedFilter()
      .pipe(
        switchMap((res: any) => {
          this.filterJson = res;
          return this.plantService.fetchLoggedInUserPlants$().pipe(
            tap((plants) => {
              this.plants = plants
                .map((plant) => {
                  this.plantsIdNameMap[`${plant.plantId} - ${plant.name}`] =
                    plant.id;
                  return `${plant.plantId} - ${plant.name}`;
                })
                .sort();
              for (const item of this.filterJson) {
                if (item.column === 'plant') {
                  item.items = this.plants;
                }
              }
            })
          );
        })
      )
      .subscribe();
  }

  applyFilters(data: any) {
    this.isPopoverOpen = false;
    for (const item of data) {
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value];
      }
    }
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }

  resetFilter() {
    this.isPopoverOpen = false;
    this.filter = {
      plant: ''
    };
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onRestoreForm(form: RoundPlan): void {
    this.operatorRoundsService
      .updateForm$({
        formMetadata: {
          id: form?.id,
          isArchived: false,
          name: form?.name,
          description: form?.description,
          isArchivedAt: ''
        },
        // eslint-disable-next-line no-underscore-dangle
        formListDynamoDBVersion: form._version
      })
      ?.subscribe(() => {
        this.restoreDeleteForm$.next({
          action: 'restore',
          form
        });
        this.triggerCountUpdate = true;
        this.archivedFormsListCountUpdate$.next(-1);
      });
  }

  private onDeleteForm(form: RoundPlan): void {
    const deleteReportRef = this.dialog.open(ArchivedDeleteModalComponent, {
      data: form
    });

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.operatorRoundsService
          .updateForm$({
            formMetadata: {
              id: form?.id,
              name: form?.name,
              description: form?.description,
              isDeleted: true
            },
            // eslint-disable-next-line no-underscore-dangle
            formListDynamoDBVersion: form._version
          })
          ?.subscribe(() => {
            this.restoreDeleteForm$.next({
              action: 'delete',
              form
            });
            this.triggerCountUpdate = true;
            this.archivedFormsListCountUpdate$.next(-1);
          });
      }
    });
  }
}
