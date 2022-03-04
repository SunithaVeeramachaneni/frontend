export interface Dashboard {
  id?: string;
  name: string;
  isDefault: boolean;
  createdBy: string;
  updatedBy?: string;
  createdOn?: string;
  updatedOn?: string;
}
