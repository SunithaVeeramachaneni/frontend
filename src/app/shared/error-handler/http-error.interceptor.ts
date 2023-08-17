import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../toast';
import { ErrorInfo } from '../../interfaces/error-info';
import { ErrorHandlerService } from './error-handler.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/components/login/services/login.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toasterService: ToastService,
    private errorHandlerService: ErrorHandlerService,
    private commonService: CommonService,
    private router: Router,
    private loginService: LoginService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const { displayToast = true, failureResponse = 'throwError' }: ErrorInfo =
      JSON.parse(request.headers.get('info')) ?? {};
    const cloneRequest = request.clone({
      headers: request.headers.delete('info')
    });
    return next.handle(cloneRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let newError = error;
        if (request.responseType === 'arraybuffer') {
          const msg = JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(error.error))
          ).message;

          if (msg?.length) {
            newError = {
              ...error,
              message: msg
            };
          }
        }
        console.error(newError);
        const text = this.errorHandlerService.getErrorMessage(newError);
        if (text.toLowerCase() === 'access denied') {
          this.commonService.displayPermissionRevoke(true);
        } else if (text.toLowerCase() === 'inactive user') {
          this.loginService.setUserAuthenticated(false);
          this.commonService.setDisplayLoader(false);
          this.router.navigate(['login/inactive'], {
            queryParams: {
              email: this.loginService.getLoggedInEmail(),
              reason: 'inactive'
            }
          });
        } else if (text.toLowerCase() === 'unknown user') {
          this.loginService.setUserAuthenticated(false);
          this.commonService.setDisplayLoader(false);
          this.router.navigate(['login/unknown'], {
            queryParams: {
              email: this.loginService.getLoggedInEmail(),
              reason: 'unknown'
            }
          });
        } else if (displayToast) {
          this.toasterService.show({
            text,
            type: 'warning'
          });
        }
        if (typeof failureResponse === 'object') {
          return of(new HttpResponse({ body: failureResponse }));
        } else if (failureResponse === 'throwError') {
          return throwError(newError);
        }
      })
    );
  }
}
