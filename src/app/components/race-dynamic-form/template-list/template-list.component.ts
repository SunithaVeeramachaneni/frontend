import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import { CellClickActionEvent, FormTableUpdate } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { slideInOut } from 'src/app/animations';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
import { UsersService } from '../../user-management/services/users.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class TemplateListComponent implements OnInit {
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
        color: '#000000'
      },
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
      id: 'counter',
      displayName: 'Questions',
      type: 'number',
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
      id: 'formsUsageCount',
      displayName: 'Used in Forms',
      type: 'number',
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
      displayName: 'Modified By',
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
      ready: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      }
    }
  };
  filter: any = {
    status: '',
    modifiedBy: '',
    authoredBy: '',
    lastModifiedOn: ''
  };
  dataSource: MatTableDataSource<any>;
  allTemplates: [];
  templatesCount$: Observable<number>;
  searchForm: FormControl;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  ghostLoading = new Array(12).fill(0).map((_, i) => i);
  selectedForm: GetFormList = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private usersService: UsersService,
    private headerService: HeaderService,
    private translateService: TranslateService,
    private router: Router,
    private readonly store: Store<State>
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormControl('');
    this.headerService.setHeaderTitle(
      this.translateService.instant('templates')
    );

    this.usersService.getUsersInfo$().subscribe((_) => {
      this.raceDynamicFormService.fetchAllTemplates$().subscribe((res: any) => {
        this.templatesCount$ = of(res.rows.length);
        this.allTemplates = res.rows.map((item) => {
          return {
            ...item,
            author: this.usersService.getUserFullName(item.author),
            lastPublishedBy: this.usersService.getUserFullName(item.author)
          };
        });
        this.dataSource = new MatTableDataSource(this.allTemplates);
        this.isLoading$.next(false);
      });
    });

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((res) => {
          this.isLoading$.next(true);
          const filteredTemplates = this.allTemplates.filter((item: any) =>
            item.name.toLocaleLowerCase().startsWith(res.toLocaleLowerCase())
          );
          this.dataSource.data = filteredTemplates;
          this.isLoading$.next(false);
        })
      )
      .subscribe(() => this.isLoading$.next(false));
    this.getFilter();

    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
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
        this.showTemplateDetail(row);
        break;
      default:
    }
  };

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'edit':
        this.router.navigate(['/forms/templates/edit', data.id]);
        break;

      default:
    }
  };

  handleTableEvent = (event): void => {
    this.raceDynamicFormService.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event): void => {};

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Edit',
        action: 'edit'
      }
    ];
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
    this.router.navigate(['/forms/templates/edit', this.selectedForm.id]);
  }

  private showTemplateDetail(row: GetFormList): void {
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.selectedForm = row;
    this.menuState = 'in';
  }

  lastPublishedBy = [];
  lastPublishedOn = [];
  authoredBy = [];

  getFilter() {
    this.raceDynamicFormService.getFilter().subscribe((res) => {
      this.filterJson = res;
    });
  }

  applyFilter(data: any) {
    for (const item of data) {
      this.filter[item.column] = item.value;
    }
  }

  resetFilter() {
    this.filter = {
      status: '',
      modifiedBy: '',
      authoredBy: '',
      lastModifiedOn: ''
    };
  }
}
