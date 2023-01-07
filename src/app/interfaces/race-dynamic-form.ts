import { GetFormListQuery } from '../API.service';
export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormListQuery;
}
