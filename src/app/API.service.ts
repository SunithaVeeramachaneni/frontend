import { Injectable } from "@angular/core";

export type CreateRoundPlanDetailMutation = {
  __typename: 'RoundPlanDetail';
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
  roundPlanSubmissionDetails?: {
    __typename: 'ModelRoundPlanSubmissionDetailsConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateAuthoredRoundPlanDetailMutation = {
  __typename: 'AuthoredRoundPlanDetail';
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
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type GetFormListQuery = {
  __typename: 'FormList';
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  publishedDate?: string | null;
  location?: string | null;
  roundType?: string | null;
  formStatus?: string | null;
  assignee?: string | null;
  tags?: Array<string | null> | null;
  lastPublishedBy?: string | null;
  author?: string | null;
  formType?: string | null;
  isArchived?: boolean | null;
  searchTerm?: string | null;
  isArchivedAt?: string | null;
  formListAuthoredFormDetail?: {
    __typename: 'ModelAuthoredFormDetailConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: 'ModelFormDetailConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isDeleted?: boolean | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAuthoredRoundPlanDetailMutation = {
  __typename: 'AuthoredRoundPlanDetail';
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
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateAuthoredFormDetailMutation = {
  __typename: 'AuthoredFormDetail';
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
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormDetailMutation = {
  __typename: 'FormDetail';
  id: string;
  formData?: string | null;
  formlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  formSubmissionDetail?: {
    __typename: 'ModelFormSubmissionDetailConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlanDetailMutation = {
  __typename: 'RoundPlanDetail';
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
  roundPlanSubmissionDetails?: {
    __typename: 'ModelRoundPlanSubmissionDetailsConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormDetailMutation = {
  __typename: 'FormDetail';
  id: string;
  formData?: string | null;
  formlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  formSubmissionDetail?: {
    __typename: 'ModelFormSubmissionDetailConnection';
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAuthoredFormDetailMutation = {
  __typename: 'AuthoredFormDetail';
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
  _deleted?: boolean | null;
  _lastChangedAt: number;
};
