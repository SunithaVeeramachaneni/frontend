import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantManagementContainerComponent } from './tenant-management-container/tenant-management-container.component';
import { TenantComponent } from './tenant/tenant.component';
import { TenantsComponent } from './tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    component: TenantManagementContainerComponent,
    data: { breadcrumb: { label: 'Tenant Management' } },
    children: [
      {
        path: 'create',
        component: TenantComponent,
        data: {
          breadcrumb: {
            label: 'Adding Tenant...',
            alias: 'tenantName'
          }
        }
      },
      {
        path: 'edit/:id',
        component: TenantComponent,
        data: { breadcrumb: { label: 'Edit Tenant', alias: 'tenantName' } }
      },
      {
        path: 'inactive-tenants',
        component: TenantsComponent,
        data: { breadcrumb: { label: 'Inactive Tenants' } }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule {}
