import { TestBed } from '@angular/core/testing';

import { RoundPlanObservationsService } from './round-plan-observation.service';

describe('RoundPlanObservationsService', () => {
  let service: RoundPlanObservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPlanObservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
