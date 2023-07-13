export type CreateRoundPlanDetail = {
  id: string;
  formData?: string | null;
  flatHierarchy?: string | null;
  formlistID: string;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  assignedTo?: string | null;
  roundPlanSubmissionDetails?: {} | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type UpdateAuthoredRoundPlanDetail = {
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID: string;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type CreateAuthoredRoundPlanDetail = {
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID: string;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export type UpdateRoundPlanDetail = {
  id: string;
  formData?: string | null;
  flatHierarchy?: string | null;
  formlistID: string;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  assignedTo?: string | null;
  roundPlanSubmissionDetails?: {} | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
};

export interface RoundPlanFile {
  name: string;
  size: number;
  objectKey: string;
}
