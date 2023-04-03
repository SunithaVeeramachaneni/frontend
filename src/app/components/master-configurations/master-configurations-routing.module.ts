import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AssetsListComponent } from './assets/assets-list/assets-list.component';

import { MasterConfigurationsContainerComponent } from './master-configurations-container/master-configurations-container.component';
import { UnitMeasurementListComponent } from './unit-measurement/unit-measurement-list/unit-measurement-list.component';
import { PlantListComponent } from './plants/plant-list/plant-list.component';
import { ResponsesListComponent } from './response-set/responses-list/responses-list.component';
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
          breadcrumb: { label: 'Assets' },
          permissions: [permissions.viewAssets]
        }
      },
      {
        path: 'unit-measurement',
        component: UnitMeasurementListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Unit of Measurement' },
          permissions: [permissions.viewUnitOfMeasurement]
        }
      },

      {
        path: 'plants',
        component: PlantListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Plants' },
          permissions: [permissions.viewPlants]
        }
      },
      {
        path: 'global-response',
        component: ResponsesListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Global Response Set' },
          permissions: [permissions.viewGlobalResponses]
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
