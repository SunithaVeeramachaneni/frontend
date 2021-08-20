import { of } from "rxjs";
import { WorkOrders } from "../../interfaces/work-order";

export const rawWorkOrders$ = of([
    {
    PARNR: '',
    IPHAS: 'CRTD',
    PRIOK: 5,
    PRIOKX: 'High',
    COLOUR: '1B6603',
    AUFNR: '58369',
    AUFTEXT: 'Mock Description',
    ARBPL: '7397',
    KTEXT: 'ELEKTRIK',
    TXT04: 'INIT',
    GSTRP: '/Date(1629331200000)/',
    WorkOrderOperationSet: {
      results: [
        {
        ARBEI: 10,
        ISMNW: 8,
        STATUS: 'CRTD'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CRTD'
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
    AUFNR: '58370',
    AUFTEXT: 'Mock Description 2',
    ARBPL: '7398',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(1629331300000)/',
    WorkOrderOperationSet: {
      results: [
        {
        ARBEI: 10,
        ISMNW: 8,
        STATUS: 'CRTD'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CRTD'
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
    AUFNR: '58371',
    AUFTEXT: 'Mock Description 3',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(1629331400000)/',
    WorkOrderOperationSet: {
      results: [
        {
        ARBEI: 10,
        ISMNW: 8,
        STATUS: 'CRTD'
        },
        {
          ARBEI: 5,
          ISMNW: 4,
          STATUS: 'CNF'
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
    AUFNR: '58371',
    AUFTEXT: 'Mock Description 4',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(1629331500000)/',
    WorkOrderOperationSet: {
      results: [
        {
        ARBEI: 8,
        ISMNW: 3,
        STATUS: 'CRTD'
        },
        {
          ARBEI: 7,
          ISMNW: 4,
          STATUS: 'CNF'
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
    AUFNR: '58372',
    AUFTEXT: 'Mock Description 5',
    ARBPL: '7399',
    KTEXT: 'MEKHANIK',
    TXT04: 'KIT READY',
    GSTRP: '/Date(1629331600000)/',
    WorkOrderOperationSet: {
      results: [
        {
        ARBEI: 3,
        ISMNW: 1,
        STATUS: 'CNF'
        },
        {
          ARBEI: 3,
          ISMNW: 4,
          STATUS: 'CNF'
        }
      ]
    }


  }

]);

  export const expectedWorkOrders : WorkOrders = 
  {
   unassigned : [{
     status: 'unassigned',
     personDetails: '',
     priorityNumber: 5,
     priorityStatus: 'High',
     colour: '1B6603',
     workOrderID: 58369,
     workOrderDesc: 'Mock Description',
     equipmentID: '7397',
     equipmentName: 'ELEKTRIK',
     kitStatus: 'INIT',
     dueDate: new Date(1629331200000),
     estimatedTime: '15 hrs',
     actualTime: '12 hrs',
     progress: [0,2]
   }],

   assigned: [{
    status: 'assigned',
    personDetails: '001',
    priorityNumber: 3,
    priorityStatus: 'Medium',
    colour: 'B0D450',
    workOrderID: 58370,
    workOrderDesc: 'Mock Description 2',
    equipmentID: '7398',
    equipmentName: 'MEKHANIK',
    kitStatus: 'KIT READY',
    dueDate: new Date(1629331300000),
    estimatedTime: '15 hrs',
    actualTime: '12 hrs',
    progress: [0,2]
  }] ,
   inProgress: [{
    status: 'inProgress',
    personDetails: '002',
    priorityNumber: 3,
    priorityStatus: 'Medium',
    colour: 'B0D450',
    workOrderID: 58371,
    workOrderDesc: 'Mock Description 3',
    equipmentID: '7399',
    equipmentName: 'MEKHANIK',
    kitStatus: 'KIT READY',
    dueDate: new Date(1629331400000),
    estimatedTime: '15 hrs',
    actualTime: '12 hrs',
    progress: [1,2]
  },
  {
    status: 'inProgress',
    personDetails: '005',
    priorityNumber: 3,
    priorityStatus: 'Medium',
    colour: 'B0D450',
    workOrderID: 58371,
    workOrderDesc: 'Mock Description 5',
    equipmentID: '7399',
    equipmentName: 'MEKHANIK',
    kitStatus: 'KIT READY',
    dueDate: new Date(1629331600000),
    estimatedTime: '6 hrs',
    actualTime: '5 hrs',
    progress: [1,2]
  }],
   completed: [{
    status: 'completed',
    personDetails: '003',
    priorityNumber: 3,
    priorityStatus: 'Medium',
    colour: 'B0D450',
    workOrderID: 58372,
    workOrderDesc: 'Mock Description 4',
    equipmentID: '7399',
    equipmentName: 'MEKHANIK',
    kitStatus: 'KIT READY',
    dueDate: new Date(1629331500000),
    estimatedTime: '15 hrs',
    actualTime: '12 hrs',
    progress: [2,2]
  }],
  
}