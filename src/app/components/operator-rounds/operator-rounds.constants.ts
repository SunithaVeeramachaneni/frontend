import { SHRColumnConfiguration } from 'src/app/interfaces/shr-column-configuration';

// To show SHR configuration
export const SHR_CONFIGURATION_DATA: SHRColumnConfiguration[] = [
  {
    columnId: 'summary',
    columnName: 'Summary',
    selected: true,
    content: [
      { columnId: 'trends', columnName: 'Trends', selected: true },
      { columnId: 'instructions', columnName: 'Instructions', selected: true },
      {
        columnId: 'shift-details',
        columnName: 'Shift Details',
        selected: true
      }
    ]
  },
  {
    columnId: 'rounds',
    columnName: 'Rounds',
    selected: true
  },
  {
    columnId: 'observations',
    columnName: 'Observations',
    selected: true,
    content: [
      { columnId: 'exception', columnName: 'Exception', selected: true },
      { columnId: 'issues', columnName: 'Issues', selected: true },
      { columnId: 'actions', columnName: 'Actions', selected: true }
    ]
  },
  { columnId: 'notes', columnName: 'Notes', selected: true },
  { columnId: 'operators', columnName: 'Operators', selected: true }
];
