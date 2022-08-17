import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { TableColumn } from './report-details';
import { Permission } from './roles-permissions';

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
  profileImage?: any;
  preTextImage?: any;
  postTextImage?: any;
  contact?: string;
  isActive: boolean;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  roles: any[];
  displayRoles?: string;
}

export interface UserInfo extends UserDetails {
  slackDetail: any;
  collaborationType: string;
  permissions: Permission[];
  online?: boolean | false;
}

export interface UserTable {
  columns: Column[];
  data: UserDetails[];
}
