import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginAllRoutesGuard } from 'angular-auth-oidc-client';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule)
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
    path: 'tenant-management',
    loadChildren: () =>
      import('./components/tenant-management/tenant-management.module').then(
        (m) => m.TenantManagementModule
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
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./components/user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
    canActivate: [AutoLoginAllRoutesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
