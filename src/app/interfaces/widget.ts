import { GridsterItem } from 'angular-gridster2';
import {
  ChartDetail,
  FilterApplied,
  ReportConfiguration,
  TableColumn
} from '.';

export interface Widget {
  id?: string;
  name: string;
  isTable: boolean;
  chartDetails: ChartDetail;
  tableColumns: TableColumn[];
  groupBy: string[];
  filtersApplied: FilterApplied[];
  config: GridsterItem;
  isFavorite: boolean;
  reportId: string;
  dashboardId: string;
  createdBy: string;
  updatedBy?: string;
  createdOn?: string;
  updatedOn?: string;
  report?: ReportConfiguration;
}

export interface WidgetsData {
  data: Widget[];
}
