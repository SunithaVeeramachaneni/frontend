export interface ReportDetails {
  report: ReportConfiguration;
  reportData: any[];
}

export interface Report {
  data: ReportConfiguration[];
  columns: TableColumn[];
}

export interface GroupByCounts {
  [key: string]: any;
}

export interface ReportConfiguration {
  id?: string;
  name: string;
  groupBy: string[];
  filtersApplied: FilterApplied[];
  filterOptions?: FilterOptions;
  tableDetails: TableDetail[];
  createdBy: string;
  createdTime?: string;
  description: string;
  isFavorite: boolean;
  showChart: boolean;
  chartDetails: ChartDetail;
}

export interface ChartDetail {
  id?: string;
  title: string;
  type: string;
  indexAxis: 'x' | 'y';
  isStacked: boolean;
  showLegends: boolean;
  showValues: boolean;
  datasetFieldName: string;
  countFieldName: string;
  stackFieldName?: string;
  renderChart?: boolean;
}

export interface TableDetail {
  tableName: string;
  keyColumn: string;
  columns: TableColumn[];
}

export interface FilterOptions {
  daterange: string[];
  multi: any;
  single: any;
  number: string[];
  string: string[];
}

export interface TableColumn {
  displayName: string;
  type: string;
  filterType: any;
  name: string;
  order: number | null;
  sticky: boolean;
  visible: boolean;
}

export interface FilterApplied {
  column: string;
  filters: Filter[];
  type: string;
}

export interface Filter {
  operation: string;
  operand: string | number;
}
export interface RowLevelActionEvent {
  action: string;
  data: any;
  subMenu: any;
}

export interface CellClickActionEvent {
  row: any;
  columnId: string;
  element?: string;
  option?: string;
}

export interface Count {
  count: number;
}
