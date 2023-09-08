/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastModule } from './shared/toast';
import { UserIdleModule } from 'angular-user-idle';

import { AuthConfigModule } from './auth-config.module';
import {
  AuthInterceptor,
  EventTypes,
  OidcSecurityService,
  PublicEventsService
} from 'angular-auth-oidc-client';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTimeoutInterceptor } from './interceptors/http-timeout.interceptor';
import { HttpRequestInterceptor } from './shared/interceptor/http-request.interceptor';
import { ErrorHandlerModule } from './shared/error-handler/error-handler.module';

import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { CommonService } from './shared/services/common.service';
import { from } from 'rxjs';
import { SharedModule } from './shared/shared.module';
import { FormModule } from './forms/form.module';
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { defaultLanguage } from './app.constants';
import localeEn from '@angular/common/locales/en';
import { LoginService } from './components/login/services/login.service';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthConfigService } from './auth-config.service';
import { EffectsModule } from '@ngrx/effects';
import { NgxImageCompressService } from 'ngx-image-compress';

registerLocaleData(localeEn, 'en');

export const customTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormModule,
    MatSidenavModule,
    MatListModule,
    ErrorHandlerModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      name: 'CWP',
      maxAge: 25,
      logOnly: environment.production
    }),
    ToastModule.forRoot(),
    AuthConfigModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage,
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    }),
    NgxShimmerLoadingModule,
    // 150seconds.. 2.5mins
    UserIdleModule.forRoot({ idle: 150, timeout: 30, ping: 30 }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    EffectsModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTimeoutInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private readonly eventService: PublicEventsService,
    private oidcSecurityService: OidcSecurityService,
    private commonService: CommonService,
    private loginService: LoginService,
    private authConfigService: AuthConfigService
  ) {
    this.eventService
      .registerForEvents()
      .pipe(
        filter(
          (notification) =>
            notification.type === EventTypes.NewAuthenticationResult ||
            notification.type === EventTypes.SilentRenewStarted
        )
      )
      .subscribe(() => {
        const protectedResources = this.commonService.getProtectedResources();

        from(protectedResources)
          .pipe(
            mergeMap((protectedResource) =>
              this.authConfigService.getAccessTokenUsingRefreshToken$(
                protectedResource
              )
            )
          )
          .subscribe();
      });

    this.oidcSecurityService.userData$
      .pipe(
        take(2),
        filter((userDataResult) => userDataResult.userData !== null),
        tap((userDataResult) => {
          this.loginService.performPostLoginActions(userDataResult);
        })
      )
      .subscribe();
  }
}
