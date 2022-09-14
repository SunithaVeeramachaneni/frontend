import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  defaultLimit,
  permissions as perms,
  products
} from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Count,
  DeactivateTenant,
  Permission,
  RowLevelActionEvent,
  TableColumn,
  TableEvent,
  Tenant,
  TenantData,
  UserInfo
} from 'src/app/interfaces';
import { LoginService } from '../../login/services/login.service';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsComponent implements OnInit {
  @ViewChild('allProducts') allProducts: MatOption;
  allProductsLabel = 'All Products';
  readonly products = products;
  tenantsOnLoadSearch$: Observable<Tenant[]>;
  tenantsCountOnLoadSearch$: Observable<Count>;
  tenantsOnScroll$: Observable<Tenant[]>;
  deactivateTenant$: BehaviorSubject<DeactivateTenant> =
    new BehaviorSubject<DeactivateTenant>({} as DeactivateTenant);
  tenantsData$: Observable<TenantData>;
  tenantsCount$: Observable<Count>;
  columns = [
    {
      name: 'tenantName',
      displayName: 'Tenant',
      type: 'string'
    },
    {
      name: 'products',
      displayName: 'Products',
      type: 'string'
    },
    {
      name: 'modules',
      displayName: 'Modules',
      type: 'string'
    },
    {
      name: 'adminInfo',
      displayName: 'Admin',
      type: 'string'
    },
    {
      name: 'createdAt',
      displayName: 'Created On',
      type: 'date'
    },
    {
      name: 'adminEmail',
      displayName: 'Admin',
      type: 'string'
    }
  ] as TableColumn[];
  configOptions: ConfigOptions = {
    tableID: 'tenantsTable',
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
    groupLevelColors: []
  };
  dataSource: MatTableDataSource<any>;
  skip = 0;
  limit = defaultLimit;
  deactivate = false;
  deactivateCount = false;
  userInfo$: Observable<UserInfo>;
  readonly perms = perms;
  searchForm: FormGroup;
  private fetchData$: BehaviorSubject<TableEvent> =
    new BehaviorSubject<TableEvent>({} as TableEvent);
  private searchTenants$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private tenantService: TenantService,
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      products: [[this.allProductsLabel, ...products]],
      search: ['']
    });

    this.tenantsOnLoadSearch$ = this.searchTenants$.pipe(
      switchMap((search) => {
        if (search) {
          this.skip = 0;
          return this.getTenants();
        }
        return this.getTenants();
      })
    );

    this.tenantsCountOnLoadSearch$ = this.searchTenants$.pipe(
      switchMap(() => this.getTenantsCount())
    );

    this.tenantsOnScroll$ = this.fetchData$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getTenants();
        } else {
          return of([] as Tenant[]);
        }
      })
    );

    const initial: TenantData = { data: [] };

    this.tenantsData$ = combineLatest([
      this.tenantsOnLoadSearch$,
      this.tenantsOnScroll$,
      this.deactivateTenant$
    ]).pipe(
      map(([tenants, scrollData, { deactivate, id }]) => {
        if (this.skip === 0) {
          initial.data = tenants;
          this.configOptions =
            this.tenantService.updateConfigOptionsFromColumns(
              this.columns,
              this.configOptions
            );
        } else {
          this.deactivate = deactivate;
          if (this.deactivate) {
            initial.data = initial.data.filter((tenant) => tenant.id !== id);
            this.deactivate = false;
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );

    this.tenantsCount$ = combineLatest([
      this.tenantsCountOnLoadSearch$,
      this.deactivateTenant$
    ]).pipe(
      map(([tenantsCount, { deactivate }]) => {
        this.deactivateCount = deactivate;
        if (this.deactivateCount) {
          tenantsCount.count = tenantsCount.count - 1;
          this.deactivateCount = false;
        }
        return tenantsCount;
      })
    );

    this.userInfo$ = this.loginService.loggedInUserInfo$.pipe(
      tap(({ permissions = [] }) => this.prepareMenuActions(permissions))
    );

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.searchTenants$.next(true);
      });
  }

  getTenants = () =>
    this.tenantService.getTenants$({
      skip: this.skip,
      limit: this.limit,
      isActive: true,
      searchKey: this.searchForm.get('search').value,
      products: this.getProducts()
    });

  getTenantsCount = () =>
    this.tenantService.getTenantsCount$({
      isActive: true,
      searchKey: this.searchForm.get('search').value,
      products: this.getProducts()
    });

  handleTableEvent(event: TableEvent) {
    this.fetchData$.next(event);
  }

  rowLevelActionHandler = (event: RowLevelActionEvent) => {
    const {
      action,
      data: { id }
    } = event;
    switch (action) {
      case 'edit':
        this.router.navigate(['tenant-management/edit', id], {
          queryParams: { edit: true }
        });
        break;
      default:
      // do nothing
    }
  };

  cellClickActionHandler = (event: CellClickActionEvent) => {
    const {
      columnId,
      row: { id }
    } = event;
    switch (columnId) {
      case 'tenantName':
      case 'products':
      case 'modules':
      case 'adminInfo':
      case 'createdAt':
        this.router.navigate(['tenant-management/edit', id], {
          queryParams: { edit: false }
        });
        break;
      default:
      // do nothing
    }
  };

  prepareMenuActions(permissions: Permission[]) {
    const menuActions = [];

    if (
      this.loginService.checkUserHasPermission(permissions, 'UPDATE_TENANT')
    ) {
      menuActions.push({
        title: 'Edit',
        action: 'edit'
      });
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  toggleAllProducts() {
    if (this.allProducts.selected) {
      this.searchForm.patchValue({
        products: [this.allProductsLabel, ...products]
      });
    } else {
      this.searchForm.patchValue({
        products: [products[0]]
      });
    }
  }

  toggleProduct() {
    if (this.allProducts.selected) {
      this.allProducts.deselect();
    }
    if (this.searchForm.get('products').value.length === products.length) {
      this.allProducts.select();
    }
  }

  getProducts() {
    const selectedProducts = this.searchForm.get('products').value;
    return selectedProducts.length === products.length + 1
      ? selectedProducts.slice(1).join(',')
      : selectedProducts.join(',');
  }
}
