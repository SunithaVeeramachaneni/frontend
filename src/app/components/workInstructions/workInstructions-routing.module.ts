import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {WorkInstructionsComponent } from './workInstructions.page';

const routes: Routes = [
  {
    path: '',
    component: WorkInstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class InstructionsPageRoutingModule {}
