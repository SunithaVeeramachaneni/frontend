import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { TableColumn } from 'src/app/interfaces';

export const columns = [
  {
    name: 'tenantName',
    displayName: 'Tenant',
    type: 'string'
  },
  {
    name: 'products',
    displayName: 'Products',
    type: 'string'
  },
  {
    name: 'modules',
    displayName: 'Modules',
    type: 'string'
  },
  {
    name: 'adminInfo',
    displayName: 'Admin',
    type: 'string'
  },
  {
    name: 'createdAt',
    displayName: 'Created On',
    type: 'date'
  }
] as TableColumn[];

export const configOptions: ConfigOptions = {
  tableID: 'tenantsTable',
  rowsExpandable: false,
  enableRowsSelection: false,
  enablePagination: false,
  displayFilterPanel: false,
  displayActionsColumn: true,
  rowLevelActions: {
    menuActions: [
      {
        title: 'Edit',
        action: 'edit'
      }
    ]
  },
  groupByColumns: [],
  pageSizeOptions: [10, 25, 50, 75, 100],
  allColumns: [
    {
      id: 'tenantName',
      displayName: 'Tenant',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 1,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: '',
      showMenuOptions: true,
       hideable: true, 
       stickable: true,
        titleStyle: {},
         subtitleStyle: {}, 
         hasPreTextImage: false,
          hasPostTextImage: false
    },
    {
      id: 'products',
      displayName: 'Products',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 2,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: '',
      showMenuOptions: true,
      hideable: true, 
      stickable: true,
       titleStyle: {},
        subtitleStyle: {}, 
        hasPreTextImage: false,
         hasPostTextImage: false
    },
    {
      id: 'modules',
      displayName: 'Modules',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 3,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: '',
      showMenuOptions: true,
      hideable: true, 
      stickable: true,
       titleStyle: {},
        subtitleStyle: {}, 
        hasPreTextImage: false,
         hasPostTextImage: false
    },
    {
      id: 'adminInfo',
      displayName: 'Admin',
      type: 'string',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 4,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: '',
      showMenuOptions: true,
      hideable: true, 
      stickable: true,
       titleStyle: {},
        subtitleStyle: {}, 
        hasPreTextImage: false,
         hasPostTextImage: false
    },
    {
      id: 'createdAt',
      displayName: 'Created On',
      type: 'date',
      visible: true,
      sticky: false,
      searchable: true,
      sortable: true,
      movable: false,
      order: 5,
      groupable: false,
      hasSubtitle: false,
      subtitleColumn: '',
      showMenuOptions: true,
      hideable: true, 
      stickable: true,
       titleStyle: {},
        subtitleStyle: {}, 
        hasPreTextImage: false,
         hasPostTextImage: false
    }
  ],
  tableHeight: 'calc(100vh - 150px)',
  groupLevelColors: []
};
