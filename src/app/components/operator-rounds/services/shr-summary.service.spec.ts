import { TestBed } from '@angular/core/testing';

import { ShrSummaryService } from './shr-summary.service';

describe('ShrSummaryService', () => {
  let service: ShrSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShrSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
