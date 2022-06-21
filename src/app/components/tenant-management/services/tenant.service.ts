import { Injectable } from '@angular/core';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { Observable } from 'rxjs';
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

  updateTenant$ = (
    tenantId: number,
    tenant: Tenant,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Tenant> =>
    this.appService
      .patchData(
        environment.userRoleManagementApiUrl,
        `catalogs/${tenantId}`,
        tenant,
        info
      )
      .pipe(map((response) => (response === null ? tenant : response)));

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
  ): Observable<Count> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `catalogs/count`,
      { displayToast, failureResponse },
      queryParams
    );
  };

  getTenantById$ = (
    id: number,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Tenant> =>
    this.appService._getRespById(
      environment.userRoleManagementApiUrl,
      'catalogs/',
      id,
      info
    );

  updateConfigOptionsFromColumns(
    columns: TableColumn[],
    configOptions: ConfigOptions
  ) {
    const allColumns = columns.map((column, index) => {
      const { name: id, displayName, type } = column;
      let hasSubtitle = false;
      let visible = true;
      let subtitleColumn = '';

      if (id === 'adminInfo') {
        hasSubtitle = true;
        subtitleColumn = 'adminEmail';
      }
      if (id === 'adminEmail') {
        visible = false;
      }
      return {
        id,
        displayName,
        type,
        visible,
        sticky: false,
        searchable: true,
        sortable: true,
        movable: false,
        order: index + 1,
        groupable: false,
        hasSubtitle,
        subtitleColumn,
        showMenuOptions: false,
        hideable: true,
        stickable: true,
        titleStyle: {},
        subtitleStyle: { 'font-size': '8pt', color: 'darkgray' },
        hasPreTextImage: false,
        hasPostTextImage: false
      };
    });
    configOptions = { ...configOptions, allColumns };
    return configOptions;
  }

  formatTenants = (tenants: Tenant[]) =>
    tenants.map((tenant) => {
      const {
        tenantAdmin: { firstName, lastName, email }
      } = tenant;
      const adminInfo = `${firstName} ${lastName}`;
      const adminEmail = email;
      return { ...tenant, adminInfo, adminEmail };
    });
}
