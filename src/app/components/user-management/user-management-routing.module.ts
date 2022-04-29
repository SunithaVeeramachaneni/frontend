import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component';

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
        component: RolesComponent,
        data: { breadcrumb: { label: 'Roles & Permissions' } }
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
