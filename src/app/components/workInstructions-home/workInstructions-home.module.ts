import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstructionsHomePageRoutingModule } from './workInstructions-home-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { WorkInstructionsHomeComponent } from './workInstructions-home.page';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    InstructionsHomePageRoutingModule
  ],
  declarations: [WorkInstructionsHomeComponent, CategoriesComponent,MyModalPageComponent],
  entryComponents: [MyModalPageComponent]
})
export class WorkInstructionsHomeModule {}
