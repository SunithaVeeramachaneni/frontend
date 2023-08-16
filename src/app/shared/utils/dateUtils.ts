import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {
  constructor() {}

  isValidDate(date): boolean {
    return date instanceof Date && !isNaN(date as unknown as number);
  }
}
