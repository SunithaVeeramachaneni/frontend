import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerPlants = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Plants, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly plantId?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly image?: string | null;
  readonly label?: string | null;
  readonly field?: string | null;
  readonly searchTerm?: string | null;
  readonly zipCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPlants = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Plants, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly plantId?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly image?: string | null;
  readonly label?: string | null;
  readonly field?: string | null;
  readonly searchTerm?: string | null;
  readonly zipCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Plants = LazyLoading extends LazyLoadingDisabled ? EagerPlants : LazyPlants

export declare const Plants: (new (init: ModelInit<Plants>) => Plants) & {
  copyOf(source: Plants, mutator: (draft: MutableModel<Plants>) => MutableModel<Plants> | void): Plants;
}

type EagerActionsLogHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ActionsLogHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message?: string | null;
  readonly type?: string | null;
  readonly username?: string | null;
  readonly actionslistID: string;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyActionsLogHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ActionsLogHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message?: string | null;
  readonly type?: string | null;
  readonly username?: string | null;
  readonly actionslistID: string;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ActionsLogHistory = LazyLoading extends LazyLoadingDisabled ? EagerActionsLogHistory : LazyActionsLogHistory

export declare const ActionsLogHistory: (new (init: ModelInit<ActionsLogHistory>) => ActionsLogHistory) & {
  copyOf(source: ActionsLogHistory, mutator: (draft: MutableModel<ActionsLogHistory>) => MutableModel<ActionsLogHistory> | void): ActionsLogHistory;
}

type EagerActionsList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ActionsList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly actionsLogHistories?: (ActionsLogHistory | null)[] | null;
  readonly actionId?: number | null;
  readonly actionData?: string | null;
  readonly taskId?: string | null;
  readonly taskDesciption?: string | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
  readonly roundId?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyActionsList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ActionsList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly actionsLogHistories: AsyncCollection<ActionsLogHistory>;
  readonly actionId?: number | null;
  readonly actionData?: string | null;
  readonly taskId?: string | null;
  readonly taskDesciption?: string | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
  readonly roundId?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ActionsList = LazyLoading extends LazyLoadingDisabled ? EagerActionsList : LazyActionsList

export declare const ActionsList: (new (init: ModelInit<ActionsList>) => ActionsList) & {
  copyOf(source: ActionsList, mutator: (draft: MutableModel<ActionsList>) => MutableModel<ActionsList> | void): ActionsList;
}

type EagerIssuesLogHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IssuesLogHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message?: string | null;
  readonly type?: string | null;
  readonly username?: string | null;
  readonly issueslistID: string;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyIssuesLogHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IssuesLogHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly message?: string | null;
  readonly type?: string | null;
  readonly username?: string | null;
  readonly issueslistID: string;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type IssuesLogHistory = LazyLoading extends LazyLoadingDisabled ? EagerIssuesLogHistory : LazyIssuesLogHistory

export declare const IssuesLogHistory: (new (init: ModelInit<IssuesLogHistory>) => IssuesLogHistory) & {
  copyOf(source: IssuesLogHistory, mutator: (draft: MutableModel<IssuesLogHistory>) => MutableModel<IssuesLogHistory> | void): IssuesLogHistory;
}

type EagerIssuesList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IssuesList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly issuesLogHistories?: (IssuesLogHistory | null)[] | null;
  readonly issueId?: number | null;
  readonly issueData?: string | null;
  readonly taskId?: string | null;
  readonly taskDesciption?: string | null;
  readonly notificationNumber?: string | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
  readonly roundId?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyIssuesList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IssuesList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly issuesLogHistories: AsyncCollection<IssuesLogHistory>;
  readonly issueId?: number | null;
  readonly issueData?: string | null;
  readonly taskId?: string | null;
  readonly taskDesciption?: string | null;
  readonly notificationNumber?: string | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
  readonly roundId?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type IssuesList = LazyLoading extends LazyLoadingDisabled ? EagerIssuesList : LazyIssuesList

export declare const IssuesList: (new (init: ModelInit<IssuesList>) => IssuesList) & {
  copyOf(source: IssuesList, mutator: (draft: MutableModel<IssuesList>) => MutableModel<IssuesList> | void): IssuesList;
}

