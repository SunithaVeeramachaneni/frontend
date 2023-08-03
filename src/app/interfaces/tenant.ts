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
  s3Details: S3Details;
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
  amplifyConfig?: any;
  configurations?: any;
  apiKeysInfo?: ApiKeyInfo[];
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
  scopes: Scope | string;
  basicCredentials: BasicCredentials;
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
  prefix: string;
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

export interface Rdbms {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
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
  race: ScopeDeatils;
  mWorkOrder: ScopeDeatils;
  mInventory: ScopeDeatils;
}

export interface ScopeDeatils {
  scope: string;
  collection: string;
}

export interface BasicCredentials {
  username: string;
  password: string;
}

export interface S3Details {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
}

export interface ApiKeyInfo {
  description: string;
  expiresOn: string;
  apiKey: string;
}

export interface ApiKeysInfoObject {
  apiKeysInfo: ApiKeyInfo[];
}

export interface ApiKeyEvent {
  type: 'create' | 'delete';
  apiKeyInfo: ApiKeyInfo;
}
