import { GetFormList } from './master-data-management/forms';
export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormList;
}
