import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginAllRoutesGuard } from 'angular-auth-oidc-client';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AutoLoginAllRoutesGuard]
  },
  {
    path: 'work-instructions',
    loadChildren: () =>
      import('./components/work-instructions/work-instructions.module').then(
        (m) => m.WorkInstructionsPageModule
      ),
    canActivate: [AutoLoginAllRoutesGuard]
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('./components/maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      ),
    canActivate: [AutoLoginAllRoutesGuard]
  },
  {
    path: 'spare-parts',
    loadChildren: () =>
      import('./components/spare-parts/spare-parts.module').then(
        (m) => m.SparePartsModule
      ),
    canActivate: [AutoLoginAllRoutesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
