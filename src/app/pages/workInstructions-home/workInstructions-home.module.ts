import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InstructionsHomePageRoutingModule } from './workInstructions-home-routing.module';
import { WorkInstructionsHomeComponent } from './workInstructions-home.page';

import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    InstructionsHomePageRoutingModule
  ],
  declarations: [
    WorkInstructionsHomeComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports: [],
  entryComponents: []
})
export class WorkInstructionsHomeModule {}






