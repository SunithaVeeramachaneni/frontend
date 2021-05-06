import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {UsedcarInsightsComponent } from './usedcar-insights.page';

const routes: Routes = [
  {
    path: '',
    component: UsedcarInsightsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule],
})
export class UsedCarsInsightsRoutingModule {}
