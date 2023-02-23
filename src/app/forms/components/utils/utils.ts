export const hierarchyMock = [
  {
    id: 'Root Node 1',
    name: 'Root Node 1',
    type: 'location',
    locationId: 'Location1',
    description: '',
    image: '',
    parentId: null
  },
  {
    id: 'Root Node 2',
    name: 'Root Node 2',
    type: 'location',
    locationId: 'Location2',
    description: '',
    image: '',
    parentId: null
  },
  {
    id: 'Root Node 3',
    name: 'Root Node 3',
    type: 'location',
    locationId: 'Location3',
    description: '',
    image: '',
    parentId: null
  },
  {
    id: 'Child Node 3.1',
    name: 'Child Node 3.1',
    type: 'asset',
    assetsId: 'Asset3.1',
    description: '',
    image: '',
    parentId: 'Root Node 3'
  },

  {
    id: 'Child Node 1.1',
    name: 'Child Node 1.1',
    type: 'asset',
    assetsId: 'Asset1.1',
    description: '',
    image: '',
    parentId: 'Root Node 1'
  },
  {
    id: 'Child Node 1.2',
    name: 'Child Node 1.2',
    type: 'asset',
    description: '',
    assetsId: 'Asset1.2',
    image: '',
    parentId: 'Root Node 1'
  },
  {
    id: 'Subchild Node 1',
    name: 'Subchild Node 1',
    type: 'asset',
    description: '',
    assetsId: 'Asset sub child 1',
    image: '',
    parentId: 'Child Node 1.1'
  },
  {
    id: 'Sub subchild Node 1',
    name: 'Sub subchild Node 1',
    type: 'location',
    description: '',
    locationId: 'location sub sub 1',
    image: '',
    parentId: 'Subchild Node 1'
  }
];
