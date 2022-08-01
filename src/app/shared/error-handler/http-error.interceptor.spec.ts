import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ToastService } from '../toast';
import { ErrorHandlerService } from './error-handler.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let toasterServiceSpy: ToastService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let loginServiceSpy: LoginService;

  beforeEach(() => {
    toasterServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    loginServiceSpy = jasmine.createSpyObj('LoginService', [
      'setUserAuthenticated',
      'getLoggedInEmail'
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        HttpErrorInterceptor,
        { provide: ToastService, useValue: toasterServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor =
      TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
