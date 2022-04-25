import { of } from 'rxjs';
import { UserDetails, UserTable } from 'src/app/interfaces';

export const usersMock: UserTable = {
  columns: [
    {
      displayName: 'User',
      type: 'string',
      name: 'user',
      filterType: 'string',
      order: 1,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Role',
      type: 'string',
      name: 'displayRoles',
      filterType: 'string',
      order: 2,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Email',
      type: 'string',
      name: 'email',
      filterType: 'string',
      order: 3,
      sticky: false,
      visible: true
    },
    {
      displayName: 'Created On',
      type: 'string',
      name: 'createdOn',
      filterType: 'date',
      order: 4,
      sticky: false,
      visible: true
    }
  ],
  data: [
    {
      id: '1',
      firstName: 'Arthur',
      lastName: 'Dent',
      user: 'Arthur Dent',
      title: 'Engineer',
      isActive: true,
      roles: ['Admin'],
      email: 'arthur@gmail.com',
      createdOn: new Date()
    },
    {
      id: '2',
      firstName: 'Ford',
      lastName: 'Prefect',
      user: 'Ford Prefect',
      title: 'Engineer',
      isActive: true,
      roles: ['Maintenance Manager'],
      email: 'ford@gmail.com',
      createdOn: new Date()
    },
    {
      id: '3',
      firstName: 'Tricia',
      lastName: 'McMillan',
      user: 'Tricia McMillan',
      roles: ['Chief Engineer'],
      title: 'Engineer',
      isActive: true,
      email: 'trillian@gmail.com',
      createdOn: new Date()
    }
  ]
};

export const addUserMock: UserDetails = {
  id: '4',
  firstName: 'Marvin',
  lastName: 'A.',
  user: 'Marvin A.',
  roles: ['Robotics Head'],
  title: 'Manager',
  isActive: true,
  email: 'android@gmail.com',
  createdOn: new Date()
};

export const updateUserMock: UserDetails = {
  id: '5',
  firstName: 'Zaphod',
  lastName: 'B.',
  user: 'Zaphod B.',
  roles: ['President'],
  title: 'Head of Human Resources',
  isActive: true,
  email: 'beeblebrox@gmail.com',
  createdOn: new Date()
};

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

export const rolesByID1Mock = [role1, role2];

export const rolesByID2Mock = [role3];

export const rolesByID3Mock = [role4];
