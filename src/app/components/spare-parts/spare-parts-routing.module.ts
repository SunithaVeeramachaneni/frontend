import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

import { SparePartsComponent } from './spare-parts.component';

const routes: Routes = [
  {
    path: '',
    component: SparePartsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { skip: true },
      permissions: [permissions.viewSparePartsControlCenter]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class SparePartsRoutingModule {}
