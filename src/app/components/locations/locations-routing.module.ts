import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { LocationContainerComponent } from './location-container/location-container.component';

const routes: Routes = [
  {
    path: '',
    component: LocationContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Location' },
      permissions: [permissions.viewLocations]
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
