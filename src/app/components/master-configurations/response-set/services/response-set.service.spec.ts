import { TestBed } from '@angular/core/testing';

import { ResponseSetService } from './response-set.service';

describe('ResponseSetService', () => {
  let service: ResponseSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
