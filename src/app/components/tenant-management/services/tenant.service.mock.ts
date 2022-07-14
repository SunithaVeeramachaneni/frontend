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
        password: 'password', // AES encrypted string
        grantType: 'grantType',
        clientId: 'clientId',
        scope:
          '{"race":"racescope","mWorkOrder":"wrokorderscope","mInventory":"inventoryscope"}',
        saml: {
          oauth2Url: 'https://oauth2urltest.com',
          grantType: 'https://granttypetest.com',
          clientSecret: 'password', // AES encrypted string
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
      password: 'password', // AES encrypted string
      database: 'Tenantname',
      dialect: 'dialect'
    },
    nosql: {
      host: 'host',
      port: 12345,
      user: 'user',
      password: 'password', // AES encrypted string
      database: 'Tenantname'
    },
    noOfLicenses: 20,
    products: ['MWORKORDER', 'MINVENTORY'],
    modules: ['Dashboard'],
    logDBType: 'logDBType',
    logLevel: 'logLevel',
    isActive: true,
    createdBy: 'admin@innovapptive.com',
    createdAt: '2022-05-04 12:00:00',
    updatedAt: '2022-05-04 12:00:00',
    collaborationType: 'msteams'
  }
];

export const formatedTenants = tenants.map((tenant) => {
  const {
    tenantAdmin: { firstName, lastName, email }
  } = tenant;
  const adminInfo = `${firstName} ${lastName}`;
  const adminEmail = email;
  return { ...tenant, adminInfo, adminEmail };
});

export const tenants$ = of(tenants);
export const formatedTenants$ = of(formatedTenants);
