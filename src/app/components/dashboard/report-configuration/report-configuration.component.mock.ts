import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { of } from 'rxjs';
import { AppChartConfig } from 'src/app/interfaces';

export const reportDetails = {
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
      countFieldName: 'Record Count',
      id: '6218ae346589975d095cda19'
    },
    createdTime: '2022-02-25T10:23:48.749Z',
    id: '6218ae346589975d095cda1a',
    filterOptions: {
      string: [
        'equals',
        'not equal to',
        'less than',
        'greater than',
        'less or equal',
        'greater or equal',
        'contains',
        'does not contain',
        'starts with'
      ],
      number: [
        'equals',
        'not equal to',
        'greater than',
        'greater or equal',
        'less than',
        'less or equal'
      ],
      daterange: ['custom', 'today', 'week', 'month'],
      multi: {
        appName: ['MWORKORDER'],
        action: ['CNF', 'NOPR', 'REL', 'TECO', 'UPD'],
        userLocation: ['DBS Tanami', 'FP Bodd', 'Granite Tanami', 'M Bodd'],
        timeZoneText: ['ACST', 'AEST', 'AWST', 'GMT+8', 'GMT+9:30'],
        roles: [
          'Advisor',
          'Engineering',
          'Health Analyst',
          'Leave',
          'Left',
          'Superintendent',
          'Supervisor',
          'Technician'
        ]
      },
      single: {}
    }
  },
  reportData: [
    {
      appName: 'MWORKORDER',
      actionTakenBy: '10011447',
      objectNumber: '21827661',
      action: 'UPD',
      documentCreatedDate: '2020-11-12T18:30:00.000Z',
      moduleName: 'WORKORDER',
      userLocation: 'Granite Tanami',
      actionTakenDate: '2020-12-31T18:30:00.000Z',
      duration: 49,
      timeZoneText: 'ACST',
      itemNumber: '0',
      time: 0.3754282407,
      roles: 'Technician',
      objectType: 'BUS2007',
      workCenterID: '11',
      workCenterName: '10EL-B',
      plantID: '1000'
    },
    {
      appName: 'MWORKORDER',
      actionTakenBy: '10011447',
      objectNumber: '12551587',
      action: 'UPD',
      documentCreatedDate: '2020-12-05T18:30:00.000Z',
      moduleName: 'WORKORDER',
      userLocation: 'Granite Tanami',
      actionTakenDate: '2020-12-31T18:30:00.000Z',
      duration: 26,
      timeZoneText: 'ACST',
      itemNumber: '0',
      time: 0.4192939815,
      roles: 'Technician',
      objectType: 'BUS2007',
      workCenterID: '11',
      workCenterName: '10EL-B',
      plantID: '1000'
    }
  ]
};

export const reportDetails$ = of(reportDetails);

export const configOptions: ConfigOptions = {
  tableID: 'widgetConfiguration6218ae346589975d095cda1a',
  rowsExpandable: false,
  enableRowsSelection: false,
  enablePagination: false,
  displayFilterPanel: false,
  displayActionsColumn: false,
  rowLevelActions: {
    menuActions: []
  },
  groupByColumns: [],
  pageSizeOptions: [10, 25, 50, 75, 100],
  allColumns: [
    {
      id: 'appName',
      displayName: 'App Name',
      type: 'string',
      visible: true,
      sticky: false,
      order: 14,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'actionTakenBy',
      displayName: 'Action By',
      type: 'string',
      visible: false,
      sticky: false,
      order: 4,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'objectType',
      displayName: 'Object Type',
      type: 'string',
      visible: true,
      sticky: true,
      order: 3,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'action',
      displayName: 'Action',
      type: 'string',
      visible: false,
      sticky: false,
      order: 5,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'documentCreatedDate',
      displayName: 'Created Date',
      type: 'date',
      visible: true,
      sticky: false,
      order: 15,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'moduleName',
      displayName: 'Module',
      type: 'string',
      visible: false,
      sticky: false,
      order: 6,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'userLocation',
      displayName: 'Location',
      type: 'string',
      visible: true,
      sticky: true,
      order: 1,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'actionTakenDate',
      displayName: 'Action Date',
      type: 'string',
      visible: false,
      sticky: false,
      order: 7,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'duration',
      displayName: 'Duration',
      type: 'number',
      visible: true,
      sticky: false,
      order: 16,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'timeZoneText',
      displayName: 'Time Zone',
      type: 'string',
      visible: false,
      sticky: false,
      order: 8,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'itemNumber',
      displayName: 'Item No',
      type: 'string',
      visible: false,
      sticky: false,
      order: 9,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'time',
      displayName: 'Time',
      type: 'number',
      visible: false,
      sticky: false,
      order: 10,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'roles',
      displayName: 'Role',
      type: 'string',
      visible: true,
      sticky: true,
      order: 2,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'objectNumber',
      displayName: 'Object No',
      type: 'string',
      visible: false,
      sticky: false,
      order: 11,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'workCenterID',
      displayName: 'Work Center ID',
      type: 'string',
      visible: false,
      sticky: false,
      order: 12,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'workCenterName',
      displayName: 'Work Center',
      type: 'string',
      visible: false,
      sticky: false,
      order: 13,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'plantID',
      displayName: 'Plant ID',
      type: 'string',
      visible: true,
      sticky: false,
      order: 17,
      searchable: true,
      sortable: true,
      movable: true,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    }
  ],
  tableHeight: 'calc(100vh - 173px)',
  groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
};

export const chartConfig: AppChartConfig = {
  title: '',
  type: 'bar',
  indexAxis: 'y',
  backgroundColors: ['rgba(61, 90, 254, 0.5)'],
  showValues: false,
  showLegends: false,
  datasetFieldName: 'userLocation',
  countFieldName: 'Record Count',
  id: '6218ae346589975d095cda19',
  datasetFields: [
    {
      name: 'userLocation',
      displayName: 'Location',
      visible: true
    },
    {
      name: 'roles',
      displayName: 'Role',
      visible: false
    },
    {
      name: 'objectType',
      displayName: 'Object Type',
      visible: false
    }
  ],
  countFields: [
    {
      name: 'Record Count',
      displayName: 'Record Count',
      visible: true
    },
    {
      name: 'duration',
      displayName: 'Sum of Duration',
      visible: false
    }
  ],
  renderChart: false
};
