import { Observable, of } from "rxjs";
import { WarehouseTechnician } from "../../interfaces/warehouse_technicians";
import { WorkOrder, WorkOrders } from "../../interfaces/work-order";


const dateString1 = '1629231200000';
const dateString2 = '1629281200000';
const dateString3 = '1629335200000';
const dateString4 = '1630335200000';
const dateString5 = '1631335200000';

const date1 = new Date(parseInt(dateString1)); //2021-08-17
const date2 = new Date(parseInt(dateString2)); //2021-08-18
const date3 = new Date(parseInt(dateString3)); //2021-08-19
const date4 = new Date(parseInt(dateString4)); //2021-08-30
const date5 = new Date(parseInt(dateString5)); //2021-09-11

export const rawWorkOrders$ = of([
  {
    PARNR: null,
    IPHAS: 'CRTD',
    PRIOK: 5,
    PRIOKX: 'High',
    COLOUR: '1B6603',
    AUFNR: 58369,
    AUFTEXT: 'Mock Description',
    ARBPL: 'ELEKTRIK',
    KTEXT: 'ELEKTRIK1',
    TXT04: 'INIT',
    GLTRP: '/Date(' + dateString1 + ')/',
    WorkOrderOperationSet: {
      results: [
        {
          ARBEI: 10,
          ISMNW: 8,
          STATUS: 'CRTD',
          LTXA1: 'Operation1'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CRTD',
          LTXA1: 'Operation2'
        }
      ]
    }


  },
  {
    PARNR: 1,
    IPHAS: 'CRTD',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58370,
    AUFTEXT: 'Mock Description 2',
    ARBPL: 'MECHANIK',
    KTEXT: 'MEKHANIK1',
    TXT04: 'KIT READY',
    GLTRP: '/Date(' + dateString2 + ')/',
    WorkOrderOperationSet: {
      results: [
        {
          ARBEI: 10,
          ISMNW: 8,
          STATUS: 'CRTD',
          LTXA1: 'Operation3'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CRTD',
          LTXA1: 'Operation4'
        }
      ]
    }


  },
  {
    PARNR: 2,
    IPHAS: 'REL',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58371,
    AUFTEXT: 'Mock Description 3',
    ARBPL: 'MECHANIK',
    KTEXT: 'MEKHANIK2',
    TXT04: 'KIT READY',
    GLTRP: '/Date(' + dateString3 + ')/',
    WorkOrderOperationSet: {
      results: [
        {
          ARBEI: 10,
          ISMNW: 8,
          STATUS: 'CRTD',
          LTXA1: 'Operation5'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CNF',
          LTXA1: 'Operation6'
        }
      ]
    }


  },
  {
    PARNR: 3,
    IPHAS: 'TECO',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58373,
    AUFTEXT: 'Mock Description 4',
    ARBPL: 'ELEKTRIK',
    KTEXT: 'ELEKTRIK1',
    TXT04: 'KIT READY',
    GLTRP: '/Date(' + dateString5 + ')/',
    WorkOrderOperationSet: {
      results: [
        {
          ARBEI: 8,
          ISMNW: 3,
          STATUS: 'CNF',
          LTXA1: 'Operation7'
        },
        {
          ARBEI: 7,
          ISMNW: 4,
          STATUS: 'CNF',
          LTXA1: 'Operation8'
        }
      ]
    }
  },
  {
    PARNR: 5,
    IPHAS: 'REL',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58372,
    AUFTEXT: 'Fake Description 5',
    ARBPL: 'ARBITRARY',
    KTEXT: 'ARBITRARY2',
    TXT04: 'KIT READY',
    GLTRP: '/Date(' + dateString4 + ')/',
    WorkOrderOperationSet: {
      results: [
        {
          ARBEI: 3,
          ISMNW: 1,
          STATUS: 'CNF',
          LTXA1: 'Operation9'
        },
        {
          ARBEI: 3,
          ISMNW: 4,
          STATUS: 'CNF',
          LTXA1: 'Operation10'
        }
      ]
    }


  }

]);

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
  dueDate: date1,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2, 0],
  timeProgress: 12/15,
  operations: [{
    actualTime: '8 hrs',
    estimatedTime: '10 hrs',
    operationName: 'Operation1',
    timeProgress: 8/10,
  },
  {
    actualTime: '4 hrs',
    estimatedTime: '5 hrs',
    operationName: 'Operation2',
    timeProgress: 4/5
  }
],
  technician: [],

} 

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
  dueDate: date2,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2, 0],
  timeProgress: 12/15,
  operations: [{
    actualTime: '8 hrs',
    estimatedTime: '10 hrs',
    operationName: 'Operation3',
    timeProgress: 8/10,
  },
  {
    actualTime: '4 hrs',
    estimatedTime: '5 hrs',
    operationName: 'Operation4',
    timeProgress: 4/5
  }
],
  technician: [{personName: 'Mr. A', personKey: '001', image: '1'}],
}

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
  dueDate: date3,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [1, 2, 0.5],
  timeProgress: 12/15,
  operations: [{
    actualTime: '8 hrs',
    estimatedTime: '10 hrs',
    operationName: 'Operation5',
    timeProgress: 8/10,
  },
  {
    actualTime: '4 hrs',
    estimatedTime: '5 hrs',
    timeProgress: 4/5,
    operationName: 'Operation6'

  }
],
  technician: [{personName: 'Ms. B', personKey: '002', image: '2'}],
}

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
  dueDate: date4,
  estimatedTime: '6 hrs',
  actualTime: '5 hrs',
  operationProgress: [2, 2, 1],
  timeProgress: 5/6,
  operations: [{
    actualTime: '1 hr',
    estimatedTime: '3 hrs',
    operationName: 'Operation9',
    timeProgress: 1/3,
  },
{
  actualTime: '4 hrs',
  estimatedTime: '3 hrs',
  operationName: 'Operation10',
  timeProgress: 4/3
},
],
technician: [{personName: 'Ms. E', personKey: '005', image: '5'}]
}

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
  dueDate: date5,
  estimatedTime: '15 hrs',
  actualTime: '7 hrs',
  operationProgress: [2, 2, 1],
  timeProgress: 7/15,
  operations: [{
    actualTime: '3 hrs',
    estimatedTime: '8 hrs',
    operationName: 'Operation7' ,
    timeProgress: 3/8,
  },
  {
    actualTime: '4 hrs',
    estimatedTime: '7 hrs',
    operationName: 'Operation8',
    timeProgress: 4/7
  }
],
  technician: [{personName: 'Ms. C', personKey: '003', image: '3'}]
}

