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
  onCreateAuthoredRoundPlanDetail: OnCreateAuthoredRoundPlanDetailSubscription;
  onUpdateAuthoredRoundPlanDetail: OnUpdateAuthoredRoundPlanDetailSubscription;
  onDeleteAuthoredRoundPlanDetail: OnDeleteAuthoredRoundPlanDetailSubscription;
  onCreateRoundPlanDetail: OnCreateRoundPlanDetailSubscription;
  onUpdateRoundPlanDetail: OnUpdateRoundPlanDetailSubscription;
  onDeleteRoundPlanDetail: OnDeleteRoundPlanDetailSubscription;
  onCreateRoundPlansList: OnCreateRoundPlansListSubscription;
  onUpdateRoundPlansList: OnUpdateRoundPlansListSubscription;
  onDeleteRoundPlansList: OnDeleteRoundPlansListSubscription;
  onCreateResponseSet: OnCreateResponseSetSubscription;
  onUpdateResponseSet: OnUpdateResponseSetSubscription;
  onDeleteResponseSet: OnDeleteResponseSetSubscription;
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

export type CreateAuthoredRoundPlanDetailInput = {
  id?: string | null;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
  _version?: number | null;
};

export type ModelAuthoredRoundPlanDetailConditionInput = {
  formStatus?: ModelStringInput | null;
  ver?: ModelStringInput | null;
  page?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  roundPlanDetailPublishStatus?: ModelStringInput | null;
  roundplanslistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredRoundPlanDetailConditionInput | null> | null;
  or?: Array<ModelAuthoredRoundPlanDetailConditionInput | null> | null;
  not?: ModelAuthoredRoundPlanDetailConditionInput | null;
};

