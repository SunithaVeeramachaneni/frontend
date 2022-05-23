import { Permission } from '../../../interfaces';

export const allRolesMock = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Super admin description',
    createdBy: 1,
    updatedBy: null,
    createdAt: '2022-04-21T06:37:07.000Z',
    updatedAt: '2022-04-21T06:37:07.000Z'
  },
  {
    id: '2',
    name: 'Supervisor',
    description: 'Supervisor Description',
    createdBy: 1,
    updatedBy: null,
    createdAt: '2022-04-21T08:29:17.000Z',
    updatedAt: '2022-04-21T08:29:17.000Z'
  },
  {
    id: '3',
    name: 'Maintenance Manager',
    description: 'desc',
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2022-04-21T06:44:44.000Z',
    updatedAt: '2022-04-21T13:54:22.000Z'
  }
];

export const rolesByID1Mock = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Super admin description',
    createdBy: 1,
    updatedBy: null,
    createdAt: '2022-04-21T06:37:07.000Z',
    updatedAt: '2022-04-21T06:37:07.000Z'
  }
];

export const allPermissionsMock: Permission[] = [
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Create Report',
    id: '1',
    moduleName: 'Reports',
    name: 'CREATE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  },
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Edit Report',
    id: '2',
    moduleName: 'Reports',
    name: 'UPDATE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  },
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Delete Report',
    id: '3',
    moduleName: 'Reports',
    name: 'DELETE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  },
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Share Report',
    id: '4',
    moduleName: 'Reports',
    name: 'SHARE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  }
];

export const roleWithPermissionsMock = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Super admin description',
    permissionIds: [
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Create Report',
        id: '1',
        moduleName: 'Reports',
        name: 'CREATE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z'
      },
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Edit Report',
        id: '2',
        moduleName: 'Reports',
        name: 'UPDATE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z'
      },
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Delete Report',
        id: '3',
        moduleName: 'Reports',
        name: 'DELETE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z'
      },
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Share Report',
        id: '4',
        moduleName: 'Reports',
        name: 'SHARE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z'
      }
    ]
  }
];

export const roleIdByPermissionMock: Permission[] = [
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Create Report',
    id: '1',
    moduleName: 'Reports',
    name: 'CREATE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  },
  {
    createdAt: '2022-04-19T10:38:41.000Z',
    displayName: 'Edit Report',
    id: '2',
    moduleName: 'Reports',
    name: 'UPDATE_REPORT',
    updatedAt: '2022-04-19T10:38:41.000Z'
  }
];

export const addRoleMock = {
  name: 'New Role',
  description: 'New Role Description',
  permissionIds: ['1', '2']
};

export const updateRoleMock = {
  id: 2,
  name: 'Update Role',
  description: 'Update Role Description',
  permissionIds: ['3', '4']
};

export const usersMock = [
  {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Dent',
    user: 'Arthur Dent',
    title: 'Engineer',
    isActive: true,
    roles: [
      {
        id: '1',
        name: 'Super Admin',
        description: 'Super admin description',
        createdBy: 1,
        updatedBy: null,
        createdAt: '2022-04-21T06:37:07.000Z',
        updatedAt: '2022-04-21T06:37:07.000Z'
      }
    ],
    email: 'arthur@gmail.com',
    createdAt: new Date('2022-04-21T11:03:59.000Z')
  }
];
