import { TestBed } from '@angular/core/testing';
import { RoundPlanResolverService } from './round-plan-resolver.service';

describe('RoundPlanResolverService', () => {
  let service: RoundPlanResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPlanResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
