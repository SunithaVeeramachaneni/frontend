import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  combineLatest
} from 'rxjs';
import { graphQLDefaultMaxLimit } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  FormMetadata,
  LoadEvent,
  SearchEvent,
  TableEvent
} from 'src/app/interfaces';
import { ImportQuestionsModalComponent } from '../import-questions/import-questions-modal/import-questions-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RaceDynamicFormService } from '../services/rdf.service';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { metadataFlatModuleNames } from 'src/app/app.constants';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
import { UsersService } from '../../user-management/services/users.service';
@Component({
  selector: 'app-import-template-list',
  templateUrl: './import-template-list.component.html',
  styleUrls: ['./import-template-list.component.scss']
})
export class ImportTemplateListComponent implements OnInit, OnDestroy {
  searchTemplates: FormControl;
  selectedTemplate;
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  isLoading$ = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  allTemplates = [];
  isPopoverOpen = false;
  filterJson: any[] = [];
  tags = new Set();
  additionalDetailFilterData = {};
  lastPublishedBy = [];
  createdBy = [];
  searchTerm: string = '';
  fetchTemplates$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  RDF_TEMPLATE_MODULE_NAME = metadataFlatModuleNames.RDF_TEMPLATES;
  filter: any = {
    formStatus: '',
    lastPublishedBy: '',
    author: ''
  };
  columns: Column[];
  additionalColumns: columnConfiguration[] = [];
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

  dataSource: MatTableDataSource<any>;
  private onDestroy$ = new Subject();
  displayedTemplates: any[];

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private raceDynamicFormService: RaceDynamicFormService,
    private columnConfigService: ColumnConfigurationService,
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.fetchTemplates$.next({ data: 'load' });
    this.getDisplayedTemplates();
    this.populateFilter();
    this.searchTemplates = new FormControl('');
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
          this.filterJson = res[this.RDF_TEMPLATE_MODULE_NAME]?.filter(
            (item) => item.column !== 'formType' && item.column !== 'formStatus'
          );
          this.setFilters();
          this.cdrf.detectChanges();
        }
      });
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
            item.tags = item.tags.toString();
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
      ...this.filter,
      formStatus: 'Ready',
      formType: this.data.isEmbeddedForm ? 'Embedded' : 'Standalone'
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

  selectListItem(template) {
    this.data.selectedFormId = template.id;
    this.data.selectedFormName = template.name;
    this.data.selectedFormData = template;
    this.data.openImportTemplateQuestionsSlider = true;
    this.data.allTemplates = this.allTemplates;
    this.dialogRef.close(this.data);
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'counter':
        this.selectListItem(row);
        break;
      default:
    }
  };

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
