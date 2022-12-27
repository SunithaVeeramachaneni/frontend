import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  tap
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
  LoadEvent,
  SearchEvent,
  TableEvent,
  FormTableUpdate,
  RaceDynamicForm
} from 'src/app/interfaces';
import { defaultLimit } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { RaceDynamicFormService } from '../services/rdf.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormListComponent implements OnInit {
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Recents',
      type: 'string',
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
      id: 'createdBy',
      displayName: 'Owner',
      type: 'number',
      isMultiValued: true,
      order: 2,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: false,
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
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      order: 3,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: true,
      titleStyle: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontSize: '14px',
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 12px',
        marginTop: '8px',
        width: '90px',
        height: '24px',
        background: '#D1FAE5', // #FEF3C7
        borderRadius: '12px',
        flex: 'none',
        order: 0,
        flexGrow: 0
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'updatedBy',
      displayName: 'Last Published By',
      type: 'number',
      order: 4,
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      searchable: false,
      sortable: false,
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
      id: 'updatedAt',
      displayName: 'Last Published At',
      type: 'string',
      order: 5,
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
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  configOptions: ConfigOptions = {
    tableID: 'formsTable',
    rowsExpandable: false,
    enableRowsSelection: true,
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
  selectedForms: RaceDynamicForm[] = [];
  allFormsList: RaceDynamicForm[] = [];
  allSelected = false;
  dataSource: MatTableDataSource<any>;
  forms$: Observable<any>;
  formsCount$: Observable<Count>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as RaceDynamicForm
    });
  formCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  searchForm: FormControl;
  addCopyFormCount = false;
  isPopoverOpen = false;
  filterIcon = '../../../../assets/maintenance-icons/filterIcon.svg';
  closeIcon = '../../../../assets/img/svg/cancel-icon.svg';
  constructor(
    private readonly toast: ToastService,
    private readonly raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.fetchForms$.next({ data: 'load' });
    this.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe();
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
    this.prepareMenuActions();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId } = event;
    switch (columnId) {
      case 'name':
      case 'createdBy':
      case 'formStatus':
      case 'updatedBy':
      case 'updatedAt ':
        this.openEditFormModal(event.row);
        break;
      default:
    }
  };

  openEditFormModal(form = {} as RaceDynamicForm): void {
    // TODO: Edit api call and integration
    this.toast.show({
      text: 'Form edited successfully!',
      type: 'success'
    });
  }

  openCopyFormModal(form: RaceDynamicForm): void {
    // TODO: Copy api call and integration
    this.addEditCopyForm$.next({
      action: 'copy',
      form
    });
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        return this.getForms();
      })
    );

    const onScrollForms$ = this.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getForms();
        } else {
          return of([] as RaceDynamicForm[]);
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
            tableHeight: 'calc(80vh - 150px)'
          };
          initial.data = rows;
        } else {
          if (Object.keys(form?.form).length > 0 && form.action === 'copy') {
            const count = initial.data.filter(
              (d) => form.form.id === d.id
            ).length;
            if (count < 5) {
              const obj = { ...form.form };
              obj.name =
                obj.name + (count - 1 === 0 ? ' Copy' : ` Copy${count - 1}`);
              initial.data.splice(obj.id - 1, 0, obj);
              this.selectedForms = [];
              form.action = 'edit';
              this.toast.show({
                text: 'Form copied successfully!',
                type: 'success'
              });
            } else {
              this.toast.show({
                text: 'Form copy limit reached!',
                type: 'warning'
              });
            }
          } else {
            if (form.action === 'delete') {
              initial.data = initial.data.filter((d) => d.id !== form.form.id);
              this.toast.show({
                text: 'Form archive successfully!',
                type: 'success'
              });
            } else {
              initial.data = initial.data.concat(scrollData);
            }
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
      .getFormsMock$({
        skip: this.skip,
        limit: this.limit,
        searchKey: this.searchForm.value
      })
      .pipe(
        mergeMap(({ count, rows }) => {
          this.formsCount$ = of({ count });
          return of(rows);
        })
      );
  }

  openArchiveModal(form: RaceDynamicForm) {
    this.addEditCopyForm$.next({
      action: 'delete',
      form
    });
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'copy':
        this.openCopyFormModal(data);
        break;

      case 'edit':
        this.openEditFormModal(data);
        break;

      case 'archive':
        this.openArchiveModal(data);
        break;

      case 'toggleAllRows':
        let allSelected = false;
        const forms: RaceDynamicForm[] = [...this.allFormsList];
        if (
          this.selectedForms.length === 0 ||
          this.selectedForms.length !== forms.length
        ) {
          allSelected = true;
          this.selectedForms = forms;
        } else {
          allSelected = false;
          this.selectedForms = [];
        }
        break;

      case 'toggleRowSelect':
        const index = this.selectedForms.findIndex(
          (form) => form.id === data.id
        );
        if (index !== -1) {
          this.selectedForms = this.selectedForms.filter(
            (form) => form.id !== data.id
          );
        } else {
          this.selectedForms.push(data);
        }
        break;
      default:
    }
  };

  handleTableEvent = (event): void => {
    this.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event): void => {
    console.log('event', event);
  };

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Copy',
        action: 'copy'
      },
      {
        title: 'Edit',
        action: 'edit'
      },
      {
        title: 'Archive',
        action: 'archive'
      }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  applyFilters(): void {
    this.isPopoverOpen = false;
  }

  clearFilters(): void {
    this.isPopoverOpen = false;
  }
}
