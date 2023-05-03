import { TestBed } from '@angular/core/testing';

import { MdmTableService } from './mdm-table.service';

describe('MdmTableService', () => {
  let service: MdmTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdmTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
