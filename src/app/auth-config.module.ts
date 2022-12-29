import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthConfigService } from './auth-config.service';
import { HttpClientModule } from '@angular/common/http';

const authCofigFactrory = (authConfigService: AuthConfigService) => () =>
  authConfigService.getTenantConfig$();

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authCofigFactrory,
      deps: [AuthConfigService],
      multi: true
    }
  ]
})
export class AuthConfigModule {}
