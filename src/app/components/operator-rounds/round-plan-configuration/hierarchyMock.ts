export const hierarchyMock = [
  {
    id: 'node1',
    type: 'Location',
    name: 'Node1',
    image: '',
    hasChildren: true,
    isExpanded: true,
    subFormId: '',
    sequence: 1,
    children: [
      {
        id: 'n1c1',
        type: 'Location',
        name: 'N1C1',
        image: '',
        hasChildren: true,
        isExpanded: true,
        subFormId: '',
        sequence: 2,
        children: [
          {
            id: 'n1c1a',
            type: 'Asset',
            name: 'N1C1A',
            image: '',
            hasChildren: false,
            isExpanded: false,
            subFormId: '',
            sequence: 3,
            children: []
          },
          {
            id: 'n1c1b',
            type: 'Asset',
            name: 'N1C1B',
            image: '',
            hasChildren: false,
            isExpanded: false,
            subFormId: '',
            sequence: 4,
            children: []
          }
        ]
      },
      {
        id: 'n1c2',
        type: 'Location',
        name: 'N1C2',
        image: '',
        hasChildren: true,
        isExpanded: true,
        subFormId: '',
        sequence: 5,
        children: [
          {
            id: 'n1c2a',
            type: 'Asset',
            name: 'N1C2A',
            image: '',
            hasChildren: false,
            isExpanded: false,
            subFormId: '',
            sequence: 6,
            children: []
          },
          {
            id: 'n1c2b',
            type: 'Asset',
            name: 'N1C2B',
            image: '',
            hasChildren: false,
            isExpanded: false,
            subFormId: '',
            sequence: 7,
            children: []
          }
        ]
      }
    ]
  }
];
