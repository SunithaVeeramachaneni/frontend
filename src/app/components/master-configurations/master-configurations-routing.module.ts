import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AssetsListComponent } from './assets/assets-list/assets-list.component';

import { MasterConfigurationsContainerComponent } from './master-configurations-container/master-configurations-container.component';
import { UnitMeasurementListComponent } from './unit-measurement/unit-measurement-list/unit-measurement-list.component';
import { ResponsesListComponent } from './response-set/responses-list/responses-list.component';
import { LocationsListComponent } from './locations/locations-list/locations-list.component';
import { AddDetailsComponent } from './mdm-table/add-details/add-details.component';
import { ViewDetailsComponent } from './mdm-table/view-details/view-details.component';
const routes: Routes = [
  {
    path: '',
    component: MasterConfigurationsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Master Configurations' },
      permissions: [permissions.viewPlants]
    },
    children: [
      {
        path: 'locations',
        component: LocationsListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Locations' },
          permissions: [permissions.viewLocations]
        }
      },
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
        path: 'global-response',
        component: ResponsesListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Global Response Set' },
          permissions: [permissions.viewGlobalResponses]
        }
      },
      {
        path: 'create-more',
        component: AddDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Create More' },
          permissions: [permissions.viewLocations]
        }
      },
      {
        path: ':tableUID',
        component: ViewDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          permissions: [permissions.viewLocations]
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
