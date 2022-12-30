import { GetFormListQuery } from '../API.service';

export interface Tags {
  text: string;
}

export interface RaceDynamicForm {
  id: number;
  name: string;
  description: string;
  formLogo: string;
  isPublic: boolean;
  isArchived: boolean;
  tags: Tags;
  formStatus: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormListQuery;
}
