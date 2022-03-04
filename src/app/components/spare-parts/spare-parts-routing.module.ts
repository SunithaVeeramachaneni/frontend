import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {SparePartsComponent } from './spare-parts.component';

const routes: Routes = [
  {
    path: '',
    component: SparePartsComponent,
    data: { breadcrumb: { skip: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class SparePartsRoutingModule {}
