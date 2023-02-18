export interface RoundPlanScheduleConfiguration {
  id?: string;
  scheduleType: string;
  repeatDuration: number;
  repeatEvery: string;
  daysOfWeek: number[];
  monthlyDaysOfWeek: any[];
  scheduleEndType: string;
  scheduleEndOn: string;
  scheduleEndOccurrences: number;
  startDate: string;
  endDate: string;
  scheduleByDate: string;
}
