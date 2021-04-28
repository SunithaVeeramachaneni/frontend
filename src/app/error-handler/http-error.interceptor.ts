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
import { ToastService } from '../shared/toast';
import { ErrorInfo } from '../interfaces/error-info';
import { InstructionService } from '../components/workInstructions-home/categories/workinstructions/instruction.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toasterService: ToastService, private instructionService: InstructionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { displayToast = true, failureResponse = 'throwError' }: ErrorInfo = JSON.parse(request.headers.get('info')) ?? {};
    const cloneRequest = request.clone({
      headers: request.headers.delete('info')
    });
    return next.handle(cloneRequest)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (displayToast) {
            this.toasterService.show({
              text: this.instructionService.getErrorMessage(error),
              type: 'warning',
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
