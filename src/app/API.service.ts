/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateFormSubmissionDetail: OnCreateFormSubmissionDetailSubscription;
  onUpdateFormSubmissionDetail: OnUpdateFormSubmissionDetailSubscription;
  onDeleteFormSubmissionDetail: OnDeleteFormSubmissionDetailSubscription;
  onCreateAuthoredFormDetail: OnCreateAuthoredFormDetailSubscription;
  onUpdateAuthoredFormDetail: OnUpdateAuthoredFormDetailSubscription;
  onDeleteAuthoredFormDetail: OnDeleteAuthoredFormDetailSubscription;
  onCreateFormSubmissionList: OnCreateFormSubmissionListSubscription;
  onUpdateFormSubmissionList: OnUpdateFormSubmissionListSubscription;
  onDeleteFormSubmissionList: OnDeleteFormSubmissionListSubscription;
  onCreateFormList: OnCreateFormListSubscription;
  onUpdateFormList: OnUpdateFormListSubscription;
  onDeleteFormList: OnDeleteFormListSubscription;
  onCreateFormDetail: OnCreateFormDetailSubscription;
  onUpdateFormDetail: OnUpdateFormDetailSubscription;
  onDeleteFormDetail: OnDeleteFormDetailSubscription;
};



export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};
       

export type CreateFormSubmissionDetailInput = {
  id?: string | null;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  _version?: number | null;
};
 

export type FormSubmissionDetail = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormSubmissionDetailInput = {
  id: string;
  formData?: string | null;
  formsubmissionlistID?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID?: string | null;
  status?: string | null;
  flatHierarchy?: string | null;
  _version?: number | null;
};

export type DeleteFormSubmissionDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateAuthoredFormDetailInput = {
  id?: string | null;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID: string;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  _version?: number | null;
};
 

export type AuthoredFormDetail = {
  __typename: "AuthoredFormDetail";
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

export type UpdateAuthoredFormDetailInput = {
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formDetailPublishStatus?: string | null;
  formlistID?: string | null;
  subForms?: string | null;
  hierarchy?: string | null;
  flatHierarchy?: string | null;
  _version?: number | null;
};

export type DeleteAuthoredFormDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormSubmissionListInput = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  _version?: number | null;
};
 

export type FormSubmissionList = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: ModelFormSubmissionDetailConnection | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelFormSubmissionDetailConnection = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<FormSubmissionDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type UpdateFormSubmissionListInput = {
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  _version?: number | null;
};

export type DeleteFormSubmissionListInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormListInput = {
  id?: string | null;
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
  isDeleted?: boolean | null;
  createdBy?: string | null;
  _version?: number | null;
};
 
export type FormList = {
  __typename: "FormList";
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
  formListAuthoredFormDetail?: ModelAuthoredFormDetailConnection | null;
  formListFormDetail?: ModelFormDetailConnection | null;
  isDeleted?: boolean | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelAuthoredFormDetailConnection = {
  __typename: "ModelAuthoredFormDetailConnection";
  items: Array<AuthoredFormDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelFormDetailConnection = {
  __typename: "ModelFormDetailConnection";
  items: Array<FormDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormDetail = {
  __typename: "FormDetail";
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
  formSubmissionDetail?: ModelFormSubmissionDetailConnection | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormListInput = {
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
  isDeleted?: boolean | null;
  createdBy?: string | null;
  _version?: number | null;
};

export type DeleteFormListInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormDetailInput = {
  id?: string | null;
  formData?: string | null;
  formlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  _version?: number | null;
};
 

export type UpdateFormDetailInput = {
  id: string;
  formData?: string | null;
  formlistID?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  flatHierarchy?: string | null;
  scheduledAt?: string | null;
  scheduledType?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  _version?: number | null;
};

export type DeleteFormDetailInput = {
  id: string;
  _version?: number | null;
};
 

export type ModelPlantsConnection = {
  __typename: "ModelPlantsConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
 
export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}
 
export type ModelActionsListConnection = {
  __typename: "ModelActionsListConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelIssuesListConnection = {
  __typename: "ModelIssuesListConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
  
export type ModelUnitListConnection = {
  __typename: "ModelUnitListConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
 

export type ModelAssetsConnection = {
  __typename: "ModelAssetsConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
 
export type ModelLocationConnection = {
  __typename: "ModelLocationConnection";
  items: Array<Location | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
  
export type ModelRoundPlanSubmissionListConnection = {
  __typename: "ModelRoundPlanSubmissionListConnection";
  items: Array<any | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
   
 
export type ModelFormSubmissionListConnection = {
  __typename: "ModelFormSubmissionListConnection";
  items: Array<FormSubmissionList | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
 
export type ModelFormListConnection = {
  __typename: "ModelFormListConnection";
  items: Array<FormList | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelSubscriptionPlantsFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  plantId?: ModelSubscriptionStringInput | null;
  country?: ModelSubscriptionStringInput | null;
  state?: ModelSubscriptionStringInput | null;
  image?: ModelSubscriptionStringInput | null;
  label?: ModelSubscriptionStringInput | null;
  field?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  zipCode?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionPlantsFilterInput | null> | null;
  or?: Array<ModelSubscriptionPlantsFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionActionsLogHistoryFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  message?: ModelSubscriptionStringInput | null;
  type?: ModelSubscriptionStringInput | null;
  username?: ModelSubscriptionStringInput | null;
  actionslistID?: ModelSubscriptionIDInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionActionsLogHistoryFilterInput | null> | null;
  or?: Array<ModelSubscriptionActionsLogHistoryFilterInput | null> | null;
};

export type ModelSubscriptionActionsListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  actionId?: ModelSubscriptionIntInput | null;
  actionData?: ModelSubscriptionStringInput | null;
  taskId?: ModelSubscriptionStringInput | null;
  taskDesciption?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  roundId?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionActionsListFilterInput | null> | null;
  or?: Array<ModelSubscriptionActionsListFilterInput | null> | null;
};

export type ModelSubscriptionIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  in?: Array<number | null> | null;
  notIn?: Array<number | null> | null;
};

export type ModelSubscriptionIssuesLogHistoryFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  message?: ModelSubscriptionStringInput | null;
  type?: ModelSubscriptionStringInput | null;
  username?: ModelSubscriptionStringInput | null;
  issueslistID?: ModelSubscriptionIDInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionIssuesLogHistoryFilterInput | null> | null;
  or?: Array<ModelSubscriptionIssuesLogHistoryFilterInput | null> | null;
};

export type ModelSubscriptionIssuesListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  issueId?: ModelSubscriptionIntInput | null;
  issueData?: ModelSubscriptionStringInput | null;
  taskId?: ModelSubscriptionStringInput | null;
  taskDesciption?: ModelSubscriptionStringInput | null;
  notificationNumber?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  roundId?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionIssuesListFilterInput | null> | null;
  or?: Array<ModelSubscriptionIssuesListFilterInput | null> | null;
};

export type ModelSubscriptionUnitMeasumentFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  description?: ModelSubscriptionStringInput | null;
  symbol?: ModelSubscriptionStringInput | null;
  isDefault?: ModelSubscriptionBooleanInput | null;
  isDeleted?: ModelSubscriptionBooleanInput | null;
  unitlistID?: ModelSubscriptionIDInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  isActive?: ModelSubscriptionBooleanInput | null;
  and?: Array<ModelSubscriptionUnitMeasumentFilterInput | null> | null;
  or?: Array<ModelSubscriptionUnitMeasumentFilterInput | null> | null;
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
};

export type ModelSubscriptionUnitListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  isDeleted?: ModelSubscriptionBooleanInput | null;
  and?: Array<ModelSubscriptionUnitListFilterInput | null> | null;
  or?: Array<ModelSubscriptionUnitListFilterInput | null> | null;
};

export type ModelSubscriptionAssetsFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  model?: ModelSubscriptionStringInput | null;
  parentType?: ModelSubscriptionStringInput | null;
  parentId?: ModelSubscriptionStringInput | null;
  assetsId?: ModelSubscriptionStringInput | null;
  image?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionAssetsFilterInput | null> | null;
  or?: Array<ModelSubscriptionAssetsFilterInput | null> | null;
};

export type ModelSubscriptionLocationFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  model?: ModelSubscriptionStringInput | null;
  locationId?: ModelSubscriptionStringInput | null;
  parentId?: ModelSubscriptionStringInput | null;
  image?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionLocationFilterInput | null> | null;
  or?: Array<ModelSubscriptionLocationFilterInput | null> | null;
};

export type ModelSubscriptionRoundPlanSubmissionDetailsFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formsubmissionlistID?: ModelSubscriptionIDInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  formdetailID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionRoundPlanSubmissionDetailsFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlanSubmissionDetailsFilterInput | null> | null;
};

export type ModelSubscriptionRoundPlanSubmissionListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  formLogo?: ModelSubscriptionStringInput | null;
  isPublic?: ModelSubscriptionBooleanInput | null;
  location?: ModelSubscriptionStringInput | null;
  roundType?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  assignee?: ModelSubscriptionStringInput | null;
  dueDate?: ModelSubscriptionStringInput | null;
  version?: ModelSubscriptionStringInput | null;
  submittedBy?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionRoundPlanSubmissionListFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlanSubmissionListFilterInput | null> | null;
};

export type ModelSubscriptionAuthoredRoundPlanDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  version?: ModelSubscriptionStringInput | null;
  pages?: ModelSubscriptionStringInput | null;
  counter?: ModelSubscriptionIntInput | null;
  formDetailPublishStatus?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  subForms?: ModelSubscriptionStringInput | null;
  hierarchy?: ModelSubscriptionStringInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionAuthoredRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionAuthoredRoundPlanDetailFilterInput | null> | null;
};

export type ModelSubscriptionRoundPlanDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  scheduledAt?: ModelSubscriptionStringInput | null;
  scheduledType?: ModelSubscriptionStringInput | null;
  dueDate?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  assignedTo?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlanDetailFilterInput | null> | null;
};

export type ModelSubscriptionRoundPlanListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  formLogo?: ModelSubscriptionStringInput | null;
  isPublic?: ModelSubscriptionBooleanInput | null;
  publishedDate?: ModelSubscriptionStringInput | null;
  location?: ModelSubscriptionStringInput | null;
  roundType?: ModelSubscriptionStringInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  assignee?: ModelSubscriptionStringInput | null;
  tags?: ModelSubscriptionStringInput | null;
  lastPublishedBy?: ModelSubscriptionStringInput | null;
  author?: ModelSubscriptionStringInput | null;
  isArchived?: ModelSubscriptionBooleanInput | null;
  formType?: ModelSubscriptionStringInput | null;
  isArchivedAt?: ModelSubscriptionStringInput | null;
  isDeleted?: ModelSubscriptionBooleanInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionRoundPlanListFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlanListFilterInput | null> | null;
};

export type ModelSubscriptionResponseSetFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  type?: ModelSubscriptionStringInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  isMultiColumn?: ModelSubscriptionBooleanInput | null;
  values?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionResponseSetFilterInput | null> | null;
  or?: Array<ModelSubscriptionResponseSetFilterInput | null> | null;
};

export type ModelSubscriptionFormSubmissionDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formsubmissionlistID?: ModelSubscriptionIDInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  formdetailID?: ModelSubscriptionIDInput | null;
  status?: ModelSubscriptionStringInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormSubmissionDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormSubmissionDetailFilterInput | null> | null;
};

export type ModelSubscriptionAuthoredFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  version?: ModelSubscriptionStringInput | null;
  pages?: ModelSubscriptionStringInput | null;
  counter?: ModelSubscriptionIntInput | null;
  formDetailPublishStatus?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  subForms?: ModelSubscriptionStringInput | null;
  hierarchy?: ModelSubscriptionStringInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
};

export type ModelSubscriptionFormSubmissionListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  formLogo?: ModelSubscriptionStringInput | null;
  isPublic?: ModelSubscriptionBooleanInput | null;
  location?: ModelSubscriptionStringInput | null;
  roundType?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  assignee?: ModelSubscriptionStringInput | null;
  dueDate?: ModelSubscriptionStringInput | null;
  version?: ModelSubscriptionStringInput | null;
  submittedBy?: ModelSubscriptionStringInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormSubmissionListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormSubmissionListFilterInput | null> | null;
};

export type ModelSubscriptionFormListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  formLogo?: ModelSubscriptionStringInput | null;
  isPublic?: ModelSubscriptionBooleanInput | null;
  publishedDate?: ModelSubscriptionStringInput | null;
  location?: ModelSubscriptionStringInput | null;
  roundType?: ModelSubscriptionStringInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  assignee?: ModelSubscriptionStringInput | null;
  tags?: ModelSubscriptionStringInput | null;
  lastPublishedBy?: ModelSubscriptionStringInput | null;
  author?: ModelSubscriptionStringInput | null;
  formType?: ModelSubscriptionStringInput | null;
  isArchived?: ModelSubscriptionBooleanInput | null;
  searchTerm?: ModelSubscriptionStringInput | null;
  isArchivedAt?: ModelSubscriptionStringInput | null;
  isDeleted?: ModelSubscriptionBooleanInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormListFilterInput | null> | null;
};

export type ModelSubscriptionFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  assignedBy?: ModelSubscriptionStringInput | null;
  flatHierarchy?: ModelSubscriptionStringInput | null;
  scheduledAt?: ModelSubscriptionStringInput | null;
  scheduledType?: ModelSubscriptionStringInput | null;
  dueDate?: ModelSubscriptionStringInput | null;
  assignedTo?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
};

