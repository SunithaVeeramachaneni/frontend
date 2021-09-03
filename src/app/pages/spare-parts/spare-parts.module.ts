import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { SparePartsComponent } from './spare-parts.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SparePartsRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    SparePartsComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  providers: [],
  exports: [],
  entryComponents: []
})
export class SparePartsModule {}






