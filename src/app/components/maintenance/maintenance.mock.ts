import { Observable, of } from 'rxjs';
import { WarehouseTechnician } from '../../interfaces/warehouse_technicians';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';

export const unassignedWorkOrder1: WorkOrder = {
  status: 'unassigned',
  personDetails: null,
  priorityNumber: 5,
  priorityStatus: 'High',
  colour: '1B6603',
  workOrderID: 58369,
  workOrderDesc: 'Mock Description',
  workCenter: 'ELEKTRIK',
  equipmentName: 'ELEKTRIK1',
  kitStatus: 'Waiting On Parts',
  dueDate: '2021-08-17T20:13:20.000Z',
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2, 0],
  timeProgress: 12 / 15,
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation1',
      timeProgress: 8 / 10
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      operationName: 'Operation2',
      timeProgress: 4 / 5
    }
  ],
  technician: []
};

const assignedWorkOrder1: WorkOrder = {
  status: 'assigned',
  personDetails: 1,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58370,
  workOrderDesc: 'Mock Description 2',
  workCenter: 'MECHANIK',
  equipmentName: 'MEKHANIK1',
  kitStatus: 'Waiting On Parts',
  dueDate: '2021-08-18T10:06:40.000Z',
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2, 0],
  timeProgress: 12 / 15,
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation3',
      timeProgress: 8 / 10
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      operationName: 'Operation4',
      timeProgress: 4 / 5
    }
  ],
  technician: [{ personName: 'Mr. A', personKey: '001', image: '1' }]
};

const inProgressWorkOrder1: WorkOrder = {
  status: 'inProgress',
  personDetails: 2,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58371,
  workOrderDesc: 'Mock Description 3',
  workCenter: 'MECHANIK',
  equipmentName: 'MEKHANIK2',
  kitStatus: null,
  dueDate: '2021-08-19T01:06:40.000Z',
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [1, 2, 0.5],
  timeProgress: 12 / 15,
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation5',
      timeProgress: 8 / 10
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      timeProgress: 4 / 5,
      operationName: 'Operation6'
    }
  ],
  technician: [{ personName: 'Ms. B', personKey: '002', image: '2' }]
};

const inProgressWorkOrder2: WorkOrder = {
  status: 'inProgress',
  personDetails: 5,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58372,
  workOrderDesc: 'Fake Description 5',
  workCenter: 'ARBITRARY',
  equipmentName: 'ARBITRARY2',
  kitStatus: null,
  dueDate: '2021-08-30T14:53:20.000Z',
  estimatedTime: '6 hrs',
  actualTime: '5 hrs',
  operationProgress: [2, 2, 1],
  timeProgress: 5 / 6,
  operations: [
    {
      actualTime: '1 hr',
      estimatedTime: '3 hrs',
      operationName: 'Operation9',
      timeProgress: 1 / 3
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '3 hrs',
      operationName: 'Operation10',
      timeProgress: 4 / 3
    }
  ],
  technician: [{ personName: 'Ms. E', personKey: '005', image: '5' }]
};

const completedWorkOrder1: WorkOrder = {
  status: 'completed',
  personDetails: 3,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58373,
  workOrderDesc: 'Mock Description 4',
  workCenter: 'ELEKTRIK',
  equipmentName: 'ELEKTRIK1',
  kitStatus: null,
  dueDate: '2021-09-11T04:40:00.000Z',
  estimatedTime: '15 hrs',
  actualTime: '7 hrs',
  operationProgress: [2, 2, 1],
  timeProgress: 7 / 15,
  operations: [
    {
      actualTime: '3 hrs',
      estimatedTime: '8 hrs',
      operationName: 'Operation7',
      timeProgress: 3 / 8
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '7 hrs',
      operationName: 'Operation8',
      timeProgress: 4 / 7
    }
  ],
  technician: [{ personName: 'Ms. C', personKey: '003', image: '3' }]
};

export const rawWorkOrders$ = of([
  unassignedWorkOrder1,
  assignedWorkOrder1,
  inProgressWorkOrder1,
  inProgressWorkOrder2,
  completedWorkOrder1
]);

export const unassignedWorkOrder1Card = {
  status: 'unassigned',
  priorityText: 'High',
  priorityNumber: 5,
  kitStatusText: 'Waiting On Parts',
  workOrderID: 58369,
  headerText: '58369 - Mock Description',
  workCenterInfo: 'ELEKTRIK -  ELEKTRIK1',
  dueDate: '2021-08-17T20:13:20.000Z',
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation1',
      timeProgress: 0.8
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      operationName: 'Operation2',
      timeProgress: 0.8
    }
  ],
  workCenter: 'ELEKTRIK',
  technician: [],
  estimatedTime: '15 hrs'
};

const assignedWorkOrder1Card = {
  status: 'assigned',
  priorityText: 'Medium',
  priorityNumber: 3,
  kitStatusText: 'Waiting On Parts',
  workOrderID: 58370,
  headerText: '58370 - Mock Description 2',
  workCenterInfo: 'MECHANIK -  MEKHANIK1',
  dueDate: '2021-08-18T10:06:40.000Z',
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation3',
      timeProgress: 0.8
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      operationName: 'Operation4',
      timeProgress: 0.8
    }
  ],
  workCenter: 'MECHANIK',
  technician: [
    {
      personName: 'Mr. A',
      personKey: '001',
      image: '1'
    }
  ],
  estimatedTime: '15 hrs'
};

