import { TestBed } from '@angular/core/testing';

import { RaceDynamicFormService } from './rdf.service';

describe('RaceDynamicFormService', () => {
  let service: RaceDynamicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaceDynamicFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
