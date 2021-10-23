import { Observable, of } from "rxjs";
import { Technician } from "../../interfaces/technicians";
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
    PARNR: '',
    IPHAS: 'CRTD',
    PRIOK: 5,
    PRIOKX: 'High',
    COLOUR: '1B6603',
    AUFNR: 58369,
    AUFTEXT: 'Mock Description',
    ARBPL: '7397',
    KTEXT: 'ELEKTRIK',
    TXT04: 'INIT',
    GSTRP: '/Date(' + dateString1 + ')/',
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
    PARNR: '001',
    IPHAS: 'CRTD',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58370,
    AUFTEXT: 'Mock Description 2',
    ARBPL: '7398',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(' + dateString2 + ')/',
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
    PARNR: '002',
    IPHAS: 'REL',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58371,
    AUFTEXT: 'Mock Description 3',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(' + dateString3 + ')/',
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
    PARNR: '003',
    IPHAS: 'TECO',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58373,
    AUFTEXT: 'Mock Description 4',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(' + dateString5 + ')/',
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
    PARNR: '005',
    IPHAS: 'REL',
    PRIOK: 3,
    PRIOKX: 'Medium',
    COLOUR: 'B0D450',
    AUFNR: 58372,
    AUFTEXT: 'Fake Description 5',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(' + dateString4 + ')/',
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

const unassignedWorkOrder1: WorkOrder = {
  status: 'unassigned',
  personDetails: null,
  priorityNumber: 5,
  priorityStatus: 'High',
  colour: '1B6603',
  workOrderID: 58369,
  workOrderDesc: 'Mock Description',
  workCenter: '7397',
  equipmentName: 'ELEKTRIK',
  kitStatus: 'INIT',
  dueDate: date1,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2],
  timeProgress: 12/15,
  operations: [{
    actualTime: 8,
    estimatedTime: 10,
    operationName: 'Operation1',
    timeProgress: 8/10,
  },
  {
    actualTime: 4,
    estimatedTime: 5,
    operationName: 'Operation2',
    timeProgress: 4/5
  }
],
  technician: null,

} 

const assignedWorkOrder1: WorkOrder = {
  status: 'assigned',
  personDetails: 1,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58370,
  workOrderDesc: 'Mock Description 2',
  workCenter: '7398',
  equipmentName: 'MEKHANIK',
  kitStatus: 'KIT READY',
  dueDate: date2,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2],
  timeProgress: 12/15,
  operations: [{
    actualTime: 8,
    estimatedTime: 10,
    operationName: 'Operation3',
    timeProgress: 8/10,
  },
  {
    actualTime: 4,
    estimatedTime: 5,
    operationName: 'Operation4',
    timeProgress: 4/5
  }
],
  technician: null,
}

const inProgressWorkOrder1: WorkOrder = {
  status: 'inProgress',
  personDetails: 2,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58371,
  workOrderDesc: 'Mock Description 3',
  workCenter: '7399',
  equipmentName: 'MEKHANIK',
  kitStatus: 'KIT READY',
  dueDate: date3,
  estimatedTime: '15 hrs',
  actualTime: '12 hrs',
  operationProgress: [0, 2],
  timeProgress: 12/15,
  operations: [{
    actualTime: 8,
    estimatedTime: 10,
    operationName: 'Operation5',
    timeProgress: 8/10,
  },
  {
    actualTime: 4,
    estimatedTime: 5,
    timeProgress: 4/5,
    operationName: 'Operation6'

  }
],
  technician: null,
}

const inProgressWorkOrder2: WorkOrder = {
  status: 'inProgress',
  personDetails: 5,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58372,
  workOrderDesc: 'Fake Description 5',
  workCenter: '7399',
  equipmentName: 'MEKHANIK',
  kitStatus: 'KIT READY',
  dueDate: date4,
  estimatedTime: '6 hrs',
  actualTime: '5 hrs',
  operationProgress: [0, 2],
  timeProgress: 5/6,
  operations: [{
    actualTime: 1,
    estimatedTime: 3,
    operationName: 'Operation9',
    timeProgress: 1/3,
  },
{
  actualTime: 4,
  estimatedTime: 3,
  operationName: 'Operation10',
  timeProgress: 4/3
},
],
technician: null,
}

const completedWorkOrder1: WorkOrder = {
  status: 'completed',
  personDetails: 3,
  priorityNumber: 3,
  priorityStatus: 'Medium',
  colour: 'B0D450',
  workOrderID: 58373,
  workOrderDesc: 'Mock Description 4',
  workCenter: '7399',
  equipmentName: 'MEKHANIK',
  kitStatus: 'KIT READY',
  dueDate: date5,
  estimatedTime: '15 hrs',
  actualTime: '7 hrs',
  operationProgress: [2, 2],
  timeProgress: 5/10,
  operations: [{
    actualTime: 1,
    estimatedTime: 3,
    operationName: 'Operation7' ,
    timeProgress: 1/3,
  },
  {
    actualTime: 4,
    estimatedTime: 7,
    operationName: 'Operation8',
    timeProgress: 4/7
  }
],
  technician: null,
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
  FileContent: '1'
},
{
  PERNRDesc: 'Ms. B',
  PERNRKey: '002',
  FileContent: '2'
}])

export const rawTechniciansELEKTRIK$ = of([
{
  PERNRDesc: 'Ms. C',
  PERNRKey: '003',
  FileContent: '3'
},
{
  PERNRDesc: 'Mr. D',
  PERNRKey: '004',
  FileContent: '4'
}])

export const rawTechnicians$ARBITRARY = of([
{
  PERNRDesc: 'Ms. E',
  PERNRKey: '005',
  FileContent: '5'
}
])

export const expectedTechniciansMECHANIK$ = of([
  {
    personName: 'Mr. A',
    personKey: 1,
    image: '1'
  },
  {
    personName: 'Ms. B',
    personKey: 2,
    image: '2'
  }])

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