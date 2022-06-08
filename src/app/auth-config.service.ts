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

declare const TENANTS_COUNT: string;

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
      redirectUrl: redirectUri,
      postLogoutRedirectUri: redirectUri,
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
      'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0';
    const redirectUri = 'https://cwpdev.innovapptive.com/';
    return {
      configId: 'default',
      authority,
      authWellknownEndpointUrl: authority,
      redirectUrl: redirectUri,
      postLogoutRedirectUri: redirectUri,
      clientId: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
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
