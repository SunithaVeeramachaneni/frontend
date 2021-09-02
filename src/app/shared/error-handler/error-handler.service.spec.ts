import { TestBed } from '@angular/core/testing';
import { ToastService } from '../toast';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let toasterServiceSpy: ToastService;
  toasterServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ToastService, useValue: toasterServiceSpy },
    ]
  }));

  it('should be created', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
