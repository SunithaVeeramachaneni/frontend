import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';
import { RaceDynamicFormService } from '../../services/rdf.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import {
  graphQLDefaultLimit,
  graphQLDefaultMaxLimit
} from 'src/app/app.constants';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { ToastService } from 'src/app/shared/toast';
import { Form } from 'src/app/interfaces';

@Component({
  selector: 'app-template-affected-forms-modal',
  templateUrl: './template-affected-forms-modal.component.html',
  styleUrls: ['./template-affected-forms-modal.component.scss']
})
export class TemplateAffectedFormsModalComponent implements OnInit {
  ghostLoading = new Array(9).fill(0).map((v, i) => i);
  nextToken = '';
  fetchType = 'load';
  searchForm: FormControl;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  skip = 0;
  limit = graphQLDefaultLimit;
  affectedFormsCount: Number;
  affectedForms: any[];
  allAffectedForms: any[];
  dataSource: MatTableDataSource<any>;
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Form Name',
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
      id: 'plant',
      displayName: 'Plant',
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'formStatus',
      displayName: 'Status',
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
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'affectedFormsTable',
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
    tableHeight: '400px',
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

  private onDestroy$ = new Subject();

  constructor(
    private store: Store<State>,
    private toastService: ToastService,
    private raceDynamicFormService: RaceDynamicFormService,
    private templateService: TemplateService,
    public dialogRef: MatDialogRef<TemplateAffectedFormsModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormControl('');
    this.configOptions.allColumns = this.columns;
    combineLatest([this.getAffectedForms(), this.getAllAffectedForms()]);
    this.getAffectedForms();
    this.getAllAffectedForms();
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((input) => {
          this.isLoading$.next(true);
          this.searchAffectedForms(input);
        })
      )
      .subscribe();
  }

  getAffectedForms(searchTerm?, nextToken?) {
    this.templateService
      .getTemplateUsedList$({
        templateID: this.data.templateID,
        searchTerm: searchTerm ? searchTerm : '',
        limit: 25,
        nextToken: nextToken ? nextToken : ''
      })
      .subscribe((res: any) => {
        this.nextToken = res.nextToken;
        this.affectedForms = res?.items ? res.items : [];
        this.dataSource = new MatTableDataSource(this.affectedForms);
        this.isLoading$.next(false);
      });
  }
  getAllAffectedForms() {
    this.templateService
      .getTemplateUsedList$({
        templateID: this.data.templateID,
        limit: graphQLDefaultMaxLimit
      })
      .subscribe((res) => {
        this.allAffectedForms = res?.items ? res.items : [];
        this.affectedFormsCount = this.allAffectedForms.length;
      });
  }
  searchAffectedForms(searchTerm) {
    this.affectedForms = this.allAffectedForms.filter((item: any) =>
      item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
    this.dataSource.data = this.affectedForms;
    this.isLoading$.next(false);
  }
  markTemplateAsReady() {
    this.dialogRef.close();
    this.store.dispatch(
      BuilderConfigurationActions.updateIsFormDetailPublished({
        isFormDetailPublished: true
      })
    );
    this.toastService.show({
      type: 'success',
      text: `${this.affectedFormsCount} Forms are updated.`
    });
  }
}
