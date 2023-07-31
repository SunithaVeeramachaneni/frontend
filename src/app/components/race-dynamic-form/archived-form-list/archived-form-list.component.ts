/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
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
  UserInfo,
  Permission
} from 'src/app/interfaces';

import {
  formConfigurationStatus,
  graphQLDefaultLimit,
  routingUrls
} from 'src/app/app.constants';

import { RaceDynamicFormService } from '../services/rdf.service';
import { ToastService } from 'src/app/shared/toast';
import { MatDialog } from '@angular/material/dialog';
import { ArchivedDeleteModalComponent } from '../archived-delete-modal/archived-delete-modal.component';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { LoginService } from '../../login/services/login.service';

interface FormTableUpdate {
  action: 'restore' | 'delete' | null;
  form: any;
}

@Component({
  selector: 'app-archived-form-list',
  templateUrl: './archived-form-list.component.html',
  styleUrls: ['./archived-form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedFormListComponent implements OnInit, OnDestroy {
  partialColumns: Partial<Column>[] = [
    {
      id: 'name',
      displayName: 'Recents',
      type: 'string',
      controlType: 'string',
      visible: true,
      titleStyle: {
        'font-weight': '500',
        'font-size': '90%',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
      sortable: true,
      visible: true,
      titleStyle: { color: '' }
    },
    {
      id: 'isArchivedAt',
      displayName: 'Archived On',
      type: 'timeAgo',
      controlType: 'string',
      isMultiValued: true,
      sortable: true,
      visible: true,
      titleStyle: { color: '' }
    },
    {
      id: 'publishedDate',
      displayName: 'Last Published',
      type: 'timeAgo',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    }
  ];
  columns: Column[] = [];
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
      form: {} as any
    });
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  isPopoverOpen = false;
  filterJson = [];
  filter = {
    plant: ''
  };
  plants = [];
  plantsIdNameMap = {};
  triggerCountUpdate = false;
  readonly routingUrls = routingUrls;
  currentRouteUrl$: Observable<string>;
  userInfo$: Observable<UserInfo>;
  private onDestroy$ = new Subject();

  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly toast: ToastService,
    private readonly loginService: LoginService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.columns = this.raceDynamicFormService.updateConfigOptionsFromColumns(
      this.partialColumns
    );
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => {
        this.headerService.setHeaderTitle(routingUrls.archivedForms.title);
      })
    );
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value: string) => {
          this.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.getFilters();
    this.getAllArchivedForms();
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
            initial.data = initial.data.filter(
              (d) => d.id !== form.data.updateFormList.id
            );
            this.triggerCountUpdate = true;
            this.archivedFormsListCountUpdate$.next(-1);
            this.toast.show({
              text:
                'Form "' +
                form.data.updateFormList.name +
                '" restore successfully!',
              type: 'success'
            });
            action = null;
          }
          if (action === 'delete') {
            initial.data = initial.data.filter(
              (d) => d.id !== form.data.updateFormList.id
            );
            this.triggerCountUpdate = true;
            this.archivedFormsListCountUpdate$.next(-1);
            this.toast.show({
              text:
                'Form "' +
                form.data.updateFormList.name +
                '" delete successfully!',
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
    return this.raceDynamicFormService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        true,
        this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.nextToken = next;
          if (count !== undefined) {
            this.archivedFormsListCountRaw$.next(count);
          }
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.archivedFormsListCount$ = of(0);
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) =>
          data.map((item) => {
            this.raceDynamicFormService
              .getEmbeddedFormId$(item.id)
              .subscribe((data1) => {
                let embeddedFormId;
                if (data1) {
                  embeddedFormId = data1?.embeddedFormId;
                } else {
                  embeddedFormId = '';
                }
                item.embeddedFormId = embeddedFormId;
              });
            if (item.plantId) {
              item = {
                ...item,
                plant: item.plant
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
        'RESTORE_ARCHIVED_FORM'
      )
    ) {
      menuActions.push({
        title: 'Restore',
        action: 'restore'
      });
    }
    if (this.loginService.checkUserHasPermission(permissions, 'DELETE_FORM')) {
      menuActions.push({
        title: 'Delete',
        action: 'delete'
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

  getFilters() {
    this.raceDynamicFormService.getArchivedFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  getAllArchivedForms() {
    this.raceDynamicFormService
      .fetchAllArchivedForms$()
      .pipe(
        tap((formsList) => {
          const objectKeys = Object.keys(formsList);
          if (objectKeys.length > 0) {
            const uniquePlants = formsList.rows
              .map((item) => {
                if (item.plantId) {
                  this.plantsIdNameMap[item.plant] = item.plantId;
                  return item.plant;
                }
                return '';
              })
              .filter((value, index, self) => self.indexOf(value) === index);
            this.plants = [...uniquePlants];

            for (const item of this.filterJson) {
              if (item.column === 'plant') {
                item.items = this.plants;
              }
            }
          }
        })
      )
      .subscribe();
  }

  applyFilter(data: any) {
    for (const item of data) {
      if (item.column === 'plant') {
        this.filter[item.column] = this.plantsIdNameMap[item.value];
      } else {
        this.filter[item.column] = item.value;
      }
    }
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }

  resetFilter() {
    this.filter = {
      plant: ''
    };
    this.nextToken = '';
    this.fetchForms$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  deleteFormFromDynamo$(form) {
    return this.raceDynamicFormService.updateForm$({
      formMetadata: {
        id: form?.id,
        name: form?.name,
        description: form?.description,
        isDeleted: true
      },
      // eslint-disable-next-line no-underscore-dangle
      formListDynamoDBVersion: form._version
    });
  }

  private onRestoreForm(form: any): void {
    this.raceDynamicFormService
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
      .subscribe((updatedForm) => {
        this.restoreDeleteForm$.next({
          action: 'restore',
          form: updatedForm
        });
      });
  }

  private onDeleteForm(form: any): void {
    const deleteReportRef = this.dialog.open(ArchivedDeleteModalComponent, {
      data: form
    });

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        const { formType } = form;
        if (formType !== formConfigurationStatus.embedded) {
          this.deleteFormFromDynamo$(form).subscribe((updatedForm) => {
            this.restoreDeleteForm$.next({
              action: 'delete',
              form: updatedForm
            });
            this.raceDynamicFormService
              .deleteTemplateReferenceByFormId$(form.id)
              .subscribe();
          });
        } else {
          of(form)
            .pipe(
              mergeMap(({ formStatus }) => {
                if (formStatus === formConfigurationStatus.draft) {
                  return this.deleteFormFromDynamo$(form);
                } else {
                  return this.raceDynamicFormService
                    .deactivateAbapForm$(form)
                    .pipe(
                      mergeMap((response) => {
                        if (response === null) {
                          return this.deleteFormFromDynamo$(form);
                        }
                        return of({});
                      })
                    );
                }
              })
            )
            .subscribe((updatedForm) => {
              this.restoreDeleteForm$.next({
                action: 'delete',
                form: updatedForm
              });
            });
        }
      }
    });
  }
}