export type ModelStringInput = {
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
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
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

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

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

export type ModelIDInput = {
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
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type AuthoredRoundPlanDetail = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateAuthoredRoundPlanDetailInput = {
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID?: string | null;
  _version?: number | null;
};

export type DeleteAuthoredRoundPlanDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateRoundPlanDetailInput = {
  id?: string | null;
  formData?: string | null;
  roundplanslistID: string;
  _version?: number | null;
};

export type ModelRoundPlanDetailConditionInput = {
  formData?: ModelStringInput | null;
  roundplanslistID?: ModelIDInput | null;
  and?: Array<ModelRoundPlanDetailConditionInput | null> | null;
  or?: Array<ModelRoundPlanDetailConditionInput | null> | null;
  not?: ModelRoundPlanDetailConditionInput | null;
};

export type RoundPlanDetail = {
  __typename: "RoundPlanDetail";
  id: string;
  formData?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlanDetailInput = {
  id: string;
  formData?: string | null;
  roundplanslistID?: string | null;
  _version?: number | null;
};

export type DeleteRoundPlanDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateRoundPlansListInput = {
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
  _version?: number | null;
};

export type ModelRoundPlansListConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  publishedDate?: ModelStringInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  formStatus?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  lastPublishedBy?: ModelStringInput | null;
  author?: ModelStringInput | null;
  formType?: ModelStringInput | null;
  isArchived?: ModelBooleanInput | null;
  searchTerm?: ModelStringInput | null;
  isArchivedAt?: ModelStringInput | null;
  and?: Array<ModelRoundPlansListConditionInput | null> | null;
  or?: Array<ModelRoundPlansListConditionInput | null> | null;
  not?: ModelRoundPlansListConditionInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type RoundPlansList = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: ModelRoundPlanDetailConnection | null;
  roundPlansListAuthoredRoundPlanDetails?: ModelAuthoredRoundPlanDetailConnection | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelRoundPlanDetailConnection = {
  __typename: "ModelRoundPlanDetailConnection";
  items: Array<RoundPlanDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelAuthoredRoundPlanDetailConnection = {
  __typename: "ModelAuthoredRoundPlanDetailConnection";
  items: Array<AuthoredRoundPlanDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type UpdateRoundPlansListInput = {
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
  _version?: number | null;
};

export type DeleteRoundPlansListInput = {
  id: string;
  _version?: number | null;
};

export type CreateResponseSetInput = {
  id?: string | null;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  _version?: number | null;
};

export type ModelResponseSetConditionInput = {
  type?: ModelStringInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  isMultiColumn?: ModelBooleanInput | null;
  values?: ModelStringInput | null;
  and?: Array<ModelResponseSetConditionInput | null> | null;
  or?: Array<ModelResponseSetConditionInput | null> | null;
  not?: ModelResponseSetConditionInput | null;
};

export type ResponseSet = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateResponseSetInput = {
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  _version?: number | null;
};

export type DeleteResponseSetInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormSubmissionDetailInput = {
  id?: string | null;
  formData?: string | null;
  formlistID: string;
  formsubmissionlistID: string;
  _version?: number | null;
};

export type ModelFormSubmissionDetailConditionInput = {
  formData?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  formsubmissionlistID?: ModelIDInput | null;
  and?: Array<ModelFormSubmissionDetailConditionInput | null> | null;
  or?: Array<ModelFormSubmissionDetailConditionInput | null> | null;
  not?: ModelFormSubmissionDetailConditionInput | null;
};

export type FormSubmissionDetail = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formlistID: string;
  formsubmissionlistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormSubmissionDetailInput = {
  id: string;
  formData?: string | null;
  formlistID?: string | null;
  formsubmissionlistID?: string | null;
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
  _version?: number | null;
};

export type ModelAuthoredFormDetailConditionInput = {
  formStatus?: ModelStringInput | null;
  version?: ModelStringInput | null;
  pages?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  formDetailPublishStatus?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  or?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  not?: ModelAuthoredFormDetailConditionInput | null;
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
  _version?: number | null;
};

export type ModelFormSubmissionListConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  status?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  dueDate?: ModelStringInput | null;
  version?: ModelStringInput | null;
  submittedBy?: ModelStringInput | null;
  searchTerm?: ModelStringInput | null;
  and?: Array<ModelFormSubmissionListConditionInput | null> | null;
  or?: Array<ModelFormSubmissionListConditionInput | null> | null;
  not?: ModelFormSubmissionListConditionInput | null;
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
  _version?: number | null;
};

export type ModelFormListConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  publishedDate?: ModelStringInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  formStatus?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  lastPublishedBy?: ModelStringInput | null;
  author?: ModelStringInput | null;
  formType?: ModelStringInput | null;
  isArchived?: ModelBooleanInput | null;
  searchTerm?: ModelStringInput | null;
  isArchivedAt?: ModelStringInput | null;
  and?: Array<ModelFormListConditionInput | null> | null;
  or?: Array<ModelFormListConditionInput | null> | null;
  not?: ModelFormListConditionInput | null;
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
  formListFormSubmissionDetail?: ModelFormSubmissionDetailConnection | null;
  formListAuthoredFormDetail?: ModelAuthoredFormDetailConnection | null;
  formListFormDetail?: ModelFormDetailConnection | null;
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
  _version?: number | null;
};

export type ModelFormDetailConditionInput = {
  formData?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelFormDetailConditionInput | null> | null;
  or?: Array<ModelFormDetailConditionInput | null> | null;
  not?: ModelFormDetailConditionInput | null;
};

export type UpdateFormDetailInput = {
  id: string;
  formData?: string | null;
  formlistID?: string | null;
  _version?: number | null;
};

export type DeleteFormDetailInput = {
  id: string;
  _version?: number | null;
};

export type ModelAuthoredRoundPlanDetailFilterInput = {
  id?: ModelIDInput | null;
  formStatus?: ModelStringInput | null;
  ver?: ModelStringInput | null;
  page?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  roundPlanDetailPublishStatus?: ModelStringInput | null;
  roundplanslistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelAuthoredRoundPlanDetailFilterInput | null> | null;
  not?: ModelAuthoredRoundPlanDetailFilterInput | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type ModelRoundPlanDetailFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  roundplanslistID?: ModelIDInput | null;
  and?: Array<ModelRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelRoundPlanDetailFilterInput | null> | null;
  not?: ModelRoundPlanDetailFilterInput | null;
};

export type ModelRoundPlansListFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  publishedDate?: ModelStringInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  formStatus?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  lastPublishedBy?: ModelStringInput | null;
  author?: ModelStringInput | null;
  formType?: ModelStringInput | null;
  isArchived?: ModelBooleanInput | null;
  searchTerm?: ModelStringInput | null;
  isArchivedAt?: ModelStringInput | null;
  and?: Array<ModelRoundPlansListFilterInput | null> | null;
  or?: Array<ModelRoundPlansListFilterInput | null> | null;
  not?: ModelRoundPlansListFilterInput | null;
};

export type ModelRoundPlansListConnection = {
  __typename: "ModelRoundPlansListConnection";
  items: Array<RoundPlansList | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelResponseSetFilterInput = {
  id?: ModelIDInput | null;
  type?: ModelStringInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  isMultiColumn?: ModelBooleanInput | null;
  values?: ModelStringInput | null;
  and?: Array<ModelResponseSetFilterInput | null> | null;
  or?: Array<ModelResponseSetFilterInput | null> | null;
  not?: ModelResponseSetFilterInput | null;
};

export type ModelResponseSetConnection = {
  __typename: "ModelResponseSetConnection";
  items: Array<ResponseSet | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelFormSubmissionDetailFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  formsubmissionlistID?: ModelIDInput | null;
  and?: Array<ModelFormSubmissionDetailFilterInput | null> | null;
  or?: Array<ModelFormSubmissionDetailFilterInput | null> | null;
  not?: ModelFormSubmissionDetailFilterInput | null;
};

export type ModelAuthoredFormDetailFilterInput = {
  id?: ModelIDInput | null;
  formStatus?: ModelStringInput | null;
  version?: ModelStringInput | null;
  pages?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  formDetailPublishStatus?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  not?: ModelAuthoredFormDetailFilterInput | null;
};

export type ModelFormSubmissionListFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  status?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  dueDate?: ModelStringInput | null;
  version?: ModelStringInput | null;
  submittedBy?: ModelStringInput | null;
  searchTerm?: ModelStringInput | null;
  and?: Array<ModelFormSubmissionListFilterInput | null> | null;
  or?: Array<ModelFormSubmissionListFilterInput | null> | null;
  not?: ModelFormSubmissionListFilterInput | null;
};

export type ModelFormSubmissionListConnection = {
  __typename: "ModelFormSubmissionListConnection";
  items: Array<FormSubmissionList | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelFormListFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  publishedDate?: ModelStringInput | null;
  location?: ModelStringInput | null;
  roundType?: ModelStringInput | null;
  formStatus?: ModelStringInput | null;
  assignee?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  lastPublishedBy?: ModelStringInput | null;
  author?: ModelStringInput | null;
  formType?: ModelStringInput | null;
  isArchived?: ModelBooleanInput | null;
  searchTerm?: ModelStringInput | null;
  isArchivedAt?: ModelStringInput | null;
  and?: Array<ModelFormListFilterInput | null> | null;
  or?: Array<ModelFormListFilterInput | null> | null;
  not?: ModelFormListFilterInput | null;
};

export type ModelFormListConnection = {
  __typename: "ModelFormListConnection";
  items: Array<FormList | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelFormDetailFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelFormDetailFilterInput | null> | null;
  or?: Array<ModelFormDetailFilterInput | null> | null;
  not?: ModelFormDetailFilterInput | null;
};

export type ModelSubscriptionAuthoredRoundPlanDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  ver?: ModelSubscriptionStringInput | null;
  page?: ModelSubscriptionStringInput | null;
  counter?: ModelSubscriptionIntInput | null;
  roundPlanDetailPublishStatus?: ModelSubscriptionStringInput | null;
  roundplanslistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionAuthoredRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionAuthoredRoundPlanDetailFilterInput | null> | null;
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

export type ModelSubscriptionRoundPlanDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  roundplanslistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionRoundPlanDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlanDetailFilterInput | null> | null;
};

export type ModelSubscriptionRoundPlansListFilterInput = {
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
  and?: Array<ModelSubscriptionRoundPlansListFilterInput | null> | null;
  or?: Array<ModelSubscriptionRoundPlansListFilterInput | null> | null;
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
};

export type ModelSubscriptionResponseSetFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  type?: ModelSubscriptionStringInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  isMultiColumn?: ModelSubscriptionBooleanInput | null;
  values?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionResponseSetFilterInput | null> | null;
  or?: Array<ModelSubscriptionResponseSetFilterInput | null> | null;
};

export type ModelSubscriptionFormSubmissionDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  formsubmissionlistID?: ModelSubscriptionIDInput | null;
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
  and?: Array<ModelSubscriptionFormListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormListFilterInput | null> | null;
};

export type ModelSubscriptionFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
};

export type CreateAuthoredRoundPlanDetailMutation = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
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
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
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
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
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
  roundplanslistID: string;
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
  roundplanslistID: string;
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
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateRoundPlansListMutation = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateRoundPlansListMutation = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteRoundPlansListMutation = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  formlistID: string;
  formsubmissionlistID: string;
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
  formlistID: string;
  formsubmissionlistID: string;
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
  formlistID: string;
  formsubmissionlistID: string;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type GetAuthoredRoundPlanDetailQuery = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
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
    ver?: string | null;
    page?: string | null;
    counter?: number | null;
    roundPlanDetailPublishStatus?: string | null;
    roundplanslistID: string;
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
    ver?: string | null;
    page?: string | null;
    counter?: number | null;
    roundPlanDetailPublishStatus?: string | null;
    roundplanslistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type AuthoredRoundPlanDetailsByRoundplanslistIDQuery = {
  __typename: "ModelAuthoredRoundPlanDetailConnection";
  items: Array<{
    __typename: "AuthoredRoundPlanDetail";
    id: string;
    formStatus?: string | null;
    ver?: string | null;
    page?: string | null;
    counter?: number | null;
    roundPlanDetailPublishStatus?: string | null;
    roundplanslistID: string;
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
  roundplanslistID: string;
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
    roundplanslistID: string;
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
    roundplanslistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type RoundPlanDetailsByRoundplanslistIDQuery = {
  __typename: "ModelRoundPlanDetailConnection";
  items: Array<{
    __typename: "RoundPlanDetail";
    id: string;
    formData?: string | null;
    roundplanslistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetRoundPlansListQuery = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListRoundPlansListsQuery = {
  __typename: "ModelRoundPlansListConnection";
  items: Array<{
    __typename: "RoundPlansList";
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncRoundPlansListsQuery = {
  __typename: "ModelRoundPlansListConnection";
  items: Array<{
    __typename: "RoundPlansList";
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
  formlistID: string;
  formsubmissionlistID: string;
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
    formlistID: string;
    formsubmissionlistID: string;
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
    formlistID: string;
    formsubmissionlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormSubmissionDetailsByFormlistIDQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formlistID: string;
    formsubmissionlistID: string;
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
    formlistID: string;
    formsubmissionlistID: string;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type OnCreateAuthoredRoundPlanDetailSubscription = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateAuthoredRoundPlanDetailSubscription = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteAuthoredRoundPlanDetailSubscription = {
  __typename: "AuthoredRoundPlanDetail";
  id: string;
  formStatus?: string | null;
  ver?: string | null;
  page?: string | null;
  counter?: number | null;
  roundPlanDetailPublishStatus?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateRoundPlanDetailSubscription = {
  __typename: "RoundPlanDetail";
  id: string;
  formData?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateRoundPlanDetailSubscription = {
  __typename: "RoundPlanDetail";
  id: string;
  formData?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteRoundPlanDetailSubscription = {
  __typename: "RoundPlanDetail";
  id: string;
  formData?: string | null;
  roundplanslistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateRoundPlansListSubscription = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateRoundPlansListSubscription = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteRoundPlansListSubscription = {
  __typename: "RoundPlansList";
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
  roundPlansListRoundPlanDetails?: {
    __typename: "ModelRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  roundPlansListAuthoredRoundPlanDetails?: {
    __typename: "ModelAuthoredRoundPlanDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateResponseSetSubscription = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateResponseSetSubscription = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteResponseSetSubscription = {
  __typename: "ResponseSet";
  id: string;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  isMultiColumn?: boolean | null;
  values?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateFormSubmissionDetailSubscription = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formlistID: string;
  formsubmissionlistID: string;
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
  formlistID: string;
  formsubmissionlistID: string;
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
  formlistID: string;
  formsubmissionlistID: string;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  formListFormSubmissionDetail?: {
    __typename: "ModelFormSubmissionDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
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
  async CreateAuthoredRoundPlanDetail(
    input: CreateAuthoredRoundPlanDetailInput,
    condition?: ModelAuthoredRoundPlanDetailConditionInput
  ): Promise<CreateAuthoredRoundPlanDetailMutation> {
    const statement = `mutation CreateAuthoredRoundPlanDetail($input: CreateAuthoredRoundPlanDetailInput!, $condition: ModelAuthoredRoundPlanDetailConditionInput) {
        createAuthoredRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
    return <CreateAuthoredRoundPlanDetailMutation>(
      response.data.createAuthoredRoundPlanDetail
    );
  }
  async UpdateAuthoredRoundPlanDetail(
    input: UpdateAuthoredRoundPlanDetailInput,
    condition?: ModelAuthoredRoundPlanDetailConditionInput
  ): Promise<UpdateAuthoredRoundPlanDetailMutation> {
    const statement = `mutation UpdateAuthoredRoundPlanDetail($input: UpdateAuthoredRoundPlanDetailInput!, $condition: ModelAuthoredRoundPlanDetailConditionInput) {
        updateAuthoredRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
    return <UpdateAuthoredRoundPlanDetailMutation>(
      response.data.updateAuthoredRoundPlanDetail
    );
  }
  async DeleteAuthoredRoundPlanDetail(
    input: DeleteAuthoredRoundPlanDetailInput,
    condition?: ModelAuthoredRoundPlanDetailConditionInput
  ): Promise<DeleteAuthoredRoundPlanDetailMutation> {
    const statement = `mutation DeleteAuthoredRoundPlanDetail($input: DeleteAuthoredRoundPlanDetailInput!, $condition: ModelAuthoredRoundPlanDetailConditionInput) {
        deleteAuthoredRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
    return <DeleteAuthoredRoundPlanDetailMutation>(
      response.data.deleteAuthoredRoundPlanDetail
    );
  }
  async CreateRoundPlanDetail(
    input: CreateRoundPlanDetailInput,
    condition?: ModelRoundPlanDetailConditionInput
  ): Promise<CreateRoundPlanDetailMutation> {
    const statement = `mutation CreateRoundPlanDetail($input: CreateRoundPlanDetailInput!, $condition: ModelRoundPlanDetailConditionInput) {
        createRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          roundplanslistID
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
    return <CreateRoundPlanDetailMutation>response.data.createRoundPlanDetail;
  }
  async UpdateRoundPlanDetail(
    input: UpdateRoundPlanDetailInput,
    condition?: ModelRoundPlanDetailConditionInput
  ): Promise<UpdateRoundPlanDetailMutation> {
    const statement = `mutation UpdateRoundPlanDetail($input: UpdateRoundPlanDetailInput!, $condition: ModelRoundPlanDetailConditionInput) {
        updateRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          roundplanslistID
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
    return <UpdateRoundPlanDetailMutation>response.data.updateRoundPlanDetail;
  }
  async DeleteRoundPlanDetail(
    input: DeleteRoundPlanDetailInput,
    condition?: ModelRoundPlanDetailConditionInput
  ): Promise<DeleteRoundPlanDetailMutation> {
    const statement = `mutation DeleteRoundPlanDetail($input: DeleteRoundPlanDetailInput!, $condition: ModelRoundPlanDetailConditionInput) {
        deleteRoundPlanDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          roundplanslistID
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
    return <DeleteRoundPlanDetailMutation>response.data.deleteRoundPlanDetail;
  }
  async CreateRoundPlansList(
    input: CreateRoundPlansListInput,
    condition?: ModelRoundPlansListConditionInput
  ): Promise<CreateRoundPlansListMutation> {
    const statement = `mutation CreateRoundPlansList($input: CreateRoundPlansListInput!, $condition: ModelRoundPlansListConditionInput) {
        createRoundPlansList(input: $input, condition: $condition) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
    return <CreateRoundPlansListMutation>response.data.createRoundPlansList;
  }
  async UpdateRoundPlansList(
    input: UpdateRoundPlansListInput,
    condition?: ModelRoundPlansListConditionInput
  ): Promise<UpdateRoundPlansListMutation> {
    const statement = `mutation UpdateRoundPlansList($input: UpdateRoundPlansListInput!, $condition: ModelRoundPlansListConditionInput) {
        updateRoundPlansList(input: $input, condition: $condition) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
    return <UpdateRoundPlansListMutation>response.data.updateRoundPlansList;
  }
  async DeleteRoundPlansList(
    input: DeleteRoundPlansListInput,
    condition?: ModelRoundPlansListConditionInput
  ): Promise<DeleteRoundPlansListMutation> {
    const statement = `mutation DeleteRoundPlansList($input: DeleteRoundPlansListInput!, $condition: ModelRoundPlansListConditionInput) {
        deleteRoundPlansList(input: $input, condition: $condition) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
    return <DeleteRoundPlansListMutation>response.data.deleteRoundPlansList;
  }
  async CreateResponseSet(
    input: CreateResponseSetInput,
    condition?: ModelResponseSetConditionInput
  ): Promise<CreateResponseSetMutation> {
    const statement = `mutation CreateResponseSet($input: CreateResponseSetInput!, $condition: ModelResponseSetConditionInput) {
        createResponseSet(input: $input, condition: $condition) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
    return <CreateResponseSetMutation>response.data.createResponseSet;
  }
  async UpdateResponseSet(
    input: UpdateResponseSetInput,
    condition?: ModelResponseSetConditionInput
  ): Promise<UpdateResponseSetMutation> {
    const statement = `mutation UpdateResponseSet($input: UpdateResponseSetInput!, $condition: ModelResponseSetConditionInput) {
        updateResponseSet(input: $input, condition: $condition) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
    return <UpdateResponseSetMutation>response.data.updateResponseSet;
  }
  async DeleteResponseSet(
    input: DeleteResponseSetInput,
    condition?: ModelResponseSetConditionInput
  ): Promise<DeleteResponseSetMutation> {
    const statement = `mutation DeleteResponseSet($input: DeleteResponseSetInput!, $condition: ModelResponseSetConditionInput) {
        deleteResponseSet(input: $input, condition: $condition) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
    return <DeleteResponseSetMutation>response.data.deleteResponseSet;
  }
  async CreateFormSubmissionDetail(
    input: CreateFormSubmissionDetailInput,
    condition?: ModelFormSubmissionDetailConditionInput
  ): Promise<CreateFormSubmissionDetailMutation> {
    const statement = `mutation CreateFormSubmissionDetail($input: CreateFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        createFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          formsubmissionlistID
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
    condition?: ModelFormSubmissionDetailConditionInput
  ): Promise<UpdateFormSubmissionDetailMutation> {
    const statement = `mutation UpdateFormSubmissionDetail($input: UpdateFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        updateFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          formsubmissionlistID
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
    condition?: ModelFormSubmissionDetailConditionInput
  ): Promise<DeleteFormSubmissionDetailMutation> {
    const statement = `mutation DeleteFormSubmissionDetail($input: DeleteFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        deleteFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
          formsubmissionlistID
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
    condition?: ModelAuthoredFormDetailConditionInput
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
    condition?: ModelAuthoredFormDetailConditionInput
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
    condition?: ModelAuthoredFormDetailConditionInput
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
    condition?: ModelFormSubmissionListConditionInput
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
    condition?: ModelFormSubmissionListConditionInput
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
    condition?: ModelFormSubmissionListConditionInput
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
    condition?: ModelFormListConditionInput
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
    condition?: ModelFormListConditionInput
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
    condition?: ModelFormListConditionInput
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
    condition?: ModelFormDetailConditionInput
  ): Promise<CreateFormDetailMutation> {
    const statement = `mutation CreateFormDetail($input: CreateFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        createFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
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
    condition?: ModelFormDetailConditionInput
  ): Promise<UpdateFormDetailMutation> {
    const statement = `mutation UpdateFormDetail($input: UpdateFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        updateFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
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
    condition?: ModelFormDetailConditionInput
  ): Promise<DeleteFormDetailMutation> {
    const statement = `mutation DeleteFormDetail($input: DeleteFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        deleteFormDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formlistID
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
  async GetAuthoredRoundPlanDetail(
    id: string
  ): Promise<GetAuthoredRoundPlanDetailQuery> {
    const statement = `query GetAuthoredRoundPlanDetail($id: ID!) {
        getAuthoredRoundPlanDetail(id: $id) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
    return <GetAuthoredRoundPlanDetailQuery>(
      response.data.getAuthoredRoundPlanDetail
    );
  }
  async ListAuthoredRoundPlanDetails(
    filter?: ModelAuthoredRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListAuthoredRoundPlanDetailsQuery> {
    const statement = `query ListAuthoredRoundPlanDetails($filter: ModelAuthoredRoundPlanDetailFilterInput, $limit: Int, $nextToken: String) {
        listAuthoredRoundPlanDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formStatus
            ver
            page
            counter
            roundPlanDetailPublishStatus
            roundplanslistID
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
    return <ListAuthoredRoundPlanDetailsQuery>(
      response.data.listAuthoredRoundPlanDetails
    );
  }
  async SyncAuthoredRoundPlanDetails(
    filter?: ModelAuthoredRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncAuthoredRoundPlanDetailsQuery> {
    const statement = `query SyncAuthoredRoundPlanDetails($filter: ModelAuthoredRoundPlanDetailFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncAuthoredRoundPlanDetails(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formStatus
            ver
            page
            counter
            roundPlanDetailPublishStatus
            roundplanslistID
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
    return <SyncAuthoredRoundPlanDetailsQuery>(
      response.data.syncAuthoredRoundPlanDetails
    );
  }
  async AuthoredRoundPlanDetailsByRoundplanslistID(
    roundplanslistID: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelAuthoredRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<AuthoredRoundPlanDetailsByRoundplanslistIDQuery> {
    const statement = `query AuthoredRoundPlanDetailsByRoundplanslistID($roundplanslistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelAuthoredRoundPlanDetailFilterInput, $limit: Int, $nextToken: String) {
        authoredRoundPlanDetailsByRoundplanslistID(roundplanslistID: $roundplanslistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formStatus
            ver
            page
            counter
            roundPlanDetailPublishStatus
            roundplanslistID
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
      roundplanslistID
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
    return <AuthoredRoundPlanDetailsByRoundplanslistIDQuery>(
      response.data.authoredRoundPlanDetailsByRoundplanslistID
    );
  }
  async GetRoundPlanDetail(id: string): Promise<GetRoundPlanDetailQuery> {
    const statement = `query GetRoundPlanDetail($id: ID!) {
        getRoundPlanDetail(id: $id) {
          __typename
          id
          formData
          roundplanslistID
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
    return <GetRoundPlanDetailQuery>response.data.getRoundPlanDetail;
  }
  async ListRoundPlanDetails(
    filter?: ModelRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListRoundPlanDetailsQuery> {
    const statement = `query ListRoundPlanDetails($filter: ModelRoundPlanDetailFilterInput, $limit: Int, $nextToken: String) {
        listRoundPlanDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            roundplanslistID
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
    return <ListRoundPlanDetailsQuery>response.data.listRoundPlanDetails;
  }
  async SyncRoundPlanDetails(
    filter?: ModelRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncRoundPlanDetailsQuery> {
    const statement = `query SyncRoundPlanDetails($filter: ModelRoundPlanDetailFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncRoundPlanDetails(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formData
            roundplanslistID
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
    return <SyncRoundPlanDetailsQuery>response.data.syncRoundPlanDetails;
  }
  async RoundPlanDetailsByRoundplanslistID(
    roundplanslistID: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelRoundPlanDetailFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<RoundPlanDetailsByRoundplanslistIDQuery> {
    const statement = `query RoundPlanDetailsByRoundplanslistID($roundplanslistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelRoundPlanDetailFilterInput, $limit: Int, $nextToken: String) {
        roundPlanDetailsByRoundplanslistID(roundplanslistID: $roundplanslistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            roundplanslistID
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
      roundplanslistID
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
    return <RoundPlanDetailsByRoundplanslistIDQuery>(
      response.data.roundPlanDetailsByRoundplanslistID
    );
  }
  async GetRoundPlansList(id: string): Promise<GetRoundPlansListQuery> {
    const statement = `query GetRoundPlansList($id: ID!) {
        getRoundPlansList(id: $id) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
    return <GetRoundPlansListQuery>response.data.getRoundPlansList;
  }
  async ListRoundPlansLists(
    filter?: ModelRoundPlansListFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListRoundPlansListsQuery> {
    const statement = `query ListRoundPlansLists($filter: ModelRoundPlansListFilterInput, $limit: Int, $nextToken: String) {
        listRoundPlansLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
    return <ListRoundPlansListsQuery>response.data.listRoundPlansLists;
  }
  async SyncRoundPlansLists(
    filter?: ModelRoundPlansListFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncRoundPlansListsQuery> {
    const statement = `query SyncRoundPlansLists($filter: ModelRoundPlansListFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncRoundPlansLists(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
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
    return <SyncRoundPlansListsQuery>response.data.syncRoundPlansLists;
  }
  async GetResponseSet(id: string): Promise<GetResponseSetQuery> {
    const statement = `query GetResponseSet($id: ID!) {
        getResponseSet(id: $id) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
    return <GetResponseSetQuery>response.data.getResponseSet;
  }
  async ListResponseSets(
    filter?: ModelResponseSetFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListResponseSetsQuery> {
    const statement = `query ListResponseSets($filter: ModelResponseSetFilterInput, $limit: Int, $nextToken: String) {
        listResponseSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            type
            name
            description
            isMultiColumn
            values
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
    return <ListResponseSetsQuery>response.data.listResponseSets;
  }
  async SyncResponseSets(
    filter?: ModelResponseSetFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncResponseSetsQuery> {
    const statement = `query SyncResponseSets($filter: ModelResponseSetFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncResponseSets(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            type
            name
            description
            isMultiColumn
            values
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
    return <SyncResponseSetsQuery>response.data.syncResponseSets;
  }
  async GetFormSubmissionDetail(
    id: string
  ): Promise<GetFormSubmissionDetailQuery> {
    const statement = `query GetFormSubmissionDetail($id: ID!) {
        getFormSubmissionDetail(id: $id) {
          __typename
          id
          formData
          formlistID
          formsubmissionlistID
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
    filter?: ModelFormSubmissionDetailFilterInput,
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
            formlistID
            formsubmissionlistID
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
    filter?: ModelFormSubmissionDetailFilterInput,
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
            formlistID
            formsubmissionlistID
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
  async FormSubmissionDetailsByFormlistID(
    formlistID: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelFormSubmissionDetailFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<FormSubmissionDetailsByFormlistIDQuery> {
    const statement = `query FormSubmissionDetailsByFormlistID($formlistID: ID!, $sortDirection: ModelSortDirection, $filter: ModelFormSubmissionDetailFilterInput, $limit: Int, $nextToken: String) {
        formSubmissionDetailsByFormlistID(formlistID: $formlistID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            formlistID
            formsubmissionlistID
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
    return <FormSubmissionDetailsByFormlistIDQuery>(
      response.data.formSubmissionDetailsByFormlistID
    );
  }
  async FormSubmissionDetailsByFormsubmissionlistID(
    formsubmissionlistID: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelFormSubmissionDetailFilterInput,
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
            formlistID
            formsubmissionlistID
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
    filter?: ModelAuthoredFormDetailFilterInput,
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
    filter?: ModelAuthoredFormDetailFilterInput,
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
    filter?: ModelAuthoredFormDetailFilterInput,
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
    filter?: ModelFormSubmissionListFilterInput,
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
    filter?: ModelFormSubmissionListFilterInput,
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
    filter?: ModelFormListFilterInput,
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
    filter?: ModelFormListFilterInput,
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
    filter?: ModelFormDetailFilterInput,
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
    filter?: ModelFormDetailFilterInput,
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
    filter?: ModelFormDetailFilterInput,
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
  OnCreateAuthoredRoundPlanDetailListener(
    filter?: ModelSubscriptionAuthoredRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateAuthoredRoundPlanDetail">
    >
  > {
    const statement = `subscription OnCreateAuthoredRoundPlanDetail($filter: ModelSubscriptionAuthoredRoundPlanDetailFilterInput) {
        onCreateAuthoredRoundPlanDetail(filter: $filter) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onCreateAuthoredRoundPlanDetail">
      >
    >;
  }

  OnUpdateAuthoredRoundPlanDetailListener(
    filter?: ModelSubscriptionAuthoredRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateAuthoredRoundPlanDetail">
    >
  > {
    const statement = `subscription OnUpdateAuthoredRoundPlanDetail($filter: ModelSubscriptionAuthoredRoundPlanDetailFilterInput) {
        onUpdateAuthoredRoundPlanDetail(filter: $filter) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onUpdateAuthoredRoundPlanDetail">
      >
    >;
  }

  OnDeleteAuthoredRoundPlanDetailListener(
    filter?: ModelSubscriptionAuthoredRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteAuthoredRoundPlanDetail">
    >
  > {
    const statement = `subscription OnDeleteAuthoredRoundPlanDetail($filter: ModelSubscriptionAuthoredRoundPlanDetailFilterInput) {
        onDeleteAuthoredRoundPlanDetail(filter: $filter) {
          __typename
          id
          formStatus
          ver
          page
          counter
          roundPlanDetailPublishStatus
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onDeleteAuthoredRoundPlanDetail">
      >
    >;
  }

  OnCreateRoundPlanDetailListener(
    filter?: ModelSubscriptionRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateRoundPlanDetail">
    >
  > {
    const statement = `subscription OnCreateRoundPlanDetail($filter: ModelSubscriptionRoundPlanDetailFilterInput) {
        onCreateRoundPlanDetail(filter: $filter) {
          __typename
          id
          formData
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onCreateRoundPlanDetail">
      >
    >;
  }

  OnUpdateRoundPlanDetailListener(
    filter?: ModelSubscriptionRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateRoundPlanDetail">
    >
  > {
    const statement = `subscription OnUpdateRoundPlanDetail($filter: ModelSubscriptionRoundPlanDetailFilterInput) {
        onUpdateRoundPlanDetail(filter: $filter) {
          __typename
          id
          formData
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onUpdateRoundPlanDetail">
      >
    >;
  }

  OnDeleteRoundPlanDetailListener(
    filter?: ModelSubscriptionRoundPlanDetailFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteRoundPlanDetail">
    >
  > {
    const statement = `subscription OnDeleteRoundPlanDetail($filter: ModelSubscriptionRoundPlanDetailFilterInput) {
        onDeleteRoundPlanDetail(filter: $filter) {
          __typename
          id
          formData
          roundplanslistID
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
        Pick<__SubscriptionContainer, "onDeleteRoundPlanDetail">
      >
    >;
  }

  OnCreateRoundPlansListListener(
    filter?: ModelSubscriptionRoundPlansListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateRoundPlansList">
    >
  > {
    const statement = `subscription OnCreateRoundPlansList($filter: ModelSubscriptionRoundPlansListFilterInput) {
        onCreateRoundPlansList(filter: $filter) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onCreateRoundPlansList">
      >
    >;
  }

  OnUpdateRoundPlansListListener(
    filter?: ModelSubscriptionRoundPlansListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateRoundPlansList">
    >
  > {
    const statement = `subscription OnUpdateRoundPlansList($filter: ModelSubscriptionRoundPlansListFilterInput) {
        onUpdateRoundPlansList(filter: $filter) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateRoundPlansList">
      >
    >;
  }

  OnDeleteRoundPlansListListener(
    filter?: ModelSubscriptionRoundPlansListFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteRoundPlansList">
    >
  > {
    const statement = `subscription OnDeleteRoundPlansList($filter: ModelSubscriptionRoundPlansListFilterInput) {
        onDeleteRoundPlansList(filter: $filter) {
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
          roundPlansListRoundPlanDetails {
            __typename
            nextToken
            startedAt
          }
          roundPlansListAuthoredRoundPlanDetails {
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
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onDeleteRoundPlansList">
      >
    >;
  }

  OnCreateResponseSetListener(
    filter?: ModelSubscriptionResponseSetFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateResponseSet">>
  > {
    const statement = `subscription OnCreateResponseSet($filter: ModelSubscriptionResponseSetFilterInput) {
        onCreateResponseSet(filter: $filter) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateResponseSet">>
    >;
  }

  OnUpdateResponseSetListener(
    filter?: ModelSubscriptionResponseSetFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateResponseSet">>
  > {
    const statement = `subscription OnUpdateResponseSet($filter: ModelSubscriptionResponseSetFilterInput) {
        onUpdateResponseSet(filter: $filter) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateResponseSet">>
    >;
  }

  OnDeleteResponseSetListener(
    filter?: ModelSubscriptionResponseSetFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteResponseSet">>
  > {
    const statement = `subscription OnDeleteResponseSet($filter: ModelSubscriptionResponseSetFilterInput) {
        onDeleteResponseSet(filter: $filter) {
          __typename
          id
          type
          name
          description
          isMultiColumn
          values
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteResponseSet">>
    >;
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
          formlistID
          formsubmissionlistID
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
          formlistID
          formsubmissionlistID
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
          formlistID
          formsubmissionlistID
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
          formListFormSubmissionDetail {
            __typename
            nextToken
            startedAt
          }
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
