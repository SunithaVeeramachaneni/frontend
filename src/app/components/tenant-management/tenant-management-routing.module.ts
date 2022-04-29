import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantManagementContainerComponent } from './tenant-management-container/tenant-management-container.component';
import { TenantsComponent } from './tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    component: TenantManagementContainerComponent,
    data: { breadcrumb: { label: 'Tenant Management' } },
    children: [
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
