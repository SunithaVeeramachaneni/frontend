import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerAuthoredRoundPlanDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredRoundPlanDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formStatus?: string | null;
  readonly version?: string | null;
  readonly pages?: string | null;
  readonly counter?: number | null;
  readonly roundPlanDetailPublishStatus?: string | null;
  readonly roundplanslistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAuthoredRoundPlanDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredRoundPlanDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formStatus?: string | null;
  readonly version?: string | null;
  readonly pages?: string | null;
  readonly counter?: number | null;
  readonly roundPlanDetailPublishStatus?: string | null;
  readonly roundplanslistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuthoredRoundPlanDetail = LazyLoading extends LazyLoadingDisabled ? EagerAuthoredRoundPlanDetail : LazyAuthoredRoundPlanDetail

export declare const AuthoredRoundPlanDetail: (new (init: ModelInit<AuthoredRoundPlanDetail>) => AuthoredRoundPlanDetail) & {
  copyOf(source: AuthoredRoundPlanDetail, mutator: (draft: MutableModel<AuthoredRoundPlanDetail>) => MutableModel<AuthoredRoundPlanDetail> | void): AuthoredRoundPlanDetail;
}

type EagerRoundPlanDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly roundPlanlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoundPlanDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly roundPlanlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RoundPlanDetail = LazyLoading extends LazyLoadingDisabled ? EagerRoundPlanDetail : LazyRoundPlanDetail

export declare const RoundPlanDetail: (new (init: ModelInit<RoundPlanDetail>) => RoundPlanDetail) & {
  copyOf(source: RoundPlanDetail, mutator: (draft: MutableModel<RoundPlanDetail>) => MutableModel<RoundPlanDetail> | void): RoundPlanDetail;
}

type EagerRoundPlanList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanList, 'id'>;
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
  readonly isArchived?: boolean | null;
  readonly searchTerm?: string | null;
  readonly isArchivedAt?: string | null;
  readonly roundPlansListRoundPlanDetails?: (RoundPlanDetail | null)[] | null;
  readonly roundPlansListAuthoredRoundPlanDetails?: (AuthoredRoundPlanDetail | null)[] | null;
  readonly RoundPlanDetails?: (RoundPlanDetail | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoundPlanList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanList, 'id'>;
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
  readonly isArchived?: boolean | null;
  readonly searchTerm?: string | null;
  readonly isArchivedAt?: string | null;
  readonly roundPlansListRoundPlanDetails: AsyncCollection<RoundPlanDetail>;
  readonly roundPlansListAuthoredRoundPlanDetails: AsyncCollection<AuthoredRoundPlanDetail>;
  readonly RoundPlanDetails: AsyncCollection<RoundPlanDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RoundPlanList = LazyLoading extends LazyLoadingDisabled ? EagerRoundPlanList : LazyRoundPlanList

export declare const RoundPlanList: (new (init: ModelInit<RoundPlanList>) => RoundPlanList) & {
  copyOf(source: RoundPlanList, mutator: (draft: MutableModel<RoundPlanList>) => MutableModel<RoundPlanList> | void): RoundPlanList;
}

type EagerResponseSet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ResponseSet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly type?: string | null;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly isMultiColumn?: boolean | null;
  readonly values?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyResponseSet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ResponseSet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly type?: string | null;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly isMultiColumn?: boolean | null;
  readonly values?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ResponseSet = LazyLoading extends LazyLoadingDisabled ? EagerResponseSet : LazyResponseSet

export declare const ResponseSet: (new (init: ModelInit<ResponseSet>) => ResponseSet) & {
  copyOf(source: ResponseSet, mutator: (draft: MutableModel<ResponseSet>) => MutableModel<ResponseSet> | void): ResponseSet;
}

type EagerFormSubmissionDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormSubmissionDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formlistID: string;
  readonly formsubmissionlistID: string;
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
  readonly formlistID: string;
  readonly formsubmissionlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormSubmissionDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormSubmissionDetail : LazyFormSubmissionDetail

export declare const FormSubmissionDetail: (new (init: ModelInit<FormSubmissionDetail>) => FormSubmissionDetail) & {
  copyOf(source: FormSubmissionDetail, mutator: (draft: MutableModel<FormSubmissionDetail>) => MutableModel<FormSubmissionDetail> | void): FormSubmissionDetail;
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
  readonly formDetailPublishStatus?: string | null;
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
  readonly formDetailPublishStatus?: string | null;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuthoredFormDetail = LazyLoading extends LazyLoadingDisabled ? EagerAuthoredFormDetail : LazyAuthoredFormDetail

export declare const AuthoredFormDetail: (new (init: ModelInit<AuthoredFormDetail>) => AuthoredFormDetail) & {
  copyOf(source: AuthoredFormDetail, mutator: (draft: MutableModel<AuthoredFormDetail>) => MutableModel<AuthoredFormDetail> | void): AuthoredFormDetail;
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
  readonly searchTerm?: string | null;
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
  readonly searchTerm?: string | null;
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
  readonly isArchived?: boolean | null;
  readonly searchTerm?: string | null;
  readonly isArchivedAt?: string | null;
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
  readonly isArchived?: boolean | null;
  readonly searchTerm?: string | null;
  readonly isArchivedAt?: string | null;
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