export type CreatePlantsMutation = {
  __typename: "Plants";
  id: string;
  name?: string | null;
  description?: string | null;
  plantId?: string | null;
  country?: string | null;
  state?: string | null;
  image?: string | null;
  label?: string | null;
  field?: string | null;
  searchTerm?: string | null;
  zipCode?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdatePlantsMutation = {
  __typename: "Plants";
  id: string;
  name?: string | null;
  description?: string | null;
  plantId?: string | null;
  country?: string | null;
  state?: string | null;
  image?: string | null;
  label?: string | null;
  field?: string | null;
  searchTerm?: string | null;
  zipCode?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeletePlantsMutation = {
  __typename: "Plants";
  id: string;
  name?: string | null;
  description?: string | null;
  plantId?: string | null;
  country?: string | null;
  state?: string | null;
  image?: string | null;
  label?: string | null;
  field?: string | null;
  searchTerm?: string | null;
  zipCode?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateActionsLogHistoryMutation = {
  __typename: "ActionsLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  actionslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateActionsLogHistoryMutation = {
  __typename: "ActionsLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  actionslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteActionsLogHistoryMutation = {
  __typename: "ActionsLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  actionslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateActionsListMutation = {
  __typename: "ActionsList";
  id: string;
  actionsLogHistories?: {
    __typename: "ModelActionsLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  actionId?: number | null;
  actionData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateActionsListMutation = {
  __typename: "ActionsList";
  id: string;
  actionsLogHistories?: {
    __typename: "ModelActionsLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  actionId?: number | null;
  actionData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteActionsListMutation = {
  __typename: "ActionsList";
  id: string;
  actionsLogHistories?: {
    __typename: "ModelActionsLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  actionId?: number | null;
  actionData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateIssuesLogHistoryMutation = {
  __typename: "IssuesLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  issueslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateIssuesLogHistoryMutation = {
  __typename: "IssuesLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  issueslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteIssuesLogHistoryMutation = {
  __typename: "IssuesLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  issueslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateIssuesListMutation = {
  __typename: "IssuesList";
  id: string;
  issuesLogHistories?: {
    __typename: "ModelIssuesLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  issueId?: number | null;
  issueData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  notificationNumber?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateIssuesListMutation = {
  __typename: "IssuesList";
  id: string;
  issuesLogHistories?: {
    __typename: "ModelIssuesLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  issueId?: number | null;
  issueData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  notificationNumber?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteIssuesListMutation = {
  __typename: "IssuesList";
  id: string;
  issuesLogHistories?: {
    __typename: "ModelIssuesLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  issueId?: number | null;
  issueData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  notificationNumber?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateUnitMeasumentMutation = {
  __typename: "UnitMeasument";
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateUnitMeasumentMutation = {
  __typename: "UnitMeasument";
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteUnitMeasumentMutation = {
  __typename: "UnitMeasument";
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateUnitListMutation = {
  __typename: "UnitList";
  id: string;
  name?: string | null;
  isDeleted?: boolean | null;
  unitMeasuments?: {
    __typename: "ModelUnitMeasumentConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateUnitListMutation = {
  __typename: "UnitList";
  id: string;
  name?: string | null;
  isDeleted?: boolean | null;
  unitMeasuments?: {
    __typename: "ModelUnitMeasumentConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteUnitListMutation = {
  __typename: "UnitList";
  id: string;
  name?: string | null;
  isDeleted?: boolean | null;
  unitMeasuments?: {
    __typename: "ModelUnitMeasumentConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAssetsMutation = {
  __typename: "Assets";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  parentType?: string | null;
  parentId?: string | null;
  assetsId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateAssetsMutation = {
  __typename: "Assets";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  parentType?: string | null;
  parentId?: string | null;
  assetsId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteAssetsMutation = {
  __typename: "Assets";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  parentType?: string | null;
  parentId?: string | null;
  assetsId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateLocationMutation = {
  __typename: "Location";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  locationId?: string | null;
  parentId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateLocationMutation = {
  __typename: "Location";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  locationId?: string | null;
  parentId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteLocationMutation = {
  __typename: "Location";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  locationId?: string | null;
  parentId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateRoundPlanSubmissionDetailsMutation = {
  __typename: "RoundPlanSubmissionDetails";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  flatHierarchy?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  status?: string | null;
  formdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlanSubmissionDetailsMutation = {
  __typename: "RoundPlanSubmissionDetails";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  flatHierarchy?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  status?: string | null;
  formdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteRoundPlanSubmissionDetailsMutation = {
  __typename: "RoundPlanSubmissionDetails";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  flatHierarchy?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  status?: string | null;
  formdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateRoundPlanSubmissionListMutation = {
  __typename: "RoundPlanSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  roundPlanSubmissionDetails?: {
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlanSubmissionListMutation = {
  __typename: "RoundPlanSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  roundPlanSubmissionDetails?: {
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteRoundPlanSubmissionListMutation = {
  __typename: "RoundPlanSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  roundPlanSubmissionDetails?: {
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAuthoredRoundPlanDetailMutation = {
  __typename: "AuthoredRoundPlanDetail";
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

export type UpdateAuthoredRoundPlanDetailMutation = {
  __typename: "AuthoredRoundPlanDetail";
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

export type DeleteAuthoredRoundPlanDetailMutation = {
  __typename: "AuthoredRoundPlanDetail";
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

export type CreateRoundPlanDetailMutation = {
  __typename: "RoundPlanDetail";
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
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
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
  __typename: "RoundPlanDetail";
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
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteRoundPlanDetailMutation = {
  __typename: "RoundPlanDetail";
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
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateRoundPlanListMutation = {
  __typename: "RoundPlanList";
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
  isArchived?: boolean | null;
  formType?: string | null;
  isArchivedAt?: string | null;
  authoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isDeleted?: boolean | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlanListMutation = {
  __typename: "RoundPlanList";
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
  isArchived?: boolean | null;
  formType?: string | null;
  isArchivedAt?: string | null;
  authoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isDeleted?: boolean | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteRoundPlanListMutation = {
  __typename: "RoundPlanList";
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
  isArchived?: boolean | null;
  formType?: string | null;
  isArchivedAt?: string | null;
  authoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isDeleted?: boolean | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateResponseSetMutation = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateResponseSetMutation = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteResponseSetMutation = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormSubmissionDetailMutation = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormSubmissionDetailMutation = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormSubmissionDetailMutation = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAuthoredFormDetailMutation = {
  __typename: "AuthoredFormDetail";
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
  __typename: "AuthoredFormDetail";
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

export type DeleteAuthoredFormDetailMutation = {
  __typename: "AuthoredFormDetail";
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

export type CreateFormSubmissionListMutation = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormSubmissionListMutation = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormSubmissionListMutation = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormListMutation = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type UpdateFormListMutation = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type DeleteFormListMutation = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type CreateFormDetailMutation = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormDetailMutation = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormDetailMutation = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type GetPlantsQuery = {
  __typename: "Plants";
  id: string;
  name?: string | null;
  description?: string | null;
  plantId?: string | null;
  country?: string | null;
  state?: string | null;
  image?: string | null;
  label?: string | null;
  field?: string | null;
  searchTerm?: string | null;
  zipCode?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListPlantsQuery = {
  __typename: "ModelPlantsConnection";
  items: Array<{
    __typename: "Plants";
    id: string;
    name?: string | null;
    description?: string | null;
    plantId?: string | null;
    country?: string | null;
    state?: string | null;
    image?: string | null;
    label?: string | null;
    field?: string | null;
    searchTerm?: string | null;
    zipCode?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncPlantsQuery = {
  __typename: "ModelPlantsConnection";
  items: Array<{
    __typename: "Plants";
    id: string;
    name?: string | null;
    description?: string | null;
    plantId?: string | null;
    country?: string | null;
    state?: string | null;
    image?: string | null;
    label?: string | null;
    field?: string | null;
    searchTerm?: string | null;
    zipCode?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetActionsLogHistoryQuery = {
  __typename: "ActionsLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  actionslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListActionsLogHistoriesQuery = {
  __typename: "ModelActionsLogHistoryConnection";
  items: Array<{
    __typename: "ActionsLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    actionslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncActionsLogHistoriesQuery = {
  __typename: "ModelActionsLogHistoryConnection";
  items: Array<{
    __typename: "ActionsLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    actionslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ActionsLogHistoriesByActionslistIDQuery = {
  __typename: "ModelActionsLogHistoryConnection";
  items: Array<{
    __typename: "ActionsLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    actionslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetActionsListQuery = {
  __typename: "ActionsList";
  id: string;
  actionsLogHistories?: {
    __typename: "ModelActionsLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  actionId?: number | null;
  actionData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListActionsListsQuery = {
  __typename: "ModelActionsListConnection";
  items: Array<{
    __typename: "ActionsList";
    id: string;
    actionId?: number | null;
    actionData?: string | null;
    taskId?: string | null;
    taskDesciption?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    roundId?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncActionsListsQuery = {
  __typename: "ModelActionsListConnection";
  items: Array<{
    __typename: "ActionsList";
    id: string;
    actionId?: number | null;
    actionData?: string | null;
    taskId?: string | null;
    taskDesciption?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    roundId?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetIssuesLogHistoryQuery = {
  __typename: "IssuesLogHistory";
  id: string;
  message?: string | null;
  type?: string | null;
  username?: string | null;
  issueslistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListIssuesLogHistoriesQuery = {
  __typename: "ModelIssuesLogHistoryConnection";
  items: Array<{
    __typename: "IssuesLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    issueslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncIssuesLogHistoriesQuery = {
  __typename: "ModelIssuesLogHistoryConnection";
  items: Array<{
    __typename: "IssuesLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    issueslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type IssuesLogHistoriesByIssueslistIDQuery = {
  __typename: "ModelIssuesLogHistoryConnection";
  items: Array<{
    __typename: "IssuesLogHistory";
    id: string;
    message?: string | null;
    type?: string | null;
    username?: string | null;
    issueslistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetIssuesListQuery = {
  __typename: "IssuesList";
  id: string;
  issuesLogHistories?: {
    __typename: "ModelIssuesLogHistoryConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  issueId?: number | null;
  issueData?: string | null;
  taskId?: string | null;
  taskDesciption?: string | null;
  notificationNumber?: string | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  roundId?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListIssuesListsQuery = {
  __typename: "ModelIssuesListConnection";
  items: Array<{
    __typename: "IssuesList";
    id: string;
    issueId?: number | null;
    issueData?: string | null;
    taskId?: string | null;
    taskDesciption?: string | null;
    notificationNumber?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    roundId?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncIssuesListsQuery = {
  __typename: "ModelIssuesListConnection";
  items: Array<{
    __typename: "IssuesList";
    id: string;
    issueId?: number | null;
    issueData?: string | null;
    taskId?: string | null;
    taskDesciption?: string | null;
    notificationNumber?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    roundId?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetUnitMeasumentQuery = {
  __typename: "UnitMeasument";
  id: string;
  description?: string | null;
  symbol?: string | null;
  isDefault?: boolean | null;
  isDeleted?: boolean | null;
  unitlistID: string;
  searchTerm?: string | null;
  unitList?: {
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListUnitMeasumentsQuery = {
  __typename: "ModelUnitMeasumentConnection";
  items: Array<{
    __typename: "UnitMeasument";
    id: string;
    description?: string | null;
    symbol?: string | null;
    isDefault?: boolean | null;
    isDeleted?: boolean | null;
    unitlistID: string;
    searchTerm?: string | null;
    isActive?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncUnitMeasumentsQuery = {
  __typename: "ModelUnitMeasumentConnection";
  items: Array<{
    __typename: "UnitMeasument";
    id: string;
    description?: string | null;
    symbol?: string | null;
    isDefault?: boolean | null;
    isDeleted?: boolean | null;
    unitlistID: string;
    searchTerm?: string | null;
    isActive?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type UnitMeasumentsByUnitlistIDQuery = {
  __typename: "ModelUnitMeasumentConnection";
  items: Array<{
    __typename: "UnitMeasument";
    id: string;
    description?: string | null;
    symbol?: string | null;
    isDefault?: boolean | null;
    isDeleted?: boolean | null;
    unitlistID: string;
    searchTerm?: string | null;
    isActive?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetUnitListQuery = {
  __typename: "UnitList";
  id: string;
  name?: string | null;
  isDeleted?: boolean | null;
  unitMeasuments?: {
    __typename: "ModelUnitMeasumentConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListUnitListsQuery = {
  __typename: "ModelUnitListConnection";
  items: Array<{
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncUnitListsQuery = {
  __typename: "ModelUnitListConnection";
  items: Array<{
    __typename: "UnitList";
    id: string;
    name?: string | null;
    isDeleted?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetAssetsQuery = {
  __typename: "Assets";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  parentType?: string | null;
  parentId?: string | null;
  assetsId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListAssetsQuery = {
  __typename: "ModelAssetsConnection";
  items: Array<{
    __typename: "Assets";
    id: string;
    name?: string | null;
    description?: string | null;
    model?: string | null;
    parentType?: string | null;
    parentId?: string | null;
    assetsId?: string | null;
    image?: string | null;
    searchTerm?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncAssetsQuery = {
  __typename: "ModelAssetsConnection";
  items: Array<{
    __typename: "Assets";
    id: string;
    name?: string | null;
    description?: string | null;
    model?: string | null;
    parentType?: string | null;
    parentId?: string | null;
    assetsId?: string | null;
    image?: string | null;
    searchTerm?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetLocationQuery = {
  __typename: "Location";
  id: string;
  name?: string | null;
  description?: string | null;
  model?: string | null;
  locationId?: string | null;
  parentId?: string | null;
  image?: string | null;
  searchTerm?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListLocationsQuery = {
  __typename: "ModelLocationConnection";
  items: Array<{
    __typename: "Location";
    id: string;
    name?: string | null;
    description?: string | null;
    model?: string | null;
    locationId?: string | null;
    parentId?: string | null;
    image?: string | null;
    searchTerm?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncLocationsQuery = {
  __typename: "ModelLocationConnection";
  items: Array<{
    __typename: "Location";
    id: string;
    name?: string | null;
    description?: string | null;
    model?: string | null;
    locationId?: string | null;
    parentId?: string | null;
    image?: string | null;
    searchTerm?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRoundPlanSubmissionDetailsQuery = {
  __typename: "RoundPlanSubmissionDetails";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  flatHierarchy?: string | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  status?: string | null;
  formdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListRoundPlanSubmissionDetailsQuery = {
  __typename: "ModelRoundPlanSubmissionDetailsConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionDetails";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    flatHierarchy?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    status?: string | null;
    formdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncRoundPlanSubmissionDetailsQuery = {
  __typename: "ModelRoundPlanSubmissionDetailsConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionDetails";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    flatHierarchy?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    status?: string | null;
    formdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type RoundPlanSubmissionDetailsByFormsubmissionlistIDQuery = {
  __typename: "ModelRoundPlanSubmissionDetailsConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionDetails";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    flatHierarchy?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    status?: string | null;
    formdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type RoundPlanSubmissionDetailsByFormdetailIDQuery = {
  __typename: "ModelRoundPlanSubmissionDetailsConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionDetails";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    flatHierarchy?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    status?: string | null;
    formdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRoundPlanSubmissionListQuery = {
  __typename: "RoundPlanSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  roundPlanSubmissionDetails?: {
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListRoundPlanSubmissionListsQuery = {
  __typename: "ModelRoundPlanSubmissionListConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionList";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    location?: string | null;
    roundType?: string | null;
    status?: string | null;
    assignee?: string | null;
    dueDate?: string | null;
    version?: string | null;
    submittedBy?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncRoundPlanSubmissionListsQuery = {
  __typename: "ModelRoundPlanSubmissionListConnection";
  items: Array<{
    __typename: "RoundPlanSubmissionList";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    location?: string | null;
    roundType?: string | null;
    status?: string | null;
    assignee?: string | null;
    dueDate?: string | null;
    version?: string | null;
    submittedBy?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetAuthoredRoundPlanDetailQuery = {
  __typename: "AuthoredRoundPlanDetail";
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

export type ListAuthoredRoundPlanDetailsQuery = {
  __typename: "ModelAuthoredRoundPlanDetailConnection";
  items: Array<{
    __typename: "AuthoredRoundPlanDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncAuthoredRoundPlanDetailsQuery = {
  __typename: "ModelAuthoredRoundPlanDetailConnection";
  items: Array<{
    __typename: "AuthoredRoundPlanDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type AuthoredRoundPlanDetailsByFormlistIDQuery = {
  __typename: "ModelAuthoredRoundPlanDetailConnection";
  items: Array<{
    __typename: "AuthoredRoundPlanDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRoundPlanDetailQuery = {
  __typename: "RoundPlanDetail";
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
    __typename: "ModelRoundPlanSubmissionDetailsConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListRoundPlanDetailsQuery = {
  __typename: "ModelRoundPlanDetailConnection";
  items: Array<{
    __typename: "RoundPlanDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncRoundPlanDetailsQuery = {
  __typename: "ModelRoundPlanDetailConnection";
  items: Array<{
    __typename: "RoundPlanDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type RoundPlanDetailsByFormlistIDQuery = {
  __typename: "ModelRoundPlanDetailConnection";
  items: Array<{
    __typename: "RoundPlanDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRoundPlanListQuery = {
  __typename: "RoundPlanList";
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
  isArchived?: boolean | null;
  formType?: string | null;
  isArchivedAt?: string | null;
  authoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isDeleted?: boolean | null;
  searchTerm?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListRoundPlanListsQuery = {
  __typename: "ModelRoundPlanListConnection";
  items: Array<{
    __typename: "RoundPlanList";
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
    isArchived?: boolean | null;
    formType?: string | null;
    isArchivedAt?: string | null;
    isDeleted?: boolean | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncRoundPlanListsQuery = {
  __typename: "ModelRoundPlanListConnection";
  items: Array<{
    __typename: "RoundPlanList";
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
    isArchived?: boolean | null;
    formType?: string | null;
    isArchivedAt?: string | null;
    isDeleted?: boolean | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetResponseSetQuery = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListResponseSetsQuery = {
  __typename: "ModelResponseSetConnection";
  items: Array<{
    __typename: "ResponseSet";
    id: string;
    type?: string | null;
    name?: string | null;
    description?: string | null;
    isMultiColumn?: boolean | null;
    values?: string | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncResponseSetsQuery = {
  __typename: "ModelResponseSetConnection";
  items: Array<{
    __typename: "ResponseSet";
    id: string;
    type?: string | null;
    name?: string | null;
    description?: string | null;
    isMultiColumn?: boolean | null;
    values?: string | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormSubmissionDetailQuery = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormSubmissionDetailsQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    formdetailID: string;
    status?: string | null;
    flatHierarchy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormSubmissionDetailsQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    formdetailID: string;
    status?: string | null;
    flatHierarchy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormSubmissionDetailsByFormsubmissionlistIDQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    formdetailID: string;
    status?: string | null;
    flatHierarchy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormSubmissionDetailsByFormdetailIDQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
    createdBy?: string | null;
    assignedBy?: string | null;
    formdetailID: string;
    status?: string | null;
    flatHierarchy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetAuthoredFormDetailQuery = {
  __typename: "AuthoredFormDetail";
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

export type ListAuthoredFormDetailsQuery = {
  __typename: "ModelAuthoredFormDetailConnection";
  items: Array<{
    __typename: "AuthoredFormDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncAuthoredFormDetailsQuery = {
  __typename: "ModelAuthoredFormDetailConnection";
  items: Array<{
    __typename: "AuthoredFormDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type AuthoredFormDetailsByFormlistIDQuery = {
  __typename: "ModelAuthoredFormDetailConnection";
  items: Array<{
    __typename: "AuthoredFormDetail";
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
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormSubmissionListQuery = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormSubmissionListsQuery = {
  __typename: "ModelFormSubmissionListConnection";
  items: Array<{
    __typename: "FormSubmissionList";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    location?: string | null;
    roundType?: string | null;
    status?: string | null;
    assignee?: string | null;
    dueDate?: string | null;
    version?: string | null;
    submittedBy?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormSubmissionListsQuery = {
  __typename: "ModelFormSubmissionListConnection";
  items: Array<{
    __typename: "FormSubmissionList";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    location?: string | null;
    roundType?: string | null;
    status?: string | null;
    assignee?: string | null;
    dueDate?: string | null;
    version?: string | null;
    submittedBy?: string | null;
    searchTerm?: string | null;
    createdBy?: string | null;
    assignedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormListQuery = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type ListFormListsQuery = {
  __typename: "ModelFormListConnection";
  items: Array<{
    __typename: "FormList";
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
    isDeleted?: boolean | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormListsQuery = {
  __typename: "ModelFormListConnection";
  items: Array<{
    __typename: "FormList";
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
    isDeleted?: boolean | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormDetailQuery = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormDetailsQuery = {
  __typename: "ModelFormDetailConnection";
  items: Array<{
    __typename: "FormDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormDetailsQuery = {
  __typename: "ModelFormDetailConnection";
  items: Array<{
    __typename: "FormDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormDetailsByFormlistIDQuery = {
  __typename: "ModelFormDetailConnection";
  items: Array<{
    __typename: "FormDetail";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
 
export type OnCreateFormSubmissionDetailSubscription = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormSubmissionDetailSubscription = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormSubmissionDetailSubscription = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  createdBy?: string | null;
  assignedBy?: string | null;
  formdetailID: string;
  status?: string | null;
  flatHierarchy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateAuthoredFormDetailSubscription = {
  __typename: "AuthoredFormDetail";
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

export type OnUpdateAuthoredFormDetailSubscription = {
  __typename: "AuthoredFormDetail";
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

export type OnDeleteAuthoredFormDetailSubscription = {
  __typename: "AuthoredFormDetail";
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

export type OnCreateFormSubmissionListSubscription = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormSubmissionListSubscription = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormSubmissionListSubscription = {
  __typename: "FormSubmissionList";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  location?: string | null;
  roundType?: string | null;
  status?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  version?: string | null;
  submittedBy?: string | null;
  searchTerm?: string | null;
  formSubmissionListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdBy?: string | null;
  assignedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateFormListSubscription = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type OnUpdateFormListSubscription = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type OnDeleteFormListSubscription = {
  __typename: "FormList";
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
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  formListFormDetail?: {
    __typename: "ModelFormDetailConnection";
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

export type OnCreateFormDetailSubscription = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormDetailSubscription = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormDetailSubscription = {
  __typename: "FormDetail";
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
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateFormSubmissionDetail(
    input: CreateFormSubmissionDetailInput,
    condition?: any
  ): Promise<CreateFormSubmissionDetailMutation> {
    const statement = `mutation CreateFormSubmissionDetail($input: CreateFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        createFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateFormSubmissionDetailMutation>(
      response.data.createFormSubmissionDetail
    );
  }
  async UpdateFormSubmissionDetail(
    input: UpdateFormSubmissionDetailInput,
    condition?: any
  ): Promise<UpdateFormSubmissionDetailMutation> {
    const statement = `mutation UpdateFormSubmissionDetail($input: UpdateFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        updateFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateFormSubmissionDetailMutation>(
      response.data.updateFormSubmissionDetail
    );
  }
  async DeleteFormSubmissionDetail(
    input: DeleteFormSubmissionDetailInput,
    condition?: any
  ): Promise<DeleteFormSubmissionDetailMutation> {
    const statement = `mutation DeleteFormSubmissionDetail($input: DeleteFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        deleteFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteFormSubmissionDetailMutation>(
      response.data.deleteFormSubmissionDetail
    );
  }
  async CreateAuthoredFormDetail(
    input: CreateAuthoredFormDetailInput,
    condition?: any
  ): Promise<CreateAuthoredFormDetailMutation> {
    const statement = `mutation CreateAuthoredFormDetail($input: CreateAuthoredFormDetailInput!, $condition: ModelAuthoredFormDetailConditionInput) {
        createAuthoredFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateAuthoredFormDetailMutation>(
      response.data.createAuthoredFormDetail
    );
  }
  async UpdateAuthoredFormDetail(
    input: UpdateAuthoredFormDetailInput,
    condition?: any
  ): Promise<UpdateAuthoredFormDetailMutation> {
    const statement = `mutation UpdateAuthoredFormDetail($input: UpdateAuthoredFormDetailInput!, $condition: ModelAuthoredFormDetailConditionInput) {
        updateAuthoredFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateAuthoredFormDetailMutation>(
      response.data.updateAuthoredFormDetail
    );
  }
  async DeleteAuthoredFormDetail(
    input: DeleteAuthoredFormDetailInput,
    condition?: any
  ): Promise<DeleteAuthoredFormDetailMutation> {
    const statement = `mutation DeleteAuthoredFormDetail($input: DeleteAuthoredFormDetailInput!, $condition: ModelAuthoredFormDetailConditionInput) {
        deleteAuthoredFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteAuthoredFormDetailMutation>(
      response.data.deleteAuthoredFormDetail
    );
  }
  async CreateFormSubmissionList(
    input: CreateFormSubmissionListInput,
    condition?: any
  ): Promise<CreateFormSubmissionListMutation> {
    const statement = `mutation CreateFormSubmissionList($input: CreateFormSubmissionListInput!, $condition: ModelFormSubmissionListConditionInput) {
        createFormSubmissionList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateFormSubmissionListMutation>(
      response.data.createFormSubmissionList
    );
  }
  async UpdateFormSubmissionList(
    input: UpdateFormSubmissionListInput,
    condition?: any
  ): Promise<UpdateFormSubmissionListMutation> {
    const statement = `mutation UpdateFormSubmissionList($input: UpdateFormSubmissionListInput!, $condition: ModelFormSubmissionListConditionInput) {
        updateFormSubmissionList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateFormSubmissionListMutation>(
      response.data.updateFormSubmissionList
    );
  }
  async DeleteFormSubmissionList(
    input: DeleteFormSubmissionListInput,
    condition?: any
  ): Promise<DeleteFormSubmissionListMutation> {
    const statement = `mutation DeleteFormSubmissionList($input: DeleteFormSubmissionListInput!, $condition: ModelFormSubmissionListConditionInput) {
        deleteFormSubmissionList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteFormSubmissionListMutation>(
      response.data.deleteFormSubmissionList
    );
  }
  async CreateFormList(
    input: CreateFormListInput,
    condition?: any
  ): Promise<CreateFormListMutation> {
    const statement = `mutation CreateFormList($input: CreateFormListInput!, $condition: ModelFormListConditionInput) {
        createFormList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateFormListMutation>response.data.createFormList;
  }
  async UpdateFormList(
    input: UpdateFormListInput,
    condition?: any
  ): Promise<UpdateFormListMutation> {
    const statement = `mutation UpdateFormList($input: UpdateFormListInput!, $condition: ModelFormListConditionInput) {
        updateFormList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateFormListMutation>response.data.updateFormList;
  }
  async DeleteFormList(
    input: DeleteFormListInput,
    condition?: any
  ): Promise<DeleteFormListMutation> {
    const statement = `mutation DeleteFormList($input: DeleteFormListInput!, $condition: ModelFormListConditionInput) {
        deleteFormList(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteFormListMutation>response.data.deleteFormList;
  }
  async CreateFormDetail(
    input: CreateFormDetailInput,
    condition?: any
  ): Promise<CreateFormDetailMutation> {
    const statement = `mutation CreateFormDetail($input: CreateFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        createFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateFormDetailMutation>response.data.createFormDetail;
  }
  async UpdateFormDetail(
    input: UpdateFormDetailInput,
    condition?: any
  ): Promise<UpdateFormDetailMutation> {
    const statement = `mutation UpdateFormDetail($input: UpdateFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        updateFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateFormDetailMutation>response.data.updateFormDetail;
  }
  async DeleteFormDetail(
    input: DeleteFormDetailInput,
    condition?: any
  ): Promise<DeleteFormDetailMutation> {
    const statement = `mutation DeleteFormDetail($input: DeleteFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        deleteFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteFormDetailMutation>response.data.deleteFormDetail;
  }
  
  async GetFormSubmissionDetail(
    id: string
  ): Promise<GetFormSubmissionDetailQuery> {
    const statement = `query GetFormSubmissionDetail($id: ID!) {
        getFormSubmissionDetail(id: $id) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFormSubmissionDetailQuery>response.data.getFormSubmissionDetail;
  }
  async ListFormSubmissionDetails(
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormSubmissionDetailsQuery> {
    const statement = `query ListFormSubmissionDetails($filter: ModelFormSubmissionDetailFilterInput, $limit: Int, $nextToken: String) {
        listFormSubmissionDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formsubmissionlistID
            createdBy
            assignedBy
            formdetailID
            status
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListFormSubmissionDetailsQuery>(
      response.data.listFormSubmissionDetails
    );
  }
  async SyncFormSubmissionDetails(
    filter?: any,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormSubmissionDetailsQuery> {
    const statement = `query SyncFormSubmissionDetails($filter: ModelFormSubmissionDetailFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormSubmissionDetails(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formData
            formsubmissionlistID
            createdBy
            assignedBy
            formdetailID
            status
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncFormSubmissionDetailsQuery>(
      response.data.syncFormSubmissionDetails
    );
  }
  async FormSubmissionDetailsByFormsubmissionlistID(
    formsubmissionlistID: string,
    sortDirection?: ModelSortDirection,
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<FormSubmissionDetailsByFormsubmissionlistIDQuery> {
    const statement = `query FormSubmissionDetailsByFormsubmissionlistID($formsubmissionlistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelFormSubmissionDetailFilterInput, $limit: Int, $nextToken: String) {
        formSubmissionDetailsByFormsubmissionlistID(formsubmissionlistID: $formsubmissionlistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formsubmissionlistID
            createdBy
            assignedBy
            formdetailID
            status
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      formsubmissionlistID
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <FormSubmissionDetailsByFormsubmissionlistIDQuery>(
      response.data.formSubmissionDetailsByFormsubmissionlistID
    );
  }
  async FormSubmissionDetailsByFormdetailID(
    formdetailID: string,
    sortDirection?: ModelSortDirection,
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<FormSubmissionDetailsByFormdetailIDQuery> {
    const statement = `query FormSubmissionDetailsByFormdetailID($formdetailID: ID!, $sortDirection: ModelSortDirection, $filter: ModelFormSubmissionDetailFilterInput, $limit: Int, $nextToken: String) {
        formSubmissionDetailsByFormdetailID(formdetailID: $formdetailID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formsubmissionlistID
            createdBy
            assignedBy
            formdetailID
            status
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      formdetailID
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <FormSubmissionDetailsByFormdetailIDQuery>(
      response.data.formSubmissionDetailsByFormdetailID
    );
  }
  async GetAuthoredFormDetail(id: string): Promise<GetAuthoredFormDetailQuery> {
    const statement = `query GetAuthoredFormDetail($id: ID!) {
        getAuthoredFormDetail(id: $id) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetAuthoredFormDetailQuery>response.data.getAuthoredFormDetail;
  }
  async ListAuthoredFormDetails(
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<ListAuthoredFormDetailsQuery> {
    const statement = `query ListAuthoredFormDetails($filter: ModelAuthoredFormDetailFilterInput, $limit: Int, $nextToken: String) {
        listAuthoredFormDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formStatus
            version
            pages
            counter
            formDetailPublishStatus
            formlistID
            subForms
            hierarchy
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListAuthoredFormDetailsQuery>response.data.listAuthoredFormDetails;
  }
  async SyncAuthoredFormDetails(
    filter?: any,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncAuthoredFormDetailsQuery> {
    const statement = `query SyncAuthoredFormDetails($filter: ModelAuthoredFormDetailFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncAuthoredFormDetails(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formStatus
            version
            pages
            counter
            formDetailPublishStatus
            formlistID
            subForms
            hierarchy
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncAuthoredFormDetailsQuery>response.data.syncAuthoredFormDetails;
  }
  async AuthoredFormDetailsByFormlistID(
    formlistID: string,
    sortDirection?: ModelSortDirection,
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<AuthoredFormDetailsByFormlistIDQuery> {
    const statement = `query AuthoredFormDetailsByFormlistID($formlistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelAuthoredFormDetailFilterInput, $limit: Int, $nextToken: String) {
        authoredFormDetailsByFormlistID(formlistID: $formlistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formStatus
            version
            pages
            counter
            formDetailPublishStatus
            formlistID
            subForms
            hierarchy
            flatHierarchy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      formlistID
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <AuthoredFormDetailsByFormlistIDQuery>(
      response.data.authoredFormDetailsByFormlistID
    );
  }
  async GetFormSubmissionList(id: string): Promise<GetFormSubmissionListQuery> {
    const statement = `query GetFormSubmissionList($id: ID!) {
        getFormSubmissionList(id: $id) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFormSubmissionListQuery>response.data.getFormSubmissionList;
  }
  async ListFormSubmissionLists(
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormSubmissionListsQuery> {
    const statement = `query ListFormSubmissionLists($filter: ModelFormSubmissionListFilterInput, $limit: Int, $nextToken: String) {
        listFormSubmissionLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            location
            roundType
            status
            assignee
            dueDate
            version
            submittedBy
            searchTerm
            createdBy
            assignedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListFormSubmissionListsQuery>response.data.listFormSubmissionLists;
  }
  async SyncFormSubmissionLists(
    filter?: any,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormSubmissionListsQuery> {
    const statement = `query SyncFormSubmissionLists($filter: ModelFormSubmissionListFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormSubmissionLists(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            location
            roundType
            status
            assignee
            dueDate
            version
            submittedBy
            searchTerm
            createdBy
            assignedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncFormSubmissionListsQuery>response.data.syncFormSubmissionLists;
  }
  async GetFormList(id: string): Promise<GetFormListQuery> {
    const statement = `query GetFormList($id: ID!) {
        getFormList(id: $id) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFormListQuery>response.data.getFormList;
  }
  async ListFormLists(
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormListsQuery> {
    const statement = `query ListFormLists($filter: ModelFormListFilterInput, $limit: Int, $nextToken: String) {
        listFormLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            publishedDate
            location
            roundType
            formStatus
            assignee
            tags
            lastPublishedBy
            author
            formType
            isArchived
            searchTerm
            isArchivedAt
            isDeleted
            createdBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListFormListsQuery>response.data.listFormLists;
  }
  async SyncFormLists(
    filter?: any,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormListsQuery> {
    const statement = `query SyncFormLists($filter: ModelFormListFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormLists(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            publishedDate
            location
            roundType
            formStatus
            assignee
            tags
            lastPublishedBy
            author
            formType
            isArchived
            searchTerm
            isArchivedAt
            isDeleted
            createdBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncFormListsQuery>response.data.syncFormLists;
  }
  async GetFormDetail(id: string): Promise<GetFormDetailQuery> {
    const statement = `query GetFormDetail($id: ID!) {
        getFormDetail(id: $id) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFormDetailQuery>response.data.getFormDetail;
  }
  async ListFormDetails(
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormDetailsQuery> {
    const statement = `query ListFormDetails($filter: ModelFormDetailFilterInput, $limit: Int, $nextToken: String) {
        listFormDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formlistID
            createdBy
            assignedBy
            flatHierarchy
            scheduledAt
            scheduledType
            dueDate
            assignedTo
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListFormDetailsQuery>response.data.listFormDetails;
  }
  async SyncFormDetails(
    filter?: any,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormDetailsQuery> {
    const statement = `query SyncFormDetails($filter: ModelFormDetailFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormDetails(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formData
            formlistID
            createdBy
            assignedBy
            flatHierarchy
            scheduledAt
            scheduledType
            dueDate
            assignedTo
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncFormDetailsQuery>response.data.syncFormDetails;
  }
  async FormDetailsByFormlistID(
    formlistID: string,
    sortDirection?: ModelSortDirection,
    filter?: any,
    limit?: number,
    nextToken?: string
  ): Promise<FormDetailsByFormlistIDQuery> {
    const statement = `query FormDetailsByFormlistID($formlistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelFormDetailFilterInput, $limit: Int, $nextToken: String) {
        formDetailsByFormlistID(formlistID: $formlistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formlistID
            createdBy
            assignedBy
            flatHierarchy
            scheduledAt
            scheduledType
            dueDate
            assignedTo
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      formlistID
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <FormDetailsByFormlistIDQuery>response.data.formDetailsByFormlistID;
  }
                 
  OnCreateFormSubmissionDetailListener(
    filter?: ModelSubscriptionFormSubmissionDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateFormSubmissionDetail">
    >
  > {
    const statement = `subscription OnCreateFormSubmissionDetail($filter: ModelSubscriptionFormSubmissionDetailFilterInput) {
        onCreateFormSubmissionDetail(filter: $filter) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onCreateFormSubmissionDetail">
      >
    >;
  }

  OnUpdateFormSubmissionDetailListener(
    filter?: ModelSubscriptionFormSubmissionDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateFormSubmissionDetail">
    >
  > {
    const statement = `subscription OnUpdateFormSubmissionDetail($filter: ModelSubscriptionFormSubmissionDetailFilterInput) {
        onUpdateFormSubmissionDetail(filter: $filter) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateFormSubmissionDetail">
      >
    >;
  }

  OnDeleteFormSubmissionDetailListener(
    filter?: ModelSubscriptionFormSubmissionDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteFormSubmissionDetail">
    >
  > {
    const statement = `subscription OnDeleteFormSubmissionDetail($filter: ModelSubscriptionFormSubmissionDetailFilterInput) {
        onDeleteFormSubmissionDetail(filter: $filter) {
          __typename
          id
          formData
          formsubmissionlistID
          createdBy
          assignedBy
          formdetailID
          status
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onDeleteFormSubmissionDetail">
      >
    >;
  }

  OnCreateAuthoredFormDetailListener(
    filter?: ModelSubscriptionAuthoredFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateAuthoredFormDetail">
    >
  > {
    const statement = `subscription OnCreateAuthoredFormDetail($filter: ModelSubscriptionAuthoredFormDetailFilterInput) {
        onCreateAuthoredFormDetail(filter: $filter) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onCreateAuthoredFormDetail">
      >
    >;
  }

  OnUpdateAuthoredFormDetailListener(
    filter?: ModelSubscriptionAuthoredFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateAuthoredFormDetail">
    >
  > {
    const statement = `subscription OnUpdateAuthoredFormDetail($filter: ModelSubscriptionAuthoredFormDetailFilterInput) {
        onUpdateAuthoredFormDetail(filter: $filter) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateAuthoredFormDetail">
      >
    >;
  }

  OnDeleteAuthoredFormDetailListener(
    filter?: ModelSubscriptionAuthoredFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteAuthoredFormDetail">
    >
  > {
    const statement = `subscription OnDeleteAuthoredFormDetail($filter: ModelSubscriptionAuthoredFormDetailFilterInput) {
        onDeleteAuthoredFormDetail(filter: $filter) {
          __typename
          id
          formStatus
          version
          pages
          counter
          formDetailPublishStatus
          formlistID
          subForms
          hierarchy
          flatHierarchy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onDeleteAuthoredFormDetail">
      >
    >;
  }

  OnCreateFormSubmissionListListener(
    filter?: ModelSubscriptionFormSubmissionListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateFormSubmissionList">
    >
  > {
    const statement = `subscription OnCreateFormSubmissionList($filter: ModelSubscriptionFormSubmissionListFilterInput) {
        onCreateFormSubmissionList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onCreateFormSubmissionList">
      >
    >;
  }

  OnUpdateFormSubmissionListListener(
    filter?: ModelSubscriptionFormSubmissionListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateFormSubmissionList">
    >
  > {
    const statement = `subscription OnUpdateFormSubmissionList($filter: ModelSubscriptionFormSubmissionListFilterInput) {
        onUpdateFormSubmissionList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateFormSubmissionList">
      >
    >;
  }

  OnDeleteFormSubmissionListListener(
    filter?: ModelSubscriptionFormSubmissionListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteFormSubmissionList">
    >
  > {
    const statement = `subscription OnDeleteFormSubmissionList($filter: ModelSubscriptionFormSubmissionListFilterInput) {
        onDeleteFormSubmissionList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          location
          roundType
          status
          assignee
          dueDate
          version
          submittedBy
          searchTerm
          formSubmissionListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdBy
          assignedBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onDeleteFormSubmissionList">
      >
    >;
  }

  OnCreateFormListListener(
    filter?: ModelSubscriptionFormListFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormList">>
  > {
    const statement = `subscription OnCreateFormList($filter: ModelSubscriptionFormListFilterInput) {
        onCreateFormList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormList">>
    >;
  }

  OnUpdateFormListListener(
    filter?: ModelSubscriptionFormListFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormList">>
  > {
    const statement = `subscription OnUpdateFormList($filter: ModelSubscriptionFormListFilterInput) {
        onUpdateFormList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormList">>
    >;
  }

  OnDeleteFormListListener(
    filter?: ModelSubscriptionFormListFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormList">>
  > {
    const statement = `subscription OnDeleteFormList($filter: ModelSubscriptionFormListFilterInput) {
        onDeleteFormList(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          publishedDate
          location
          roundType
          formStatus
          assignee
          tags
          lastPublishedBy
          author
          formType
          isArchived
          searchTerm
          isArchivedAt
          formListAuthoredFormDetail {
            __typename
            nextToken
            startedAt
          }
          formListFormDetail {
            __typename
            nextToken
            startedAt
          }
          isDeleted
          createdBy
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormList">>
    >;
  }

  OnCreateFormDetailListener(
    filter?: ModelSubscriptionFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormDetail">>
  > {
    const statement = `subscription OnCreateFormDetail($filter: ModelSubscriptionFormDetailFilterInput) {
        onCreateFormDetail(filter: $filter) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormDetail">>
    >;
  }

  OnUpdateFormDetailListener(
    filter?: ModelSubscriptionFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormDetail">>
  > {
    const statement = `subscription OnUpdateFormDetail($filter: ModelSubscriptionFormDetailFilterInput) {
        onUpdateFormDetail(filter: $filter) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormDetail">>
    >;
  }

  OnDeleteFormDetailListener(
    filter?: ModelSubscriptionFormDetailFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormDetail">>
  > {
    const statement = `subscription OnDeleteFormDetail($filter: ModelSubscriptionFormDetailFilterInput) {
        onDeleteFormDetail(filter: $filter) {
          __typename
          id
          formData
          formlistID
          createdBy
          assignedBy
          flatHierarchy
          scheduledAt
          scheduledType
          dueDate
          assignedTo
          formSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormDetail">>
    >;
  }
}
