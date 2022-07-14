import { LogLevel } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Erp,
  Nosql,
  ProtectedResource,
  Rdbms,
  Tenant,
  UserDetails
} from './interfaces';

const authority =
  'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0';
const redirectUri = 'https://cwpdev.innovapptive.com/';

export const defaultAuthConfig = {
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

export const tenantsInfo: Tenant[] = [
  {
    tenantId: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
    tenantName: 'Innovapptive',
    tenantIdp: 'azure',
    clientId: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
    authority:
      'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
    redirectUri: 'http://localhost:4200/',
    tenantDomainName: 'innovapptive.com',
    protectedResources: {
      sap: {
        urls: ['http://localhost:8002/', 'http://localhost:8003/'],
        scope: 'api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access'
      } as ProtectedResource,
      node: {
        urls: [
          'http://localhost:8001/',
          'http://localhost:8004/',
          'http://localhost:8007/'
        ],
        scope: 'api://9d93f9da-6989-4aea-b59f-c26e06a2ef91/access_as_user'
      } as ProtectedResource
    },
    tenantAdmin: {} as UserDetails,
    erps: { sap: {} as Erp },
    rdbms: {} as Rdbms,
    nosql: {} as Nosql,
    noOfLicenses: 1,
    products: [],
    modules: [],
    logDBType: '',
    logLevel: '',
    collaborationType: 'msteams',
    slackConfiguration: {},
    msTeamsConfiguration: {}
  }
];

export const tenantsInfo$ = of(tenantsInfo);

export const authConfigs = [
  {
    configId: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
    authority:
      'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
    authWellknownEndpointUrl:
      'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
    redirectUrl: 'http://localhost:4200/',
    postLogoutRedirectUri: 'http://localhost:4200/',
    clientId: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
    scope:
      'openid profile offline_access email api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access',
    responseType: 'code',
    silentRenew: true,
    ignoreNonceAfterRefresh: true,
    maxIdTokenIatOffsetAllowedInSeconds: 600,
    issValidationOff: false,
    autoUserInfo: false,
    useRefreshToken: true,
    logLevel: 2,
    secureRoutes: ['http://localhost:8002/', 'http://localhost:8003/'],
    customParamsRefreshTokenRequest: {
      scope: 'api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access'
    }
  }
];
