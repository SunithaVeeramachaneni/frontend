export interface TenantConfig {
  tenantId: string;
  tenantName: string;
  tenantDate: Date;
  tenantIdp: string;
  clientId: string;
  authority: string;
  redirectUri: string;
  sapProtectedResources: [string[], string];
  nodeProtectedResources: [string[], string];
}
