import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  AuthModule,
  LogLevel,
  StsConfigHttpLoader,
  StsConfigLoader
} from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TenantConfig } from './interfaces';
import { CommonService } from './shared/services/common.service';

const hostname =
  (window && window.location && window.location.hostname) || 'localhost';

export const httpLoaderFactory = (
  httpClient: HttpClient,
  commonService: CommonService
) => {
  const config$ = httpClient
    .get<any>(`${environment.spccAbapApiUrl}user/${hostname}`)
    .pipe(
      map((tenatConfig: TenantConfig) => {
        const {
          authority,
          clientId,
          sapProtectedResources,
          nodeProtectedResources
        } = tenatConfig;
        const { urls, scope } = sapProtectedResources || {};
        commonService.setProtectedResources(nodeProtectedResources);
        commonService.setTenantConfig(tenatConfig);

        return {
          authority,
          authWellknownEndpointUrl: authority,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId,
          scope: `openid profile offline_access email ${scope}`,
          responseType: 'code',
          silentRenew: true,
          ignoreNonceAfterRefresh: true,
          maxIdTokenIatOffsetAllowedInSeconds: 600,
          issValidationOff: false, // this needs to be true if using a common endpoint in Azure
          autoUserInfo: false,
          useRefreshToken: true,
          logLevel: environment.production ? LogLevel.Error : LogLevel.Warn,
          secureRoutes: urls,
          customParamsRefreshTokenRequest: {
            scope
          }
        };
      })
    )
    .toPromise();

  return new StsConfigHttpLoader(config$);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient, CommonService]
      }
    })
  ],
  exports: [AuthModule]
})
export class AuthConfigModule {}
