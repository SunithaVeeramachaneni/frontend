import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { defaultLimit } from 'src/app/app.constants';
import {
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
  selectedProduct = 'allproducts';
  tenantsOnLoad$: Observable<Tenant[]>;
  tenantsOnScroll$: Observable<Tenant[]>;
  tenantDeactivate$: BehaviorSubject<Tenant> = new BehaviorSubject<Tenant>(
    {} as Tenant
  );
  tenantsData$: Observable<TenantData>;
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
    tableHeight: 'calc(100vh - 173px)',
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
      this.tenantDeactivate$
    ]).pipe(
      map(([tenants, scrollData, deactiveTenant]) => {
        const initial: TenantData = {
          data: tenants
        };
        if (this.skip === 0) {
          this.configOptions =
            this.tenantService.updateConfigOptionsFromColumns(
              this.columns,
              this.configOptions
            );
          console.log(this.configOptions);
        } else {
          initial.data = initial.data.concat(scrollData);
        }

        this.skip = initial.data ? initial.data.length : this.skip;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getTenants = () =>
    this.tenantService.getTenants$({
      skip: this.skip,
      limit: this.limit
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
        this.router.navigate(['tenant-management/edit', id]);
        break;
      default:
      // do nothing
    }
  };
}
