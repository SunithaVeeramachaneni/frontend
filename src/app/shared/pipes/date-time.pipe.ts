import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: Date, ...args: any[]): any {
    if (args[0].toLowerCase() === 'dd mmm yyyy | hh:mm:ss') {
      const getDate = new Date(value).toDateString();
      const dateString = getDate.split(" ");  
      const getTime = new Date(value).toTimeString();
      const timeString = getTime.substring(0,9);
      return `${dateString[2]} ${dateString[1]} ${dateString[3]} | ${timeString}`;
    }
    return value;
  }

}
