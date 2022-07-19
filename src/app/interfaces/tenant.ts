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
  protectedResources: { [key: string]: ProtectedResource };
  rdbms: Rdbms;
  nosql: Nosql;
  noOfLicenses: number;
  products: string[];
  modules: string[];
  logDBType: string;
  logLevel: string;
  tenantLogo?: any;
  tenantLogoName?: string;
  isActive?: boolean;
  collaborationType: string;
  slackConfiguration?: any;
  msTeamsConfiguration?: any;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProtectedResource {
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
  scope: Scope | string;
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

export interface Scope {
  race: string;
  mWorkOrder: string;
  mInventory: string;
}
