import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import { CellClickActionEvent } from 'src/app/interfaces';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Router } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { UsersService } from '../../user-management/services/users.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { permissions } from 'src/app/app.constants';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { TemplateModalComponent } from '../template-modal/template-modal.component';

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
  selectedForm: any = null;
  affectedFormDetail: any = null;
  selectedTemplate: any = null;
  submissionSlider = 'out';
  isPopoverOpen = false;
  status: any[] = ['Draft', 'Ready'];
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
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'questionsCount',
      displayName: 'Questions',
      type: 'number',
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
    },
    {
      id: 'formType',
      displayName: 'Template Type',
      type: 'string',
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
      id: 'formsUsageCount',
      displayName: 'Used in Forms',
      type: 'number',
      controlType: 'string',
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
      titleStyle: {
        color: '#3D5AFE',
        'text-decoration': 'underline'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'lastPublishedBy',
      displayName: 'Modified By',
      type: 'number',
      controlType: 'string',
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
      order: 7,
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
    status: '',
    modifiedBy: '',
    createdBy: ''
  };
  dataSource: MatTableDataSource<any>;
  allTemplates: [];
  displayedTemplates: any[];
  templatesCount$: Observable<number>;
  searchTemplates: FormControl;
  ghostLoading = new Array(12).fill(0).map((_, i) => i);
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  lastPublishedBy = [];
  createdBy = [];
  readonly permissions = permissions;
  fetchAllTemplatesSubscription: Subscription;
  private onDestroy$ = new Subject();

  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private usersService: UsersService,
    private headerService: HeaderService,
    private translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private readonly store: Store<State>
  ) {}

  ngOnInit(): void {
    this.searchTemplates = new FormControl('');
    this.headerService.setHeaderTitle(
      this.translateService.instant('templates')
    );

    this.usersService.getUsersInfo$().subscribe(() => {
      this.fetchAllTemplatesSubscription = this.raceDynamicFormService
        .fetchAllTemplates$()
        .subscribe((res: any) => {
          this.templatesCount$ = of(res.rows.length);
          this.allTemplates = res.rows.map((item) => ({
            ...item,
            author: this.usersService.getUserFullName(item.author),
            lastPublishedBy: this.usersService.getUserFullName(
              item.lastPublishedBy
            )
          }));
          this.displayedTemplates = this.allTemplates;
          this.dataSource = new MatTableDataSource(this.displayedTemplates);
          this.isLoading$.next(false);

          this.initializeFilter();
        });
    });

    this.searchTemplates.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((res) => {
          this.applySearchAndFilter(res);
        })
      )
      .subscribe(() => this.isLoading$.next(false));

    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
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
      case 'formsUsageCount':
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
              data: this.allTemplates
            });
          });
        break;

      default:
    }
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

  initializeFilter() {
    this.raceDynamicFormService.getTemplateFilter().subscribe((res) => {
      this.filterJson = res;

      const uniqueLastPublishedBy = Array.from(
        new Set(
          this.allTemplates
            .map((item: any) => item.lastPublishedBy)
            .filter((item) => item != null)
        )
      );
      this.lastPublishedBy = uniqueLastPublishedBy;
      const uniqueCreatedBy = Array.from(
        new Set(
          this.allTemplates
            .map((item: any) => item.author)
            .filter((item) => item != null)
        )
      );
      this.createdBy = uniqueCreatedBy;

      this.filterJson.forEach((item) => {
        if (item.column === 'status') {
          item.items = this.status;
        } else if (item.column === 'modifiedBy') {
          item.items = this.lastPublishedBy;
        } else if (item.column === 'createdBy') {
          item.items = this.createdBy;
        }
      });
    });
  }

  applySearchAndFilter(searchTerm: string) {
    this.isLoading$.next(true);
    this.displayedTemplates = this.allTemplates
      .filter((item: any) =>
        item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
      )
      .filter((item: any) => {
        if (
          this.filter.status !== '' &&
          this.filter.status !== item.formStatus
        ) {
          return false;
        } else if (
          this.filter.modifiedBy !== '' &&
          this.filter.modifiedBy.indexOf(item.lastPublishedBy) === -1
        ) {
          return false;
        } else if (
          this.filter.createdBy !== '' &&
          this.filter.createdBy.indexOf(item.author) === -1
        ) {
          return false;
        }
        return true;
      });
    this.dataSource.data = this.displayedTemplates;
    this.isLoading$.next(false);
  }

  updateFilter(data: any) {
    data.forEach((item) => {
      this.filter[item.column] = item.value;
    });
    this.applySearchAndFilter(this.searchTemplates.value);
  }

  resetFilter() {
    this.filter = {
      status: '',
      modifiedBy: '',
      createdBy: ''
    };
    this.applySearchAndFilter(this.searchTemplates.value);
  }

  openCreateTemplateModal() {
    this.dialog.open(TemplateModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: this.allTemplates
    });
  }

  templateDetailActionHandler() {
    this.router.navigate([`/forms/templates/edit/${this.selectedForm.id}`]);
    this.openCreateTemplateModal();
  }

  affectedFormDetailActionHandler() {
    this.router.navigate(['/forms/edit', this.affectedFormDetail.id]);
    this.openCreateTemplateModal();
  }

  onClickAffectedFormDetail(event) {
    this.affectedFormDetail = event;
    this.affectedFormDetailState = 'in';
  }

  ngOnDestroy(): void {
    if (this.fetchAllTemplatesSubscription) {
      this.fetchAllTemplatesSubscription.unsubscribe();
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  showAffectedSlider(row: any): void {
    if (row.formsUsageCount) {
      this.selectedTemplate = row;
      this.affectedSliderState = 'in';
      this.onCloseViewDetail();
    }
  }

  private showFormDetail(row: any): void {
    this.selectedForm = row;
    this.menuState = 'in';
    this.onCloseAffectedSlider();
  }
}
