import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  Permission,
  UserInfo
} from 'src/app/interfaces';
import {
  formConfigurationStatus,
  permissions as perms,
  graphQLDefaultLimit,
  graphQLDefaultFilterLimit
} from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Router } from '@angular/router';
import { cloneDeep, omit } from 'lodash-es';
import { generateCopyNumber, generateCopyRegex } from '../utils/utils';
import { slideInOut } from 'src/app/animations';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../login/services/login.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UsersService } from '../../user-management/services/users.service';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { UploadResponseModalComponent } from '../../../shared/components/upload-response-modal/upload-response-modal.component';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { metadataFlatModuleNames } from '../../../app.constants';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class FormListComponent implements OnInit, OnDestroy {
  public menuState = 'out';
  public columnConfigMenuState = 'out';
  submissionSlider = 'out';
  isPopoverOpen = false;
  filterJson: any[] = [];

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
  filter: any = {
    formStatus: '',
    author: '',
    lastPublishedBy: '',
    plant: '',
    tags: ''
  };
  dataSource: MatTableDataSource<any>;
  forms$: Observable<any>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as GetFormList
    });
  skip = 0;
  limit = graphQLDefaultLimit;
  tags = new Set();
  searchForm: FormControl;
  addCopyFormCount = false;
  formsListCount$: Observable<number>;
  formsListCountRaw$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  formsListCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  includeAttachments = false;
  selectedForm: GetFormList = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  formsList$: Observable<any>;
  allForms = [];
  lastPublishedBy = [];
  lastPublishedOn = [];
  lastModifiedBy = [];
  authoredBy = [];
  plantsIdNameMap = {};
  plants = [];
  createdBy = [];
  additionalDetailFilterData = {};
  userInfo$: Observable<UserInfo>;
  triggerCountUpdate = false;
  rdfModuleName = metadataFlatModuleNames.RACE_DYNAMIC_FORMS;
  quickResponses = [];
  placeholder = '_ _';
  readonly perms = perms;
  private onDestroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private columnConfigService: ColumnConfigurationService,
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
    private usersService: UsersService,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef
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
        tap((value: string) => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));

    this.getDisplayedForms();
    this.raceDynamicFormService
      .getDataSetsByType$('quickResponses')
      .subscribe((responses) => {
        this.quickResponses = responses;
      });

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
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
    this.columnConfigService.moduleColumnConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.rdfModuleName]) {
          this.columns = res[this.rdfModuleName];
          this.configOptions.allColumns = this.columns;
          this.allForms?.forEach((item) => {
            item =
              this.raceDynamicFormService.extractAdditionalDetailsToColumns(
                item
              );
            item = this.raceDynamicFormService.handleEmptyColumns(
              item,
              this.columns
            );
          });
          this.dataSource = new MatTableDataSource(this.allForms);
          let reloadData = false;
          Object.values(this.filter).forEach((value) => {
            if (value) {
              reloadData = true;
            }
          });
          if (reloadData) this.resetFilter();
          this.cdrf.detectChanges();
        }
      });
    this.columnConfigService.moduleFilterConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.rdfModuleName]) {
          this.filterJson = res[this.rdfModuleName];
          this.setFilters();
          this.cdrf.detectChanges();
        }
      });
    this.populateFilter();
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

  onCopyFormMetaData(form: GetFormList): void {
    if (!form.id) {
      return;
    }
    combineLatest([
      this.raceDynamicFormService.fetchAllFormListNames$(form.name),
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
              additionalDetails: JSON.parse(form.additionalDetails),
              instructions: JSON.parse(form.instructions),
              isPublic: false
            })
            .subscribe((newRecord) => {
              if (!newRecord) {
                return;
              }
              if (
                authoredFormDetail &&
                Object.keys(authoredFormDetail)?.length
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
                  .subscribe(() => {
                    newRecord.publishedDate = '';
                    this.raceDynamicFormService
                      .copyTemplateReferenceByFormId$({
                        oldFormId: form.id,
                        newFormId: newRecord.id
                      })
                      .subscribe();
                  });

                this.createQuickResponsesOnCopyForm$(form.id, newRecord.id);
              }
              newRecord.publishedDate = '';
              this.addEditCopyForm$.next({
                action: 'copy',
                form: {
                  ...newRecord,
                  name: createdForm.newName,
                  preTextImage: (form as any)?.preTextImage,
                  oldId: form.id,
                  plant: Object.keys(this.plantsIdNameMap).find(
                    (key) => this.plantsIdNameMap[key] === newRecord.plantId
                  )
                } as any
              });
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
            this.triggerCountUpdate = true;
            this.formsListCountUpdate$.next(1);
            this.toast.show({
              text: 'Form copied successfully!',
              type: 'success'
            });
          }
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            form.action = 'add';
            this.triggerCountUpdate = true;
            this.formsListCountUpdate$.next(-1);
            this.toast.show({
              text: 'Form "' + form.form.name + '" archived successfully!',
              type: 'success'
            });
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }
        this.allForms = initial.data;
        this.allForms?.forEach((item) => {
          item.tags = item.tags?.toString();
          item =
            this.raceDynamicFormService.extractAdditionalDetailsToColumns(item);
          item = this.raceDynamicFormService.handleEmptyColumns(
            item,
            this.columns
          );
        });
        this.dataSource = new MatTableDataSource(this.allForms);
        this.skip = this.allForms.length;
        return initial;
      })
    );
  }

  getForms() {
    const columnConfigFilter = cloneDeep(this.filter);
    delete columnConfigFilter.plant;
    delete columnConfigFilter.tags;
    delete columnConfigFilter.lastPublishedBy;
    delete columnConfigFilter.author;
    delete columnConfigFilter.formStatus;

    const hasColumnConfigFilter = Object.keys(columnConfigFilter)?.length || 0;

    return this.raceDynamicFormService
      .getFormsList$(
        {
          next: this.nextToken,
          limit: hasColumnConfigFilter ? graphQLDefaultFilterLimit : this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        false,
        this.filter
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
          if (count !== undefined) {
            this.formsListCountRaw$.next(count);
          }
          this.nextToken = next;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formsListCount$ = of(0);
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
      .subscribe(() => {
        this.addEditCopyForm$.next({
          action: 'delete',
          form
        });
      });
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'copy':
        this.onCopyFormMetaData({
          ...data,
          tags: data.tags !== this.placeholder ? data.tags.split(',') : []
        });
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
  }
  onCloseColumnConfig() {
    this.columnConfigMenuState = 'out';
  }
  formDetailActionHandler() {
    this.router.navigate([`/forms/edit/${this.selectedForm.id}`]);
  }

  populateFilter() {
    combineLatest([
      this.usersService.getUsersInfo$(),
      this.plantService.fetchAllPlants$(),
      this.raceDynamicFormService.fetchAllFormsList$(),
      this.raceDynamicFormService.getDataSetsByType$('formHeaderTags'),
      this.columnConfigService.moduleAdditionalDetailsFiltersData$
    ]).subscribe(
      ([
        usersList,
        { items: plantsList },
        formsList,
        allTags,
        additionDetailsData
      ]) => {
        this.createdBy = usersList
          .map((user) => `${user.firstName} ${user.lastName}`)
          .sort();
        this.lastModifiedBy = usersList.map(
          (user) => `${user.firstName} ${user.lastName}`
        );
        this.plants = plantsList
          .map((plant) => {
            this.plantsIdNameMap[`${plant.plantId} - ${plant.name}`] = plant.id;
            return `${plant.plantId} - ${plant.name}`;
          })
          .sort();

        this.lastPublishedBy = formsList.rows
          .map((item) => item.lastPublishedBy)
          .filter(
            (value, index, self) => self.indexOf(value) === index && value
          )
          .sort();
        allTags[0]?.values?.forEach((tag) => {
          this.tags.add(tag);
        });
        this.additionalDetailFilterData = additionDetailsData;
        this.setFilters();
      }
    );
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
    this.isLoading$.next(true);
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
  }

  openFormCreationModal(data: any, formType) {
    const dialogRef = this.dialog.open(FormModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        formData: data,
        formType,
        type: 'add'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      const formData = result.data === undefined ? {} : result;
      if (Object.keys(formData.data)?.length !== 0) {
        this.isLoading$.next(true);
        this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        this.formsListCountUpdate$.next(1);
      }
    });
  }
  setFilters() {
    for (const item of this.filterJson) {
      switch (item.column) {
        case 'lastPublishedBy':
          item.items = this.lastPublishedBy;
          break;
        case 'plant':
          item.items = this.plants;
          break;
        case 'author':
          item.items = this.createdBy;
          break;
        case 'tags':
          item.items = this.tags;
          break;
        default:
          if (!item?.items?.length) {
            item.items = this.additionalDetailFilterData[item.column]
              ? this.additionalDetailFilterData[item.column]
              : [];
          }
          break;
      }
    }
  }
  resetFilter() {
    this.filter = {
      status: '',
      authoredBy: '',
      lastModifiedOn: '',
      plant: '',
      publishedBy: ''
    };
    this.nextToken = '';
    this.isLoading$.next(true);
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
  }

  downloadTemplate(formType): void {
    let fileName;
    if (formType === formConfigurationStatus.standalone) {
      fileName = 'Standalone_Form_Sample_Template';
    } else {
      fileName = 'Embedded_Form_Sample_Template';
    }

    this.raceDynamicFormService
      .downloadSampleFormTemplate(formType, {
        displayToast: true,
        failureResponse: {}
      })
      .pipe(tap((data) => downloadFile(data, fileName)))
      .subscribe(() => {
        this.toast.show({
          text: 'Template downloaded successfully!',
          type: 'success'
        });
      });
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  uploadFile(event, formType) {
    const file = event.target.files[0];
    const dialogRef = this.dialog.open(UploadResponseModalComponent, {
      data: {
        file,
        type: 'forms',
        formType
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res.data) {
        this.nextToken = '';
        this.isLoading$.next(true);
        this.formsListCountUpdate$.next(res.successCount);
        this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
        this.toast.show({
          text: 'Forms uploaded successfully!',
          type: 'success'
        });
      }
    });
  }

  createQuickResponsesOnCopyForm$(formId, copiedFormId) {
    const quickResponses = this.quickResponses
      .filter((response) => response?.formId === formId)
      .map((response) => {
        response.formId = copiedFormId;
        delete response.id;
        return response;
      });
    if (quickResponses?.length) {
      this.raceDynamicFormService
        .createDataSetMultiple$(quickResponses, {
          displayToast: true,
          failureResponse: []
        })
        .subscribe();
    }
  }

  private showFormDetail(row: GetFormList): void {
    this.selectedForm = row;
    this.menuState = 'in';
  }

  showColumnConfig(): void {
    this.columnConfigMenuState = 'in';
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
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
