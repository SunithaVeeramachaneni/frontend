import { TestBed } from '@angular/core/testing';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';

import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;
  let tenantServiceSpy: TenantService;

  beforeEach(() => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getTenantInfo']);
    TestBed.configureTestingModule({
      providers: [{ provide: TenantService, useValue: tenantServiceSpy }]
    });
    service = TestBed.inject(SseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
