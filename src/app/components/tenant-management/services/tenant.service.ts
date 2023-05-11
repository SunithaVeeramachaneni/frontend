/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Count, ErrorInfo, TableColumn, Tenant } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private tenantInfo: Tenant = {} as Tenant;
  private tenantsInfo: Tenant[] = [];
  private tenantInfoSubject = new BehaviorSubject<Tenant>({} as Tenant);
  tenantInfo$ = this.tenantInfoSubject.asObservable();

  constructor(private appService: AppService) {}

  setTenantInfo(tenantInfo: Tenant) {
    this.tenantInfoSubject.next({ ...this.tenantInfo, ...tenantInfo });
    this.tenantInfo = { ...this.tenantInfo, ...tenantInfo };
  }

  getTenantInfo() {
    return this.tenantInfo;
  }

  setTenantsInfo(tenantsInfo: Tenant[]) {
    this.tenantsInfo = tenantsInfo;
  }

  getTenantsInfo() {
    return this.tenantsInfo;
  }

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

  getTenantInfoByTenantUrlDomainName$ = (
    tenantUrlDomainName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Tenant> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        `catalogs/${tenantUrlDomainName}/info`,
        { displayToast, failureResponse }
      )
      .pipe(tap((tenant) => this.setTenantInfo(cloneDeep(tenant))));
  };

  getTenantsInfo$ = (info: ErrorInfo = {} as ErrorInfo): Observable<Tenant[]> =>
    this.appService
      ._getResp(environment.userRoleManagementApiUrl, 'catalogs/info', info)
      .pipe(
        tap((tenants) => this.setTenantsInfo(cloneDeep(tenants))),
        shareReplay(1)
      );

  getTenantLogoByTenantId$ = (
    tenantId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._getRespById(
      environment.userRoleManagementApiUrl,
      `catalogs/${tenantId}/logo`,
      '',
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
      let sortable = false;

      if (id === 'adminInfo') {
        hasSubtitle = true;
        subtitleColumn = 'adminEmail';
      }
      if (id === 'adminEmail') {
        visible = false;
      }
      if (id === 'tenantName' || id === 'createdAt') {
        sortable = true;
      }
      return {
        id,
        displayName,
        type,
        controlType: 'string',
        visible,
        sticky: false,
        searchable: true,
        sortable,
        movable: false,
        order: index + 1,
        groupable: false,
        hasSubtitle,
        subtitleColumn,
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

  getTenantAmplifyConfigByTenantId$ = (
    tenantId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    // eslint-disable-next-line no-underscore-dangle
    this.appService._getRespById(
      environment.userRoleManagementApiUrl,
      `catalogs/${tenantId}/amplifyConfig`,
      '',
      info
    );

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
