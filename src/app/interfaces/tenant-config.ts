export interface TenantConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  protectedResourceMaps: any[];
}
export interface TenantsConfig {
  [key: string]: TenantConfig;
}
