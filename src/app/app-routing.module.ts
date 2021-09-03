import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)
  },
  {
    path: 'spare-parts',
    loadChildren: () => import('./pages/spare-parts/spare-parts.module').then(m => m.SparePartsModule)
  },
  {
    path: 'work-instructions',
    loadChildren: () => import('./pages/work-instructions/work-instructions.module').then( m => m.WorkInstructionsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
