import { TestBed } from '@angular/core/testing';

import { RoundPlanConfigurationService } from './round-plan-configuration.service';

describe('RoundPlanConfigurationService', () => {
  let service: RoundPlanConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPlanConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
