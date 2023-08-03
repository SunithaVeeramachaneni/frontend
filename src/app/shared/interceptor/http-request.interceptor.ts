/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import * as hash from 'object-hash';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';
import { AuthConfigService } from 'src/app/auth-config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private commonService: CommonService,
    private tenantService: TenantService,
    private authConfigService: AuthConfigService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { tenantId } = this.tenantService.getTenantInfo();
    const protectedResource = this.getProtectedResource(request.url);
    const authorization = request.headers.get('authorization');

    if (
      authorization === null &&
      protectedResource &&
      Object.keys(protectedResource).length
    ) {
      const { urls } = protectedResource;
      const { token_type, access_token, access_token_expires_at } =
        JSON.parse(sessionStorage.getItem(hash(urls))) || {};

      if (
        access_token &&
        new Date().getTime() < access_token_expires_at - 30000
      ) {
        const cloneRequest = request.clone({
          headers: request.headers
            .set('authorization', `${token_type} ${access_token}`)
            .set('tenantid', tenantId)
        });
        return next.handle(cloneRequest);
      }

      return this.authConfigService
        .getAccessTokenUsingRefreshToken$(protectedResource)
        .pipe(
          switchMap((response) => {
            if (Object.keys(response).length) {
              const cloneRequest = request.clone({
                headers: request.headers
                  .set(
                    'authorization',
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    `${response['token_type']} ${response['access_token']}`
                  )
                  .set('tenantid', tenantId)
              });
              return next.handle(cloneRequest);
            } else {
              const cloneRequest = request.clone({
                headers: request.headers.set('tenantid', tenantId)
              });
              return next.handle(cloneRequest);
            }
          })
        );
    }

    if (
      authorization !== null &&
      protectedResource &&
      Object.keys(protectedResource).length
    ) {
      const cloneRequest = request.clone({
        headers: request.headers.set('tenantid', tenantId)
      });
      return next.handle(cloneRequest);
    }

    return next.handle(request);
  }

  getProtectedResource(requestUrl: string) {
    return this.commonService
      .getProtectedResources()
      .find((protectedResource) => {
        const { urls } = protectedResource;
        return urls.find((url) => requestUrl.indexOf(url) > -1);
      });
  }
}
