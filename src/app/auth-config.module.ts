import { NgModule } from '@angular/core';
import {
  AuthModule,
  StsConfigHttpLoader,
  StsConfigLoader
} from 'angular-auth-oidc-client';
import { AuthConfigService } from './auth-config.service';

const httpLoaderFactory = (authConfigService: AuthConfigService) =>
  new StsConfigHttpLoader(authConfigService.getAuthConfig$());

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [AuthConfigService]
      }
    })
  ],
  exports: [AuthModule]
})
export class AuthConfigModule {}
