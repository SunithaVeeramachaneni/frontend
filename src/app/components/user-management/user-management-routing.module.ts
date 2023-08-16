import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component';

import { UserManagementContainerComponent } from './user-management-container/user-management-container.component';
import { InactiveUsersComponent } from './inactive-users/inactive-users.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { permissions } from 'src/app/app.constants';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementContainerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'User Management' },
      permissions: [permissions.viewUsers]
    },
    children: [
      {
        path: 'roles-permissions',
        component: RolesComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Roles & Permissions' },
          permissions: [permissions.viewRoles]
        }
      },
      {
        path: 'inactive-users',
        component: InactiveUsersComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Inactive Users' },
          permissions: [permissions.viewInactiveUsers]
        }
      },
      {
        path: 'user-groups',
        component: UserGroupListComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'User Groups' },
          permissions: [permissions.viewUserGroup]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
