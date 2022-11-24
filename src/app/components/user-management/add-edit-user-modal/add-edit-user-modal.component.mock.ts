import { Permission } from 'src/app/interfaces';
import { of } from 'rxjs';

const allPermissions: Permission[] = [
  {
    id: 1,
    name: 'VIEW_DASHBOARDS',
    displayName: 'View Dashboards',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 2,
    name: 'CREATE_DASHBOARD',
    displayName: 'Create Dashboard',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 3,
    name: 'UPDATE_DASHBOARD',
    displayName: 'Update Dashboard',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 4,
    name: 'DELETE_DASHBOARD',
    displayName: 'Delete Dashboard',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 5,
    name: 'COPY_DASHBOARD',
    displayName: 'Copy Dashboard',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 6,
    name: 'VIEW_REPORTS',
    displayName: 'View Reports',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 7,
    name: 'CREATE_REPORT',
    displayName: 'Create Report',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 8,
    name: 'UPDATE_REPORT',
    displayName: 'Update Report',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 9,
    name: 'DELETE_REPORT',
    displayName: 'Delete Report',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 10,
    name: 'COPY_REPORT',
    displayName: 'Copy Report',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 11,
    name: 'REPORT_EXPORT_TO_EXCEL',
    displayName: 'Export to Excel',
    moduleName: 'Dashboard',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 12,
    name: 'VIEW_TENANTS',
    displayName: 'View Tenants',
    moduleName: 'Tenant Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 13,
    name: 'CREATE_TENANT',
    displayName: 'Create Tenant',
    moduleName: 'Tenant Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 14,
    name: 'UPDATE_TENANT',
    displayName: 'Update Tenant',
    moduleName: 'Tenant Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 15,
    name: 'VIEW_MAINTENANCE_CONTROL_CENTER',
    displayName: 'View Work Orders',
    moduleName: 'Maintenance Control Center',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 16,
    name: 'ASSIGN_WORK_ORDERS',
    displayName: 'Assign Work Orders',
    moduleName: 'Maintenance Control Center',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 17,
    name: 'VIEW_SPARE_PARTS_CONTROL_CENTER',
    displayName: 'View Picklists',
    moduleName: 'Spare Parts Control Center',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 18,
    name: 'ASSIGN_PICKLIST',
    displayName: 'Assign Picklist',
    moduleName: 'Spare Parts Control Center',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 19,
    name: 'VIEW_USERS',
    displayName: 'View Users',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 20,
    name: 'CREATE_USER',
    displayName: 'Create User',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 21,
    name: 'UPDATE_USER',
    displayName: 'Update User',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 22,
    name: 'DEACTIVATE_USER',
    displayName: 'Deactivate User',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 23,
    name: 'VIEW_ROLES',
    displayName: 'View Roles',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 24,
    name: 'CREATE_ROLE',
    displayName: 'Create Role',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 25,
    name: 'UPDATE_ROLE',
    displayName: 'Update Role',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 26,
    name: 'DELETE_ROLE',
    displayName: 'DELETE Role',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 27,
    name: 'COPY_ROLE',
    displayName: 'Copy Role',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 28,
    name: 'VIEW_INACTIVE_USERS',
    displayName: 'View Inactive Users',
    moduleName: 'User Management',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 29,
    name: 'VIEW_WORK_INSTRUCTIONS',
    displayName: 'View Work Instructions',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 30,
    name: 'CREATE_WORK_INSTRUCTION',
    displayName: 'Create Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 31,
    name: 'UPDATE_WORK_INSTRUCTION',
    displayName: 'Update Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 32,
    name: 'PUBLISH_WORK_INSTRUCTION',
    displayName: 'Publish Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 33,
    name: 'DELETE_WORK_INSTRUCTION',
    displayName: 'Delete Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 34,
    name: 'IMPORT_WORK_INSTRUCTION',
    displayName: 'Import Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 35,
    name: 'COPY_WORK_INSTRUCTION',
    displayName: 'Copy Work Instruction',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 36,
    name: 'CREATE_CATEGORY',
    displayName: 'Create Category',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 37,
    name: 'UPDATE_CATEGORY',
    displayName: 'Update Category',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 38,
    name: 'DELETE_CATEGORY',
    displayName: 'Delete Category',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 39,
    name: 'VIEW_FILES',
    displayName: 'View Files',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 40,
    name: 'UPDATE_FILE',
    displayName: 'Update File',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  },
  {
    id: 41,
    name: 'DELETE_FILE',
    displayName: 'Delete File',
    moduleName: 'Work Instructions Authoring',
    createdAt: '2022-05-23T05:13:29.000Z',
    updatedAt: '2022-05-23T05:13:29.000Z'
  }
];

export const rolesInput = [
  {
    createdAt: '2022-08-26T06:30:36.000Z',
    createdBy: 1,
    description: 'Super Admin role',
    id: 1,
    name: 'Super Admin',
    updatedAt: '2022-08-26T06:30:36.000Z',
    updatedBy: null
  },
  {
    createdAt: '2022-09-19T13:26:25.000Z',
    createdBy: 1,
    description: 'mmnk',
    id: 2,
    name: 'New Role',
    updatedAt: '2022-09-19T13:26:25.000Z',
    updatedBy: null
  }
];

const permissionsList = [
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
        updatedAt: '2022-06-16T17:00:05.000Z'
      },
      {
        id: 2,
        name: 'CREATE_DASHBOARD',
        displayName: 'Create Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z'
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
        updatedAt: '2022-06-16T17:00:05.000Z'
      },
      {
        id: 5,
        name: 'COPY_DASHBOARD',
        displayName: 'Copy Dashboard',
        moduleName: 'Dashboard',
        subModuleName: 'Dashboard',
        createdAt: '2022-06-16T17:00:05.000Z',
        updatedAt: '2022-06-16T17:00:05.000Z'
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
    ]
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
    ]
  },
  {
    name: 'Tenant Management'
  }
];

const rolesList = [
  {
    description: 'Super Admin Role',
    id: 1,
    name: 'Super Admin',
    permissionIds: allPermissions
  },
  {
    description: 'Mock Role',
    id: 2,
    name: 'Mock Role',
    permissionIds: allPermissions
  }
];

export const existingUser = {
  createdAt: '2022-04-26T11:59:39.000Z',
  createdBy: 1,
  displayRoles: ['Mock Role'],
  email: 'user1@innovapptive.com',
  firstName: 'default',
  id: 12,
  isActive: false,
  lastName: 'profile',
  postTextImage: '',
  preTextImage: '',
  profileImage: 'image,123',
  roles: [
    {
      createdAt: '2022-09-19T13:26:25.000Z',
      createdBy: 1,
      description: 'mmnk',
      id: 2,
      name: 'New Role',
      updatedAt: '2022-09-19T13:26:25.000Z',
      updatedBy: null
    }
  ],
  title: 'picture',
  updatedAt: '2022-04-26T11:59:39.000Z',
  updatedBy: 1,
  user: 'default profile'
};

export const rolesList$ = of(rolesList);
export const permissionsList$ = of(permissionsList);