type EagerUnitMeasument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitMeasument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly description?: string | null;
  readonly symbol?: string | null;
  readonly isDefault?: boolean | null;
  readonly isDeleted?: boolean | null;
  readonly unitlistID: string;
  readonly searchTerm?: string | null;
  readonly unitList?: UnitList | null;
  readonly isActive?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUnitMeasument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitMeasument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly description?: string | null;
  readonly symbol?: string | null;
  readonly isDefault?: boolean | null;
  readonly isDeleted?: boolean | null;
  readonly unitlistID: string;
  readonly searchTerm?: string | null;
  readonly unitList: AsyncItem<UnitList | undefined>;
  readonly isActive?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UnitMeasument = LazyLoading extends LazyLoadingDisabled ? EagerUnitMeasument : LazyUnitMeasument

export declare const UnitMeasument: (new (init: ModelInit<UnitMeasument>) => UnitMeasument) & {
  copyOf(source: UnitMeasument, mutator: (draft: MutableModel<UnitMeasument>) => MutableModel<UnitMeasument> | void): UnitMeasument;
}

type EagerUnitList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly isDeleted?: boolean | null;
  readonly unitMeasuments?: (UnitMeasument | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUnitList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UnitList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly isDeleted?: boolean | null;
  readonly unitMeasuments: AsyncCollection<UnitMeasument>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UnitList = LazyLoading extends LazyLoadingDisabled ? EagerUnitList : LazyUnitList

export declare const UnitList: (new (init: ModelInit<UnitList>) => UnitList) & {
  copyOf(source: UnitList, mutator: (draft: MutableModel<UnitList>) => MutableModel<UnitList> | void): UnitList;
}

type EagerAssets = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Assets, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly model?: string | null;
  readonly parentType?: string | null;
  readonly parentId?: string | null;
  readonly assetsId?: string | null;
  readonly image?: string | null;
  readonly searchTerm?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAssets = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Assets, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly model?: string | null;
  readonly parentType?: string | null;
  readonly parentId?: string | null;
  readonly assetsId?: string | null;
  readonly image?: string | null;
  readonly searchTerm?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Assets = LazyLoading extends LazyLoadingDisabled ? EagerAssets : LazyAssets

export declare const Assets: (new (init: ModelInit<Assets>) => Assets) & {
  copyOf(source: Assets, mutator: (draft: MutableModel<Assets>) => MutableModel<Assets> | void): Assets;
}

type EagerLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly model?: string | null;
  readonly locationId?: string | null;
  readonly parentId?: string | null;
  readonly image?: string | null;
  readonly searchTerm?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLocation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Location, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly model?: string | null;
  readonly locationId?: string | null;
  readonly parentId?: string | null;
  readonly image?: string | null;
  readonly searchTerm?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Location = LazyLoading extends LazyLoadingDisabled ? EagerLocation : LazyLocation

export declare const Location: (new (init: ModelInit<Location>) => Location) & {
  copyOf(source: Location, mutator: (draft: MutableModel<Location>) => MutableModel<Location> | void): Location;
}

type EagerRoundPlanSubmissionDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanSubmissionDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formsubmissionlistID: string;
  readonly flatHierarchy?: string | null;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly status?: string | null;
  readonly formdetailID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoundPlanSubmissionDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanSubmissionDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formData?: string | null;
  readonly formsubmissionlistID: string;
  readonly flatHierarchy?: string | null;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly status?: string | null;
  readonly formdetailID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RoundPlanSubmissionDetails = LazyLoading extends LazyLoadingDisabled ? EagerRoundPlanSubmissionDetails : LazyRoundPlanSubmissionDetails

export declare const RoundPlanSubmissionDetails: (new (init: ModelInit<RoundPlanSubmissionDetails>) => RoundPlanSubmissionDetails) & {
  copyOf(source: RoundPlanSubmissionDetails, mutator: (draft: MutableModel<RoundPlanSubmissionDetails>) => MutableModel<RoundPlanSubmissionDetails> | void): RoundPlanSubmissionDetails;
}

type EagerRoundPlanSubmissionList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanSubmissionList, 'id'>;
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
  readonly roundPlanSubmissionDetails?: (RoundPlanSubmissionDetails | null)[] | null;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoundPlanSubmissionList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RoundPlanSubmissionList, 'id'>;
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
  readonly roundPlanSubmissionDetails: AsyncCollection<RoundPlanSubmissionDetails>;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RoundPlanSubmissionList = LazyLoading extends LazyLoadingDisabled ? EagerRoundPlanSubmissionList : LazyRoundPlanSubmissionList

export declare const RoundPlanSubmissionList: (new (init: ModelInit<RoundPlanSubmissionList>) => RoundPlanSubmissionList) & {
  copyOf(source: RoundPlanSubmissionList, mutator: (draft: MutableModel<RoundPlanSubmissionList>) => MutableModel<RoundPlanSubmissionList> | void): RoundPlanSubmissionList;
}

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
  readonly formDetailPublishStatus?: string | null;
  readonly formlistID: string;
  readonly subForms?: string | null;
  readonly hierarchy?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly formDetailPublishStatus?: string | null;
  readonly formlistID: string;
  readonly subForms?: string | null;
  readonly hierarchy?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly flatHierarchy?: string | null;
  readonly formlistID: string;
  readonly scheduledAt?: string | null;
  readonly scheduledType?: string | null;
  readonly dueDate?: string | null;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly assignedTo?: string | null;
  readonly roundPlanSubmissionDetails?: (RoundPlanSubmissionDetails | null)[] | null;
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
  readonly flatHierarchy?: string | null;
  readonly formlistID: string;
  readonly scheduledAt?: string | null;
  readonly scheduledType?: string | null;
  readonly dueDate?: string | null;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly assignedTo?: string | null;
  readonly roundPlanSubmissionDetails: AsyncCollection<RoundPlanSubmissionDetails>;
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
  readonly isArchived?: boolean | null;
  readonly formType?: string | null;
  readonly isArchivedAt?: string | null;
  readonly authoredRoundPlanDetails?: (AuthoredRoundPlanDetail | null)[] | null;
  readonly roundPlanDetails?: (RoundPlanDetail | null)[] | null;
  readonly isDeleted?: boolean | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
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
  readonly isArchived?: boolean | null;
  readonly formType?: string | null;
  readonly isArchivedAt?: string | null;
  readonly authoredRoundPlanDetails: AsyncCollection<AuthoredRoundPlanDetail>;
  readonly roundPlanDetails: AsyncCollection<RoundPlanDetail>;
  readonly isDeleted?: boolean | null;
  readonly searchTerm?: string | null;
  readonly createdBy?: string | null;
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
  readonly createdBy?: string | null;
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
  readonly createdBy?: string | null;
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
  readonly formsubmissionlistID: string;
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly formdetailID: string;
  readonly status?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly formdetailID: string;
  readonly status?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly subForms?: string | null;
  readonly hierarchy?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly subForms?: string | null;
  readonly hierarchy?: string | null;
  readonly flatHierarchy?: string | null;
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
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
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
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
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
  readonly formListAuthoredFormDetail?: (AuthoredFormDetail | null)[] | null;
  readonly formListFormDetail?: (FormDetail | null)[] | null;
  readonly isDeleted?: boolean | null;
  readonly createdBy?: string | null;
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
  readonly formListAuthoredFormDetail: AsyncCollection<AuthoredFormDetail>;
  readonly formListFormDetail: AsyncCollection<FormDetail>;
  readonly isDeleted?: boolean | null;
  readonly createdBy?: string | null;
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
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly flatHierarchy?: string | null;
  readonly scheduledAt?: string | null;
  readonly scheduledType?: string | null;
  readonly dueDate?: string | null;
  readonly assignedTo?: string | null;
  readonly formSubmissionDetail?: (FormSubmissionDetail | null)[] | null;
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
  readonly createdBy?: string | null;
  readonly assignedBy?: string | null;
  readonly flatHierarchy?: string | null;
  readonly scheduledAt?: string | null;
  readonly scheduledType?: string | null;
  readonly dueDate?: string | null;
  readonly assignedTo?: string | null;
  readonly formSubmissionDetail: AsyncCollection<FormSubmissionDetail>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FormDetail = LazyLoading extends LazyLoadingDisabled ? EagerFormDetail : LazyFormDetail

export declare const FormDetail: (new (init: ModelInit<FormDetail>) => FormDetail) & {
  copyOf(source: FormDetail, mutator: (draft: MutableModel<FormDetail>) => MutableModel<FormDetail> | void): FormDetail;
}