import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.page';

import { HeaderModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports: [],
  entryComponents: []
})
export class DashboardModule {}






