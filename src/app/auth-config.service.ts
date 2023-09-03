import { Inject, Injectable } from '@angular/core';
import {
  LogLevel,
  OidcSecurityService,
  OpenIdConfiguration
} from 'angular-auth-oidc-client';
import { Amplify } from 'aws-amplify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Buffer } from 'buffer';
import * as hash from 'object-hash';
import { environment } from 'src/environments/environment';
import { ErrorInfo, Tenant } from './interfaces';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { AppService } from './shared/services/app.services';
import { DOCUMENT } from '@angular/common';
// declare const TENANTS_COUNT: string;
const TENANTS_COUNT = 10;
@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  tenantsInfo$: Observable<Tenant>;
  constructor(
    private tenantService: TenantService,
    private appService: AppService,
    private oidcSecurityService: OidcSecurityService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  getAuthConfig$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Promise<OpenIdConfiguration> =>
    this.tenantService
      .getTenantInfoByTenantUrlDomainName$('cwpqa.innovapptive.com', info)
      .pipe(
        map((tenant: Tenant) => {
          if (tenant && Object.keys(tenant).length) {
            Amplify.configure(tenant?.amplifyConfig); // Added tenant based Amplify configure
            return this.prepareAuthConfig(tenant);
          }
          return this.defaultAuthConfig();
        })
      )
      .toPromise();
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
      'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0';
    const redirectUri = 'https://cwpqa.innovapptive.com/';
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
  getAccessTokenUsingRefreshToken$ = (protectedResource) => {
    const { tenantId: configId } = this.tenantService.getTenantInfo();
    const config = this.oidcSecurityService.getConfiguration(configId);
    const {
      authWellknownEndpoints: { tokenEndpoint },
      clientId
    } = config;
    const { urls, scope } = protectedResource;
    const data = {
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: this.oidcSecurityService.getRefreshToken(configId),
      scope
    };
    return this.appService
      .getAccessTokenUsingRefreshToken(tokenEndpoint, data)
      .pipe(
        map((response) => {
          if (Object.keys(response).length) {
            const { exp } = JSON.parse(
              Buffer.from(
                response.access_token.split('.')[1],
                'base64'
              ).toString()
            );
            response = {
              ...response,
              access_token_expires_at: exp * 1000
            };
            delete response.id_token;
            delete response.refresh_token;
            sessionStorage.setItem(hash(urls), JSON.stringify(response));
            return response;
          }
          return response;
        })
      );
  };
}
