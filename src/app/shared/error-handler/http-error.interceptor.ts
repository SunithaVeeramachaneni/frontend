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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toasterService: ToastService,
    private errorHandlerService: ErrorHandlerService,
    private commonService: CommonService
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
        console.error(error);
        const text = this.errorHandlerService.getErrorMessage(error);
        if (text === 'Access Denied') {
          this.commonService.displayPermissionRevoke(true);
        } else if (displayToast) {
          this.toasterService.show({
            text,
            type: 'warning'
          });
        }
        if (typeof failureResponse === 'object') {
          return of(new HttpResponse({ body: failureResponse }));
        } else if (failureResponse === 'throwError') {
          return throwError(error);
        }
      })
    );
  }
}
