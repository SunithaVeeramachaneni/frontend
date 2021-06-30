import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TenantConfig, TenantsConfig } from '../interfaces/tenant-config';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {

  private configUrl = `assets/config/tenants-config.json`;
  private tenantsConfig: TenantsConfig = {};
  private http: HttpClient;

  constructor(private readonly httpHandler: HttpBackend) {
    this.http = new HttpClient(httpHandler);
  }

  config = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get<TenantsConfig>(this.configUrl)
        .subscribe(
          (tenantsConfig: TenantsConfig) => {
            this.tenantsConfig = tenantsConfig;
            resolve(true);
          },
          error => reject(error)
        );
    });
  }

  getTenantConfig = (tenant: string): TenantConfig => {
    return this.tenantsConfig[tenant];
  }

}
