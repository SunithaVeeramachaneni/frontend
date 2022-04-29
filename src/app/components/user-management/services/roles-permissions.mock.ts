import { of } from 'rxjs';
import { Role, Permission } from 'src/app/interfaces';

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

export const allRolesMock = [role1, role2, role3];

export const rolesByID1Mock = [role1];
