import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AssetsContainerComponent } from './assets-container/assets-container.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Assets' },
      permissions: [permissions.viewAssets]
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
