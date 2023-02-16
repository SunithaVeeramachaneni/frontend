import { TestBed } from '@angular/core/testing';

import { UnitMeasurementService } from './unit-measurement.service';

describe('UnitMeasurementService', () => {
  let service: UnitMeasurementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitMeasurementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
