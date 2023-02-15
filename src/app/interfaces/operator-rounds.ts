export interface RoundPlanSchedulerConfiguration {
  id?: string;
  scheduleType: string;
  repeatDuration: number;
  repeatEvery: string;
  repeatDays: number[];
  weekWiseRepeatDays: any[];
  scheduleEndType: string;
  scheduleEndOn: string;
  scheduleEndOccurrences: number;
  startDate: string;
  endDate: string;
  scheduleByDate: string;
}
