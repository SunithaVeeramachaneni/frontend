import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginAllRoutesGuard } from 'angular-auth-oidc-client';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/maintenance',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule),
    canActivate: [AutoLoginAllRoutesGuard]
  },
  {
    path: 'spare-parts',
    loadChildren: () => import('./pages/spare-parts/spare-parts.module').then(m => m.SparePartsModule),
    canActivate: [AutoLoginAllRoutesGuard]
  },
  {
    path: 'work-instructions',
    loadChildren: () => import('./pages/work-instructions/work-instructions.module').then( m => m.WorkInstructionsPageModule),
    canActivate: [AutoLoginAllRoutesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
