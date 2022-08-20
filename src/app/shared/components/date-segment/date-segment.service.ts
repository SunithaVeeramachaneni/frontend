import { Injectable } from '@angular/core';
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateSegmentService {
  constructor() {}

  getStartAndEndDate = (date) => {
    if (date === 'today') return this.todayStartAndEndDate();
    if (date === 'month') return this.monthStartAndEndDate();
    if (date === 'week') return this.weekStartAndEndDate();
  };

  todayStartAndEndDate = () => ({
    startDate: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00`,
    endDate: `${format(new Date(), 'yyyy-MM-dd')}T23:59:59`
  });

  weekStartAndEndDate = () => ({
    startDate: `${format(startOfWeek(new Date()), 'yyyy-MM-dd', {})}T00:00:00`,
    endDate: `${format(endOfWeek(new Date()), 'yyyy-MM-dd', {})}T23:59:59`
  });

  monthStartAndEndDate = () => ({
    startDate: `${format(startOfMonth(new Date()), 'yyyy-MM-dd', {})}T00:00:00`,
    endDate: `${format(endOfMonth(new Date()), 'yyyy-MM-dd', {})}T23:59:59`
  });
}
