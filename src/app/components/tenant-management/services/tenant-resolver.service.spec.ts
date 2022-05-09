import { TestBed } from '@angular/core/testing';

import { TenantResolverService } from './tenant-resolver.service';

describe('TenantResolverService', () => {
  let service: TenantResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
