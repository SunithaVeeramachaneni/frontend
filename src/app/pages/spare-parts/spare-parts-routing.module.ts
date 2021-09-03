import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {SparePartsComponent } from './spare-parts.page';

const routes: Routes = [
  {
    path: '',
    component: SparePartsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class SparePartsRoutingModule {}
