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
  onCreateFormInspection: OnCreateFormInspectionSubscription;
  onUpdateFormInspection: OnUpdateFormInspectionSubscription;
  onDeleteFormInspection: OnDeleteFormInspectionSubscription;
  onCreateFormList: OnCreateFormListSubscription;
  onUpdateFormList: OnUpdateFormListSubscription;
  onDeleteFormList: OnDeleteFormListSubscription;
  onCreateFormsMetaData: OnCreateFormsMetaDataSubscription;
  onUpdateFormsMetaData: OnUpdateFormsMetaDataSubscription;
  onDeleteFormsMetaData: OnDeleteFormsMetaDataSubscription;
  onCreateFormsJSON: OnCreateFormsJSONSubscription;
  onUpdateFormsJSON: OnUpdateFormsJSONSubscription;
  onDeleteFormsJSON: OnDeleteFormsJSONSubscription;
};

export type CreateFormDetailInput = {
  id?: string | null;
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  _version?: number | null;
};

export type ModelFormDetailConditionInput = {
  version?: ModelStringInput | null;
  FORMS?: ModelStringInput | null;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: FormList | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type FormList = {
  __typename: "FormList";
  id: string;
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: ModelAuthoredFormDetailConnection | null;
  FormDetails?: ModelFormDetailConnection | null;
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

export type AuthoredFormDetail = {
  __typename: "AuthoredFormDetail";
  id: string;
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: ModelFormInspectionConnection | null;
  FormList?: FormList | null;
  formlistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelFormInspectionConnection = {
  __typename: "ModelFormInspectionConnection";
  items: Array<FormInspection | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormInspection = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: AuthoredFormDetail | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelFormDetailConnection = {
  __typename: "ModelFormDetailConnection";
  items: Array<FormDetail | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type UpdateFormDetailInput = {
  id: string;
  version?: string | null;
  FORMS?: string | null;
  formlistID?: string | null;
  _version?: number | null;
};

export type DeleteFormDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateAuthoredFormDetailInput = {
  id?: string | null;
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  _version?: number | null;
};

export type ModelAuthoredFormDetailConditionInput = {
  version?: ModelStringInput | null;
  FORMS?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  or?: Array<ModelAuthoredFormDetailConditionInput | null> | null;
  not?: ModelAuthoredFormDetailConditionInput | null;
};

export type UpdateAuthoredFormDetailInput = {
  id: string;
  version?: string | null;
  FORMS?: string | null;
  formlistID?: string | null;
  _version?: number | null;
};

export type DeleteAuthoredFormDetailInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormInspectionInput = {
  id?: string | null;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredformdetailID: string;
  _version?: number | null;
};

export type ModelFormInspectionConditionInput = {
  formData?: ModelStringInput | null;
  status?: ModelStringInput | null;
  SubmittedDate?: ModelStringInput | null;
  SubmittedTime?: ModelStringInput | null;
  authoredformdetailID?: ModelIDInput | null;
  and?: Array<ModelFormInspectionConditionInput | null> | null;
  or?: Array<ModelFormInspectionConditionInput | null> | null;
  not?: ModelFormInspectionConditionInput | null;
};

export type UpdateFormInspectionInput = {
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredformdetailID?: string | null;
  _version?: number | null;
};

export type DeleteFormInspectionInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormListInput = {
  id?: string | null;
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  _version?: number | null;
};

export type ModelFormListConditionInput = {
  Title?: ModelStringInput | null;
  Description?: ModelStringInput | null;
  Image?: ModelStringInput | null;
  Owner?: ModelStringInput | null;
  PublishedDate?: ModelStringInput | null;
  Status?: ModelStringInput | null;
  updatedBy?: ModelStringInput | null;
  and?: Array<ModelFormListConditionInput | null> | null;
  or?: Array<ModelFormListConditionInput | null> | null;
  not?: ModelFormListConditionInput | null;
};

export type UpdateFormListInput = {
  id: string;
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  _version?: number | null;
};

export type DeleteFormListInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormsMetaDataInput = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  _version?: number | null;
};

export enum FormStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export type ModelFormsMetaDataConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  isArchived?: ModelBooleanInput | null;
  tags?: ModelStringInput | null;
  formStatus?: ModelFormStatusEnumInput | null;
  createdBy?: ModelStringInput | null;
  updatedBy?: ModelStringInput | null;
  and?: Array<ModelFormsMetaDataConditionInput | null> | null;
  or?: Array<ModelFormsMetaDataConditionInput | null> | null;
  not?: ModelFormsMetaDataConditionInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelFormStatusEnumInput = {
  eq?: FormStatusEnum | null;
  ne?: FormStatusEnum | null;
};

export type FormsMetaData = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormsMetaDataInput = {
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  _version?: number | null;
};

export type DeleteFormsMetaDataInput = {
  id: string;
  _version?: number | null;
};

export type CreateFormsJSONInput = {
  id?: string | null;
  pages?: Array<string> | null;
  formId?: string | null;
  _version?: number | null;
};

export type ModelFormsJSONConditionInput = {
  pages?: ModelStringInput | null;
  formId?: ModelStringInput | null;
  and?: Array<ModelFormsJSONConditionInput | null> | null;
  or?: Array<ModelFormsJSONConditionInput | null> | null;
  not?: ModelFormsJSONConditionInput | null;
};

export type FormsJSON = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormsJSONInput = {
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  _version?: number | null;
};

export type DeleteFormsJSONInput = {
  id: string;
  _version?: number | null;
};

export type ModelFormDetailFilterInput = {
  id?: ModelIDInput | null;
  version?: ModelStringInput | null;
  FORMS?: ModelStringInput | null;
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
  version?: ModelStringInput | null;
  FORMS?: ModelStringInput | null;
  formlistID?: ModelIDInput | null;
  and?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelAuthoredFormDetailFilterInput | null> | null;
  not?: ModelAuthoredFormDetailFilterInput | null;
};

export type ModelFormInspectionFilterInput = {
  id?: ModelIDInput | null;
  formData?: ModelStringInput | null;
  status?: ModelStringInput | null;
  SubmittedDate?: ModelStringInput | null;
  SubmittedTime?: ModelStringInput | null;
  authoredformdetailID?: ModelIDInput | null;
  and?: Array<ModelFormInspectionFilterInput | null> | null;
  or?: Array<ModelFormInspectionFilterInput | null> | null;
  not?: ModelFormInspectionFilterInput | null;
};

export type ModelFormListFilterInput = {
  id?: ModelIDInput | null;
  Title?: ModelStringInput | null;
  Description?: ModelStringInput | null;
  Image?: ModelStringInput | null;
  Owner?: ModelStringInput | null;
  PublishedDate?: ModelStringInput | null;
  Status?: ModelStringInput | null;
  updatedBy?: ModelStringInput | null;
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

export type ModelFormsMetaDataFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  formLogo?: ModelStringInput | null;
  isPublic?: ModelBooleanInput | null;
  isArchived?: ModelBooleanInput | null;
  tags?: ModelStringInput | null;
  formStatus?: ModelFormStatusEnumInput | null;
  createdBy?: ModelStringInput | null;
  updatedBy?: ModelStringInput | null;
  and?: Array<ModelFormsMetaDataFilterInput | null> | null;
  or?: Array<ModelFormsMetaDataFilterInput | null> | null;
  not?: ModelFormsMetaDataFilterInput | null;
};

export type ModelFormsMetaDataConnection = {
  __typename: "ModelFormsMetaDataConnection";
  items: Array<FormsMetaData | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelFormsJSONFilterInput = {
  id?: ModelIDInput | null;
  pages?: ModelStringInput | null;
  formId?: ModelStringInput | null;
  and?: Array<ModelFormsJSONFilterInput | null> | null;
  or?: Array<ModelFormsJSONFilterInput | null> | null;
  not?: ModelFormsJSONFilterInput | null;
};

export type ModelFormsJSONConnection = {
  __typename: "ModelFormsJSONConnection";
  items: Array<FormsJSON | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelSubscriptionFormDetailFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  version?: ModelSubscriptionStringInput | null;
  FORMS?: ModelSubscriptionStringInput | null;
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
  version?: ModelSubscriptionStringInput | null;
  FORMS?: ModelSubscriptionStringInput | null;
  formlistID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
  or?: Array<ModelSubscriptionAuthoredFormDetailFilterInput | null> | null;
};

export type ModelSubscriptionFormInspectionFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  formData?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  SubmittedDate?: ModelSubscriptionStringInput | null;
  SubmittedTime?: ModelSubscriptionStringInput | null;
  authoredformdetailID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionFormInspectionFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormInspectionFilterInput | null> | null;
};

export type ModelSubscriptionFormListFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  Title?: ModelSubscriptionStringInput | null;
  Description?: ModelSubscriptionStringInput | null;
  Image?: ModelSubscriptionStringInput | null;
  Owner?: ModelSubscriptionStringInput | null;
  PublishedDate?: ModelSubscriptionStringInput | null;
  Status?: ModelSubscriptionStringInput | null;
  updatedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormListFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormListFilterInput | null> | null;
};

export type ModelSubscriptionFormsMetaDataFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  formLogo?: ModelSubscriptionStringInput | null;
  isPublic?: ModelSubscriptionBooleanInput | null;
  isArchived?: ModelSubscriptionBooleanInput | null;
  tags?: ModelSubscriptionStringInput | null;
  formStatus?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  updatedBy?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormsMetaDataFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormsMetaDataFilterInput | null> | null;
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
};

export type ModelSubscriptionFormsJSONFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  pages?: ModelSubscriptionStringInput | null;
  formId?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFormsJSONFilterInput | null> | null;
  or?: Array<ModelSubscriptionFormsJSONFilterInput | null> | null;
};

export type CreateFormDetailMutation = {
  __typename: "FormDetail";
  id: string;
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateAuthoredFormDetailMutation = {
  __typename: "AuthoredFormDetail";
  id: string;
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
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
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
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
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  formlistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormInspectionMutation = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormInspectionMutation = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormInspectionMutation = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormListMutation = {
  __typename: "FormList";
  id: string;
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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

export type CreateFormsMetaDataMutation = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormsMetaDataMutation = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormsMetaDataMutation = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateFormsJSONMutation = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateFormsJSONMutation = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteFormsJSONMutation = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type GetFormDetailQuery = {
  __typename: "FormDetail";
  id: string;
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
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
    version?: string | null;
    FORMS?: string | null;
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
    version?: string | null;
    FORMS?: string | null;
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
    version?: string | null;
    FORMS?: string | null;
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
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
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
    version?: string | null;
    FORMS?: string | null;
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
    version?: string | null;
    FORMS?: string | null;
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
    version?: string | null;
    FORMS?: string | null;
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

export type GetFormInspectionQuery = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormInspectionsQuery = {
  __typename: "ModelFormInspectionConnection";
  items: Array<{
    __typename: "FormInspection";
    id: string;
    formData?: string | null;
    status?: string | null;
    SubmittedDate?: string | null;
    SubmittedTime?: string | null;
    authoredformdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormInspectionsQuery = {
  __typename: "ModelFormInspectionConnection";
  items: Array<{
    __typename: "FormInspection";
    id: string;
    formData?: string | null;
    status?: string | null;
    SubmittedDate?: string | null;
    SubmittedTime?: string | null;
    authoredformdetailID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type FormInspectionsByAuthoredformdetailIDQuery = {
  __typename: "ModelFormInspectionConnection";
  items: Array<{
    __typename: "FormInspection";
    id: string;
    formData?: string | null;
    status?: string | null;
    SubmittedDate?: string | null;
    SubmittedTime?: string | null;
    authoredformdetailID: string;
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
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
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
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormsMetaDataQuery = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormsMetaDataQuery = {
  __typename: "ModelFormsMetaDataConnection";
  items: Array<{
    __typename: "FormsMetaData";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    isArchived?: boolean | null;
    tags?: Array<string | null> | null;
    formStatus?: FormStatusEnum | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormsMetaDataQuery = {
  __typename: "ModelFormsMetaDataConnection";
  items: Array<{
    __typename: "FormsMetaData";
    id: string;
    name?: string | null;
    description?: string | null;
    formLogo?: string | null;
    isPublic?: boolean | null;
    isArchived?: boolean | null;
    tags?: Array<string | null> | null;
    formStatus?: FormStatusEnum | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetFormsJSONQuery = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListFormsJSONSQuery = {
  __typename: "ModelFormsJSONConnection";
  items: Array<{
    __typename: "FormsJSON";
    id: string;
    pages?: Array<string> | null;
    formId?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncFormsJSONSQuery = {
  __typename: "ModelFormsJSONConnection";
  items: Array<{
    __typename: "FormsJSON";
    id: string;
    pages?: Array<string> | null;
    formId?: string | null;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
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
  version?: string | null;
  FORMS?: string | null;
  formlistID: string;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateAuthoredFormDetailSubscription = {
  __typename: "AuthoredFormDetail";
  id: string;
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
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
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
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
  version?: string | null;
  FORMS?: string | null;
  FormInspections?: {
    __typename: "ModelFormInspectionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormList?: {
    __typename: "FormList";
    id: string;
    Title?: string | null;
    Description?: string | null;
    Image?: string | null;
    Owner?: string | null;
    PublishedDate?: string | null;
    Status?: string | null;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  formlistID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateFormInspectionSubscription = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormInspectionSubscription = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormInspectionSubscription = {
  __typename: "FormInspection";
  id: string;
  formData?: string | null;
  status?: string | null;
  SubmittedDate?: string | null;
  SubmittedTime?: string | null;
  authoredForm?: {
    __typename: "AuthoredFormDetail";
    id: string;
    version?: string | null;
    FORMS?: string | null;
    formlistID: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
  authoredformdetailID: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateFormListSubscription = {
  __typename: "FormList";
  id: string;
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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
  Title?: string | null;
  Description?: string | null;
  Image?: string | null;
  Owner?: string | null;
  PublishedDate?: string | null;
  Status?: string | null;
  updatedBy?: string | null;
  authoredFormDetails?: {
    __typename: "ModelAuthoredFormDetailConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  FormDetails?: {
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

export type OnCreateFormsMetaDataSubscription = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormsMetaDataSubscription = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormsMetaDataSubscription = {
  __typename: "FormsMetaData";
  id: string;
  name?: string | null;
  description?: string | null;
  formLogo?: string | null;
  isPublic?: boolean | null;
  isArchived?: boolean | null;
  tags?: Array<string | null> | null;
  formStatus?: FormStatusEnum | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateFormsJSONSubscription = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateFormsJSONSubscription = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteFormsJSONSubscription = {
  __typename: "FormsJSON";
  id: string;
  pages?: Array<string> | null;
  formId?: string | null;
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
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
    condition?: ModelFormDetailConditionInput
  ): Promise<UpdateFormDetailMutation> {
    const statement = `mutation UpdateFormDetail($input: UpdateFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        updateFormDetail(input: $input, condition: $condition) {
          __typename
          id
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
    condition?: ModelFormDetailConditionInput
  ): Promise<DeleteFormDetailMutation> {
    const statement = `mutation DeleteFormDetail($input: DeleteFormDetailInput!, $condition: ModelFormDetailConditionInput) {
        deleteFormDetail(input: $input, condition: $condition) {
          __typename
          id
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
  async CreateAuthoredFormDetail(
    input: CreateAuthoredFormDetailInput,
    condition?: ModelAuthoredFormDetailConditionInput
  ): Promise<CreateAuthoredFormDetailMutation> {
    const statement = `mutation CreateAuthoredFormDetail($input: CreateAuthoredFormDetailInput!, $condition: ModelAuthoredFormDetailConditionInput) {
        createAuthoredFormDetail(input: $input, condition: $condition) {
          __typename
          id
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
  async CreateFormInspection(
    input: CreateFormInspectionInput,
    condition?: ModelFormInspectionConditionInput
  ): Promise<CreateFormInspectionMutation> {
    const statement = `mutation CreateFormInspection($input: CreateFormInspectionInput!, $condition: ModelFormInspectionConditionInput) {
        createFormInspection(input: $input, condition: $condition) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
    return <CreateFormInspectionMutation>response.data.createFormInspection;
  }
  async UpdateFormInspection(
    input: UpdateFormInspectionInput,
    condition?: ModelFormInspectionConditionInput
  ): Promise<UpdateFormInspectionMutation> {
    const statement = `mutation UpdateFormInspection($input: UpdateFormInspectionInput!, $condition: ModelFormInspectionConditionInput) {
        updateFormInspection(input: $input, condition: $condition) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
    return <UpdateFormInspectionMutation>response.data.updateFormInspection;
  }
  async DeleteFormInspection(
    input: DeleteFormInspectionInput,
    condition?: ModelFormInspectionConditionInput
  ): Promise<DeleteFormInspectionMutation> {
    const statement = `mutation DeleteFormInspection($input: DeleteFormInspectionInput!, $condition: ModelFormInspectionConditionInput) {
        deleteFormInspection(input: $input, condition: $condition) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
    return <DeleteFormInspectionMutation>response.data.deleteFormInspection;
  }
  async CreateFormList(
    input: CreateFormListInput,
    condition?: ModelFormListConditionInput
  ): Promise<CreateFormListMutation> {
    const statement = `mutation CreateFormList($input: CreateFormListInput!, $condition: ModelFormListConditionInput) {
        createFormList(input: $input, condition: $condition) {
          __typename
          id
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
  async CreateFormsMetaData(
    input: CreateFormsMetaDataInput,
    condition?: ModelFormsMetaDataConditionInput
  ): Promise<CreateFormsMetaDataMutation> {
    const statement = `mutation CreateFormsMetaData($input: CreateFormsMetaDataInput!, $condition: ModelFormsMetaDataConditionInput) {
        createFormsMetaData(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
    return <CreateFormsMetaDataMutation>response.data.createFormsMetaData;
  }
  async UpdateFormsMetaData(
    input: UpdateFormsMetaDataInput,
    condition?: ModelFormsMetaDataConditionInput
  ): Promise<UpdateFormsMetaDataMutation> {
    const statement = `mutation UpdateFormsMetaData($input: UpdateFormsMetaDataInput!, $condition: ModelFormsMetaDataConditionInput) {
        updateFormsMetaData(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
    return <UpdateFormsMetaDataMutation>response.data.updateFormsMetaData;
  }
  async DeleteFormsMetaData(
    input: DeleteFormsMetaDataInput,
    condition?: ModelFormsMetaDataConditionInput
  ): Promise<DeleteFormsMetaDataMutation> {
    const statement = `mutation DeleteFormsMetaData($input: DeleteFormsMetaDataInput!, $condition: ModelFormsMetaDataConditionInput) {
        deleteFormsMetaData(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
    return <DeleteFormsMetaDataMutation>response.data.deleteFormsMetaData;
  }
  async CreateFormsJSON(
    input: CreateFormsJSONInput,
    condition?: ModelFormsJSONConditionInput
  ): Promise<CreateFormsJSONMutation> {
    const statement = `mutation CreateFormsJSON($input: CreateFormsJSONInput!, $condition: ModelFormsJSONConditionInput) {
        createFormsJSON(input: $input, condition: $condition) {
          __typename
          id
          pages
          formId
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
    return <CreateFormsJSONMutation>response.data.createFormsJSON;
  }
  async UpdateFormsJSON(
    input: UpdateFormsJSONInput,
    condition?: ModelFormsJSONConditionInput
  ): Promise<UpdateFormsJSONMutation> {
    const statement = `mutation UpdateFormsJSON($input: UpdateFormsJSONInput!, $condition: ModelFormsJSONConditionInput) {
        updateFormsJSON(input: $input, condition: $condition) {
          __typename
          id
          pages
          formId
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
    return <UpdateFormsJSONMutation>response.data.updateFormsJSON;
  }
  async DeleteFormsJSON(
    input: DeleteFormsJSONInput,
    condition?: ModelFormsJSONConditionInput
  ): Promise<DeleteFormsJSONMutation> {
    const statement = `mutation DeleteFormsJSON($input: DeleteFormsJSONInput!, $condition: ModelFormsJSONConditionInput) {
        deleteFormsJSON(input: $input, condition: $condition) {
          __typename
          id
          pages
          formId
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
    return <DeleteFormsJSONMutation>response.data.deleteFormsJSON;
  }
  async GetFormDetail(id: string): Promise<GetFormDetailQuery> {
    const statement = `query GetFormDetail($id: ID!) {
        getFormDetail(id: $id) {
          __typename
          id
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
            version
            FORMS
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
            version
            FORMS
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
            version
            FORMS
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
            version
            FORMS
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
            version
            FORMS
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
            version
            FORMS
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
  async GetFormInspection(id: string): Promise<GetFormInspectionQuery> {
    const statement = `query GetFormInspection($id: ID!) {
        getFormInspection(id: $id) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
    return <GetFormInspectionQuery>response.data.getFormInspection;
  }
  async ListFormInspections(
    filter?: ModelFormInspectionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormInspectionsQuery> {
    const statement = `query ListFormInspections($filter: ModelFormInspectionFilterInput, $limit: Int, $nextToken: String) {
        listFormInspections(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            status
            SubmittedDate
            SubmittedTime
            authoredformdetailID
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
    return <ListFormInspectionsQuery>response.data.listFormInspections;
  }
  async SyncFormInspections(
    filter?: ModelFormInspectionFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormInspectionsQuery> {
    const statement = `query SyncFormInspections($filter: ModelFormInspectionFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormInspections(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            formData
            status
            SubmittedDate
            SubmittedTime
            authoredformdetailID
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
    return <SyncFormInspectionsQuery>response.data.syncFormInspections;
  }
  async FormInspectionsByAuthoredformdetailID(
    authoredformdetailID: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelFormInspectionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<FormInspectionsByAuthoredformdetailIDQuery> {
    const statement = `query FormInspectionsByAuthoredformdetailID($authoredformdetailID: ID!, $sortDirection: ModelSortDirection, $filter: ModelFormInspectionFilterInput, $limit: Int, $nextToken: String) {
        formInspectionsByAuthoredformdetailID(authoredformdetailID: $authoredformdetailID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            formData
            status
            SubmittedDate
            SubmittedTime
            authoredformdetailID
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
      authoredformdetailID
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
    return <FormInspectionsByAuthoredformdetailIDQuery>(
      response.data.formInspectionsByAuthoredformdetailID
    );
  }
  async GetFormList(id: string): Promise<GetFormListQuery> {
    const statement = `query GetFormList($id: ID!) {
        getFormList(id: $id) {
          __typename
          id
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
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
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
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
  async GetFormsMetaData(id: string): Promise<GetFormsMetaDataQuery> {
    const statement = `query GetFormsMetaData($id: ID!) {
        getFormsMetaData(id: $id) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
    return <GetFormsMetaDataQuery>response.data.getFormsMetaData;
  }
  async ListFormsMetaData(
    filter?: ModelFormsMetaDataFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormsMetaDataQuery> {
    const statement = `query ListFormsMetaData($filter: ModelFormsMetaDataFilterInput, $limit: Int, $nextToken: String) {
        listFormsMetaData(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            isArchived
            tags
            formStatus
            createdBy
            updatedBy
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
    return <ListFormsMetaDataQuery>response.data.listFormsMetaData;
  }
  async SyncFormsMetaData(
    filter?: ModelFormsMetaDataFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormsMetaDataQuery> {
    const statement = `query SyncFormsMetaData($filter: ModelFormsMetaDataFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormsMetaData(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            description
            formLogo
            isPublic
            isArchived
            tags
            formStatus
            createdBy
            updatedBy
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
    return <SyncFormsMetaDataQuery>response.data.syncFormsMetaData;
  }
  async GetFormsJSON(id: string): Promise<GetFormsJSONQuery> {
    const statement = `query GetFormsJSON($id: ID!) {
        getFormsJSON(id: $id) {
          __typename
          id
          pages
          formId
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
    return <GetFormsJSONQuery>response.data.getFormsJSON;
  }
  async ListFormsJSONS(
    filter?: ModelFormsJSONFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListFormsJSONSQuery> {
    const statement = `query ListFormsJSONS($filter: ModelFormsJSONFilterInput, $limit: Int, $nextToken: String) {
        listFormsJSONS(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            pages
            formId
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
    return <ListFormsJSONSQuery>response.data.listFormsJSONS;
  }
  async SyncFormsJSONS(
    filter?: ModelFormsJSONFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncFormsJSONSQuery> {
    const statement = `query SyncFormsJSONS($filter: ModelFormsJSONFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncFormsJSONS(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            pages
            formId
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
    return <SyncFormsJSONSQuery>response.data.syncFormsJSONS;
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
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
          version
          FORMS
          formlistID
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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
          version
          FORMS
          FormInspections {
            __typename
            nextToken
            startedAt
          }
          FormList {
            __typename
            id
            Title
            Description
            Image
            Owner
            PublishedDate
            Status
            updatedBy
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
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

  OnCreateFormInspectionListener(
    filter?: ModelSubscriptionFormInspectionFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateFormInspection">
    >
  > {
    const statement = `subscription OnCreateFormInspection($filter: ModelSubscriptionFormInspectionFilterInput) {
        onCreateFormInspection(filter: $filter) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
        Pick<__SubscriptionContainer, "onCreateFormInspection">
      >
    >;
  }

  OnUpdateFormInspectionListener(
    filter?: ModelSubscriptionFormInspectionFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateFormInspection">
    >
  > {
    const statement = `subscription OnUpdateFormInspection($filter: ModelSubscriptionFormInspectionFilterInput) {
        onUpdateFormInspection(filter: $filter) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
        Pick<__SubscriptionContainer, "onUpdateFormInspection">
      >
    >;
  }

  OnDeleteFormInspectionListener(
    filter?: ModelSubscriptionFormInspectionFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteFormInspection">
    >
  > {
    const statement = `subscription OnDeleteFormInspection($filter: ModelSubscriptionFormInspectionFilterInput) {
        onDeleteFormInspection(filter: $filter) {
          __typename
          id
          formData
          status
          SubmittedDate
          SubmittedTime
          authoredForm {
            __typename
            id
            version
            FORMS
            formlistID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          authoredformdetailID
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
        Pick<__SubscriptionContainer, "onDeleteFormInspection">
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
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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
          Title
          Description
          Image
          Owner
          PublishedDate
          Status
          updatedBy
          authoredFormDetails {
            __typename
            nextToken
            startedAt
          }
          FormDetails {
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

  OnCreateFormsMetaDataListener(
    filter?: ModelSubscriptionFormsMetaDataFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormsMetaData">>
  > {
    const statement = `subscription OnCreateFormsMetaData($filter: ModelSubscriptionFormsMetaDataFilterInput) {
        onCreateFormsMetaData(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
        Pick<__SubscriptionContainer, "onCreateFormsMetaData">
      >
    >;
  }

  OnUpdateFormsMetaDataListener(
    filter?: ModelSubscriptionFormsMetaDataFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormsMetaData">>
  > {
    const statement = `subscription OnUpdateFormsMetaData($filter: ModelSubscriptionFormsMetaDataFilterInput) {
        onUpdateFormsMetaData(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
        Pick<__SubscriptionContainer, "onUpdateFormsMetaData">
      >
    >;
  }

  OnDeleteFormsMetaDataListener(
    filter?: ModelSubscriptionFormsMetaDataFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormsMetaData">>
  > {
    const statement = `subscription OnDeleteFormsMetaData($filter: ModelSubscriptionFormsMetaDataFilterInput) {
        onDeleteFormsMetaData(filter: $filter) {
          __typename
          id
          name
          description
          formLogo
          isPublic
          isArchived
          tags
          formStatus
          createdBy
          updatedBy
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
        Pick<__SubscriptionContainer, "onDeleteFormsMetaData">
      >
    >;
  }

  OnCreateFormsJSONListener(
    filter?: ModelSubscriptionFormsJSONFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormsJSON">>
  > {
    const statement = `subscription OnCreateFormsJSON($filter: ModelSubscriptionFormsJSONFilterInput) {
        onCreateFormsJSON(filter: $filter) {
          __typename
          id
          pages
          formId
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFormsJSON">>
    >;
  }

  OnUpdateFormsJSONListener(
    filter?: ModelSubscriptionFormsJSONFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormsJSON">>
  > {
    const statement = `subscription OnUpdateFormsJSON($filter: ModelSubscriptionFormsJSONFilterInput) {
        onUpdateFormsJSON(filter: $filter) {
          __typename
          id
          pages
          formId
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFormsJSON">>
    >;
  }

  OnDeleteFormsJSONListener(
    filter?: ModelSubscriptionFormsJSONFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormsJSON">>
  > {
    const statement = `subscription OnDeleteFormsJSON($filter: ModelSubscriptionFormsJSONFilterInput) {
        onDeleteFormsJSON(filter: $filter) {
          __typename
          id
          pages
          formId
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFormsJSON">>
    >;
  }
}
