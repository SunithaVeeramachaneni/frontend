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
  Count,
  TableEvent,
  FormTableUpdate,
  Permission,
  UserInfo
} from 'src/app/interfaces';
import {
  graphQLDefaultLimit,
  formConfigurationStatus,
  permissions as perms
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Router } from '@angular/router';
import { omit } from 'lodash-es';
import { generateCopyNumber, generateCopyRegex } from '../utils/utils';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { slideInOut } from 'src/app/animations';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { CreateFromTemplateModalComponent } from '../create-from-template-modal/create-from-template-modal.component';
import { FormConfigurationModalComponent } from '../form-configuration-modal/form-configuration-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class FormListComponent implements OnInit, OnDestroy {
  public menuState = 'out';
  submissionSlider = 'out';
  isPopoverOpen = false;
  status: any[] = ['Draft', 'Published'];
  filterJson: any[] = [];
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Name',
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
        display: 'block',
        'white-space': 'wrap',
        'max-width': '350px',
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
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      published: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      }
    }
  };
  filter: any = {
    status: '',
    modifiedBy: '',
    authoredBy: '',
    lastModifiedOn: '',
    plant: ''
  };
  dataSource: MatTableDataSource<any>;
  forms$: Observable<any>;
  formsCount$: Observable<Count>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as GetFormList
    });
  formCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  addCopyFormCount = false;
  formsListCount$: Observable<number>;
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  selectedForm: GetFormList = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  formsList$: Observable<any>;
  lastPublishedBy = [];
  lastPublishedOn = [];
  authoredBy = [];
  plantsIdNameMap = {};
  plants = [];
  createdBy = [];
  userInfo$: Observable<UserInfo>;
  readonly perms = perms;
  private onDestroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private router: Router,
    private readonly store: Store<State>,
    private dialog: MatDialog,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
    this.raceDynamicFormService.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.getFilter();
    this.formsListCount$ = this.raceDynamicFormService.getFormsListCount$();

    this.getAllForms();
    this.getDisplayedForms();

    this.formsCount$ = combineLatest([
      this.formsCount$,
      this.formCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addCopyFormCount) {
          count.count += update;
          this.addCopyFormCount = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'author':
      case 'formStatus':
      case 'lastPublishedBy':
      case 'publishedDate':
      case 'responses':
        this.showFormDetail(row);
        break;
      default:
    }
  };

  onCopyFormMetaData(form: GetFormList): void {
    if (!form.id) {
      return;
    }
    combineLatest([
      this.raceDynamicFormService.fetchAllFormListNames$(),
      this.raceDynamicFormService.getAuthoredFormDetailByFormId$(form.id)
    ])
      .pipe(
        map(([formNames, authoredFormDetail]) => ({
          formNames,
          authoredFormDetail
        }))
      )
      .subscribe(({ formNames, authoredFormDetail }) => {
        const createdForm = this.generateCopyFormName(form, formNames);
        if (createdForm?.newName) {
          this.raceDynamicFormService
            .createForm$({
              ...omit(form, ['id', 'preTextImage']),
              name: createdForm.newName,
              formStatus: formConfigurationStatus.draft,
              isPublic: false
            })
            .subscribe((newRecord) => {
              if (!newRecord) {
                return;
              }
              if (
                authoredFormDetail &&
                Object.keys(authoredFormDetail).length
              ) {
                this.raceDynamicFormService
                  .createAuthoredFormDetail$({
                    formStatus: authoredFormDetail?.formStatus,
                    formDetailPublishStatus: 'Draft',
                    formListId: newRecord?.id,
                    pages: JSON.parse(authoredFormDetail?.pages) ?? '',
                    counter: authoredFormDetail?.counter,
                    authoredFormDetailVersion: 1
                  })
                  .subscribe(() => (newRecord.publishedDate = ''));
              }
              newRecord.publishedDate = '';
              this.addEditCopyForm$.next({
                action: 'copy',
                form: {
                  ...newRecord,
                  name: createdForm.newName,
                  preTextImage: (form as any)?.preTextImage,
                  oldId: form.id
                } as any
              });
              this.formsListCount$ =
                this.raceDynamicFormService.getFormsListCount$();
            });
        }
      });
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getForms();
      })
    );

    const onScrollForms$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as GetFormList[]);
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
      onScrollForms$
    ]).pipe(
      map(([rows, form, scrollData]) => {
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
            initial.data.splice(newIdx, 0, obj);
            form.action = 'add';
            this.toast.show({
              text: 'Form copied successfully!',
              type: 'success'
            });
          }
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            form.action = 'add';
            this.toast.show({
              text: 'Form "' + form.form.name + '" archive successfully!',
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
    return this.raceDynamicFormService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        false,
        this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.formsCount$ = of({ count });
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        }),
        map((data) =>
          data.map((item) => {
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

  openArchiveModal(form: GetFormList): void {
    this.raceDynamicFormService
      .updateForm$({
        formMetadata: {
          id: form?.id,
          isArchived: true,
          name: form?.name,
          description: form?.description,
          isArchivedAt: new Date().toISOString()
        },
        // eslint-disable-next-line no-underscore-dangle
        formListDynamoDBVersion: form._version
      })
      .subscribe((updatedForm) => {
        this.addEditCopyForm$.next({
          action: 'delete',
          form
        });
        this.formsListCount$ = this.raceDynamicFormService.getFormsListCount$();
      });
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'copy':
        this.onCopyFormMetaData(data);
        break;

      case 'edit':
        this.router.navigate(['/forms/edit', data.id]);
        break;

      case 'archive':
        this.openArchiveModal(data);
        break;
      default:
    }
  };

  handleTableEvent = (event): void => {
    this.raceDynamicFormService.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];

    if (this.loginService.checkUserHasPermission(permissions, 'UPDATE_FORM')) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }
    if (this.loginService.checkUserHasPermission(permissions, 'COPY_FORM')) {
      menuActions.push({
        title: 'Copy',
        action: 'copy'
      });
    }
    if (this.loginService.checkUserHasPermission(permissions, 'ARCHIVE_FORM')) {
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
    this.store.dispatch(FormConfigurationActions.resetPages());
  }
  formDetailActionHandler(event) {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/forms/edit/${this.selectedForm.id}`]);
  }

  getAllForms() {
    this.formsList$ = this.raceDynamicFormService.fetchAllForms$();
    this.formsList$
      .pipe(
        tap((formsList) => {
          const objectKeys = Object.keys(formsList);
          if (objectKeys.length > 0) {
            const uniqueLastPublishedBy = formsList.rows
              .map((item) => item.lastPublishedBy)
              .filter((value, index, self) => self.indexOf(value) === index);
            this.lastPublishedBy = [...uniqueLastPublishedBy];

            const uniqueCreatedBy = formsList.rows
              .map((item) => item.author)
              .filter((value, index, self) => self.indexOf(value) === index);
            this.createdBy = [...uniqueCreatedBy];

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
              if (item.column === 'status') {
                item.items = this.status;
              } else if (item.column === 'modifiedBy') {
                item.items = this.lastPublishedBy;
              } else if (item.column === 'authoredBy') {
                item.items = this.authoredBy;
              } else if (item.column === 'plant') {
                item.items = this.plants;
              } else if (item.column === 'createdBy') {
                item.items = this.createdBy;
              }
            }
          }
        })
      )
      .subscribe();
  }

  getFilter() {
    this.raceDynamicFormService.getFilter().subscribe((res) => {
      this.filterJson = res;
    });
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
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
  }

  openCreateFromTemplateModal() {
    const dialogRef = this.dialog.open(CreateFromTemplateModalComponent, {});
    dialogRef.afterClosed().subscribe((data) => {
      if (data.selectedTemplate) {
        this.openFormCreationModal(data.selectedTemplate);
      }
    });
  }

  openFormCreationModal(data: any) {
    this.dialog.open(FormConfigurationModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data
    });
  }

  resetFilter() {
    this.filter = {
      status: '',
      modifiedBy: '',
      authoredBy: '',
      lastModifiedOn: '',
      plant: ''
    };
    this.nextToken = '';
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private showFormDetail(row: GetFormList): void {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.selectedForm = row;
    this.menuState = 'in';
  }

  private generateCopyFormName(form: GetFormList, rows: GetFormList[]) {
    if (rows?.length > 0) {
      const listCopyNumbers: number[] = [];
      const regex: RegExp = generateCopyRegex(form?.name);
      rows?.forEach((row) => {
        const matchObject = row?.name?.match(regex);
        if (matchObject) {
          listCopyNumbers.push(parseInt(matchObject[1], 10));
        }
      });
      const newIndex: number = generateCopyNumber(listCopyNumbers);
      const newName = `${form?.name} Copy(${newIndex})`;
      return {
        newName
      };
    }
    return null;
  }
}
