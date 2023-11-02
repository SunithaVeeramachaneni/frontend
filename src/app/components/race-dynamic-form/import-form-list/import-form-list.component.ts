import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  CellClickActionEvent,
  FormMetadata,
  TableEvent
} from '../../../interfaces';

import {
  defaultLimit,
  graphQLDefaultFilterLimit,
  metadataFlatModuleNames
} from '../../../app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { getFormMetadata, State } from 'src/app/forms/state';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { ImportQuestionsModalComponent } from '../import-questions/import-questions-modal/import-questions-modal.component';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
import { UsersService } from '../../user-management/services/users.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { cloneDeep } from 'lodash-es';
@Component({
  selector: 'app-import-form-list',
  templateUrl: './import-form-list.component.html',
  styleUrls: ['./import-form-list.component.scss']
})
export class ImportFormListComponent implements OnInit, OnDestroy {
  searchForm: FormControl;
  skip = 0;
  limit = defaultLimit;
  selectedForm;
  forms$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  authoredFormDetail;
  nextToken = '';
  fetchType = 'load';
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  isLoading$ = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  selectedFormId = '';
  rdfModuleName = metadataFlatModuleNames.RACE_DYNAMIC_FORMS;
  tags = new Set();
  status: any[] = ['Draft', 'Published'];
  columns: Column[] = [];
  isPopoverOpen = false;
  lastPublishedBy = [];
  lastPublishedOn = [];
  lastModifiedBy = [];
  authoredBy = [];
  plantsIdNameMap = {};
  plants = [];
  createdBy = [];
  additionalDetailFilterData = {};
  filterJson: any[] = [];
  filter: any = {
    formStatus: '',
    author: '',
    lastPublishedBy: '',
    plant: '',
    tags: ''
  };

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
    tableHeight: '492px',
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
  private onDestroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private raceDynamicFormService: RaceDynamicFormService,
    private columnConfigService: ColumnConfigurationService,
    private store: Store<State>,
    private usersService: UsersService,
    private plantService: PlantService
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

    this.getDisplayedForms();

    this.formMetadata$ = this.store
      .select(getFormMetadata)
      .pipe(tap((formMetadata) => (this.formMetadata = formMetadata)));
    this.columnConfigService.moduleColumnConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.rdfModuleName]) {
          this.columns = res[this.rdfModuleName];
          this.configOptions.allColumns = this.columns;
        }
      });
    this.columnConfigService.moduleFilterConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.rdfModuleName]) {
          this.filterJson = res[this.rdfModuleName]?.filter(
            (item) => item.column !== 'formType'
          );
          this.setFilters();
        }
      });
    this.populateFilter();
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
    this.forms$ = combineLatest([formsOnLoadSearch$, onScrollForms$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: '492px'
          };
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getForms() {
    const filterData = {
      formType: this.data.isEmbeddedForm ? 'Embedded' : 'Standalone'
    };
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
        { ...this.filter, ...filterData }
      )
      .pipe(
        mergeMap(({ count, rows, next }) => {
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
            if (item?.tags) {
              item.tags = item.tags.toString();
            }
            if (item.plantId) {
              item = {
                ...item,
                plant: item.plant
              };
            } else {
              item = { ...item, plant: '' };
            }
            item =
              this.raceDynamicFormService.extractAdditionalDetailsToColumns(
                item
              );
            item = this.raceDynamicFormService.handleEmptyColumns(
              item,
              this.columns
            );
            return item;
          })
        )
      );
  }

  selectListItem(form) {
    this.selectedFormId = form?.id;
    this.raceDynamicFormService
      .getAuthoredFormDetailByFormId$(form.id)
      .pipe(
        map((authoredFormDetail) => {
          this.data.selectedFormName = form.name;
          const filteredForm = JSON.parse(authoredFormDetail.pages);
          let sectionData;
          const pageData = filteredForm.map((page) => {
            sectionData = page.sections.map((section) => {
              const questionsArray = [];
              page.questions.forEach((question) => {
                if (section.id === question.sectionId) {
                  questionsArray.push(question);
                }
              });
              return { ...section, questions: questionsArray };
            });
            return { ...page, sections: sectionData };
          });
          return pageData;
        })
      )
      .subscribe((response) => {
        this.selectedForm = response;
        this.selectFormElement();
      });
  }

  selectFormElement() {
    this.selectedForm?.forEach((page) => {
      page.sections.forEach((sec) => {
        sec.checked = false;
        sec.questions.forEach((que) => {
          que.checked = false;
        });
      });
    });
    this.data.selectedFormData = this.selectedForm;
    this.data.openImportQuestionsSlider = true;
    this.data.selectedFormId = this.selectedFormId;
    this.dialogRef.close(this.data);
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'formStatus':
        this.selectListItem(row);
        break;
      default:
    }
  };
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
  applyFilter(data: any) {
    for (const item of data) {
        this.filter[item.column] = item.value;
    }
    this.nextToken = '';
    this.isLoading$.next(true);
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
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
        allPlants,
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
        this.plants = Object.values(allPlants)
          .map((plant: any) => {
            return {
              display: `${plant.plantId} - ${plant.name}`,
              value: plant.id
          }})
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
  handleTableEvent = (event): void => {
    this.raceDynamicFormService.fetchForms$.next(event);
  };

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
