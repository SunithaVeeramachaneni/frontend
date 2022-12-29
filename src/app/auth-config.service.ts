import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { TenantService } from './components/tenant-management/services/tenant.service';
import { Tenant } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  private;
  constructor(
    private tenantService: TenantService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  getTenantConfig$ = (): Observable<Tenant> =>
    this.tenantService
      .getTenantInfoByTenantDomainUrlHost$(this.document.location.host)
      .pipe(
        tap((tenantInfo) => {
          if (Object.keys(tenantInfo).length) {
            const {
              cognito: { region, userPoolId, domain, redirectUrl },
              tenantId
            } = tenantInfo;
            this.tenantService.setTenantInfo(tenantInfo);
            Auth.configure({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Auth: {
                region,
                userPoolId,
                userPoolWebClientId: tenantId,
                mandatorySignIn: false,
                signUpVerificationMethod: 'code',
                storage: sessionStorage,
                authenticationFlowType: 'USER_SRP_AUTH',
                oauth: {
                  domain,
                  scope: [
                    'phone',
                    'email',
                    'profile',
                    'openid',
                    'aws.cognito.signin.user.admin'
                  ],
                  redirectSignIn: redirectUrl,
                  redirectSignOut: redirectUrl,
                  responseType: 'code'
                }
              }
            });
          }
        })
      );
}
