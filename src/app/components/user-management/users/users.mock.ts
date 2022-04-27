import { DataRowOutlet } from '@angular/cdk/table';
import { of } from 'rxjs';
import { UserDetails, UserTable } from 'src/app/interfaces';

const role1 = {
  id: 4,
  name: 'Super Admin',
  description: 'Super admin description',
  createdBy: 1,
  updatedBy: null,
  createdAt: new Date('2022-04-21T06:37:07.000Z'),
  updatedAt: new Date('2022-04-21T06:37:07.000Z')
};

const role2 = {
  id: 5,
  name: 'Maintenance Manager',
  description: 'desc',
  createdBy: 1,
  updatedBy: 1,
  createdAt: new Date('2022-04-21T06:44:44.000Z'),
  updatedAt: new Date('2022-04-21T13:54:22.000Z')
};

const role3 = {
  id: 6,
  name: 'Supervisor',
  description: 'Supervisor Description',
  createdBy: 1,
  updatedBy: null,
  createdAt: new Date('2022-04-21T08:29:17.000Z'),
  updatedAt: new Date('2022-04-21T08:29:17.000Z')
};

const role4 = {
  id: 8,
  name: 'New Role',
  description: ' bgf',
  createdBy: 1,
  updatedBy: null,
  createdAt: new Date('2022-04-21T11:03:59.000Z'),
  updatedAt: new Date('2022-04-21T11:03:59.000Z')
};

export const usersMock: UserDetails[] = [
  {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Dent',
    user: 'Arthur Dent',
    title: 'Engineer',
    isActive: true,
    roles: [role1],
    email: 'arthur@gmail.com',
    createdAt: new Date('2022-04-21T11:03:59.000Z')
  },
  {
    id: '2',
    firstName: 'Ford',
    lastName: 'Prefect',
    user: 'Ford Prefect',
    title: 'Engineer',
    isActive: true,
    roles: [role2, role3],
    email: 'ford@gmail.com',
    createdAt: new Date('2022-04-21T11:03:59.000Z')
  },
  {
    id: '3',
    firstName: 'Tricia',
    lastName: 'McMillan',
    user: 'Tricia McMillan',
    roles: [role3],
    title: 'Engineer',
    isActive: true,
    email: 'trillian@gmail.com',
    createdAt: new Date('2022-04-21T11:03:59.000Z')
  }
];

export const addUserMock: UserDetails = {
  id: '4',
  firstName: 'Marvin',
  lastName: 'A.',
  user: 'Marvin A.',
  roles: [{ name: 'Robotics Head' }],
  title: 'Manager',
  isActive: true,
  email: 'android@gmail.com',
  createdAt: new Date('2022-04-21T11:03:59.000Z'),
  profileImage: 'image,456'
};

export const updateUserMock: UserDetails = {
  id: '5',
  firstName: 'Zaphod',
  lastName: 'B.',
  user: 'Zaphod B.',
  roles: [{ name: 'President' }],
  title: 'Head of Human Resources',
  isActive: true,
  email: 'beeblebrox@gmail.com',
  createdAt: new Date('2022-04-21T11:03:59.000Z)'),
  profileImage: 'image,123'
};

export const allRolesMock = [role1, role2, role3, role4];

export const rolesByID1Mock = [role1, role2];

export const rolesByID2Mock = [role3];

export const rolesByID3Mock = [role4];

export const preparedUserMock = {
  id: '1',
  firstName: 'Arthur',
  lastName: 'Dent',
  user: 'Arthur Dent',
  title: 'Engineer',
  isActive: true,
  roles: [
    {
      id: 4,
      name: 'Super Admin',
      description: 'Super admin description',
      createdBy: 1,
      updatedBy: null,
      createdAt: '2022-04-21T06:37:07.000Z',
      updatedAt: '2022-04-21T06:37:07.000Z'
    },
    {
      id: 5,
      name: 'Maintenance Manager',
      description: 'desc',
      createdBy: 1,
      updatedBy: 1,
      createdAt: '2022-04-21T06:44:44.000Z',
      updatedAt: '2022-04-21T13:54:22.000Z'
    }
  ],
  email: 'arthur@gmail.com',
  createdAt: '2022-04-21T11:03:59.000Z',
  displayRoles: 'Super Admin, Maintenance Manager'
};

export const allUsersWithRolesMock = [
  {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Dent',
    user: 'Arthur Dent',
    title: 'Engineer',
    isActive: true,
    roles: [
      {
        id: 4,
        name: 'Super Admin',
        description: 'Super admin description',
        createdBy: 1,
        updatedBy: null,
        createdAt: '2022-04-21T06:37:07.000Z',
        updatedAt: '2022-04-21T06:37:07.000Z'
      },
      {
        id: 5,
        name: 'Maintenance Manager',
        description: 'desc',
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2022-04-21T06:44:44.000Z',
        updatedAt: '2022-04-21T13:54:22.000Z'
      }
    ],
    email: 'arthur@gmail.com',
    createdAt: '2022-04-21T11:03:59.000Z',
    displayRoles: 'Super Admin, Maintenance Manager'
  },
  {
    id: '2',
    firstName: 'Ford',
    lastName: 'Prefect',
    user: 'Ford Prefect',
    title: 'Engineer',
    isActive: true,
    roles: [
      {
        id: 6,
        name: 'Supervisor',
        description: 'Supervisor Description',
        createdBy: 1,
        updatedBy: null,
        createdAt: '2022-04-21T08:29:17.000Z',
        updatedAt: '2022-04-21T08:29:17.000Z'
      }
    ],
    email: 'ford@gmail.com',
    createdAt: '2022-04-21T11:03:59.000Z',
    displayRoles: 'Supervisor'
  },
  {
    id: '3',
    firstName: 'Tricia',
    lastName: 'McMillan',
    user: 'Tricia McMillan',
    roles: [
      {
        id: 8,
        name: 'New Role',
        description: ' bgf',
        createdBy: 1,
        updatedBy: null,
        createdAt: '2022-04-21T11:03:59.000Z',
        updatedAt: '2022-04-21T11:03:59.000Z'
      }
    ],
    title: 'Engineer',
    isActive: true,
    email: 'trillian@gmail.com',
    createdAt: '2022-04-21T11:03:59.000Z',
    displayRoles: 'New Role'
  }
];
