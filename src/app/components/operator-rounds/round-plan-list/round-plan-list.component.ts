import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
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
  CellClickActionEvent,
  TableEvent,
  FormTableUpdate,
  RoundPlan,
  UserInfo,
  Permission
} from 'src/app/interfaces';
import {
  graphQLDefaultLimit,
  permissions as perms
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { Router } from '@angular/router';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { slideInOut } from 'src/app/animations';
import { MatDialog } from '@angular/material/dialog';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { PlantsResponse } from 'src/app/interfaces/master-data-management/plants';
import { LoginService } from '../../login/services/login.service';
import { RoundPlanModalComponent } from '../round-plan-modal/round-plan-modal.component';

@Component({
  selector: 'app-round-plan-list',
  templateUrl: './round-plan-list.component.html',
  styleUrls: ['./round-plan-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class RoundPlanListComponent implements OnInit, OnDestroy {
  public menuState = 'out';
  submissionSlider = 'out';
  isPopoverOpen = false;
  status: any[] = ['Draft', 'Published'];
  filterJson: any[] = [];
  filter: any = {
    status: '',
    createdBy: '',
    lastModifiedOn: '',
    scheduleStartDate: '',
    scheduleEndDate: '',
    publishedBy: '',
    plant: ''
  };
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Plan Name',
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
        'font-size': '100%',
        color: '#000000',
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
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      controlType: 'string',
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
      groupable: true,
      titleStyle: {
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        width: '80px',
        height: '24px',
        background: '#FEF3C7',
        color: '#92400E',
        borderRadius: '12px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
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
      id: 'lastPublishedBy',
      displayName: 'Last Published By',
      type: 'number',
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
    },
    {
      id: 'publishedDate',
      displayName: 'Last Published',
      type: 'timeAgo',
      controlType: 'string',
      order: 5,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: true,
      reverseSort: true,
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
      id: 'author',
      displayName: 'Created By',
      type: 'number',
      controlType: 'string',
      isMultiValued: true,
      order: 6,
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
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FFCC00',
        color: '#000000'
      },
      published: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      }
    }
  };
  dataSource: MatTableDataSource<any>;
  forms$: Observable<any>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  formsListCount$: Observable<number>;
  formsListCountRaw$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  formsListCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  selectedForm: RoundPlan = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  infiniteScrollEnabled = true;
  formsList$: Observable<any>;
  lastPublishedBy = [];
  lastPublishedOn = [];
  lastModifiedBy = [];
  authoredBy = [];
  plants = [];
  plantsIdNameMap = {};
  createdBy = [];
  plantsObject: { [key: string]: PlantsResponse } = {};
  userInfo$: Observable<UserInfo>;
  triggerCountUpdate = false;
  readonly perms = perms;
  private destroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    private readonly operatorRoundsService: OperatorRoundsService,
    private router: Router,
    private dialog: MatDialog,
    private plantService: PlantService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
    this.operatorRoundsService.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap(() => {
          this.operatorRoundsService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getFilter();
    this.getDisplayedForms();
    this.getAllOperatorRounds();
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [], plantId = null }) => {
        this.plantService.setUserPlantIds(plantId);
        this.filter.plant = plantId;
        this.prepareMenuActions(permissions);
      })
    );
    this.formsListCount$ = combineLatest([
      this.formsListCountRaw$,
      this.formsListCountUpdate$
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

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'author':
      case 'plant':
      case 'formStatus':
      case 'lastPublishedBy':
      case 'publishedDate':
      case 'responses':
        this.showFormDetail(row);
        break;
      default:
    }
  };

  onCopyFormMetaData(form: RoundPlan): void {
    if (!form.id) {
      return;
    }
    this.operatorRoundsService.copyRoundPlan$(form.id).subscribe((round) => {
      this.addEditCopyForm$.next({
        action: 'copy',
        form: round
      });
    });
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getForms();
      })
    );

    const onScrollForms$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll' && this.infiniteScrollEnabled) {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as RoundPlan[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.forms$ = combineLatest([
      formsOnLoadSearch$,
      this.addEditCopyForm$,
      onScrollForms$,
      this.plantService.fetchLoggedInUserPlants$()
    ]).pipe(
      map(([rows, form, scrollData, plants]) => {
        plants.forEach((plant) => {
          this.plantsIdNameMap[`${plant.plantId} - ${plant.name}`] = plant.id;
        });
        for (const item of this.filterJson) {
          if (item.column === 'plant') {
            item.items = plants
              .map((plant) => `${plant.plantId} - ${plant.name}`)
              .sort();
          }
        }

        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 130px)'
          };
          initial.data = rows;
        } else {
          if (form.action === 'copy') {
            const obj = { ...form.form } as any;
            const oldIdx = initial?.data?.findIndex(
              (d) => d?.id === obj?.oldId
            );
            const newIdx = oldIdx !== -1 ? oldIdx : 0;
            initial.data.splice(newIdx, 0, {
              ...obj,
              publishedDate: '',
              preTextImage: {
                image: obj.formLogo,
                style: {
                  width: '40px',
                  height: '40px',
                  marginRight: '10px'
                },
                condition: true
              },
              plant: this.plantsObject[obj.plantId]
            });
            form.action = 'add';
            this.triggerCountUpdate = true;
            this.formsListCountUpdate$.next(1);
            this.toast.show({
              text: 'Round Plan copied successfully!',
              type: 'success'
            });
          }
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            form.action = 'add';
            this.toast.show({
              text: 'Round Plan archived successfully!',
              type: 'success'
            });
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

  getForms() {
    return this.operatorRoundsService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        'All',
        false,
        this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          // if next token turns null from not null, that means all records have been fetched with the given limit.
          if (next === null && this.nextToken !== null) {
            this.infiniteScrollEnabled = false;
          }
          if (count !== undefined) {
            this.formsListCountRaw$.next(count);
          }
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) => {
          const rows = data.map((item) => {
            if (item.plantId) {
              if (item.plant) {
                item = {
                  ...item,
                  plant: `${item.plant?.plantId} - ${item.plant?.name}`
                };
              } else {
                item = {
                  ...item,
                  plant: ``
                };
              }
            } else {
              // remove if condition after clearing data since plant will be mandatory
              item = {
                ...item,
                plant: ``
              };
            }
            return item;
          });
          return rows;
        })
      );
  }

  openArchiveModal(form: any): void {
    this.operatorRoundsService
      .updateForm$({
        formMetadata: {
          id: form?.id,
          isArchived: true,
          name: form?.name,
          plantId: form?.plantId,
          description: form?.description,
          isArchivedAt: new Date().toISOString()
        },
        // eslint-disable-next-line no-underscore-dangle
        formListDynamoDBVersion: form._version
      })
      .subscribe(() => {
        this.addEditCopyForm$.next({
          action: 'delete',
          form
        });
        this.triggerCountUpdate = true;
        this.formsListCountUpdate$.next(-1);
      });
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'copy':
        this.onCopyFormMetaData(data);
        break;

      case 'edit':
        this.router.navigate(['/operator-rounds/edit', data.id]);
        break;

      case 'archive':
        this.openArchiveModal(data);
        break;
      default:
    }
  };

  handleTableEvent = (event): void => {
    this.operatorRoundsService.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(permissions, 'UPDATE_OR_PLAN')
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }
    if (this.loginService.checkUserHasPermission(permissions, 'COPY_OR_PLAN')) {
      menuActions.push({
        title: 'Copy',
        action: 'copy'
      });
    }
    if (
      this.loginService.checkUserHasPermission(permissions, 'ARCHIVE_OR_PLAN')
    ) {
      menuActions.push({
        title: 'Archive',
        action: 'archive'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
  }
  roundPlanDetailActionHandler(event) {
    this.router.navigate([`/operator-rounds/edit/${this.selectedForm.id}`]);
  }

  getAllOperatorRounds() {
    this.operatorRoundsService
      .fetchAllOperatorRounds$({
        plantId: this.plantService.getUserPlantIds()
      })
      .subscribe((formsList: any) => {
        const objectKeys = Object.keys(formsList);
        if (objectKeys.length > 0) {
          this.lastPublishedBy = formsList.rows
            .map((item) => item.lastPublishedBy)
            .filter((value, index, self) => {
              if (value !== null && value !== undefined) {
                const hasDifferentCasingDuplicate = self
                  .slice(0, index)
                  .some(
                    (item) =>
                      item !== null &&
                      item !== undefined &&
                      item.toLowerCase() === value.toLowerCase()
                  );

                return !hasDifferentCasingDuplicate;
              }
              return false;
            })
            .sort();

          this.lastModifiedBy = formsList.rows
            .map((item) => {
              if (item.lastModifiedBy) {
                return item.lastModifiedBy;
              }
              return '';
            })
            .filter((value) => value)
            .filter((value, index, self) => self.indexOf(value) === index);

          this.createdBy = formsList.rows
            .map((item) => item.author)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort();
          for (const item of this.filterJson) {
            if (item.column === 'status') {
              item.items = this.status;
            } else if (item.column === 'publishedBy') {
              item.items = this.lastPublishedBy;
            } else if (item.column === 'authoredBy') {
              item.items = this.authoredBy;
            } else if (item.column === 'createdBy') {
              item.items = this.createdBy;
            }
          }
        }
      });
  }

  getFilter() {
    this.operatorRoundsService.getFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  applyFilter(data: any) {
    for (const item of data) {
      if (item.type === 'daterange') {
        this.filter.scheduleStartDate = item.value[0];
        this.filter.scheduleEndDate = item.value[1];
      } else if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value] ?? '';
      } else {
        this.filter[item.column] = item.value;
      }
    }
    if (!this.filter.plant) {
      this.filter.plant = this.plantService.getUserPlantIds();
    }
    this.nextToken = '';
    this.isLoading$.next(true);
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
  }

  openRoundPlanCreationModal() {
    const dialogRef = this.dialog.open(RoundPlanModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      const data = result === undefined ? {} : result;
      if (Object.keys(data).length !== 0) {
        this.isLoading$.next(true);
        this.operatorRoundsService.fetchForms$.next({ data: 'search' });
        this.formsListCountUpdate$.next(1);
      }
    });
  }

  resetFilter() {
    this.filter = {
      status: '',
      createdBy: '',
      lastModifiedOn: '',
      scheduleStartDate: '',
      scheduleEndDate: '',
      plant: this.plantService.getUserPlantIds(),
      publishedBy: ''
    };
    this.nextToken = '';
    this.isLoading$.next(true);
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showFormDetail(row: RoundPlan): void {
    this.selectedForm = row;
    this.menuState = 'in';
  }
}
