import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
export const routes: Routes = [
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
    canActivate: [AuthGuard]
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('./components/tenant-management/tenant-management.module').then(
        (m) => m.TenantManagementModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'work-instructions',
    loadChildren: () =>
      import('./components/work-instructions/work-instructions.module').then(
        (m) => m.WorkInstructionsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('./components/maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'spare-parts',
    loadChildren: () =>
      import('./components/spare-parts/spare-parts.module').then(
        (m) => m.SparePartsModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./components/user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
