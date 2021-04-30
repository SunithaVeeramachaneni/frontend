import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgpSortModule } from "ngp-sort-pipe";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RouteReuseStrategy } from '@angular/router';
import { DelayFocusDirective } from './directives/delayfocus';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { WorkInstructionsHomeComponent } from './components/workInstructions-home/workInstructions-home.page';
import { AppComponent } from './app.component';
import { AppMaterialModules } from './material.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { AppRoutingModule } from './app-routing.module';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WorkInstructionsModule} from './components/workInstructions-home/categories/workinstructions/workinstructions.module';
import {UserManagementModule} from './components/user-management/user-management.module';
import { SharedModule } from './shared/shared.module';
import { ModalModule } from './components/modal/modal.module';
import {ButtonsModule} from 'ngx-bootstrap/buttons';

import { NgxSpinnerModule } from 'ngx-spinner';

import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { HttpTimeoutInterceptor } from './interceptors/http-timeout.interceptor';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ZingchartAngularModule} from 'zingchart-angular';

@NgModule({
  declarations: [
    AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    NgpSortModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule,
    ChartsModule,
    AppMaterialModules,
    CommonModule,
    HttpClientModule,
    FormsModule,
    WorkInstructionsModule,
  
    ButtonsModule.forRoot(),
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    UserManagementModule,
    ErrorHandlerModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ name: 'Work Instructions', maxAge: 25, logOnly: environment.production }),
    IonicModule.forRoot(),
    AppRoutingModule,
    ZingchartAngularModule

  ],
  providers: [
  
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'} },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTimeoutInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor() {

	}
}
