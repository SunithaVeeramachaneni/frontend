export interface RoundPlanScheduleConfiguration {
  id?: string;
  roundPlanId: string;
  scheduleType: string;
  repeatDuration: number;
  repeatEvery: string;
  daysOfWeek: number[];
  monthlyDaysOfWeek: MonthlyDaysOfWeek[];
  scheduleEndType: string;
  scheduleEndOn: string;
  scheduleEndOccurrences: number;
  startDate: string;
  endDate: string;
  scheduleByDates: ScheduleByDate[];
  scheduledTill?: string;
  startDatePicker?: Date;
  endDatePicker?: Date;
  scheduleEndOnPicker?: Date;
}

export interface ScheduleByDate {
  date: Date;
  scheduled: boolean;
}

export interface MonthlyDaysOfWeek {
  [key: number]: number[];
}

export interface RoundPlanScheduleConfigurationObj {
  [key: string]: RoundPlanScheduleConfiguration;
}

export interface RoundPlanSuccessModalData {
  roundPlanName: string;
  mode: 'update' | 'create';
}

export interface RoundPlan {
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

export interface RoundPlanDetail extends RoundPlan {
  schedule?: string;
  scheduleDates?: string;
  tasks?: number;
  rounds?: number;
  operator?: string;
}

export interface RoundDetail extends RoundPlan {
  schedule?: string;
  scheduleDates?: string;
  tasks?: number;
  rounds?: number;
  operator?: string;
}

export interface RoundPlanDetailResponse {
  rows: RoundPlanDetail[];
  scheduledCount: number;
  unscheduledCount: number;
  nextToken: string | null;
}

export interface RoundDetailResponse {
  rows: RoundDetail[];
  scheduledCount: number;
  unscheduledCount: number;
  nextToken: string | null;
}

export type RoundPlanList = {
  items: Array<RoundPlan | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export interface RoundPlanSubmission {
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
}

export type RoundPlanSubmissionList = {
  items: Array<RoundPlanSubmission | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};
