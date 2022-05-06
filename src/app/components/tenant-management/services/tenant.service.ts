import { Injectable } from '@angular/core';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Count, ErrorInfo, TableColumn, Tenant } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private appService: AppService) {}

  createTenant$ = (
    tenant: Tenant,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Tenant> =>
    this.appService._postData(
      environment.userRoleManagementApiUrl,
      'catalogs',
      tenant,
      info
    );

  getTenants$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Tenant[]> =>
    this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        'catalogs',
        info,
        queryParams
      )
      .pipe(map((resp) => this.formatTenants(resp)));

  getTenantsCount$ = (
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `catalogs/count`,
      info,
      queryParams
    );

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
        visible: true,
        sticky: false,
        searchable: true,
        sortable: true,
        movable: false,
        order: index + 1,
        groupable: false,
        hasSubtitle: false,
        subtitleColumn: ''
      };
    });
    configOptions = { ...configOptions, allColumns };
    return configOptions;
  }

  formatTenants = (tenants: Tenant[]) =>
    tenants.map((tenant) => {
      const {
        tenantAdmin: { firstName, lastName },
        modules,
        products
      } = tenant;
      const adminInfo = `${firstName} ${lastName}`;
      return { ...tenant, adminInfo };
    });
}
