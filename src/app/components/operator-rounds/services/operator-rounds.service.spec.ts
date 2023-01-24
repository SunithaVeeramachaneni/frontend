import { TestBed } from '@angular/core/testing';
import { OperatorRoundsService } from './operator-rounds.service';

describe('OperatorRoundsService', () => {
  let service: OperatorRoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorRoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
