import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { graphQLDefaultMaxLimit } from 'src/app/app.constants';
import { CellClickActionEvent, FormMetadata } from 'src/app/interfaces';
import { ImportQuestionsModalComponent } from '../import-questions/import-questions-modal/import-questions-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Store } from '@ngrx/store';
import { getFormMetadata, State } from 'src/app/forms/state';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import { ResponseSetService } from '../../master-configurations/response-set/services/response-set.service';
import { metadataFlatModuleNames } from 'src/app/app.constants';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
@Component({
  selector: 'app-import-template-list',
  templateUrl: './import-template-list.component.html',
  styleUrls: ['./import-template-list.component.scss']
})
export class ImportTemplateListComponent implements OnInit, OnDestroy {
  searchTemplates: FormControl;
  skip = 0;
  limit = graphQLDefaultMaxLimit;
  selectedTemplate;
  templates$: Observable<any>;
  nextToken = '';
  fetchType = 'load';
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  ghostLoading = new Array(11).fill(0).map((v, i) => i);
  isLoading$ = new BehaviorSubject(true);
  isLoadingColumns$: Observable<boolean> =
    this.columnConfigService.isLoadingColumns$;
  allTemplates = [];
  RDF_TEMPLATE_MODULE_NAME = metadataFlatModuleNames.RDF_TEMPLATES;
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

  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private raceDynamicFormService: RaceDynamicFormService,
    private columnConfigService: ColumnConfigurationService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.columnConfigService.moduleColumnConfiguration$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if (res && res[this.RDF_TEMPLATE_MODULE_NAME]) {
          console.log(res);
          this.columns = res[this.RDF_TEMPLATE_MODULE_NAME];
          this.columns?.map((dynamicColumnConfiguration) => {
            if (dynamicColumnConfiguration.id === 'displayFormsUsageCount') {
              dynamicColumnConfiguration.titleStyle = '';
            }
            return dynamicColumnConfiguration;
          });
          this.configOptions.allColumns = this.columns;
        }
      });

    this.searchTemplates = new FormControl('');

    const filterData = {
      formType: this.data.isEmbeddedForm ? 'Embedded' : 'Standalone'
    };

    this.templates$ = this.raceDynamicFormService
      .fetchTemplates$({ isArchived: false, isDeleted: false })
      .pipe(
        map((res: any) => {
          this.allTemplates =
            res?.rows?.filter(
              (item) =>
                item.formType === filterData.formType &&
                item.formStatus === 'Ready'
            ) || [];
          this.allTemplates.map((template) => {
            template.displayFormsUsageCount = template.formsUsageCount;
          });
          this.dataSource = new MatTableDataSource(this.allTemplates);
          this.isLoading$.next(false);
          return this.allTemplates;
        })
      );

    this.searchTemplates.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((res) => {
          this.applySearch(res);
        })
      )
      .subscribe(() => this.isLoading$.next(false));

    this.formMetadata$ = this.store
      .select(getFormMetadata)
      .pipe(tap((formMetadata) => (this.formMetadata = formMetadata)));
  }

  applySearch(searchTerm: string) {
    this.isLoading$.next(true);
    const filteredTemplates = this.allTemplates.filter((item: any) =>
      item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
    this.dataSource.data = filteredTemplates;
    this.isLoading$.next(false);
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
