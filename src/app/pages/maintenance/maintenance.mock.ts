import { of } from "rxjs";
import { WorkOrders } from "../../interfaces/work-order";


const dateString1 = '1629231200000';
const dateString2 = '1629281200000';
const dateString3 = '1629335200000';
const dateString4 = '1630335200000';
const dateString5 = '1631335200000'

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
          STATUS: 'CNF'
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

export const expectedWorkOrders$ = of(
  {
    unassigned: [{
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
      dueDate: date1,
      estimatedTime: '15 hrs',
      actualTime: '12 hrs',
      progress: [0, 2]
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
      dueDate: date2,
      estimatedTime: '15 hrs',
      actualTime: '12 hrs',
      progress: [0, 2]
    }],
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
      dueDate: date3,
      estimatedTime: '15 hrs',
      actualTime: '12 hrs',
      progress: [1, 2]
    },
    {
      status: 'inProgress',
      personDetails: '005',
      priorityNumber: 3,
      priorityStatus: 'Medium',
      colour: 'B0D450',
      workOrderID: 58372,
      workOrderDesc: 'Fake Description 5',
      equipmentID: '7399',
      equipmentName: 'MEKHANIK',
      kitStatus: 'KIT READY',
      dueDate: date4,
      estimatedTime: '6 hrs',
      actualTime: '5 hrs',
      progress: [2, 2]
    }],
    completed: [{
      status: 'completed',
      personDetails: '003',
      priorityNumber: 3,
      priorityStatus: 'Medium',
      colour: 'B0D450',
      workOrderID: 58373,
      workOrderDesc: 'Mock Description 4',
      equipmentID: '7399',
      equipmentName: 'MEKHANIK',
      kitStatus: 'KIT READY',
      dueDate: date5,
      estimatedTime: '15 hrs',
      actualTime: '7 hrs',
      progress: [2, 2]
    }],

  })