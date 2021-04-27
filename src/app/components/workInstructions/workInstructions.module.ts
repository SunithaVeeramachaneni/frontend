import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstructionsPageRoutingModule } from './workInstructions-routing.module';

import { WorkInstructionsComponent } from './workInstructions.page';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    InstructionsPageRoutingModule
  ],
  declarations: [WorkInstructionsComponent, MyModalPageComponent],
  entryComponents: [MyModalPageComponent]
})
export class WorkInstructionsModule {}
