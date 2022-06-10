import { NgModule } from '@angular/core';
import {
  AuthModule,
  StsConfigHttpLoader,
  StsConfigLoader
} from 'angular-auth-oidc-client';
import { AuthConfigService } from './auth-config.service';

const httpLoaderFactory = (authConfigService: AuthConfigService) => {
  const authConfigs = [];
  Array.from(Array(authConfigService.getAuthConfigsCount()).keys()).forEach(
    (v, i) => {
      const config$ = authConfigService.getAuthConfig$(i);
      authConfigs.push(config$);
    }
  );
  return new StsConfigHttpLoader(authConfigs);
};

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
