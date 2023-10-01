import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
    data: {
      breadcrumb: { skip: true }
    }
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { skip: true }
    }
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      )
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('./components/tenant-management/tenant-management.module').then(
        (m) => m.TenantManagementModule
      )
  },
  {
    path: 'integrations',
    loadChildren: () =>
      import('./components/integrations/integrations.module').then(
        (m) => m.IntegrationsModule
      )
  },
  {
    path: 'work-instructions',
    loadChildren: () =>
      import('./components/work-instructions/work-instructions.module').then(
        (m) => m.WorkInstructionsPageModule
      )
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('./components/maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      )
  },
  {
    path: 'spare-parts',
    loadChildren: () =>
      import('./components/spare-parts/spare-parts.module').then(
        (m) => m.SparePartsModule
      )
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./components/user-management/user-management.module').then(
        (m) => m.UserManagementModule
      )
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./components/race-dynamic-form/race-dynamic-form.module').then(
        (m) => m.RaceDynamicFormModule
      )
  },
  {
    path: 'operator-rounds',
    loadChildren: () =>
      import('./components/operator-rounds/operator-rounds.module').then(
        (m) => m.OperatorRoundsModule
      )
  },
  {
    path: 'master-configuration',
    loadChildren: () =>
      import(
        './components/master-configurations/master-configurations.module'
      ).then((m) => m.MasterConfigurationsModule)
  },

  {
    path: 'user-settings',
    loadChildren: () =>
      import('./components/user-settings/user-settings.module').then(
        (m) => m.UserSettingsModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
