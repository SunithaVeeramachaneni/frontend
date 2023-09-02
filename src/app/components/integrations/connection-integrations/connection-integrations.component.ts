import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  of
} from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { IntegrationsService } from '../services/integrations.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from 'src/app/interfaces';
import { defaultLimit } from 'src/app/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { AddEditIntegrationComponent } from '../add-edit-integration/add-edit-integration.component';

@Component({
  selector: 'app-connection-integrations',
  templateUrl: './connection-integrations.component.html',
  styleUrls: ['./connection-integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionIntegrationsComponent implements OnInit, OnChanges {
  @Input() connector: any;

  createUpdateDeleteIntegration$ = new BehaviorSubject<any>({
    type: 'create',
    integration: {} as any
  });

  columns: Column[] = [
    {
      id: 'connectorId',
      displayName: 'Connector',
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
      titleStyle: {},
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'integrationPointId',
      displayName: 'Integration Point',
      type: 'string',
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
      id: 'syncType',
      displayName: 'Synchronization',
      type: 'string',
      controlType: 'string',
      isMultiValued: true,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'updatedOn',
      displayName: 'Last Updated',
      type: 'timeAgo',
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
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'integrationsTable',
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
  isIntegrationsLoading = false;

  integrations$: Observable<any>;
  skip = 0;
  limit = defaultLimit;
  fetchIntegrations$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  constructor(
    private dialog: MatDialog,
    private integrationsService: IntegrationsService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Delete',
        action: 'delete'
      }
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  getDisplayedIntegrations(connectorId?: string) {
    this.fetchIntegrations$.next({ data: 'load' });
    this.fetchIntegrations$.next({} as TableEvent);

    const integrationsOnLoadSearch$ = this.fetchIntegrations$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(() => {
        this.skip = 0;
        const id = connectorId ? connectorId : this.connector.connectorId;
        this.prepareMenuActions();
        return this.getIntegrations(id);
      })
    );

    const onScrollIntegrations$ = this.fetchIntegrations$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getIntegrations(this.connector.connectorId);
        } else {
          return of([] as any[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.integrations$ = combineLatest([
      integrationsOnLoadSearch$,
      onScrollIntegrations$,
      this.createUpdateDeleteIntegration$
    ]).pipe(
      map(([integrations, scrollData, integrationAction]) => {
        const { integration, type } = integrationAction;
        this.configOptions = {
          ...this.configOptions,
          tableHeight: 'calc(100vh - 150px)'
        };
        if (type === 'create') {
          if (Object.keys(integration).length) {
            initial.data = [...initial.data, integration];
          }
        } else {
          if (this.skip === 0) {
            initial.data = integrations;
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }

        this.configOptions.allColumns = this.columns;
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        this.cdrf.detectChanges();
        return initial;
      })
    );
  }

  getIntegrations = (connectorId: string) => {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    return this.integrationsService.getIntegrations$(connectorId, info);
  };

  addIntegration = () => {
    const dialogRef = this.dialog.open(AddEditIntegrationComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: { mode: 'create' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.createUpdateDeleteIntegration$.next({
        type: 'create',
        integration: result
      });
      console.log(result);
    });
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.connector.currentValue.connectorId) {
      this.getDisplayedIntegrations(this.connector.connectorId);
      // this.getIntegrations();
    }
  }
}
