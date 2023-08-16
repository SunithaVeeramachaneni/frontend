import { TestBed } from '@angular/core/testing';

import { FormUpdateProgressService } from './form-update-progress.service';

describe('FormUpdateProgressService', () => {
  let service: FormUpdateProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUpdateProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
