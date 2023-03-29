import { GetFormList } from './master-data-management/forms';
export interface FormTableUpdate {
  action: 'add' | 'delete' | 'edit' | 'copy' | null;
  form: GetFormList;
}


export interface InspectionQueryParam {
  nextToken?: string;
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
  nextToken?: string;
  limit: number;
  searchTerm: string;
  fetchType: string;
  formId: string;
}

export interface InspectionDetailResponse {
  rows: any[];
  count: number;
  nextToken: string | null;
} 

export interface ScheduleFormDetail extends Form {
  schedule: string;
  scheduleDates: string;
  tasks: number;
  locations: number;
  assets: number;
  rounds: number;
  operator: string;
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
  rows: ScheduleFormDetail[];
  scheduledCount: number;
  unscheduledCount: number;
  nextToken: string | null;
}

export interface FormDetailResponse {
  rows: FormDetail[];
  count: number;
  nextToken: string | null;
}

export type FormList = {
  items: Array<Form | null>;
  nextToken?: string | null;
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
}
export interface FormScheduleConfigurationObj {
  [key: string]: FormScheduleConfiguration;
}

export interface FormSuccessModalData {
  roundPlanName: string;
  mode: 'update' | 'create';
}
