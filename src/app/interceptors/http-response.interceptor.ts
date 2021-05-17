import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return defer(() => {
      const key = request.urlWithParams;
      console.time(key);
      return next.handle(request).pipe(finalize(() => {
        console.timeEnd(key);
      }));
    });
  }
}
