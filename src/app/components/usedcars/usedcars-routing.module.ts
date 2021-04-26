import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { UsedcarsPage } from './usedcars.page';

const routes: Routes = [
  {
    path: '',
    component: UsedcarsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class UsedcarsPageRoutingModule {}
