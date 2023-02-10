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
import { environment } from 'src/environments/environment';

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
    const configId = tenantId;
    if (!environment.production) {
      const cloneRequest = request.clone({
        headers: request.headers.set(
          'authorization',
          `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJhcGk6Ly85ZDkzZjlkYS02OTg5LTRhZWEtYjU5Zi1jMjZlMDZhMmVmOTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mOGU2ZjA0Yi0yYjlmLTQzYWItYmE4YS1iNGMzNjcwODg3MjMvIiwiaWF0IjoxNjc2MDIzMjk0LCJuYmYiOjE2NzYwMjMyOTQsImV4cCI6MTY3NjAyNzQyNywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhUQUFBQTBuK2lSU0R0aWZCQWRCV1VxK1ExaG5uVlpFY2txV3MwcEtod1BvdUlhQ0h3WGFlYmpHRHl0N25nSlFDV2lxa0oiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiMDZhOTZjMDktNDVjYy00MTIwLThmOTYtOWMwYTBkODlkNmJjIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJWZWVyYW1hY2hhbmVuaSIsImdpdmVuX25hbWUiOiJTdW5pdGhhIiwiaXBhZGRyIjoiMTIyLjE3MC4zMi4xNDYiLCJuYW1lIjoiU3VuaXRoYSBWZWVyYW1hY2hhbmVuaSIsIm9pZCI6ImJiMDE0NzY0LWY5YWItNDM5OS04MTdhLTIzMjUwYjlmMmJhZCIsInJoIjoiMC5BUklBU19EbS1KOHJxME82aXJURFp3aUhJOXI1azUySmFlcEt0Wl9DYmdhaTc1RVNBSEUuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJtTG5nNHRCSFZveEVNZlVmNDlZRl8xbkdQUFZ2eC1tVGxSY095OFgyZXowIiwidGlkIjoiZjhlNmYwNGItMmI5Zi00M2FiLWJhOGEtYjRjMzY3MDg4NzIzIiwidW5pcXVlX25hbWUiOiJzdW5pdGhhLnZlZXJhbWFjaGFuZW5pQGlubm92YXBwdGl2ZS5jb20iLCJ1cG4iOiJzdW5pdGhhLnZlZXJhbWFjaGFuZW5pQGlubm92YXBwdGl2ZS5jb20iLCJ1dGkiOiJQS1owQV9KeW5rT2RfYmZwYlNpQkFRIiwidmVyIjoiMS4wIn0.ia1DrJzno1_CmuF1NmcrJ-LweaNV7ZTsJGIeRxSRH78P8gMVwKstIsIyduFXgGUfNSuW8joO-GEXw-u_lGm6quLACWvwo9eGImBZtSJJotwA_290OaeLAFb-kfDLdWk3E2abZrLbuSoVfaNlA-8F79Pta6mMCLvY38jyLbZ1C5TStcQ1Ifd-IwSyNonqNb4UXY9189w2QkwwsZ4Ko10J7zKUT9bafR0Yx2HlBN5SfN_OXbZe_1_Oc02BcnS7SE6jPnSy5AHKvt-FUmJps0e8BKmjdEbri9HMREuC2yUMqiP4hC6Xi9TehaNoFfINCjqE34RrWA-l_fGN81CB3YSnwA`
        )
      });
      return next.handle(cloneRequest);
    } else {
      if (request.headers.get('authorization') === null) {
        const protectedResource = this.getProtectedResource(request.url);

        if (protectedResource && Object.keys(protectedResource).length) {
          const { urls } = protectedResource;
          const { token_type, access_token, access_token_expires_at } =
            JSON.parse(sessionStorage.getItem(hash(urls))) || {};

          if (
            access_token &&
            new Date().getTime() < access_token_expires_at - 30000
          ) {
            const cloneRequest = request.clone({
              headers: request.headers.set(
                'authorization',
                `${token_type} ${access_token}`
              )
            });
            return next.handle(cloneRequest);
          } else {
            return this.authConfigService
              .getAccessTokenUsingRefreshToken$(protectedResource)
              .pipe(
                switchMap((response) => {
                  if (Object.keys(response).length) {
                    const cloneRequest = request.clone({
                      headers: request.headers.set(
                        'authorization',
                        // eslint-disable-next-line @typescript-eslint/dot-notation
                        `${response['token_type']} ${response['access_token']}`
                      )
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
        const cloneRequest = request.clone({});
        return next.handle(cloneRequest);
      }
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
