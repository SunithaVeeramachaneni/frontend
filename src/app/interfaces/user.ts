import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { TableColumn } from './report-details';

export interface User {
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  contact: string;
  profileImage: string;
}

export interface UserDetails {
  id: number;
  user?: string;
  firstName?: string;
  lastName?: string;
  title: string;
  email: string;
  profileImage?: string;
  preTextImage?: any;
  postTextImage?: any;
  contact?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedOn?: Date;
  roles: any[];
  displayRoles?: string;
}

export interface UserTable {
  columns: Column[];
  data: UserDetails[];
}
