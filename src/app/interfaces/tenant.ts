import { UserDetails } from './user';

export interface Tenant {
  id?: number;
  tenantId: string;
  tenantName: string;
  tenantIdp: string;
  clientId: string;
  authority: string;
  redirectUri: string;
  tenantDomainName: string;
  tenantAdmin: UserDetails;
  erps: { [key: string]: Erp };
  protectedResources: { [key: string]: ProtectedResourceLatest };
  rdbms: Rdbms;
  nosql: Nosql;
  licenseInfo: LicenseInfo;
  products: string[];
  modules: string[];
  logDBType: string;
  logLevel: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProtectedResourceLatest {
  identityMetadata: string;
  issuer: string;
  clientId: string;
  audience: string;
  scope: string;
  urls: string[];
}

export interface Erp {
  baseUrl: string;
  oauth2Url: string;
  username: string;
  password: string;
  grantType: string;
  clientId: string;
  scope: string;
  saml: Saml;
}

export interface Saml {
  oauth2Url: string;
  grantType: string;
  clientSecret: string;
  resource: string;
  tokenUse: string;
  tokenType: string;
}

export interface Nosql {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface Rdbms extends Nosql {
  dialect: string;
}

export interface LicenseInfo {
  start: string;
  end: string;
  count: number;
}

export interface TenantData {
  data: Tenant[];
}

export interface DeactivateTenant {
  deactivate: boolean;
  id: number;
}
