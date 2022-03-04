import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';

export interface ColumnObject {
  [key: string]: Column;
}

export interface TableEvent {
  data: 'infiniteScroll';
}

export interface TableFilterPanelEvent {
  eventType: 'REFRESH_CONFIG';
  data: ConfigOptions;
}
