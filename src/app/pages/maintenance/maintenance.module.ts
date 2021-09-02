import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.page';

import { AppMaterialModules } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    CommonModule,
    AppMaterialModules,
    SharedModule
  ],
  declarations: [
    MaintenanceComponent
  ],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {}






