import { TestBed } from '@angular/core/testing';
import { tenantsInfo } from 'src/app/auth-config.service.mock';
import { CommonService } from 'src/app/shared/services/common.service';
import { TenantService } from '../../tenant-management/services/tenant.service';

import { LoginService } from './login.service';
import { userAuthData } from './login.service.mock';

describe('LoginService', () => {
  let service: LoginService;
  let tenantServiceSpy: TenantService;
  let commonServiceSpy: CommonService;

  beforeEach(() => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'getTenantsInfo',
      'setTenantInfo'
    ]);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setProtectedResources'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy }
      ]
    });
    service = TestBed.inject(LoginService);

    (tenantServiceSpy.getTenantsInfo as jasmine.Spy)
      .withArgs()
      .and.returnValue(tenantsInfo)
      .and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUserAuthenticated', () => {
    it('should define function', () => {
      expect(service.setUserAuthenticated).toBeDefined();
    });

    it('should set user authenticated', () => {
      service.setUserAuthenticated(true);

      service.isUserAuthenticated$.subscribe((isUserAuthenticated) =>
        expect(isUserAuthenticated).toBeTrue()
      );
    });
  });

  describe('performPostLoginActions', () => {
    it('should define function', () => {
      expect(service.performPostLoginActions).toBeDefined();
    });

    it('should perform post login actions', () => {
      service.performPostLoginActions(userAuthData.allUserData[0], []);

      expect(tenantServiceSpy.setTenantInfo).toHaveBeenCalledWith(
        tenantsInfo[0]
      );
      expect(commonServiceSpy.setProtectedResources).toHaveBeenCalledWith(
        tenantsInfo[0].protectedResources.sap
      );
      expect(commonServiceSpy.setProtectedResources).toHaveBeenCalledWith(
        tenantsInfo[0].protectedResources.node
      );
      service.isUserAuthenticated$.subscribe((isUserAuthenticated) =>
        expect(isUserAuthenticated).toBeTrue()
      );
    });
  });
});
