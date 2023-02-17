export const hierarchyMock = [
  {
    id: 'Root Node 1',
    name: 'Root Node 1',
    type: 'location',
    image: '',
    parentId: null
  },
  {
    id: 'Root Node 2',
    name: 'Root Node 2',
    type: 'location',
    image: '',
    parentId: null
  },
  {
    id: 'Child Node 1.1',
    name: 'Child Node 1.1',
    type: 'location',
    image: '',
    parentId: 'Root Node 1'
  },
  {
    id: 'Child Node 1.2',
    name: 'Child Node 1.2',
    type: 'asset',
    image: '',
    parentId: 'Root Node 1'
  },
  {
    id: 'Subchild Node 1',
    name: 'Subchild Node 1',
    type: 'asset',
    image: '',
    parentId: 'Child Node 1.1'
  },
  {
    id: 'Sub subchild Node 1',
    name: 'Sub subchild Node 1',
    type: 'location',
    image: '',
    parentId: 'Subchild Node 1'
  }
];
