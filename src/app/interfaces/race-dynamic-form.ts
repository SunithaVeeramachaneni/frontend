import { GetFormListQuery } from '../API.service';
export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormListQuery;
}


export interface InspectionQueryParam {
  nextToken?: string;
  limit: number;
  searchTerm: string;
  fetchType: string;
}

export interface InspectionDetailResponse {
  rows: any[];
  count: number;
  nextToken: string | null;
}