import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { defaultLimit } from 'src/app/app.constants';
import {
  CellClickActionEvent,
  Count,
  DeactivateTenant,
  RowLevelActionEvent,
  TableColumn,
  TableEvent,
  Tenant,
  TenantData
} from 'src/app/interfaces';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsComponent implements OnInit {
  selectedProduct = ['All Products'];
  products = ['All Products', 'MWorkOrder', 'MInventory'];
  tenantsOnLoad$: Observable<Tenant[]>;
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
    displayActionsColumn: true,
    rowLevelActions: {
      menuActions: [
        {
          title: 'Edit',
          action: 'edit'
        }
      ]
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
  private fetchData$: BehaviorSubject<TableEvent> =
    new BehaviorSubject<TableEvent>({} as TableEvent);

  constructor(private tenantService: TenantService, private router: Router) {}

  ngOnInit(): void {
    this.tenantsOnLoad$ = this.getTenants();
    this.tenantsOnScroll$ = this.fetchData$.pipe(
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          return this.getTenants();
        } else {
          return of([] as Tenant[]);
        }
      })
    );

    this.tenantsData$ = combineLatest([
      this.tenantsOnLoad$,
      this.tenantsOnScroll$,
      this.deactivateTenant$
    ]).pipe(
      map(([tenants, scrollData, { deactivate, id }]) => {
        const initial: TenantData = {
          data: tenants
        };
        if (this.skip === 0) {
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

        this.skip = initial.data ? initial.data.length : this.skip;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );

    this.tenantsCount$ = combineLatest([
      this.getTenantsCount(),
      this.deactivateTenant$
    ]).pipe(
      map(([tenantsCount, { deactivate }]) => {
        if (deactivate) {
          tenantsCount.count = tenantsCount.count - 1;
        }
        return tenantsCount;
      })
    );
  }

  getTenants = () =>
    this.tenantService.getTenants$({
      skip: this.skip,
      limit: this.limit,
      isActive: true
      // searchKey: this.searchValue
    });

  getTenantsCount = () =>
    this.tenantService.getTenantsCount$({
      isActive: true
      // searchKey: this.searchValue
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
}
