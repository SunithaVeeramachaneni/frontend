import { TestBed } from '@angular/core/testing';
import { WiCommonService } from './wi-common.services';

describe('WiCommonService', () => {
  let service: WiCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WiCommonService] });
    service = TestBed.inject(WiCommonService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
