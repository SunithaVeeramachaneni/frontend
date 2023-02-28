import { TestBed } from '@angular/core/testing';

import { RoundPlanScheduleConfigurationService } from './round-plan-schedule-configuration.service';

describe('RoundPlanScheduleConfigurationService', () => {
  let service: RoundPlanScheduleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPlanScheduleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
