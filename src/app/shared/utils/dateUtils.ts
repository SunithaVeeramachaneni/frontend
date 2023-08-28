import { Injectable } from '@angular/core';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {
  constructor() {}

  isValidDate(date): boolean {
    return date instanceof Date && !isNaN(date as unknown as number);
  }

  getStartAndEndDates(timePeriod, customStartDate, customEndDate): any {
    const today = new Date();
    let startDate;
    let endDate;
    switch (timePeriod) {
      case 'last_6_months':
        // eslint-disable-next-line no-case-declarations
        const todayClone1 = new Date(today.getTime());
        startDate = todayClone1.setMonth(todayClone1.getMonth() - 6);
        endDate = today;
        break;
      case 'last_3_months':
        // eslint-disable-next-line no-case-declarations
        const todayClone2 = new Date(today.getTime());
        startDate = todayClone2.setMonth(todayClone2.getMonth() - 3);
        endDate = today;
        break;
      case 'this_week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        break;
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case 'custom':
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;
      default:
        break;
    }
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    startDate = `${format(startDate, 'yyyy-MM-dd')}T00:00:00`;
    endDate = `${format(endDate, 'yyyy-MM-dd')}T23:59:59`;

    return { startDate, endDate };
  }
}
