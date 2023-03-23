import { TestBed } from '@angular/core/testing';

import { FormScheduleConfigurationService } from './form-schedule-configuration.service';

describe('FormScheduleConfigurationService', () => {
  let service: FormScheduleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormScheduleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
