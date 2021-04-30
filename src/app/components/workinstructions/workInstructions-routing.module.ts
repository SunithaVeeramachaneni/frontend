import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';

const routes: Routes = [
  {
    path: 'add-instruction',
    component: AddWorkinstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructionsRoutingModule {}
