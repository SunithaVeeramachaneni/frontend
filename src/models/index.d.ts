import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum FormStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}



type EagerFormSubmissionDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formSubmissionDetailId?: FormSubmissions | null;
  readonly formsubmissionsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly formSubmissionsFormSubmissionDetailsId?: string | null;
}

type LazyFormSubmissionDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formSubmissionDetailId: AsyncItem<FormSubmissions | undefined>;
  readonly formsubmissionsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly formSubmissionsFormSubmissionDetailsId?: string | null;
}

export declare type FormSubmissionDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormSubmissionDetail : LazyFormSubmissionDetail

export declare const FormSubmissionDetail: (new (init: ModelInit<FormSubmissionDetail>) => FormSubmissionDetail) & {
  copyOf(source: FormSubmissionDetail, mutator: (draft: MutableModel<FormSubmissionDetail>) => MutableModel<FormSubmissionDetail> | void): FormSubmissionDetail;
}

type EagerFormSubmissions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly location?: string | null;
  readonly roundType?: string | null;
  readonly status?: string | null;
  readonly assignee?: string | null;
  readonly dueDate?: string | null;
  readonly version?: string | null;
  readonly submittedBy?: string | null;
  readonly formListId?: FormList | null;
  readonly formlistID: string;
  readonly formSubmissionDetails?: (FormSubmissionDetail | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly formListFormSubmissionsId?: string | null;
}

type LazyFormSubmissions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly location?: string | null;
  readonly roundType?: string | null;
  readonly status?: string | null;
  readonly assignee?: string | null;
  readonly dueDate?: string | null;
  readonly version?: string | null;
  readonly submittedBy?: string | null;
  readonly formListId: AsyncItem<FormList | undefined>;
  readonly formlistID: string;
  readonly formSubmissionDetails: AsyncCollection<FormSubmissionDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly formListFormSubmissionsId?: string | null;
}

export declare type FormSubmissions = LazyLoading extends LazyLoadingDisabled ? EagerFormSubmissions : LazyFormSubmissions

export declare const FormSubmissions: (new (init: ModelInit<FormSubmissions>) => FormSubmissions) & {
  copyOf(source: FormSubmissions, mutator: (draft: MutableModel<FormSubmissions>) => MutableModel<FormSubmissions> | void): FormSubmissions;
}

type EagerFormList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly publishedDate?: string | null;
  readonly location?: string | null;
  readonly roundType?: string | null;
  readonly formStatus?: string | null;
  readonly assignee?: string | null;
  readonly tags?: (string | null)[] | null;
  readonly lastPublishedBy?: string | null;
  readonly author?: string | null;
  readonly formType?: string | null;
  readonly formDetails?: (FormDetail | null)[] | null;
  readonly formSubmissions?: (FormSubmissions | null)[] | null;
  readonly authoredFormDetails?: (AuthoredFormDetail | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly publishedDate?: string | null;
  readonly location?: string | null;
  readonly roundType?: string | null;
  readonly formStatus?: string | null;
  readonly assignee?: string | null;
  readonly tags?: (string | null)[] | null;
  readonly lastPublishedBy?: string | null;
  readonly author?: string | null;
  readonly formType?: string | null;
  readonly formDetails: AsyncCollection<FormDetail>;
  readonly formSubmissions: AsyncCollection<FormSubmissions>;
  readonly authoredFormDetails: AsyncCollection<AuthoredFormDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormList = LazyLoading extends LazyLoadingDisabled ? EagerFormList : LazyFormList

export declare const FormList: (new (init: ModelInit<FormList>) => FormList) & {
  copyOf(source: FormList, mutator: (draft: MutableModel<FormList>) => MutableModel<FormList> | void): FormList;
}

type EagerFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormDetail : LazyFormDetail

export declare const FormDetail: (new (init: ModelInit<FormDetail>) => FormDetail) & {
  copyOf(source: FormDetail, mutator: (draft: MutableModel<FormDetail>) => MutableModel<FormDetail> | void): FormDetail;
}

type EagerAuthoredFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredFormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version?: string | null;
  readonly formStatus?: FormStatusEnum | keyof typeof FormStatusEnum | null;
  readonly counter?: number | null;
  readonly pages?: string | null;
  readonly formListId: string;
  readonly formList?: FormList | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAuthoredFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredFormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version?: string | null;
  readonly formStatus?: FormStatusEnum | keyof typeof FormStatusEnum | null;
  readonly counter?: number | null;
  readonly pages?: string | null;
  readonly formListId: string;
  readonly formList: AsyncItem<FormList | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuthoredFormDetail = LazyLoading extends LazyLoadingDisabled ? EagerAuthoredFormDetail : LazyAuthoredFormDetail

export declare const AuthoredFormDetail: (new (init: ModelInit<AuthoredFormDetail>) => AuthoredFormDetail) & {
  copyOf(source: AuthoredFormDetail, mutator: (draft: MutableModel<AuthoredFormDetail>) => MutableModel<AuthoredFormDetail> | void): AuthoredFormDetail;
}