/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import { TableEvent, LoadEvent, SearchEvent } from 'src/app/interfaces';
import { defaultLimit } from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { ToastService } from 'src/app/shared/toast';
import { MatDialog } from '@angular/material/dialog';
import { ArchivedDeleteModalComponent } from '../archived-delete-modal/archived-delete-modal.component';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';

interface FormTableUpdate {
  action: 'restore' | 'delete' | null;
  form: any;
}

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.scss']
})
export class ArchivedListComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Recents',
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
      titleStyle: { 'font-weight': '500', 'font-size': '90%' },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'isArchivedAt',
      displayName: 'Archived',
      type: 'timeAgo',
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
      id: 'publishedDate',
      displayName: 'Last Published',
      type: 'timeAgo',
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
  limit = defaultLimit;
  searchForm: FormControl;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  archivedFormsListCount$: Observable<number>;
  nextToken = '';
  public menuState = 'out';
  ghostLoading = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  submissionDetail: any;
  fetchType = 'load';
  restoreDeleteForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly toast: ToastService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.fetchForms$.next({ data: 'search' }))
      )
      .subscribe(() => this.isLoading$.next(true));
    this.archivedFormsListCount$ =
      this.raceDynamicFormService.getFormsListCount$(true);
    this.getDisplayedForms();
    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
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
            tableHeight: 'calc(80vh - 20px)'
          };
          initial.data = rows;
        } else {
          if (action === 'restore') {
            initial.data = initial.data.filter(
              (d) => d.id !== form.data.updateFormList.id
            );
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
          nextToken: this.nextToken,
          limit: this.limit,
          searchKey: this.searchForm.value,
          fetchType: this.fetchType
        },
        true
      )
      .pipe(
        mergeMap(({ rows, nextToken }) => {
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  handleTableEvent = (event): void => {
    this.fetchForms$.next(event);
  };

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Restore',
        action: 'restore'
      },
      {
        title: 'Delete',
        action: 'delete'
      }
    ];
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
        this.archivedFormsListCount$ =
          this.raceDynamicFormService.getFormsListCount$(true);
      });
  }

  private onDeleteForm(form: any): void {
    const deleteReportRef = this.dialog.open(ArchivedDeleteModalComponent, {
      data: form
    });

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.raceDynamicFormService
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
          .subscribe((updatedForm) => {
            this.restoreDeleteForm$.next({
              action: 'delete',
              form: updatedForm
            });
            this.archivedFormsListCount$ =
              this.raceDynamicFormService.getFormsListCount$(true);
          });
      }
    });
  }
}
