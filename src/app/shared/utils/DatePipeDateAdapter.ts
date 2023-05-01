import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  MAT_NATIVE_DATE_FORMATS,
  MatDateFormats,
  NativeDateAdapter
} from '@angular/material/core';

@Injectable()
export class DatePipeDateAdapter extends NativeDateAdapter {
  // This function creates a custom `MatDateFormats` object that
  // defaults all values to `MAT_NATIVE_DATE_FORMATS` except for
  // the `display.dateInput` property, which gets set by the user
  // via this `displayFormat` parameter. This parameter ultimately
  // gets passed to the Angular `DatePipe` in the `format()`
  // function above, so it can be any format value that `DatePipe`
  // accepts:
  //    https://angular.io/api/common/DatePipe#usage-notes
  static createCustomMatDateFormats(displayFormat: string): MatDateFormats {
    const customDateInputFormats: MatDateFormats = {
      ...MAT_NATIVE_DATE_FORMATS,
      display: {
        ...MAT_NATIVE_DATE_FORMATS.display,
        dateInput: displayFormat
      }
    };

    return customDateInputFormats;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  format(date: Date, displayFormat: Object): string {
    // Use DatePipe to format date however you specify
    if (typeof displayFormat === 'string') {
      return new DatePipe('en-US').transform(date, displayFormat) as string;
    }

    // Default to parent class format() if no custom format string is given
    return super.format(date, displayFormat);
  }
}
