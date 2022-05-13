import { of } from 'rxjs';
import { Tenant, UserDetails } from 'src/app/interfaces';

export const tenants: Tenant[] = [
  {
    id: 1,
    tenantId: 'tenantId',
    tenantName: 'tenantName',
    tenantIdp: 'azure',
    clientId: 'clientId',
    authority: 'https://authoritytest.com',
    redirectUri: 'https://redirecturitest.com',
    tenantDomainName: 'tenantDomainName',
    tenantAdmin: {
      firstName: 'firstName',
      lastName: 'lastName',
      title: 'title',
      email: 'email@innovapptive.com'
    } as UserDetails,
    erps: {
      sap: {
        baseUrl: 'https://baseurltest.com',
        oauth2Url: 'https://oauth2urltest.com',
        username: 'username',
        password: 'U2FsdGVkX1/jzQzjSDwhGSxNNNeXk5uULcqqJGPhKOg=', // AES encrypted string
        grantType: 'grantType',
        clientId: 'clientId',
        scope: 'scope',
        saml: {
          oauth2Url: 'https://oauth2urltest.com',
          grantType: 'https://granttypetest.com',
          clientSecret: 'U2FsdGVkX1/jzQzjSDwhGSxNNNeXk5uULcqqJGPhKOg=', // AES encrypted string
          resource: 'resource',
          tokenUse: 'tokenUse',
          tokenType: 'tokenType'
        }
      }
    },
    protectedResources: {
      sap: {
        identityMetadata: 'https://identitymetadatatest.com',
        issuer: 'https://issuertest.com',
        clientId: 'clientId',
        audience: 'audience',
        scope: 'scope',
        urls: ['https://urltest.com']
      },
      node: {
        identityMetadata: 'https://identitymetadatatest.com',
        issuer: 'https://issuertest.com',
        clientId: 'clientId',
        audience: 'audience',
        scope: 'scope',
        urls: ['https://urltest.com']
      }
    },
    rdbms: {
      host: 'host',
      port: 1234,
      user: 'user',
      password: 'U2FsdGVkX1/jzQzjSDwhGSxNNNeXk5uULcqqJGPhKOg=', // AES encrypted string
      database: 'database',
      dialect: 'dialect'
    },
    nosql: {
      host: 'host',
      port: 12345,
      user: 'user',
      password: 'U2FsdGVkX1/jzQzjSDwhGSxNNNeXk5uULcqqJGPhKOg=', // AES encrypted string
      database: 'database'
    },
    noOfLicenses: 20,
    products: ['MWORKORDER', 'MINVENTORY'],
    modules: ['Dashboard'],
    logDBType: 'logDBType',
    logLevel: 'logLevel',
    isActive: true,
    createdBy: 'admin@innovapptive.com',
    createdAt: '2022-05-04 12:00:00',
    updatedAt: '2022-05-04 12:00:00'
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
