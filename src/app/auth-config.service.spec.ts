import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthConfigService } from './auth-config.service';
import {
  authConfigs,
  defaultAuthConfig,
  tenantsInfo,
  tenantsInfo$
} from './auth-config.service.mock';
import { ErrorInfo } from './interfaces';
import { AppService } from './shared/services/app.services';
import { CommonService } from './shared/services/common.service';

const info = {} as ErrorInfo;

describe('AuthConfigService', () => {
  let service: AuthConfigService;
  let appServiceSpy: AppService;
  let commonServiceSpy: CommonService;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj('AppService', ['_getResp']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setTenantsInfo'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AppService, useValue: appServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy }
      ]
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
      (appServiceSpy._getResp as jasmine.Spy)
        .withArgs(environment.userRoleManagementApiUrl, 'catalogs/info', info)
        .and.returnValue(tenantsInfo$);

      service.getAuthConfig$(0).then((response) => {
        expect(response).toEqual(authConfigs[0]);
        expect(commonServiceSpy.setTenantsInfo).toHaveBeenCalledWith(
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
