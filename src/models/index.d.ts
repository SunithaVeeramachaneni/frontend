import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





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
  readonly formStatus?: string | null;
  readonly version?: string | null;
  readonly pages?: string | null;
  readonly counter?: number | null;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAuthoredFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredFormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formStatus?: string | null;
  readonly version?: string | null;
  readonly pages?: string | null;
  readonly counter?: number | null;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuthoredFormDetail = LazyLoading extends LazyLoadingDisabled ? EagerAuthoredFormDetail : LazyAuthoredFormDetail

export declare const AuthoredFormDetail: (new (init: ModelInit<AuthoredFormDetail>) => AuthoredFormDetail) & {
  copyOf(source: AuthoredFormDetail, mutator: (draft: MutableModel<AuthoredFormDetail>) => MutableModel<AuthoredFormDetail> | void): AuthoredFormDetail;
}

type EagerFormSubmissionDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formsubmissionlistID: string;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormSubmissionDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formsubmissionlistID: string;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormSubmissionDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormSubmissionDetail : LazyFormSubmissionDetail

export declare const FormSubmissionDetail: (new (init: ModelInit<FormSubmissionDetail>) => FormSubmissionDetail) & {
  copyOf(source: FormSubmissionDetail, mutator: (draft: MutableModel<FormSubmissionDetail>) => MutableModel<FormSubmissionDetail> | void): FormSubmissionDetail;
}

type EagerFormSubmissionList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionList, 'id'>;
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
  readonly formSubmissionListFormSubmissionDetail?: (FormSubmissionDetail | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormSubmissionList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionList, 'id'>;
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
  readonly formSubmissionListFormSubmissionDetail: AsyncCollection<FormSubmissionDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormSubmissionList = LazyLoading extends LazyLoadingDisabled ? EagerFormSubmissionList : LazyFormSubmissionList

export declare const FormSubmissionList: (new (init: ModelInit<FormSubmissionList>) => FormSubmissionList) & {
  copyOf(source: FormSubmissionList, mutator: (draft: MutableModel<FormSubmissionList>) => MutableModel<FormSubmissionList> | void): FormSubmissionList;
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
  readonly formListFormSubmissionDetail?: (FormSubmissionDetail | null)[] | null;
  readonly formListAuthoredFormDetail?: (AuthoredFormDetail | null)[] | null;
  readonly formListFormDetail?: (FormDetail | null)[] | null;
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
  readonly formListFormSubmissionDetail: AsyncCollection<FormSubmissionDetail>;
  readonly formListAuthoredFormDetail: AsyncCollection<AuthoredFormDetail>;
  readonly formListFormDetail: AsyncCollection<FormDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormList = LazyLoading extends LazyLoadingDisabled ? EagerFormList : LazyFormList

export declare const FormList: (new (init: ModelInit<FormList>) => FormList) & {
  copyOf(source: FormList, mutator: (draft: MutableModel<FormList>) => MutableModel<FormList> | void): FormList;
}