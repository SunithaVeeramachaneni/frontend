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
  lastPublishedBy: string;
  publishedDate: string;
  createdAt: string;
  author: string;
  schedule?: string;
  scheduleDates?: string;
  tasks?: number;
  rounds?: number;
  operator?: string;
}

export interface RoundPlanResponse {
  rows: RoundPlan[];
  scheduledCount: number;
  unscheduledCount: number;
  nextToken: string | null;
}
