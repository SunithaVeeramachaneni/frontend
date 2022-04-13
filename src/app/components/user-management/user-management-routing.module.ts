import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';

import { UserManagementContainerComponent } from './user-management-container/user-management-container.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementContainerComponent,
    data: { breadcrumb: { label: 'User Management' } },
    children: [
      {
        path: 'roles-permissions',
        component: RolesPermissionsComponent,
        data: { breadcrumb: { label: 'roles & permissions' } }
      },
      {
        path: 'inactive-users',
        component: UsersComponent,
        data: { breadcrumb: { label: 'Inactive Users' } }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
