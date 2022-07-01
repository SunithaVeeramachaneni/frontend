/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorInfo, Tenant } from './interfaces';
import { AppService } from './shared/services/app.services';
import { CommonService } from './shared/services/common.service';
import { cloneDeep } from 'lodash';

const TENANTS_COUNT = 100;

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  tenantsInfo$: Observable<Tenant[]>;
  authConfigsCount = TENANTS_COUNT ? +TENANTS_COUNT : 1;

  constructor(
    private appService: AppService,
    private commonService: CommonService
  ) {}

  getAuthConfig$ = (
    index: number,
    info: ErrorInfo = {} as ErrorInfo
  ): Promise<OpenIdConfiguration> => {
    if (!this.tenantsInfo$) {
      this.tenantsInfo$ = this.appService
        ._getResp(environment.userRoleManagementApiUrl, 'catalogs/info', info)
        .pipe(
          tap((tenants) =>
            this.commonService.setTenantsInfo(cloneDeep(tenants))
          ),
          shareReplay(1)
        );
    }
    return this.tenantsInfo$
      .pipe(
        map((tenants: Tenant[]) => {
          const tenant = tenants.find((v, i) => i === index);
          if (tenant) {
            return this.prepareAuthConfig(tenant);
          }
          return this.defaultAuthConfig();
        })
      )
      .toPromise();
  };

  getAuthConfigsCount = (): number => this.authConfigsCount;

  prepareAuthConfig = (tenant: Tenant) => {
    const { tenantId, authority, clientId, protectedResources, redirectUri } =
      tenant || {};
    const { sap, node } = protectedResources || {};
    const { urls, scope } = sap || {};

    return {
      configId: tenantId,
      authority,
      authWellknownEndpointUrl: authority,
      redirectUrl: 'http://localhost:4200/',
      postLogoutRedirectUri: 'http://localhost:4200/',
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
  };

  defaultAuthConfig() {
    const authority =
      'https://login.microsoftonline.com/63ad6831-ccca-481c-bc5a-76fc53f85b9b/v2.0';
    const redirectUri = 'http://localhost:4200/';
    return {
      configId: 'default',
      authority,
      authWellknownEndpointUrl: authority,
      redirectUrl: redirectUri,
      postLogoutRedirectUri: redirectUri,
      clientId: 'ad72beb9-737b-461b-985a-eeb3551faf40',
      scope: `openid profile offline_access email`,
      responseType: 'code',
      silentRenew: false,
      ignoreNonceAfterRefresh: true,
      maxIdTokenIatOffsetAllowedInSeconds: 600,
      issValidationOff: false,
      autoUserInfo: false,
      useRefreshToken: true,
      logLevel: environment.production ? LogLevel.Error : LogLevel.Warn,
      secureRoutes: []
    };
  }
}
