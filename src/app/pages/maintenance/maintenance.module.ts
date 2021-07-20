import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.page';

import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    HeaderModule,
    CommonModule
  ],
  declarations: [
    MaintenanceComponent
  ],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {}






