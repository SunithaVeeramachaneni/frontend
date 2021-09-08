import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.page';

import { AppMaterialModules } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalComponent } from './modal/modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaintenanceRoutingModule,
    CommonModule,
    AppMaterialModules,
    SharedModule,
    NgxSpinnerModule,
    PopoverModule.forRoot() 
  ],
  declarations: [
    MaintenanceComponent,
    ModalComponent
  ],
  exports: [],
  entryComponents: []
})
export class MaintenanceModule {}






