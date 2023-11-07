import { TestBed } from '@angular/core/testing';

import { ShrService } from './shr.service';

describe('ShrService', () => {
  let service: ShrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
