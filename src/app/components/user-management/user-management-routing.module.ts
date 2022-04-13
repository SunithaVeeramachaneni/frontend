import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';

import { UserManagementComponent } from './users/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: { breadcrumb: { label: 'User Management' } },
    children: [
      {
        path: 'roles-permissions',
        component: RolesPermissionsComponent,
        data: { breadcrumb: { label: 'roles & permissions' } }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
