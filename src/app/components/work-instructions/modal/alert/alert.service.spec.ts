import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AlertService] });
    service = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
