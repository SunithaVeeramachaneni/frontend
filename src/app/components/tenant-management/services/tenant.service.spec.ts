import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { ErrorInfo, Tenant } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { columns, configOptions } from '../tenants/tenants.component.mock';

import { TenantService } from './tenant.service';
import { formatedTenants, tenants, tenants$ } from './tenant.service.mock';

const info = {} as ErrorInfo;

describe('TenantService', () => {
  let service: TenantService;
  let appServiceSpy: AppService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_postData',
      '_getResp',
      '_getRespById',
      'patchData'
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(TenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTenant$', () => {
    it('should define function', () => {
      expect(service.createTenant$).toBeDefined();
    });

    it('should create tenant', () => {
      const [{ id, ...tenant }] = tenants;
      (appServiceSpy._postData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          'catalogs',
          tenant,
          info
        )
        .and.returnValue(of({ ...tenant, id }));

      service.createTenant$(tenant, info).subscribe((response) => {
        expect(response).toEqual({ ...tenant, id });
        expect(appServiceSpy._postData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          'catalogs',
          tenant,
          info
        );
      });
    });
  });

  describe('updateTenant$', () => {
    it('should define function', () => {
      expect(service.updateTenant$).toBeDefined();
    });

    it('should update tenant', () => {
      const [{ id, rdbms, nosql, ...tenant }] = tenants;
      const updatedTenant = {
        ...tenant,
        modules: ['Dashboard', 'UserManagement']
      } as Tenant;
      (appServiceSpy.patchData as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          `catalogs/${id}`,
          updatedTenant,
          info
        )
        .and.returnValue(of(null));

      service.updateTenant$(id, updatedTenant, info).subscribe((response) => {
        expect(response).toEqual(updatedTenant);
        expect(appServiceSpy.patchData).toHaveBeenCalledWith(
          environment.userRoleManagementApiUrl,
          `catalogs/${id}`,
          updatedTenant,
          info
        );
      });
    });
  });

  describe('getTenants$', () => {
    it('should define function', () => {
      expect(service.getTenants$).toBeDefined();
    });

    it('should get tenants data', () => {
      const queryParams = {
        skip: 0,
        limit: defaultLimit,
        isActive: true
      };
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          'catalogs',
          info,
          queryParams
        )
        .and.returnValue(tenants$);

      service
        .getTenants$(queryParams, info)
        .subscribe((response) => expect(response).toEqual(formatedTenants));
    });
  });

  describe('getTenantsCount$', () => {
    it('should define function', () => {
      expect(service.getTenantsCount$).toBeDefined();
    });

    it('should get tenants count', () => {
      const queryParams = {
        isActive: true
      };
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(
          environment.userRoleManagementApiUrl,
          'catalogs/count',
          { displayToast: undefined, failureResponse: {} },
          queryParams
        )
        .and.returnValue(of({ count: tenants.length }));

      service
        .getTenantsCount$(queryParams, info)
        .subscribe((response) =>
          expect(response).toEqual({ count: tenants.length })
        );
    });
  });

  describe('getTenantById$', () => {
    it('should define function', () => {
      expect(service.getTenantById$).toBeDefined();
    });

    it('should get tenant data by id', () => {
      const [{ id }] = tenants;
      (appServiceSpy._getRespById as jasmine.Spy)
        .withArgs(environment.userRoleManagementApiUrl, 'catalogs/', id, info)
        .and.returnValue(of(tenants[0]));

      service
        .getTenantById$(id, info)
        .subscribe((response) => expect(response).toEqual(tenants[0]));
    });
  });

  describe('updateConfigOptionsFromColumns', () => {
    it('should define function', () => {
      expect(service.updateConfigOptionsFromColumns).toBeDefined();
    });

    it('should update configOptions from columns', () => {
      const updatedConfigOptions = service.updateConfigOptionsFromColumns(
        columns,
        {
          ...configOptions,
          allColumns: []
        }
      );

      expect(updatedConfigOptions).toEqual(configOptions);
    });
  });

  describe('formatTenants', () => {
    it('should define function', () => {
      expect(service.formatTenants).toBeDefined();
    });

    it('should format raw tenants data', () => {
      const data = service.formatTenants(tenants);

      expect(data).toEqual(formatedTenants);
    });
  });
});
