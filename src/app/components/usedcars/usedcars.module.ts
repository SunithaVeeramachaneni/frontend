import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsedcarsPageRoutingModule } from './usedcars-routing.module';

import { UsedcarsPage } from './usedcars.page';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    UsedcarsPageRoutingModule
  ],
  declarations: [UsedcarsPage, MyModalPageComponent],
  entryComponents: [MyModalPageComponent]
})
export class UsedcarsPageModule {}
