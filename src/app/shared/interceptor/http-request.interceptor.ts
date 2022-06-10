/* eslint-disable @typescript-eslint/naming-convention */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import { Buffer } from 'buffer';
import * as hash from 'object-hash';
import { AppService } from '../services/app.services';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private appService: AppService,
    private commonService: CommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { tenantId } = this.commonService.getTenantInfo();
    const configId = tenantId;
    if (request.headers.get('authorization') === null) {
      const protectedResource = this.getProtectedResource(request.url);

      if (protectedResource && Object.keys(protectedResource).length) {
        const { urls, scope } = protectedResource;
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
        } else {
          const config = this.oidcSecurityService.getConfiguration(configId);
          const {
            authWellknownEndpoints: { tokenEndpoint },
            clientId
          } = config;
          const data = {
            grant_type: 'refresh_token',
            client_id: clientId,
            refresh_token: this.oidcSecurityService.getRefreshToken(configId),
            scope
          };

          return this.appService.postRefreshToken(tokenEndpoint, data).pipe(
            switchMap((response) => {
              if (Object.keys(response).length) {
                const { exp } = JSON.parse(
                  Buffer.from(
                    response['access_token'].split('.')[1],
                    'base64'
                  ).toString()
                );
                response = { ...response, access_token_expires_at: exp * 1000 };
                delete response.id_token;
                delete response.refresh_token;
                sessionStorage.setItem(hash(urls), JSON.stringify(response));
                const cloneRequest = request.clone({
                  headers: request.headers
                    .set(
                      'authorization',
                      `${response['token_type']} ${response['access_token']}`
                    )
                    .set('tenantid', tenantId)
                });
                return next.handle(cloneRequest);
              } else {
                return next.handle(request);
              }
            })
          );
        }
      } else {
        return next.handle(request);
      }
    } else {
      const cloneRequest = request.clone({
        headers: request.headers.set('tenantid', tenantId)
      });
      return next.handle(cloneRequest);
    }
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
