import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.page';

import { HeaderModule } from '../../components/header/header.module';

import { AppMaterialModules } from '../../material.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    HeaderModule,
    CommonModule,
    AppMaterialModules,
  ],
  declarations: [
    MaintenanceComponent
  ],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {}






