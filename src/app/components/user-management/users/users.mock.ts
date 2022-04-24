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

const permissionSetOne = [
  {
    moduleName: 'Dashboard',
    permissions: [
      {
        permissionName: 'Create dashboard',
        permission: true
      },
      {
        permissionName: 'Delete dashboard',
        permission: false
      }
    ]
  },
  {
    moduleName: 'Reports',
    permissions: [
      {
        permissionName: 'Create report',
        permission: true
      },
      {
        permissionName: 'Delete report',
        permission: false
      }
    ]
  },
  {
    moduleName: 'SPCC',
    permissions: [
      {
        permissionName: 'Create WO',
        permission: false
      },
      {
        permissionName: 'Update WO',
        permission: true
      }
    ]
  }
];

const permissionSetTwo = [
  {
    moduleName: 'Dashboard',
    permissions: [
      {
        permissionName: 'Create dashboard',
        permission: true
      },
      {
        permissionName: 'Delete dashboard',
        permission: true
      }
    ]
  },
  {
    moduleName: 'Reports',
    permissions: [
      {
        permissionName: 'Create report',
        permission: true
      },
      {
        permissionName: 'Delete report',
        permission: true
      }
    ]
  },
  {
    moduleName: 'SPCC',
    permissions: [
      {
        permissionName: 'Create WO',
        permission: true
      },
      {
        permissionName: 'Update WO',
        permission: true
      }
    ]
  }
];

export const rolesMock = [
  {
    roleName: 'Maintenance manager',
    permissionSet: permissionSetOne
  },
  {
    roleName: 'Super Admin',
    permissionSet: permissionSetTwo
  }
];
