import { TestBed } from '@angular/core/testing';
import { CommonService } from './common.services';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CommonService] });
    service = TestBed.inject(CommonService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
