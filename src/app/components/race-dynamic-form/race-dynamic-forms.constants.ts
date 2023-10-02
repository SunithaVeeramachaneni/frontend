import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { formConfigurationStatus } from 'src/app/app.constants';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';
// INFO: This is the default column configuration for RDF module

// To add a column in FormList Screen add the column in RDF_DEFAULT_COLUMNS and RDF_DEFAULT_COLUMN_CONFIG
export const RDF_DEFAULT_COLUMNS: columnConfiguration[] = [
  {
    columnId: 'name',
    columnName: 'Name',
    disabled: true, // Column which should not be modified by the user should be marked as disabled
    selected: true, // Column which should be selected by default should be marked as selected
    draggable: false, // If this is a default column then it should not be draggable
    default: true, // reset to default view in column configuration slider will select all columns selected as default,
    filterable: false
  },
  {
    columnId: 'formStatus',
    columnName: 'Status',
    disabled: true,
    selected: true,
    draggable: false,
    default: true,
    filterable: true
  },
  {
    columnId: 'plant',
    columnName: 'Plant',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'formType',
    columnName: 'Form Type',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'lastPublishedBy',
    columnName: 'Last Published By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'publishedDate',
    columnName: 'Last Published',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: false
  },
  {
    columnId: 'author',
    columnName: 'Created By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'tags',
    columnName: 'Tags',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  }
];
export const RDF_TEMPLATE_DEFAULT_COLUMNS: columnConfiguration[] = [
  {
    columnId: 'name',
    columnName: 'Name',
    disabled: true, // Column which should not be modified by the user should be marked as disabled
    selected: true, // Column which should be selected by default should be marked as selected
    draggable: false, // If this is a default column then it should not be draggable
    default: true, // reset to default view in column configuration slider will select all columns selected as default
    filterable: false
  },
  {
    columnId: 'formStatus',
    columnName: 'Status',
    disabled: true,
    selected: true,
    draggable: false,
    default: true,
    filterable: true
  },
  {
    columnId: 'questionsCount',
    columnName: 'Questions',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: false
  },

  {
    columnId: 'formType',
    columnName: 'Template Type',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'displayFormsUsageCount',
    columnName: 'Used in Forms',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: false
  },
  {
    columnId: 'lastPublishedBy',
    columnName: 'Modified By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'author',
    columnName: 'Created By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  },
  {
    columnId: 'tags',
    columnName: 'Tags',
    disabled: false,
    selected: true,
    draggable: true,
    default: true,
    filterable: true
  }
];

export const RDF_DEFAULT_COLUMN_CONFIG: Partial<Column>[] = [
  {
    id: 'name',
    displayName: 'Name',
    type: 'string',
    controlType: 'string',
    visible: true,
    titleStyle: {
      'font-weight': '500',
      'font-size': '100%',
      color: '#000000',
      'overflow-wrap': 'anywhere'
    },
    hasSubtitle: true,
    subtitleColumn: 'description',
    subtitleStyle: {
      'font-size': '80%',
      color: 'darkgray',
      display: 'block',
      'white-space': 'wrap',
      'max-width': '350px',
      'overflow-wrap': 'anywhere'
    },
    hasPreTextImage: true
  },
  {
    id: 'formStatus',
    displayName: 'Status',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true,
    titleStyle: {
      textTransform: 'capitalize',
      fontWeight: 500,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      top: '10px',
      width: '80px',
      height: '24px',
      background: '#FEF3C7',
      color: '#92400E',
      borderRadius: '12px'
    },
    hasConditionalStyles: true
  },
  {
    id: 'plant',
    displayName: 'Plant',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'formType',
    displayName: 'Form Type',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'lastPublishedBy',
    displayName: 'Last Published By',
    type: 'number',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'publishedDate',
    displayName: 'Last Published',
    type: 'timeAgo',
    controlType: 'string',
    sortable: true,
    reverseSort: true,
    visible: true,
    groupable: true
  },
  {
    id: 'author',
    displayName: 'Created By',
    type: 'number',
    controlType: 'string',
    isMultiValued: true,
    sortable: true,
    visible: true,
    titleStyle: { color: '' }
  },
  {
    id: 'tags',
    displayName: 'Tags',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  }
];

export const RDF_TEMPLATE_DEFAULT_COLUMN_CONFIG: Partial<Column>[] = [
  {
    id: 'name',
    displayName: 'Name',
    type: 'string',
    controlType: 'string',
    visible: true,
    titleStyle: {
      'font-weight': '500',
      'font-size': '100%',
      color: '#000000',
      'overflow-wrap': 'anywhere'
    },
    hasSubtitle: true,
    subtitleColumn: 'description',
    subtitleStyle: {
      'font-size': '80%',
      color: 'darkgray',
      'overflow-wrap': 'anywhere'
    },
    hasPreTextImage: true
  },
  {
    id: 'questionsCount',
    displayName: 'Questions',
    type: 'number',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'formStatus',
    displayName: 'Status',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true,
    titleStyle: {
      textTransform: 'capitalize',
      fontWeight: 500,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      top: '10px',
      width: '80px',
      height: '24px',
      background: '#FEF3C7',
      color: '#92400E',
      borderRadius: '12px'
    },
    hasConditionalStyles: true
  },
  {
    id: 'formType',
    displayName: 'Template Type',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'displayFormsUsageCount',
    displayName: 'Used in Forms',
    type: 'number',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true,
    titleStyle: {
      color: '#3D5AFE'
    }
  },
  {
    id: 'lastPublishedBy',
    displayName: 'Modified By',
    type: 'number',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  },
  {
    id: 'author',
    displayName: 'Created By',
    type: 'number',
    controlType: 'string',
    isMultiValued: true,
    sortable: true,
    visible: true,
    titleStyle: { color: '' }
  },
  {
    id: 'tags',
    displayName: 'Tags',
    type: 'string',
    controlType: 'string',
    sortable: true,
    visible: true,
    groupable: true
  }
];

export const RDF_FORM_LIST_FILTERS = [
  {
    label: 'Status',
    items: ['Draft', 'Published'],
    column: 'formStatus',
    type: 'select',
    value: ''
  },
  {
    label: 'Last Published by',
    items: [],
    column: 'lastPublishedBy',
    type: 'multiple',
    value: ''
  },
  {
    label: 'Created By',
    items: [],
    column: 'author',
    type: 'multiple',
    value: ''
  },
  {
    label: 'Plant',
    items: [],
    column: 'plant',
    type: 'select',
    value: ''
  },
  {
    label: 'Form Type',
    items: [
      formConfigurationStatus.embedded,
      formConfigurationStatus.standalone
    ],
    column: 'formType',
    type: 'select',
    value: ''
  },
  {
    label: 'Tags',
    items: [],
    column: 'tags',
    type: 'multiple',
    value: ''
  }
];
