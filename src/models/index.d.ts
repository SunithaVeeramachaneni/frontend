import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum FormStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}



type EagerFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version?: string | null;
  readonly FORMS?: string | null;
  readonly formlistID: string;
  readonly FormList?: FormList | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version?: string | null;
  readonly FORMS?: string | null;
  readonly formlistID: string;
  readonly FormList: AsyncItem<FormList | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormDetail : LazyFormDetail

export declare const FormDetail: (new (init: ModelInit<FormDetail>) => FormDetail) & {
  copyOf(source: FormDetail, mutator: (draft: MutableModel<FormDetail>) => MutableModel<FormDetail> | void): FormDetail;
}

type EagerFormList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Title?: string | null;
  readonly Description?: string | null;
  readonly Image?: string | null;
  readonly Owner?: string | null;
  readonly PublishedDate?: string | null;
  readonly Status?: string | null;
  readonly updatedBy?: string | null;
  readonly authoredFormDetails?: (AuthoredFormDetail | null)[] | null;
  readonly FormDetails?: (FormDetail | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Title?: string | null;
  readonly Description?: string | null;
  readonly Image?: string | null;
  readonly Owner?: string | null;
  readonly PublishedDate?: string | null;
  readonly Status?: string | null;
  readonly updatedBy?: string | null;
  readonly authoredFormDetails: AsyncCollection<AuthoredFormDetail>;
  readonly FormDetails: AsyncCollection<FormDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormList = LazyLoading extends LazyLoadingDisabled ? EagerFormList : LazyFormList

export declare const FormList: (new (init: ModelInit<FormList>) => FormList) & {
  copyOf(source: FormList, mutator: (draft: MutableModel<FormList>) => MutableModel<FormList> | void): FormList;
}

type EagerAuthoredFormDetail = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuthoredFormDetail, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version?: string | null;
  readonly FORMS?: string | null;
  readonly FormInspections?: (FormInspection | null)[] | null;
  readonly FormList?: FormList | null;
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
  readonly version?: string | null;
  readonly FORMS?: string | null;
  readonly FormInspections: AsyncCollection<FormInspection>;
  readonly FormList: AsyncItem<FormList | undefined>;
  readonly formlistID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuthoredFormDetail = LazyLoading extends LazyLoadingDisabled ? EagerAuthoredFormDetail : LazyAuthoredFormDetail

export declare const AuthoredFormDetail: (new (init: ModelInit<AuthoredFormDetail>) => AuthoredFormDetail) & {
  copyOf(source: AuthoredFormDetail, mutator: (draft: MutableModel<AuthoredFormDetail>) => MutableModel<AuthoredFormDetail> | void): AuthoredFormDetail;
}

type EagerFormInspection = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormInspection, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly status?: string | null;
  readonly SubmittedDate?: string | null;
  readonly SubmittedTime?: string | null;
  readonly authoredForm?: AuthoredFormDetail | null;
  readonly authoredformdetailID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormInspection = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormInspection, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly status?: string | null;
  readonly SubmittedDate?: string | null;
  readonly SubmittedTime?: string | null;
  readonly authoredForm: AsyncItem<AuthoredFormDetail | undefined>;
  readonly authoredformdetailID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormInspection = LazyLoading extends LazyLoadingDisabled ? EagerFormInspection : LazyFormInspection

export declare const FormInspection: (new (init: ModelInit<FormInspection>) => FormInspection) & {
  copyOf(source: FormInspection, mutator: (draft: MutableModel<FormInspection>) => MutableModel<FormInspection> | void): FormInspection;
}

type EagerFormsMetaData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormsMetaData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly isArchived?: boolean | null;
  readonly tags?: (string | null)[] | null;
  readonly formStatus?: FormStatusEnum | keyof typeof FormStatusEnum | null;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormsMetaData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormsMetaData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly formLogo?: string | null;
  readonly isPublic?: boolean | null;
  readonly isArchived?: boolean | null;
  readonly tags?: (string | null)[] | null;
  readonly formStatus?: FormStatusEnum | keyof typeof FormStatusEnum | null;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormsMetaData = LazyLoading extends LazyLoadingDisabled ? EagerFormsMetaData : LazyFormsMetaData

export declare const FormsMetaData: (new (init: ModelInit<FormsMetaData>) => FormsMetaData) & {
  copyOf(source: FormsMetaData, mutator: (draft: MutableModel<FormsMetaData>) => MutableModel<FormsMetaData> | void): FormsMetaData;
}

type EagerFormsJSON = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormsJSON, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pages?: string[] | null;
  readonly formId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFormsJSON = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FormsJSON, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pages?: string[] | null;
  readonly formId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormsJSON = LazyLoading extends LazyLoadingDisabled ? EagerFormsJSON : LazyFormsJSON

export declare const FormsJSON: (new (init: ModelInit<FormsJSON>) => FormsJSON) & {
  copyOf(source: FormsJSON, mutator: (draft: MutableModel<FormsJSON>) => MutableModel<FormsJSON> | void): FormsJSON;
}