import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/app.constants';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { TenantResolverService } from './services/tenant-resolver.service';
import { TenantManagementContainerComponent } from './tenant-management-container/tenant-management-container.component';
import { TenantComponent } from './tenant/tenant.component';
import { TenantsComponent } from './tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    component: TenantManagementContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Tenant Management' },
      permissions: [permissions.viewTenants]
    },
    children: [
      {
        path: 'create',
        component: TenantComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: {
            label: 'Adding Tenant...',
            alias: 'tenantName'
          },
          permissions: [permissions.createTenant]
        }
      },
      {
        path: 'edit/:id',
        component: TenantComponent,
        canActivate: [AuthGuard],
        resolve: { tenant: TenantResolverService },
        data: {
          breadcrumb: { label: 'Edit Tenant', alias: 'tenantName' },
          permissions: [permissions.updateTenant]
        }
      },
      {
        path: 'inactive-tenants',
        component: TenantsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Inactive Tenants' },
          permissions: [permissions.viewInactiveTenants]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule {}
