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
  onCreateFormDetail: OnCreateFormDetailSubscription;
  onUpdateFormDetail: OnUpdateFormDetailSubscription;
  onDeleteFormDetail: OnDeleteFormDetailSubscription;
  onCreateAuthoredFormDetail: OnCreateAuthoredFormDetailSubscription;
  onUpdateAuthoredFormDetail: OnUpdateAuthoredFormDetailSubscription;
  onDeleteAuthoredFormDetail: OnDeleteAuthoredFormDetailSubscription;
  onCreateFormSubmissionDetail: OnCreateFormSubmissionDetailSubscription;
  onUpdateFormSubmissionDetail: OnUpdateFormSubmissionDetailSubscription;
  onDeleteFormSubmissionDetail: OnDeleteFormSubmissionDetailSubscription;
  onCreateFormSubmissionList: OnCreateFormSubmissionListSubscription;
  onUpdateFormSubmissionList: OnUpdateFormSubmissionListSubscription;
  onDeleteFormSubmissionList: OnDeleteFormSubmissionListSubscription;
  onCreateFormList: OnCreateFormListSubscription;
  onUpdateFormList: OnUpdateFormListSubscription;
  onDeleteFormList: OnDeleteFormListSubscription;
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

export type CreateAuthoredFormDetailInput = {
  id?: string | null;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
  formlistID: string;
  _version?: number | null;
};

export type ModelAuthoredFormDetailConditionInput = {
  formStatus?: ModelStringInput | null;
  version?: ModelStringInput | null;
  pages?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  or?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  not?: ModelAuthoredFormDetailConditionInput | null;
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

export type AuthoredFormDetail = {
  __typename: "AuthoredFormDetail";
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
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
  formlistID?: string | null;
  _version?: number | null;
};

export type DeleteAuthoredFormDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormSubmissionDetailInput = {
  id?: string | null;
  formData?: string | null;
  formsubmissionlistID: string;
  formlistID: string;
  _version?: number | null;
};

export type ModelFormSubmissionDetailConditionInput = {
  formData?: ModelStringInput | null;
  formsubmissionlistID?: ModelIDInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelFormSubmissionDetailConditionInput | null> | null;
  or?: Array<ModelFormSubmissionDetailConditionInput | null> | null;
  not?: ModelFormSubmissionDetailConditionInput | null;
};

export type FormSubmissionDetail = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  formlistID: string;
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
  formlistID?: string | null;
  _version?: number | null;
};

export type DeleteFormSubmissionDetailInput = {
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
  and?: Array<ModelFormSubmissionListConditionInput | null> | null;
  or?: Array<ModelFormSubmissionListConditionInput | null> | null;
  not?: ModelFormSubmissionListConditionInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
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
  _version?: number | null;
};

export type DeleteFormListInput = {
  id: string;
  _version?: number | null;
};

export type ModelFormDetailFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelFormDetailFilterInput | null> | null;
  or?: Array<ModelFormDetailFilterInput | null> | null;
  not?: ModelFormDetailFilterInput | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type ModelAuthoredFormDetailFilterInput = {
  id?: ModelIDInput | null;
  formStatus?: ModelStringInput | null;
  version?: ModelStringInput | null;
  pages?: ModelStringInput | null;
  counter?: ModelIntInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  not?: ModelAuthoredFormDetailFilterInput | null;
};

export type ModelFormSubmissionDetailFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  formsubmissionlistID?: ModelIDInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelFormSubmissionDetailFilterInput | null> | null;
  or?: Array<ModelFormSubmissionDetailFilterInput | null> | null;
  not?: ModelFormSubmissionDetailFilterInput | null;
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

export type ModelSubscriptionFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormDetailFilterInput | null> | null;
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

export type ModelSubscriptionAuthoredFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  version?: ModelSubscriptionStringInput | null;
  pages?: ModelSubscriptionStringInput | null;
  counter?: ModelSubscriptionIntInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
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

export type ModelSubscriptionFormSubmissionDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  formsubmissionlistID?: ModelSubscriptionIDInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionFormSubmissionDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormSubmissionDetailFilterInput | null> | null;
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
  and?: Array<ModelSubscriptionFormSubmissionListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormSubmissionListFilterInput | null> | null;
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
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
  and?: Array<ModelSubscriptionFormListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormListFilterInput | null> | null;
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

export type CreateAuthoredFormDetailMutation = {
  __typename: "AuthoredFormDetail";
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
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
  formlistID: string;
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
  formlistID: string;
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
  formlistID: string;
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

export type GetAuthoredFormDetailQuery = {
  __typename: "AuthoredFormDetail";
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
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

export type GetFormSubmissionDetailQuery = {
  __typename: "FormSubmissionDetail";
  id: string;
  formData?: string | null;
  formsubmissionlistID: string;
  formlistID: string;
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

export type SyncFormSubmissionDetailsQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
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

export type FormSubmissionDetailsByFormsubmissionlistIDQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
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

export type FormSubmissionDetailsByFormlistIDQuery = {
  __typename: "ModelFormSubmissionDetailConnection";
  items: Array<{
    __typename: "FormSubmissionDetail";
    id: string;
    formData?: string | null;
    formsubmissionlistID: string;
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
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
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

export type OnCreateAuthoredFormDetailSubscription = {
  __typename: "AuthoredFormDetail";
  id: string;
  formStatus?: string | null;
  version?: string | null;
  pages?: string | null;
  counter?: number | null;
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
  formlistID: string;
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
  formsubmissionlistID: string;
  formlistID: string;
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
  formlistID: string;
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

@Injectable({
  providedIn: "root"
})
export class APIService {
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
  async CreateFormSubmissionDetail(
    input: CreateFormSubmissionDetailInput,
    condition?: ModelFormSubmissionDetailConditionInput
  ): Promise<CreateFormSubmissionDetailMutation> {
    const statement = `mutation CreateFormSubmissionDetail($input: CreateFormSubmissionDetailInput!, $condition: ModelFormSubmissionDetailConditionInput) {
        createFormSubmissionDetail(input: $input, condition: $condition) {
          __typename
          id
          formData
          formsubmissionlistID
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
          formsubmissionlistID
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
          formsubmissionlistID
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
    return <DeleteFormSubmissionDetailMutation>(
      response.data.deleteFormSubmissionDetail
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
  async GetAuthoredFormDetail(id: string): Promise<GetAuthoredFormDetailQuery> {
    const statement = `query GetAuthoredFormDetail($id: ID!) {
        getAuthoredFormDetail(id: $id) {
          __typename
          id
          formStatus
          version
          pages
          counter
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
  async GetFormSubmissionDetail(
    id: string
  ): Promise<GetFormSubmissionDetailQuery> {
    const statement = `query GetFormSubmissionDetail($id: ID!) {
        getFormSubmissionDetail(id: $id) {
          __typename
          id
          formData
          formsubmissionlistID
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
            formsubmissionlistID
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
            formsubmissionlistID
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
    return <SyncFormSubmissionDetailsQuery>(
      response.data.syncFormSubmissionDetails
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
            formsubmissionlistID
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
            formsubmissionlistID
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
    return <FormSubmissionDetailsByFormlistIDQuery>(
      response.data.formSubmissionDetailsByFormlistID
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
        Pick<__SubscriptionContainer, "onDeleteFormSubmissionDetail">
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
}
