import { ChartDetail } from './report-details';

export interface AppChartConfig extends ChartDetail {
  datasetFields: AppDatasetField[];
  countFields: CountField[];
  customColors?: any;
}

export interface AppChartData {
  [key: string]: any;
}

export interface CountField {
  name: string;
  displayName: string;
  visible: boolean;
}

export interface AppDatasetField {
  name: string;
  displayName: string;
  type: string;
  visible: boolean;
}

export interface ChartVariantChanges {
  type:
    | 'chartVarient'
    | 'datasetFieldName'
    | 'countFieldName'
    | 'stackFieldName'
    | 'chartTitle'
    | 'showValues'
    | 'showLegends'
    | 'customColors';
  value: string | boolean | any;
  isFormValid?: boolean;
}
