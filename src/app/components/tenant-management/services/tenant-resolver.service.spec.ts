import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TenantResolverService } from './tenant-resolver.service';
import { TenantService } from './tenant.service';
import { tenants } from './tenant.service.mock';

describe('TenantResolverService', () => {
  let service: TenantResolverService;
  let tenantServiceSpy: TenantService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(() => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'getTenantById$'
    ]);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: TenantService, useValue: tenantServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: convertToParamMap({ id: tenants[0].id })
          }
        }
      ]
    });
    service = TestBed.inject(TenantResolverService);
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    (tenantServiceSpy.getTenantById$ as jasmine.Spy)
      .withArgs(tenants[0].id)
      .and.returnValue(of(tenants[0]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve tenant data', () => {
    service
      .resolve(route.snapshot)
      .subscribe((response) => expect(response).toEqual(tenants[0]));
  });

  it('should navigate to tenant management screen when resolve tenant data is null', () => {
    (tenantServiceSpy.getTenantById$ as jasmine.Spy)
      .withArgs(tenants[0].id)
      .and.returnValue(of(null));
    const navigateSpy = spyOn(router, 'navigate');

    service.resolve(route.snapshot).subscribe((response) => {
      expect(response).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/tenant-management']);
    });
  });
});
