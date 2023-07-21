/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { addMonths, format } from 'date-fns';
import {
  ApiKeyEvent,
  ApiKeyInfo,
  ApiKeysInfoObject,
  Permission,
  RowLevelActionEvent,
  TableColumn,
  UserInfo
} from 'src/app/interfaces';
import { TenantService } from '../services/tenant.service';
import { LoginService } from '../../login/services/login.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const expiredOnFormat = 'yyyy-MM-dd';

@Component({
  selector: 'app-api-key-generation',
  templateUrl: './api-key-generation.component.html',
  styleUrls: ['./api-key-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyGenerationComponent implements OnInit {
  @Input() set apiKeysInfo(apiKeysInfoObject: ApiKeysInfoObject) {
    this.adjustTableHeight();
    this.filteredApiKeysInfo = apiKeysInfoObject.apiKeysInfo;
    this.dataSource = new MatTableDataSource(this.filteredApiKeysInfo);
  }
  @Input() set disabeleApiKeyGeneration(disabeleApiKeyGeneration: boolean) {
    this._disabeleApiKeyGeneration = disabeleApiKeyGeneration;
    if (disabeleApiKeyGeneration) {
      this.apiKeyInfoForm.disable();
    } else {
      this.apiKeyInfoForm.enable();
    }
    this.prepareMenuActions();
  }
  get disabeleApiKeyGeneration(): boolean {
    return this._disabeleApiKeyGeneration;
  }
  @Output() apiKeyEvent: EventEmitter<ApiKeyEvent> =
    new EventEmitter<ApiKeyEvent>();
  apiKeyInfoForm: FormGroup = this.fb.group({
    description: '',
    expires: ''
  });
  expires = [
    '30 days (1 month)',
    '90 days (3 months)',
    '180 days (6 months)',
    '365 days (12 months)'
  ];
  columns = [
    {
      name: 'description',
      displayName: 'Description',
      type: 'string'
    },
    {
      name: 'expiresOn',
      displayName: 'Expries',
      type: 'string'
    },
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'string'
    }
  ] as TableColumn[];

  configOptions: ConfigOptions = {
    tableID: 'apiKeysInfoTable',
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
    tableHeight: 'calc(100vh - 350px)',
    groupLevelColors: []
  };
  dataSource: MatTableDataSource<any>;
  userInfo$: Observable<UserInfo>;
  permissions: Permission[] = [];
  filteredApiKeysInfo: ApiKeyInfo[] = [];
  private _disabeleApiKeyGeneration: boolean;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.apiKeyInfoForm.patchValue({ expires: this.expires[2] });
    this.configOptions = this.tenantService.updateConfigOptionsFromColumns(
      this.columns,
      this.configOptions
    );

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => {
        this.permissions = permissions;
        this.prepareMenuActions();
      })
    );
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const { action, data: apiKeyInfo } = event;
    switch (action) {
      case 'delete':
        this.filteredApiKeysInfo = this.filteredApiKeysInfo.filter(
          (info) => info.apiKey !== apiKeyInfo.apiKey
        );
        this.adjustTableHeight();
        this.dataSource = new MatTableDataSource(this.filteredApiKeysInfo);
        this.apiKeyEvent.emit({
          type: 'delete',
          apiKeyInfo
        });
        break;
      default:
      // do nothing
    }
  };

  adjustTableHeight() {
    if (!this.filteredApiKeysInfo.length) {
      this.configOptions = {
        ...this.configOptions,
        tableHeight: 'calc(100vh - 350px)'
      };
    }
  }

  generateApiKey() {
    this.apiKeyEvent.emit({
      type: 'create',
      apiKeyInfo: { ...this.prepareApikeyInfo(), apiKey: '' }
    });
  }

  prepareApikeyInfo() {
    const currDate = new Date();
    const { description, expires } = this.apiKeyInfoForm.value;
    return {
      description: description.trim()
        ? description
        : `API Key generated on ${format(currDate, 'EEE MMM dd yyyy')}`,
      expiresOn: expires
        ? expires === this.expires[0]
          ? format(addMonths(currDate, 1), expiredOnFormat)
          : expires === this.expires[1]
          ? format(addMonths(currDate, 3), expiredOnFormat)
          : expires === this.expires[2]
          ? format(addMonths(currDate, 6), expiredOnFormat)
          : format(addMonths(currDate, 12), expiredOnFormat)
        : format(currDate, expiredOnFormat)
    };
  }

  updateConfigOptionsFromColumns(
    columns: TableColumn[],
    configOptions: ConfigOptions
  ) {
    const allColumns = columns.map((column, index) => {
      const { name: id, displayName, type } = column;

      return {
        id,
        displayName,
        type,
        controlType: 'string',
        visible: true,
        sticky: false,
        searchable: true,
        sortable: false,
        movable: false,
        order: index + 1,
        groupable: false,
        hasSubtitle: false,
        subtitleColumn: '',
        showMenuOptions: false,
        hideable: true,
        stickable: true,
        titleStyle: { 'font-size': '90%' },
        subtitleStyle: { 'font-size': '80%', color: 'darkgray' },
        hasPreTextImage: false,
        hasPostTextImage: false
      };
    });
    configOptions = { ...configOptions, allColumns };
    return configOptions;
  }

  prepareMenuActions() {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(
        this.permissions,
        'UPDATE_TENANT'
      ) &&
      !this.disabeleApiKeyGeneration
    ) {
      menuActions.push({
        title: 'Delete',
        action: 'delete'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }
}
