import { TestBed } from '@angular/core/testing';

import { ColumnConfigurationService } from './column-configuration.service';

describe('ColumnConfigurationService', () => {
  let service: ColumnConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
