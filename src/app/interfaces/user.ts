import { TableColumn } from './report-details';

export interface User {
  first_name: string;
  last_name: string;
}

export interface UserDetails {
  id: string;
  user?: string;
  firstName?: string;
  lastName?: string;
  title: string;
  email: string;
  profilePicture?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdOn: Date;
  updatedOn?: Date;
  roles: any[];
  displayRoles?: string;
}

export interface UserTable {
  columns: TableColumn[];
  data: UserDetails[];
}
