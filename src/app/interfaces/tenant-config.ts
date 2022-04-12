export interface ProtectedResource {
  urls: string[];
  scope: string;
}

export interface TenantConfig {
  tenantId: string;
  tenantName: string;
  tenantDate: Date;
  tenantIdp: string;
  clientId: string;
  authority: string;
  redirectUri: string;
  sapProtectedResources: ProtectedResource;
  nodeProtectedResources: ProtectedResource;
}
