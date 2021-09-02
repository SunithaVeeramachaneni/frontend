import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.page';

import { AppMaterialModules } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    CommonModule,
    AppMaterialModules,
    SharedModule,
    NgxSpinnerModule
  ],
  declarations: [
    MaintenanceComponent
  ],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {}






