/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';
import { LoginService } from 'src/app/components/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private tenantService: TenantService,
    private loginService: LoginService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { tenantId } = this.tenantService.getTenantInfo();
    if (request.headers.get('authorization') === null) {
      const jwtToken = this.loginService
        .getLoggedInUserSession()
        ?.getAccessToken().jwtToken;
      const cloneRequest = request.clone({
        headers: request.headers.set('authorization', `Bearer ${jwtToken}`)
      });
      return next.handle(cloneRequest);
    } else {
      return next.handle(request);
    }
  }
}
