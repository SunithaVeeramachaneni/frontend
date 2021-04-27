import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {WorkInstructionsHomeComponent } from './workInstructions-home.page';

const routes: Routes = [
  {
    path: '',
    component: WorkInstructionsHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class InstructionsHomePageRoutingModule {}
