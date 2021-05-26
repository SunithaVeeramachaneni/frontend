import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';

//const now = require("performance-now");

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return defer(() => {
      console.log(request);
      const key = request.urlWithParams;
      //var start = now();
      let start = window.performance.now();
      console.time(key);
      return next.handle(request).pipe(finalize(() => {
        console.timeEnd(key);
        //var end = now();
        //var time = end - start;
        //console.log(time);
        let end = window.performance.now();
        let time = end - start;
        localStorage.setItem("response", JSON.stringify(time))
        console.log(time)
      }));
    });
  }
}
