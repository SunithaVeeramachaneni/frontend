/* eslint-disable @typescript-eslint/no-empty-interface */
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { type } from 'os';

export interface UserGroup {
  name: string;
  description?: string;
  plantId: string;
}
export interface UserGroupDetails {
  name: string;
  description?: string;
  plantId: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  user?: string;
  searchTerm?: string;
  count: number;
  next: string | null;
}
export interface UserGroupDetailResponse {
  rows: UserGroupDetails[];
  count: number;
  next: string | null;
}
export type UserGroupList = {
  items: Array<UserGroup | null>;
  user: string | null;
  next?: string | null;
};

export interface UserGroupQueryParam {
  next?: string;
  limit: number;
  searchTerm: string;
  fetchType: string;
  plantId: string;
}
