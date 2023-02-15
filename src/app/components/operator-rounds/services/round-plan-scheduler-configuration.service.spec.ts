import { TestBed } from '@angular/core/testing';

import { RoundPlanSchedulerConfigurationService } from './round-plan-scheduler-configuration.service';

describe('RoundPlanSchedulerConfigurationService', () => {
  let service: RoundPlanSchedulerConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPlanSchedulerConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
