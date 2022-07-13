import { TestBed } from '@angular/core/testing';

import { AuthConfigService } from './auth-config.service';
import {
  authConfigs,
  defaultAuthConfig,
  tenantsInfo,
  tenantsInfo$
} from './auth-config.service.mock';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { ErrorInfo } from './interfaces';

const info = {} as ErrorInfo;

describe('AuthConfigService', () => {
  let service: AuthConfigService;
  let tenantServiceSpy: TenantService;

  beforeEach(() => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'getTenantsInfo$',
      'setTenantsInfo'
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: TenantService, useValue: tenantServiceSpy }]
    });
    service = TestBed.inject(AuthConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuthConfig$', () => {
    it('should be defined', () => {
      expect(service.getAuthConfig$).toBeDefined();
    });

    it('should fetch tenats info and return auth configuration', () => {
      (tenantServiceSpy.getTenantsInfo$ as jasmine.Spy)
        .withArgs(info)
        .and.returnValue(tenantsInfo$);

      service.getAuthConfig$(0).then((response) => {
        expect(response).toEqual(authConfigs[0]);
        expect(tenantServiceSpy.setTenantsInfo).toHaveBeenCalledWith(
          tenantsInfo
        );
      });
      expect(true).toBe(true);
    });
  });

  describe('getAuthConfigsCount', () => {
    it('should be defined', () => {
      expect(service.getAuthConfigsCount).toBeDefined();
    });

    it('should return auth configuration count', () => {
      expect(service.getAuthConfigsCount()).not.toBeUndefined();
    });
  });

  describe('prepareAuthConfig', () => {
    it('should be defined', () => {
      expect(service.prepareAuthConfig).toBeDefined();
    });

    it('should prepare auth configuration from tenant info', () => {
      expect(service.prepareAuthConfig(tenantsInfo[0])).toEqual(authConfigs[0]);
    });
  });

  describe('defaultAuthConfig', () => {
    it('should be defined', () => {
      expect(service.defaultAuthConfig).toBeDefined();
    });

    it('should return default auth configuration', () => {
      expect(service.defaultAuthConfig()).toEqual(defaultAuthConfig);
    });
  });
});
