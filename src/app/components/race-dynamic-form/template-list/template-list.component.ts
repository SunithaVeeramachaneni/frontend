import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  combineLatest,
  of
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { updateCreateOrEditForm } from 'src/app/forms/state/builder/builder.actions';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import {
  CellClickActionEvent,
  LoadEvent,
  Permission,
  SearchEvent,
  TableEvent,
  UserInfo
} from 'src/app/interfaces';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { UsersService } from '../../user-management/services/users.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  formConfigurationStatus,
  metadataFlatModuleNames,
  permissions as perms
} from 'src/app/app.constants';
import { generateCopyNumber, generateCopyRegex } from '../utils/utils';
import { omit } from 'lodash-es';
import { LoginService } from '../../login/services/login.service';
import { ToastService } from 'src/app/shared/toast';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { ConfirmModalPopupComponent } from '../confirm-modal-popup/confirm-modal-popup/confirm-modal-popup.component';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class TemplateListComponent implements OnInit, OnDestroy {
  public menuState = 'out';
  public affectedFormDetailState = 'out';
  public affectedSliderState = 'out';
  public columnConfigMenuState = 'out';
  selectedForm: any = null;
  affectedFormDetail: any = null;
  selectedTemplate: any = null;
  submissionSlider = 'out';
  isPopoverOpen = false;
  filterJson: any[] = [];
  tags = new Set();
  templates$: Observable<any>;
  additionalDetailFilterData = {};
  fetchTemplates$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  partialColumns: Partial<Column>[] = [
    {
      id: 'name',
      displayName: 'Name',
      type: 'string',
      controlType: 'string',
      visible: true,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
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
      id: 'questionsCount',
      displayName: 'Questions',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    },
    {
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
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
      hasConditionalStyles: true
    },
    {
      id: 'formType',
      displayName: 'Template Type',
      type: 'string',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    },
    {
      id: 'displayFormsUsageCount',
      displayName: 'Used in Forms',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true,
      titleStyle: {
        color: '#3D5AFE'
      }
    },
    {
      id: 'lastPublishedBy',
      displayName: 'Modified By',
      type: 'number',
      controlType: 'string',
      sortable: true,
      visible: true,
      groupable: true
    },
    {
      id: 'author',
      displayName: 'Created By',
      type: 'number',
      controlType: 'string',
      isMultiValued: true,
      sortable: true,
      visible: true,
      titleStyle: { color: '' }
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
    tableHeight: 'calc(100vh - 135px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FFCC00',
        color: '#000000'
      },
      ready: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      }
    }
  };
  filter: any = {
    formStatus: '',
    lastPublishedBy: '',
    author: ''
  };
  dataSource: MatTableDataSource<any>;
  allTemplates: any = [];
  displayedTemplates: any[];
  templatesCount$: Observable<number>;
  searchTemplates: FormControl;
  ghostLoading = new Array(12).fill(0).map((_, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  lastPublishedBy = [];
  createdBy = [];
  readonly perms = perms;
  userInfo$: Observable<UserInfo>;
  searchTerm: string = '';
  RDF_TEMPLATE_MODULE_NAME = metadataFlatModuleNames.RDF_TEMPLATES;
  private onDestroy$ = new Subject();

  constructor(
    private readonly toast: ToastService,
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly loginService: LoginService,
    private usersService: UsersService,
    private headerService: HeaderService,
    private translateService: TranslateService,
    private columnConfigService: ColumnConfigurationService,
    private router: Router,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.fetchTemplates$.next({ data: 'load' });
    this.getDisplayedTemplates();
    this.populateFilter();
    this.searchTemplates = new FormControl('');
    this.headerService.setHeaderTitle(
      this.translateService.instant('templates')
    );
    this.searchTemplates.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((searchTerm) => {
          this.searchTerm = searchTerm;
          this.fetchTemplates$.next({ data: 'search' });
        })
      )
      .subscribe();

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );
    this.columnConfigService.moduleColumnConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res) {
          this.columns = res[this.RDF_TEMPLATE_MODULE_NAME] || [];
          this.configOptions.allColumns = this.columns;
          this.cdrf.detectChanges();
        }
        this.allTemplates?.map((item) => {
          item =
            this.raceDynamicFormService.extractAdditionalDetailsToColumns(item);
          item = this.raceDynamicFormService.handleEmptyColumns(
            item,
            this.columns
          );
          return item;
        });
        let reloadData = false;
        Object.values(this.filter).forEach((value) => {
          if (value) {
            reloadData = true;
          }
        });
        if (reloadData) this.resetFilter();
        this.dataSource = new MatTableDataSource(this.allTemplates);
      });
    this.columnConfigService.moduleFilterConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.RDF_TEMPLATE_MODULE_NAME]) {
          this.filterJson = res[this.RDF_TEMPLATE_MODULE_NAME];
          this.setFilters();
          this.cdrf.detectChanges();
        }
      });
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
    this.affectedFormDetail = null;
    this.affectedFormDetailState = 'out';
  }

  onCloseAffectedSlider() {
    this.selectedTemplate = null;
    this.affectedSliderState = 'out';
  }
  onCloseColumnConfig() {
    this.columnConfigMenuState = 'out';
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'questionsCount':
      case 'formStatus':
      case 'formType':
      case 'lastPublishedBy':
      case 'author':
        this.showFormDetail(row);
        break;
      case 'displayFormsUsageCount':
        this.showAffectedSlider(row);
        break;
      default:
    }
  };

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.router
          .navigate(['/forms/templates/edit', data.id], {
            state: {
              templateNamesList: this.allTemplates
            }
          })
          .then(() => {
            this.dialog.open(TemplateModalComponent, {
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%',
              panelClass: 'full-screen-modal',
              data: this.allTemplates,
              disableClose: true
            });
          });
        break;
      case 'copy':
        this.copyTemplate(data);
        break;
      case 'archive':
        this.onArchiveTemplate(data);
        break;
      default:
    }
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(permissions: Permission[]): void {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'UPDATE_FORM_TEMPLATE'
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
        'COPY_FORM_TEMPLATE'
      )
    ) {
      menuActions.push({
        title: 'Copy',
        action: 'copy'
      });
    }

    if (
      this.loginService.checkUserHasPermission(
        permissions,
        'ARCHIVE_FORM_TEMPLATE'
      )
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

  getDisplayedTemplates() {
    const templatesOnLoadSearch$ = this.fetchTemplates$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        return this.getTemplates();
      })
    );
    combineLatest(this.usersService.getUsersInfo$(), templatesOnLoadSearch$)
      .pipe(
        tap(([_, { count, rows, next }]) => {
          rows = rows.map((item) => {
            item =
              this.raceDynamicFormService.extractAdditionalDetailsToColumns(
                item
              );
            item = this.raceDynamicFormService.handleEmptyColumns(
              item,
              this.columns
            );
            const author = this.usersService.getUserFullName(item.author);
            const lastPublishedBy = this.usersService.getUserFullName(
              item.lastPublishedBy
            );
            const formsUsageCount =
              item.formsUsageCount === 0 ? '_ _' : item.formsUsageCount;
            return {
              ...item,
              author,
              displayFormsUsageCount: formsUsageCount,
              lastPublishedBy
            };
          });
          this.allTemplates = rows;
        })
      )
      .subscribe(([_, res]) => {
        this.configOptions = {
          ...this.configOptions,
          tableHeight: 'calc(100vh - 130px)'
        };
        this.templatesCount$ = of(res.rows.length);
        this.displayedTemplates = this.allTemplates;
        this.dataSource = new MatTableDataSource(this.allTemplates);
        this.isLoading$.next(false);
      });
  }
  getTemplates() {
    return this.raceDynamicFormService.fetchTemplates$({
      isArchived: 'false',
      isDeleted: 'false',
      searchTerm: this.searchTerm,
      ...this.filter
    });
  }

  populateFilter() {
    combineLatest([
      this.raceDynamicFormService.getDataSetsByType$('formTemplateHeaderTags'),
      this.columnConfigService.moduleAdditionalDetailsFiltersData$
    ]).subscribe(([allTags, additionalDetails]) => {
      this.additionalDetailFilterData = additionalDetails;
      this.lastPublishedBy = Array.from(
        new Set(
          this.allTemplates
            .map((item: any) => item.lastPublishedBy)
            .filter((item) => item != null && item !== '_ _')
        )
      ).sort();

      this.createdBy = Array.from(
        new Set(
          this.allTemplates
            .map((item: any) => item.author)
            .filter((item) => item != null)
        )
      ).sort();
      allTags[0]?.values?.forEach((tag) => {
        this.tags.add(tag);
      });
      this.setFilters();
    });
  }

  setFilters() {
    this.filterJson.forEach((item) => {
      if (item.column === 'lastPublishedBy') {
        item.items = this.lastPublishedBy;
      } else if (item.column === 'author') {
        item.items = this.createdBy;
      } else if (item.column === 'tags') {
        item.items = this.tags;
      } else if (!item?.items?.length) {
        item.items = this.additionalDetailFilterData[item.column]
          ? this.additionalDetailFilterData[item.column]
          : [];
      }
    });
  }

  applyFilter(data: any) {
    for (const item of data) {
      if (item.column === 'author' || item.column === 'lastPublishedBy') {
        this.filter[item.column] = Array.isArray(item.value)
          ? item?.value?.reduce((acc, curr) => {
              acc.push(this.usersService.getUserEmailByFullName(curr));
              return acc;
            }, [])
          : [];
      } else {
        this.filter[item.column] = item.value;
      }
    }
    this.isLoading$.next(true);
    this.fetchTemplates$.next({ data: 'load' });
  }

  resetFilter() {
    this.filter = {
      formStatus: '',
      lastPublishedBy: '',
      author: ''
    };
    this.fetchTemplates$.next({ data: 'load' });
  }

  copyTemplate(template) {
    if (!template.id) return;
    this.raceDynamicFormService
      .fetchAllTemplateListNames$()
      .subscribe((templateNames) => {
        const createdTemplate = this.generateCopyTemplateName(
          template,
          templateNames
        );
        if (createdTemplate?.newName) {
          const authoredFormTemplateDetails =
            template.authoredFormTemplateDetails[0];
          const preTextImage = template.preTextImage;
          this.raceDynamicFormService
            .createTemplate$({
              ...omit(template, [
                'id',
                'preTextImage',
                'authoredFormTemplateDetails',
                'publishedDate'
              ]),
              name: createdTemplate.newName,
              formStatus: formConfigurationStatus.draft,
              additionalDetails: JSON.parse(template.additionalDetails),
              isPublic: false
            })
            .subscribe((newTemplate) => {
              if (!newTemplate) return;
              if (
                authoredFormTemplateDetails &&
                Object.keys(authoredFormTemplateDetails).length
              ) {
                authoredFormTemplateDetails.formStatus =
                  formConfigurationStatus.draft;
                authoredFormTemplateDetails.pages = JSON.parse(
                  authoredFormTemplateDetails?.pages || '[]'
                );
                authoredFormTemplateDetails.counter =
                  authoredFormTemplateDetails?.counter || 0;
                this.raceDynamicFormService
                  .createAuthoredTemplateDetail$(
                    newTemplate.id,
                    authoredFormTemplateDetails
                  )
                  .subscribe();
              }
              authoredFormTemplateDetails.pages = JSON.stringify(
                authoredFormTemplateDetails.pages
              );
              newTemplate.authoredFormTemplateDetails = [
                authoredFormTemplateDetails
              ];
              newTemplate.formsUsageCount = 0;
              newTemplate.counter =
                newTemplate.authoredFormTemplateDetails[
                  newTemplate.authoredFormTemplateDetails.length - 1
                ]?.counter;
              newTemplate.questionsCount =
                JSON.parse(
                  newTemplate.authoredFormTemplateDetails[
                    newTemplate.authoredFormTemplateDetails.length - 1
                  ]?.pages || '{}'
                )[0]?.questions?.length || 0;
              newTemplate.formStatus = formConfigurationStatus.draft;
              newTemplate.formLogo = 'assets/rdf-forms-icons/formlogo.svg';
              newTemplate.preTextImage = preTextImage;
              if (newTemplate.author)
                newTemplate.author = this.usersService.getUserFullName(
                  newTemplate.author
                );
              if (newTemplate.lastPublishedBy)
                newTemplate.lastPublishedBy = this.usersService.getUserFullName(
                  newTemplate.lastPublishedBy
                );
              this.allTemplates = [newTemplate, ...this.allTemplates];
              this.allTemplates?.map((item) => {
                item =
                  this.raceDynamicFormService.extractAdditionalDetailsToColumns(
                    item
                  );
                item = this.raceDynamicFormService.handleEmptyColumns(
                  item,
                  this.columns
                );
                return item;
              });
              this.dataSource = new MatTableDataSource(this.allTemplates);
              this.cdrf.detectChanges();
              this.toast.show({
                text: 'Template "' + template.name + '" copied successfully!',
                type: 'success'
              });
            });
        }
      });
  }

  onArchiveTemplate(template) {
    let dialogRef;
    if (template.formsUsageCount === 0) {
      dialogRef = this.dialog.open(ConfirmModalPopupComponent, {
        maxWidth: 'max-content',
        maxHeight: 'max-content',
        data: {
          popupTexts: {
            primaryBtnText: 'yes',
            secondaryBtnText: 'no',
            title: 'archiveTemplateModalHeading1',
            subtitle: 'archiveTemplateModalSubHeading1'
          }
        }
      });
    } else {
      dialogRef = this.dialog.open(ConfirmModalPopupComponent, {
        maxWidth: 'max-content',
        maxHeight: 'max-content',
        data: {
          popupTexts: {
            primaryBtnText: 'okay',
            title: 'archiveTemplateModalHeading2',
            subtitle: 'archiveTemplateModalSubHeading2'
          }
        }
      });
    }
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'primary' && template.formsUsageCount === 0) {
        this.raceDynamicFormService
          .archiveDeleteTemplate$(template.id, {
            isArchived: true,
            archivedBy: this.loginService.getLoggedInEmail()
          })
          .subscribe(() => {
            this.allTemplates = this.allTemplates.filter(
              (item) => item.id !== template.id
            );
            this.dataSource = new MatTableDataSource(this.allTemplates);
            this.cdrf.detectChanges();
            this.toast.show({
              text: 'Template "' + template.name + '" archived successfully!',
              type: 'success'
            });
          });
      }
    });
  }

  openCreateTemplateModal(formType) {
    this.store.dispatch(
      updateCreateOrEditForm({
        createOrEditForm: true
      })
    );
    this.dialog.open(TemplateModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        data: this.allTemplates,
        formType
      }
    });
  }

  templateDetailActionHandler() {
    this.router
      .navigate(['/forms/templates/edit', this.selectedForm.id], {
        state: {
          templateNamesList: this.allTemplates
        }
      })
      .then(() => {
        this.openCreateTemplateModal(this.selectedForm.formType);
      });
  }
  affectedFormDetailActionHandler() {
    this.router.navigate(['/forms/edit', this.affectedFormDetail.id]);
  }

  onClickAffectedFormDetail(event) {
    this.affectedFormDetail = event;
    this.affectedFormDetailState = 'in';
  }

  showAffectedSlider(row: any): void {
    if (row.formsUsageCount > 0) {
      this.selectedTemplate = row;
      this.affectedSliderState = 'in';
      this.onCloseViewDetail();
    }
  }
  showColumnConfig(): void {
    this.columnConfigMenuState = 'in';
  }

  private showFormDetail(row: any): void {
    this.selectedForm = row;
    this.menuState = 'in';
    this.onCloseAffectedSlider();
  }

  private generateCopyTemplateName(template, rows) {
    if (rows?.length > 0) {
      const listCopyNumbers: number[] = [];
      const regex: RegExp = generateCopyRegex(template?.name);
      rows?.forEach((row) => {
        const matchObject = row?.name?.match(regex);
        if (matchObject) {
          listCopyNumbers.push(parseInt(matchObject[1], 10));
        }
      });
      const newIndex: number = generateCopyNumber(listCopyNumbers);
      const newName = `${template?.name} Copy(${newIndex})`;
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
