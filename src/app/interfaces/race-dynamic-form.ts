import { GetFormList } from './master-data-management/forms';
import { AssignmentDetail } from './operator-rounds';
export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormList;
}

export interface InspectionQueryParam {
  next?: string;
  limit: number;
  searchTerm: string;
  fetchType: string;
  formId: string;
}

export interface FormScheduleByDate {
  date: Date;
  scheduled: boolean;
}

export interface FormMonthlyDaysOfWeek {
  [key: number]: number[];
}

export interface Form {
  id: string;
  name: string;
  description: string;
  formLogo: string;
  isPublic?: boolean;
  lastPublishedBy?: string;
  publishedDate: string;
  author?: string;
  isArchived?: boolean;
  formType?: string;
  isArchivedAt?: string;
  isDeleted?: boolean;
  location?: string;
  roundType?: string;
  formStatus?: string;
  assignee?: string;
  tags?: string[];
  searchTerm?: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
}

export interface FormQueryParam {
  next?: string;
  limit: number;
  searchTerm: string;
  fetchType: string;
  formId: string;
}

export interface InspectionDetailResponse {
  rows: any[];
  count: number;
  next: string | null;
}

export interface ScheduleFormDetail extends Form {
  schedule: string;
  scheduleDates: string;
  tasks: number;
  locations: number;
  assets: number;
  rounds: number;
  forms: number;
  operator: string;
  plantId: string;
  plant: string;
}

export interface FormDetail extends Form {
  scheduledType: string;
  dueDate: string;
  locationAndAssets: number;
  locationAndAssetsCompleted: number;
  locationAndAssetTasks: number;
  locationAndAssetTasksCompleted: number;
}

export interface FormsDetailResponse {
  items: ScheduleFormDetail[];
  scheduledCount: number;
  unscheduledCount: number;
  next: string | null;
}

export interface FormDetailResponse {
  items: FormDetail[];
  count: number;
  next: string | null;
}

export type FormList = {
  items: Array<Form | null>;
  next?: string | null;
  startedAt?: number | null;
};

export interface FormScheduleConfiguration {
  id?: string;
  formId: string;
  scheduleType: string;
  repeatDuration: number;
  repeatEvery: string;
  daysOfWeek: number[];
  monthlyDaysOfWeek: FormMonthlyDaysOfWeek[];
  scheduleEndType: string;
  scheduleEndOn: string;
  scheduleEndOccurrences: number;
  startDate: string;
  endDate: string;
  scheduleByDates: FormScheduleByDate[];
  scheduledTill?: string;
  startDatePicker?: Date;
  endDatePicker?: Date;
  scheduleEndOnPicker?: Date;
  assignmentDetails: AssignmentDetail;
}
export interface FormScheduleConfigurationObj {
  [key: string]: FormScheduleConfiguration;
}

export interface FormSuccessModalData {
  roundPlanName: string;
  mode: 'update' | 'create';
}

export interface InspectionDetail extends Form {
  inspectionId: string;
  inspectionDetailId: string;
  scheduledType: string;
  dueDate: string | Date;
  locationAndAssets: number;
  locationAndAssetsCompleted: number;
  locationAndAssetTasks: number;
  createdBy: string;
  status: string;
  locationAndAssetTasksCompleted: number;
  assignedTo: string;
  assignedToEmail?: string;
  previouslyAssignedTo: string;
  inspectionDBVersion: number;
  inspectionDetailDBVersion: number;
}