const inProgressWorkOrder1Card = {
  status: 'inProgress',
  priorityText: 'Medium',
  priorityNumber: 3,
  kitStatusText: null,
  workOrderID: 58371,
  headerText: '58371 - Mock Description 3',
  workCenterInfo: 'MECHANIK -  MEKHANIK2',
  dueDate: '2021-08-19T01:06:40.000Z',
  operations: [
    {
      actualTime: '8 hrs',
      estimatedTime: '10 hrs',
      operationName: 'Operation5',
      timeProgress: 0.8
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '5 hrs',
      timeProgress: 0.8,
      operationName: 'Operation6'
    }
  ],
  workCenter: 'MECHANIK',
  technician: [
    {
      personName: 'Ms. B',
      personKey: '002',
      image: '2'
    }
  ],
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  timeProgress: 0.8,
  operationProgress: [1, 2, 0.5]
};

const inProgressWorkOrder2Card = {
  status: 'inProgress',
  priorityText: 'Medium',
  priorityNumber: 3,
  kitStatusText: null,
  workOrderID: 58372,
  headerText: '58372 - Fake Description 5',
  workCenterInfo: 'ARBITRARY -  ARBITRARY2',
  dueDate: '2021-08-30T14:53:20.000Z',
  operations: [
    {
      actualTime: '1 hr',
      estimatedTime: '3 hrs',
      operationName: 'Operation9',
      timeProgress: 0.3333333333333333
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '3 hrs',
      operationName: 'Operation10',
      timeProgress: 1.3333333333333333
    }
  ],
  workCenter: 'ARBITRARY',
  technician: [
    {
      personName: 'Ms. E',
      personKey: '005',
      image: '5'
    }
  ],
  estimatedTime: '6 hrs',
  actualTime: '5 hrs',
  timeProgress: 0.8333333333333334,
  operationProgress: [2, 2, 1]
};

const completedWorkOrder1Card = {
  status: 'completed',
  priorityText: 'Medium',
  priorityNumber: 3,
  kitStatusText: null,
  workOrderID: 58373,
  headerText: '58373 - Mock Description 4',
  workCenterInfo: 'ELEKTRIK -  ELEKTRIK1',
  dueDate: '2021-09-11T04:40:00.000Z',
  operations: [
    {
      actualTime: '3 hrs',
      estimatedTime: '8 hrs',
      operationName: 'Operation7',
      timeProgress: 0.375
    },
    {
      actualTime: '4 hrs',
      estimatedTime: '7 hrs',
      operationName: 'Operation8',
      timeProgress: 0.5714285714285714
    }
  ],
  workCenter: 'ELEKTRIK',
  technician: [
    {
      personName: 'Ms. C',
      personKey: '003',
      image: '3'
    }
  ],
  estimatedTime: '15 hrs',
  actualTime: '7 hrs',
  timeProgress: 0.4666666666666667,
  operationProgress: [2, 2, 1]
};

export const expectedWorkOrders$ = of({
  unassigned: [unassignedWorkOrder1Card],

  assigned: [assignedWorkOrder1Card],
  inProgress: [inProgressWorkOrder1Card, inProgressWorkOrder2Card],
  completed: [completedWorkOrder1Card]
});

export const rawARBPLs$ = of([
  {
    ARBPLKey: 'ELEKTRIK',
    ARBPLDesc: 'Electrical Maintenance'
  },
  {
    ARBPLKey: 'MECHANIK',
    ARBPLDesc: 'Mechanical Maintenance'
  },
  {
    ARBPLKey: 'ARBITRARY',
    ARBPLDesc: 'Arbitrary Maintenance'
  }
]);

export const expectedARBPLs$ = of([
  {
    workCenterKey: 'ELEKTRIK',
    workCenterDesc: 'Electrical Maintenance'
  },
  {
    workCenterKey: 'MECHANIK',
    workCenterDesc: 'Mechanical Maintenance'
  },
  {
    workCenterKey: 'ARBITRARY',
    workCenterDesc: 'Arbitrary Maintenance'
  }
]);

export const rawTechniciansMECHANIK$ = of([
  {
    PERNRDesc: 'Mr. A',
    PERNRKey: '001',
    FILECONTENT: '1'
  },
  {
    PERNRDesc: 'Ms. B',
    PERNRKey: '002',
    FILECONTENT: '2'
  }
]);

export const rawTechniciansELEKTRIK$ = of([
  {
    PERNRDesc: 'Ms. C',
    PERNRKey: '003',
    FILECONTENT: '3'
  },
  {
    PERNRDesc: 'Mr. D',
    PERNRKey: '004',
    FILECONTENT: '4'
  }
]);

export const rawTechniciansARBITRARY$ = of([
  {
    PERNRDesc: 'Ms. E',
    PERNRKey: '005',
    FILECONTENT: '5'
  }
]);

export const expectedTechnicians$ = of({
  ELEKTRIK: [
    {
      personName: 'Ms. C',
      personKey: '003',
      image: '3'
    },
    {
      personName: 'Mr. D',
      personKey: '004',
      image: '4'
    }
  ],
  MECHANIK: [
    {
      personName: 'Mr. A',
      personKey: '001',
      image: '1'
    },
    {
      personName: 'Ms. B',
      personKey: '002',
      image: '2'
    }
  ],
  ARBITRARY: [
    {
      personName: 'Ms. E',
      personKey: '005',
      image: '5'
    }
  ]
});

export const expectedTechniciansELEKTRIK$ = of([
  {
    personName: 'Ms. C',
    personKey: 3,
    image: '2'
  },
  {
    personName: 'Ms. D',
    personKey: 4,
    image: '4'
  }
]);

export const expectedTechniciansARBITRARY$ = of([
  {
    personName: 'Ms. E',
    personKey: 5,
    image: '5'
  }
]);