export const expectedWorkOrders$ = of(
  {
    unassigned: [unassignedWorkOrder1],

    assigned: [assignedWorkOrder1],
    inProgress: [inProgressWorkOrder1, inProgressWorkOrder2
    ],
    completed: [completedWorkOrder1
    ],

  })


  export const rawARBPLs$ = of([{
    ARBPLKey: "ELEKTRIK",
    ARBPLDesc: "Electrical Maintenance",
  },
  {
    ARBPLKey: "MECHANIK",
    ARBPLDesc: "Mechanical Maintenance",
  },
  {
    ARBPLKey: "ARBITRARY",
    ARBPLDesc: "Arbitrary Maintenance",
  },
])

export const expectedARBPLs$ = of([
  {
    workCenterKey: "ELEKTRIK",
    workCenterDesc: "Electrical Maintenance"
  },
  {
    workCenterKey: 'MECHANIK',
    workCenterDesc: 'Mechanical Maintenance'
  },
  {
    workCenterKey: "ARBITRARY",
    workCenterDesc: "Arbitrary Maintenance"
  }
])

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
}])

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
}])

export const rawTechniciansARBITRARY$ = of([
{
  PERNRDesc: 'Ms. E',
  PERNRKey: '005',
  FILECONTENT: '5'
}
])

export const expectedTechnicians$ = of({
  'ELEKTRIK':[
  {
    personName: 'Ms. C',
    personKey: '003',
    image: '3'
  },
  {
    personName: 'Mr. D',
    personKey: '004',
    image: '4'
  }],
  'MECHANIK':[
    {
      personName: 'Mr. A',
      personKey: '001',
      image: '1'
    },
    {
      personName: 'Ms. B',
      personKey: '002',
      image: '2'
    }],
  'ARBITRARY':[
  {
    personName: 'Ms. E',
    personKey: '005',
    image: '5'
  }
]
})

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
  }])

export const expectedTechniciansARBITRARY$ = of([
  {
    personName: 'Ms. E',
    personKey: 5,
    image: '5'
  }

])