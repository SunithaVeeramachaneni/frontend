import { TestBed } from '@angular/core/testing';
import { ToastService } from '../toast';
import { ErrorHandlerService } from './error-handler.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let toasterServiceSpy: ToastService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  toasterServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
  errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpErrorInterceptor,
      { provide: ToastService, useValue: toasterServiceSpy },
      { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy }
    ]
  }));

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
