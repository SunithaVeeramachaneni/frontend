import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {MaintenanceComponent } from './maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent,
    data: { breadcrumb: { skip: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
