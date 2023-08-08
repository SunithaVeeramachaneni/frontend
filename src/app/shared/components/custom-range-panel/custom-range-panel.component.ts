/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { addMonths, subDays } from 'date-fns';

const customPresets = [
  'Today',
  'Last 7 days',
  'Last week',
  'Last month',
  'This month',
  'Last 3 months'
] as const;

type CustomPreset = (typeof customPresets)[number];

@Component({
  selector: 'app-custom-range-panel',
  templateUrl: './custom-range-panel.component.html',
  styleUrls: ['./custom-range-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomRangePanelComponent<D> {
  // list of range presets we want to provide:
  readonly customPresets = customPresets;
  @HostBinding('class.touch-ui')
  readonly isTouchUi = this.picker.touchUi;

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>
  ) {}

  // called when user selects a range preset:
  selectRange(rangeName: CustomPreset): void {
    const [start, end] = this.calculateDateRange(rangeName);
    this.picker.select(start);
    this.picker.select(end);
    this.picker.close();
  }

  private calculateDateRange(rangeName: CustomPreset): [start: D, end: D] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);

    switch (rangeName) {
      case 'Today':
        return [today, today];
      case 'Last 7 days': {
        const start = this.dateAdapter.addCalendarDays(today, -6);
        return [start, today];
      }
      case 'Last week': {
        const thisDayLastWeek = this.dateAdapter.addCalendarDays(today, -7);
        return this.calculateWeek(thisDayLastWeek);
      }
      case 'Last month': {
        const thisDayLastMonth = this.dateAdapter.addCalendarMonths(today, -1);
        return this.calculateMonth(thisDayLastMonth);
      }
      case 'This month': {
        return this.calculateMonth(today);
      }
      case 'Last 3 months': {
        const thisDayLastMonth = this.dateAdapter.addCalendarMonths(today, -3);
        const dates = this.calculateMonth(thisDayLastMonth, 3);
        return dates;
      }
      default:
        return rangeName;
    }
  }

  private calculateMonth(forDay: D, day: number = 1): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    if (day === 3) {
      let endDate: Date | D = addMonths(start as unknown as number, month);
      endDate = subDays(endDate, 1) as unknown as D;
      return [start, endDate];
    } else {
      const daysInMonth = this.dateAdapter.getNumDaysInMonth(forDay) * day;
      const days = daysInMonth - 1;
      const endDate = this.dateAdapter.addCalendarDays(start, days);
      return [start, endDate];
    }
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart =
      this.dateAdapter.getFirstDayOfWeek() -
      this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }
}
