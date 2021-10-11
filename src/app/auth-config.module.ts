import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
        authWellknownEndpointUrl: 'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
        redirectUrl: 'http://localhost:4200',
        clientId: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
        scope: 'openid profile offline_access email api://06a96c09-45cc-4120-8f96-9c0a0d89d6bc/scp.access',
        responseType: 'code',
        silentRenew: true,
        maxIdTokenIatOffsetAllowedInSeconds: 600,
        issValidationOff: true,
        autoUserInfo: false,
        // silentRenewUrl: window.location.origin + '/silent-renew.html',
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
        customParamsAuthRequest: {
          prompt: 'select_account', // login, consent
        },
        secureRoutes:['http://localhost:8000/']
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
