import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { of } from 'rxjs';
import { Report, TableColumn } from 'src/app/interfaces';

export const reports: Report = {
  data: [
    {
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
      id: '6218ae346589975d095cda1a'
    }
  ],
  columns: [
    {
      name: 'name',
      displayName: 'Name',
      type: 'string'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string'
    },
    {
      name: 'createdBy',
      displayName: 'Created By',
      type: 'string'
    },
    {
      name: 'createdTime',
      displayName: 'Created On',
      type: 'date'
    }
  ] as TableColumn[]
};

export const reports$ = of(reports);

export const configOptions: ConfigOptions = {
  tableID: 'reportsTable',
  rowsExpandable: false,
  enableRowsSelection: false,
  enablePagination: false,
  displayFilterPanel: false,
  displayActionsColumn: true,
  rowLevelActions: {
    menuActions: [
      {
        icon: 'remove_red_eye',
        title: 'Preview',
        action: 'preview'
      },
      {
        icon: 'edit',
        title: 'Edit',
        action: 'edit'
      },
      {
        icon: 'file_download',
        title: 'Export to Excel',
        action: 'export'
      },
      {
        icon: 'content_copy',
        title: 'Copy',
        action: 'copy'
      },
      {
        icon: 'delete',
        title: 'Delete',
        action: 'delete'
      }
    ],
    iconAction: {
      iconToggleOff: 'star_border',
      iconToggleOn: 'star',
      styleToggleOff: {},
      styleToggleOn: {
        color: '#f9d247'
      },
      property: 'isFavorite',
      action: 'favorite',
      title: 'Favorite'
    }
  },
  groupByColumns: [],
  pageSizeOptions: [10, 25, 50, 75, 100],
  allColumns: [
    {
      id: 'name',
      displayName: 'Name',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 1,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'description',
      displayName: 'Description',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 2,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'createdBy',
      displayName: 'Created By',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 3,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    },
    {
      id: 'createdTime',
      displayName: 'Created On',
      type: 'date',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 4,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: ''
    }
  ],
  tableHeight: 'calc(100vh - 200px)',
  groupLevelColors: []
};
