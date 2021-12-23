import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage-angular';
import { AppMaterialModules } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastModule } from './shared/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpTimeoutInterceptor } from './interceptors/http-timeout.interceptor';
import { ErrorHandlerModule } from './shared/error-handler/error-handler.module';

import { AuthConfigModule } from './auth-config.module';
import { AuthInterceptor, EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { HttpRequestInterceptor } from './shared/interceptor/http-request.interceptor';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { CommonService } from './shared/services/common.service';
import { from } from 'rxjs';
import { AppService } from './shared/services/app.services';
import { Buffer }  from 'buffer';
import * as hash from 'object-hash';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    // IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ name: 'CWP', maxAge: 25, logOnly: environment.production }),
    ToastModule.forRoot(),
    NgxSpinnerModule,
    ErrorHandlerModule,
    AuthConfigModule
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser, SplashScreen, StatusBar,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly eventService: PublicEventsService,
              private oidcSecurityService: OidcSecurityService,
              private appService: AppService,
              private commonService: CommonService) {
    this.eventService
      .registerForEvents()
      .pipe(filter(notification => notification.type === EventTypes.NewAuthenticationResult || notification.type === EventTypes.SilentRenewStarted))
      .subscribe(
        () => {
          const config = this.oidcSecurityService.getConfiguration();
          const { authWellknownEndpoints: { tokenEndpoint }, clientId } = config;
          const protectedResources = this.commonService.getProtectedResources();

          from(protectedResources)
            .pipe(
              mergeMap(protectedResource => {
                const [urls, scope] = protectedResource;
                const data = {
                  'grant_type': 'refresh_token',
                  'client_id': clientId,
                  'refresh_token': this.oidcSecurityService.getRefreshToken(),
                  scope
                }
                
                return this.appService.postRefreshToken(tokenEndpoint, data)
                  .pipe(
                    tap(response => {
                      if (Object.keys(response).length) {
                        const { exp } = JSON.parse(Buffer.from(response['access_token'].split('.')[1], 'base64').toString());
                        response = { ...response, access_token_expires_at: exp * 1000 };
                        delete response.id_token;
                        delete response.refresh_token;
                        sessionStorage.setItem(hash(urls), JSON.stringify(response));
                      }
                    })
                  )
              }) 
            ).subscribe();
        }
      );
  }
}
