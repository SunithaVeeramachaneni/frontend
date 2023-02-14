import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AssetsListComponent } from './assets/assets-list/assets-list.component';

import { MasterConfigurationsContainerComponent } from './master-configurations-container/master-configurations-container.component';

const routes: Routes = [
  {
    path: '',
    component: MasterConfigurationsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Master Configurations' },
      permissions: [permissions.viewLocations]
    },
    children: [
      {
        path: 'assets',
        component: AssetsListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Asssets' },
          permissions: [permissions.viewAssets]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterConfigurationsRoutingModule {}
