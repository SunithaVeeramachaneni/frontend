import { Widget, TableColumn } from 'src/app/interfaces';

export const widget: Widget = {
  name: 'TestReport1',
  isTable: false,
  chartDetails: {
    title: '',
    type: 'bar',
    indexAxis: 'y',
    backgroundColors: ['rgba(61, 90, 254, 0.5)'],
    showValues: false,
    showLegends: false,
    datasetFieldName: 'userLocation',
    countFieldName: 'Record Count'
  },
  tableColumns: [
    {
      name: 'appName',
      order: 14,
      sticky: false,
      visible: true
    },
    {
      name: 'objectType',
      order: 3,
      sticky: true,
      visible: true
    },
    {
      name: 'documentCreatedDate',
      order: 15,
      sticky: false,
      visible: true
    },
    {
      name: 'userLocation',
      order: 1,
      sticky: true,
      visible: true
    },
    {
      name: 'duration',
      order: 16,
      sticky: false,
      visible: true
    },
    {
      name: 'roles',
      order: 2,
      sticky: true,
      visible: true
    },
    {
      name: 'plantID',
      order: 17,
      sticky: false,
      visible: true
    }
  ] as TableColumn[],
  groupBy: [],
  filtersApplied: [],
  config: {
    x: 0,
    y: 0,
    cols: 6,
    rows: 6,
    dragEnabled: true,
    resizeEnabled: true,
    id: '6218d4236589975d095cdc98'
  },
  isFavorite: false,
  reportId: '6218ae346589975d095cda1a',
  dashboardId: '62173ba5d188c7b6c8629797',
  createdBy: 'kiran palani',
  updatedBy: null,
  updatedOn: '2022-02-25T13:05:39.434Z',
  createdOn: '2022-02-25T13:05:39.366Z',
  report: {
    name: 'TestReport1',
    groupBy: ['userLocation', 'roles', 'objectType'],
    filtersApplied: [],
    tableDetails: [
      {
        tableName: 'transactions',
        keyColumn: 'workGroup',
        columns: [
          {
            displayName: 'App Name',
            name: 'appName',
            filterType: 'multi',
            order: 14,
            sticky: false,
            visible: true,
            type: 'string'
          },
          {
            displayName: 'Action By',
            name: 'actionTakenBy',
            filterType: 'string',
            order: 4,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Object Type',
            name: 'objectType',
            filterType: 'string',
            order: 3,
            sticky: true,
            visible: true,
            type: 'string'
          },
          {
            displayName: 'Action',
            name: 'action',
            filterType: 'multi',
            order: 5,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Created Date',
            name: 'documentCreatedDate',
            filterType: 'daterange',
            order: 15,
            sticky: false,
            visible: true,
            type: 'date'
          },
          {
            displayName: 'Module',
            name: 'moduleName',
            filterType: 'string',
            order: 6,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Location',
            name: 'userLocation',
            filterType: 'multi',
            order: 1,
            sticky: true,
            visible: true,
            type: 'string'
          },
          {
            displayName: 'Action Date',
            name: 'actionTakenDate',
            filterType: 'daterange',
            order: 7,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Duration',
            name: 'duration',
            filterType: 'number',
            order: 16,
            sticky: false,
            visible: true,
            type: 'number'
          },
          {
            displayName: 'Time Zone',
            name: 'timeZoneText',
            filterType: 'multi',
            order: 8,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Item No',
            name: 'itemNumber',
            filterType: 'string',
            order: 9,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Time',
            name: 'time',
            filterType: 'number',
            order: 10,
            sticky: false,
            visible: false,
            type: 'number'
          },
          {
            displayName: 'Role',
            name: 'roles',
            filterType: 'multi',
            order: 2,
            sticky: true,
            visible: true,
            type: 'string'
          },
          {
            displayName: 'Object No',
            name: 'objectNumber',
            filterType: 'string',
            order: 11,
            sticky: false,
            visible: false,
            type: 'string'
          }
        ]
      },
      {
        tableName: 'workcenters',
        keyColumn: 'workCenterName',
        columns: [
          {
            displayName: 'Work Center ID',
            name: 'workCenterID',
            filterType: 'string',
            order: 12,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Work Center',
            name: 'workCenterName',
            filterType: 'string',
            order: 13,
            sticky: false,
            visible: false,
            type: 'string'
          },
          {
            displayName: 'Plant ID',
            name: 'plantID',
            filterType: 'string',
            order: 17,
            sticky: false,
            visible: true,
            type: 'string'
          }
        ]
      }
    ],
    createdBy: 'kiran palani',
    description: 'A report containing transactions and work centers',
    isFavorite: false,
    showChart: false,
    chartDetails: {
      title: '',
      type: 'bar',
      indexAxis: 'y',
      backgroundColors: ['rgba(61, 90, 254, 0.5)'],
      showLegends: false,
      showValues: false,
      datasetFieldName: 'userLocation',
      countFieldName: 'Record Count'
    },
    createdTime: '2022-02-25T10:23:48.749Z',
    id: '6218ae346589975d095cda1a'
  },
  id: '6218d4236589975d095cdc8e'
};
