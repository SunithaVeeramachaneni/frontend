import { of } from 'rxjs';
import { cloneDeep } from 'lodash-es';

const role1 = {
  id: 4,
  name: 'Super Admin',
  description: 'Super admin description',
  createdBy: 1,
  updatedBy: null,
  createdAt: '2022-04-21T06:37:07.000Z',
  updatedAt: '2022-04-21T06:37:07.000Z'
};

const role2 = {
  id: 5,
  name: 'Maintenance Manager',
  description: 'desc',
  createdBy: 1,
  updatedBy: 1,
  createdAt: '2022-04-21T06:44:44.000Z',
  updatedAt: '2022-04-21T13:54:22.000Z'
};

const role3 = {
  id: 6,
  name: 'Supervisor',
  description: 'Supervisor Description',
  createdBy: 1,
  updatedBy: null,
  createdAt: '2022-04-21T08:29:17.000Z',
  updatedAt: '2022-04-21T08:29:17.000Z'
};

const role4 = {
  id: 8,
  name: 'New Role',
  description: ' bgf',
  createdBy: 1,
  updatedBy: null,
  createdAt: '2022-04-21T11:03:59.000Z',
  updatedAt: '2022-04-21T11:03:59.000Z'
};

export const allRolesMock = [role1, role2, role3, role4];

export const allPermissions = [
  {
    name: 'Dashboard',
    permissions: [
      {
        id: 1,
        name: 'VIEW_DASHBOARDS',
        displayName: 'Display Dashboards',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 2,
        name: 'CREATE_DASHBOARD',
        displayName: 'Create Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 3,
        name: 'UPDATE_DASHBOARD',
        displayName: 'Update Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 4,
        name: 'DELETE_DASHBOARD',
        displayName: 'Delete Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 5,
        name: 'COPY_DASHBOARD',
        displayName: 'Copy Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 6,
        name: 'VIEW_REPORTS',
        displayName: 'Display Reports',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 7,
        name: 'CREATE_REPORT',
        displayName: 'Create Report',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 8,
        name: 'UPDATE_REPORT',
        displayName: 'Update Report',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 9,
        name: 'DELETE_REPORT',
        displayName: 'Delete Report',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 10,
        name: 'COPY_REPORT',
        displayName: 'Copy Report',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      },
      {
        id: 11,
        name: 'REPORT_EXPORT_TO_EXCEL',
        displayName: 'Export to Excel',
        moduleName: 'Dashboard',
        subModuleName: 'Reports',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z',
        checked: true
      }
    ],
    checked: true
  },
  {
    name: 'User Management',
    permissions: [
      {
        id: 19,
        name: 'VIEW_USERS',
        displayName: 'Display Users',
        moduleName: 'User Management',
        subModuleName: 'User Management',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 20,
        name: 'CREATE_USER',
        displayName: 'Create User',
        moduleName: 'User Management',
        subModuleName: 'User Management',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 21,
        name: 'UPDATE_USER',
        displayName: 'Update User',
        moduleName: 'User Management',
        subModuleName: 'User Management',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 22,
        name: 'DEACTIVATE_USER',
        displayName: 'Deactivate User',
        moduleName: 'User Management',
        subModuleName: 'User Management',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 23,
        name: 'VIEW_ROLES',
        displayName: 'Display Roles',
        moduleName: 'User Management',
        subModuleName: 'Roles & Permissions',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 24,
        name: 'CREATE_ROLE',
        displayName: 'Create Role',
        moduleName: 'User Management',
        subModuleName: 'Roles & Permissions',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 25,
        name: 'UPDATE_ROLE',
        displayName: 'Update Role',
        moduleName: 'User Management',
        subModuleName: 'Roles & Permissions',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 26,
        name: 'DELETE_ROLE',
        displayName: 'Delete Role',
        moduleName: 'User Management',
        subModuleName: 'Roles & Permissions',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 27,
        name: 'COPY_ROLE',
        displayName: 'Copy Role',
        moduleName: 'User Management',
        subModuleName: 'Roles & Permissions',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      },
      {
        id: 28,
        name: 'VIEW_INACTIVE_USERS',
        displayName: 'Display Inactive Users',
        moduleName: 'User Management',
        subModuleName: 'Inactive Users',
        createdAt: '2022-06-21T09:45:35.000Z',
        updatedAt: '2022-06-21T09:45:35.000Z',
        checked: false
      }
    ],
    checked: false
  }
];
export const allPermissions$ = of(allPermissions);

export const selectedRolePermissions$ = of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
