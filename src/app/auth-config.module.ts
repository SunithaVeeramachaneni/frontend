
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule, LogLevel, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment'

let hostname = window && window.location && window.location.hostname;
if (hostname) {
  hostname = hostname.split('.')[1]; // must be made generic
}
console.log(hostname);

export const httpLoaderFactory = (httpClient: HttpClient) => {
  const config$ = httpClient
    .get<any>(`${environment.spccAbapApiUrl}user/${hostname}`)
    .pipe(
      map((tenatConfig: any) => {
        console.log("tenatConfig",tenatConfig)
        return  ({
            authority:tenatConfig.authority ,
            authWellknownEndpointUrl: tenatConfig.authority,
            redirectUrl: tenatConfig.redirectUri,
            postLogoutRedirectUri:tenatConfig.redirectUri,
            clientId: tenatConfig.clientId,
            scope: "openid profile offline_access email api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access",
            responseType: "code",
            silentRenew: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: true,
            autoUserInfo: false,
            useRefreshToken: true,
            logLevel:1,
            secureRoutes:tenatConfig.secureRoutes,
            customParamsAuthRequest:{
                prompt:"select_account"
            }

         })
      })
    )
    .toPromise();

  return new StsConfigHttpLoader(config$);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
