import { of } from 'rxjs';
import { Tenant, UserDetails } from 'src/app/interfaces';

export const tenants: Tenant[] = [
  {
    id: 1,
    tenantId: 'tenantId',
    tenantName: 'tenantName',
    tenantIdp: 'tenantIdp',
    clientId: 'clientId',
    authority: 'authority',
    redirectUri: 'redirectUri',
    tenantDomainName: 'tenantDomainName',
    tenantAdmin: {
      firstName: 'firstName',
      lastName: 'lastName',
      title: 'title',
      email: 'email'
    } as UserDetails,
    erps: {
      sap: {
        baseUrl: 'baseUrl',
        oauth2Url: 'oauth2Url',
        username: 'username',
        password: '', // AES encrypted string
        grantType: 'grantType',
        clientId: 'clientId',
        scope: 'scope',
        saml: {
          oauth2Url: 'oauth2Url',
          grantType: 'grantType',
          clientSecret: '', // AES encrypted string
          resource: 'resource',
          tokenUse: 'tokenUse',
          tokenType: 'tokenType'
        }
      }
    },
    protectedResources: {
      sap: {
        identityMetadata: 'identityMetadata',
        issuer: 'issuer',
        clientId: 'clientId',
        audience: 'audience',
        scope: 'scope',
        urls: ['urls']
      },
      node: {
        identityMetadata: 'identityMetadata',
        issuer: 'issuer',
        clientId: 'clientId',
        audience: 'audience',
        scope: 'scope',
        urls: ['urls']
      }
    },
    rdbms: {
      host: 'host',
      port: 1234,
      user: 'user',
      password: '', // AES encrypted string
      database: 'database',
      dialect: 'dialect'
    },
    nosql: {
      host: 'host',
      port: 1234,
      user: 'user',
      password: '', // AES encrypted string
      database: 'database'
    },
    noOfLicenses: 20,
    products: ['products', 'products1'],
    modules: ['modules'],
    logDBType: 'logDBType',
    logLevel: 'logLevel',
    createdAt: '2022-05-04 12:00:00'
  }
];

export const formatedTenants = tenants.map((tenant) => {
  const {
    tenantAdmin: { firstName, lastName }
  } = tenant;
  const adminInfo = `${firstName} ${lastName}`;
  return { ...tenant, adminInfo };
});

export const tenants$ = of(tenants);
export const formatedTenants$ = of(formatedTenants);
