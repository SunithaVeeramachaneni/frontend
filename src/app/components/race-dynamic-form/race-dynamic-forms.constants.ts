import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';

export const RDF_DEFAULT_COLUMNS: columnConfiguration[] = [
  {
    columnId: 'name',
    columnName: 'Name',
    disabled: true,
    selected: true,
    draggable: false,
    default: true
  },
  {
    columnId: 'formStatus',
    columnName: 'Status',
    disabled: true,
    selected: true,
    draggable: false,
    default: true
  },
  {
    columnId: 'plant',
    columnName: 'Plant',
    disabled: false,
    selected: true,
    draggable: true,
    default: true
  },
  {
    columnId: 'formType',
    columnName: 'Form Type',
    disabled: false,
    selected: true,
    draggable: true,
    default: true
  },
  {
    columnId: 'lastPublishedBy',
    columnName: 'Last Published By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true
  },
  {
    columnId: 'publishedDate',
    columnName: 'Last Published',
    disabled: false,
    selected: true,
    draggable: true,
    default: true
  },
  {
    columnId: 'author',
    columnName: 'Created By',
    disabled: false,
    selected: true,
    draggable: true,
    default: true
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
  }
];
