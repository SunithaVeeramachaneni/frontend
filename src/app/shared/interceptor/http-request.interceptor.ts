import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private oidcSecurityService: OidcSecurityService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('oauth2/v2.0/token') > -1 && request.method.toLowerCase() === 'post' && request.body.indexOf('scope=') === -1 && request.body.indexOf('grant_type=refresh_token') > -1) {
      const config = this.oidcSecurityService.getConfiguration();
      const { scope } = config;
      const cloneRequest = request.clone({
        body: `${request.body}&scope=${scope}`
      });
      return next.handle(cloneRequest);
    } else {
      return next.handle(request);
    }
  }
}
