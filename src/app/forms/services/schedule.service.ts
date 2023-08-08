import { Injectable } from '@angular/core';

import {
  TimeType,
  TIME_SLOTS
} from '../components/schedular/schedule-configuration/schedule-configuration.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleConfigurationService {
  scheduleConfigEvent = new BehaviorSubject<{
    slideInOut: 'out' | 'in';
    viewForms?: boolean;
    viewRounds?: boolean;
    actionType: 'scheduleConfigEvent';
    mode?: 'create' | 'update';
  }>(null);
  constructor() {}

  // The convertTo24Hour function takes a time string in the 12-hour format with AM/PM indicator and converts it to the 24-hour format.
  convertTo24Hour(timeString: string): string {
    // Extract the hour, minute, and AM/PM indicator from the time string
    const [time, period] = timeString?.split(' ');
    const [hour, minute] = time?.split(':');

    // Convert hour to a number
    let hourNumeric: number = parseInt(hour, 10);

    // Handle special cases of 12 AM and 12 PM
    if (hourNumeric === 12) {
      hourNumeric = period === 'AM' ? 0 : 12;
    } else {
      // Adjust the hour based on the AM/PM indicator
      hourNumeric += period === 'PM' ? 12 : 0;
    }

    // Convert hour and minute back to strings and pad with leading zeros if necessary
    const hourString: string = hourNumeric.toString().padStart(2, '0');
    const minuteString: string = minute.padStart(2, '0');

    // Return the time in 24-hour format
    return `${hourString}:${minuteString}`;
  }

  // The convertTo12HourFormat function takes a time string in the 24-hour format and converts it to the 12-hour format with AM/PM indicator.
  convertTo12HourFormat(timeString: string): string {
    const [hours, minutes] = timeString?.split(':');
    const date: Date = new Date();
    date.setHours(hours as unknown as number);
    date.setMinutes(minutes as unknown as number);
    const formattedTime: string = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return formattedTime;
  }

  // The getTime function takes a time string in the format HH:MM and returns the corresponding timestamp in milliseconds.
  getTime(time: string): number {
    return new Date(`${this.getDateString()} ${time}`).getTime();
  }

  // The getHours function takes a time string in the format HH:MM and returns the corresponding timestamp in hours.
  getHours(time: string): number {
    return new Date(`${this.getDateString()} ${time}`).getHours();
  }

  // The getTimeDifference function takes two time strings (firstTime and secondTime) in the format HH:MM and returns the time difference in hours between the two.
  getTimeDifference(firstTime: string, secondTime: string): number {
    let timeDifference: number;
    const startTime = '12:00 AM';
    const nextDayStartTime = '01:00 AM';
    const twentyFourHours = 24;
    const twelveHours = 12;
    const firstHour = this.getHours(firstTime);
    const secondHour = this.getHours(secondTime);
    if (
      firstTime.toLowerCase() !== startTime.toLowerCase() &&
      secondTime.toLowerCase() === nextDayStartTime.toLowerCase()
    ) {
      return (timeDifference = (firstHour === 0 ? 1 : firstHour) - secondHour);
    }
    if (firstTime === startTime && secondTime === startTime) {
      timeDifference = twentyFourHours;
    } else {
      if (firstHour > secondHour) {
        timeDifference = twentyFourHours - (firstHour - secondHour);
      } else {
        timeDifference = secondHour - firstHour;
      }
    }
    return timeDifference;
  }

  // The function generateTimeSlots(startTime: string, endTime: string): string[] generates an array of time slots between a given start time and end time.
  generateTimeSlots(startTime: string, endTime: string): string[] {
    const timeSlots: string[] = [];
    const start: Date = new Date(`${this.getDateString()} ${startTime}`);
    const end: Date = new Date(`${this.getDateString()} ${endTime}`);

    // Set the start time as the current time
    const current: Date = new Date(start);
    if (current > end) end.setHours(end.getHours() + 24);
    // Add one hour to the current time until it exceeds the end time
    while (current <= end) {
      const formattedTime: string = current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      timeSlots.push(formattedTime.toLocaleUpperCase());
      current.setHours(current.getHours() + 1);
      if (current > end) {
        break;
      }
    }
    const checkExtraMint = this.hasMinutes(endTime);
    if (
      checkExtraMint !== 0 &&
      !(startTime === '12:00 AM' && endTime === '11:59 PM')
    ) {
      endTime = new Date(end).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      timeSlots.push(endTime);
    }
    if (startTime === this.addTime(endTime, 0, 1)) {
      return TIME_SLOTS;
    }
    return timeSlots;
  }

  // The function padZero(val: number): string takes a number val as input and returns a string representation of that number with leading zeros added if necessary.
  padZero(val: number): string {
    return val?.toString().padStart(2, '0');
  }

  // The function isTimeSlotPresent(timeSlot: string, slots): boolean checks whether a given timeSlot is present within an array of slots based on their start and end times.
  isTimeSlotPresent(timeSlot: string, slots): boolean {
    const time: number = this.getTime(timeSlot);
    return slots?.some((obj) => {
      const startTime: number = this.getTime(obj?.startTime);
      const endTime: number = this.getTime(obj?.endTime);
      return time >= startTime && time <= endTime;
    });
  }

  // The function getMatchingObject(timeSlot, arrayOfObjects) searches for an object within an array of objects (arrayOfObjects) that matches a given timeSlot based on their start and end times.
  getMatchingObject(
    timeSlot: string,
    arrayOfObjects: { startTime: string; endTime: string }[]
  ) {
    const time: number = this.getTime(timeSlot);
    const matchingObject = arrayOfObjects?.find((obj) => {
      const startTime: number = this.getTime(obj?.startTime);
      const endTime: number = this.getTime(obj?.endTime);
      return time >= startTime && time <= endTime;
    });
    return matchingObject || null;
  }

  // The function addTime(originalTime: string, addHours: number, addMinutes: number) takes an original time string, along with the number of hours and minutes to add, and returns a new time string with the added time.
  addTime(originalTime: string, addHours: number, addMinutes: number) {
    if (!originalTime) return;

    originalTime = this.convertTo24Hour(originalTime);

    // Split the original time into hours, minutes, and AM/PM indicator
    const [timePart, ampmPart] = originalTime?.split(' ');
    const [hoursStr, minutesStr] = timePart?.split(':');

    // Convert the string values to numbers
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);
    // Adjust the hours based on the AM/PM indicator
    if (ampmPart?.toLowerCase() === 'pm') {
      hours += 12;
    }
    // Add the specified hours and minutes
    hours += addHours;
    minutes += addMinutes;
    // Adjust the time components if necessary
    if (minutes >= 60) {
      const extraHours = Math.floor(minutes / 60);
      minutes %= 60;
      hours += extraHours;
    }
    if (hours >= 24) {
      hours %= 24;
    }
    // Convert the hours back to a 12-hour format
    let ampm = 'AM';
    if (hours >= 12) {
      ampm = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    const startTimeAM = '12:00 am';
    if (originalTime?.toLowerCase() === startTimeAM.toLowerCase()) {
      ampm = TimeType.am;
    }
    // Format the resulting time as a string
    const updatedTime = `${this.padZero(hours)}:${this.padZero(
      minutes
    )} ${ampm}`;
    return updatedTime;
  }

  // The function subtractTime(timeString: string, subtractHours: number, subtractMinutes: number): string takes a time string, along with the number of hours and minutes to subtract, and returns a new time string with the subtracted time.
  subtractTime(
    timeString: string,
    subtractHours: number,
    subtractMinutes: number
  ): string {
    timeString = this.convertTo24Hour(timeString);

    const [timePart, timeType] = (timeString?.split(' ') ?? []) as [
      string?,
      string?
    ];
    const [hoursStr, minutesStr] = (timePart?.split(':') ?? []) as [
      string?,
      string?
    ];

    let hours: number = parseInt(hoursStr, 10);
    let minutes: number = parseInt(minutesStr, 10);

    if (timeType?.toLowerCase() === TimeType.pm.toLowerCase()) {
      hours += 12;
    }

    minutes -= subtractMinutes;
    hours -= subtractHours;

    while (minutes < 0) {
      minutes += 60;
      hours--;
    }

    while (hours < 0) {
      hours += 24;
    }

    hours %= 24;

    let type = TimeType.am;
    if (hours >= 12) {
      type = TimeType.pm;
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }
    const updatedTimeString = `${this.padZero(hours)}:${this.padZero(
      minutes
    )} ${type}`;
    return updatedTimeString;
  }

  sortArray(rows = [], timeSlots = []) {
    if (timeSlots.length > 0) {
      if (timeSlots[0] === timeSlots[timeSlots.length - 1]) {
        return rows?.sort((a, b) =>
          this.getTime(a?.startTime) > this.getTime(b?.startTime) ? 1 : -1
        );
      }
    }

    return rows?.sort((a, b) => {
      const aIndex = timeSlots?.indexOf(a?.startTime);
      const bIndex = timeSlots?.indexOf(b?.startTime);
      return aIndex - bIndex;
    });
  }

  addLeadingZero(val: string): string {
    const parsedNumber = parseInt(val, 10);
    if (!isNaN(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 9) {
      return val.split('')[0] === '0' ? val : '0' + val;
    }
    return val;
  }

  adjustStartEndTime(
    dataArrays,
    obj,
    slotStartTime,
    objStartLastTime,
    allSlots
  ) {
    const totalDiff = this.getTimeDifference(slotStartTime, objStartLastTime);
    let highestEndTime = '';
    dataArrays.forEach((item) => {
      highestEndTime = this.addTime(item.endTime, 0, 1);
    });

    if (highestEndTime !== '') {
      let endTimeDiff = this.getTimeDifference(highestEndTime, obj?.startTime);
      if (totalDiff < endTimeDiff) {
        this.sortArray(dataArrays, allSlots);
        return obj;
      }
      if (endTimeDiff > 0) {
        obj.startTime = this.subtractTime(obj?.startTime, endTimeDiff, 0);
        if (obj.index === 2) {
          endTimeDiff = obj.index;
        } else {
          obj.endTime = this.subtractTime(obj.endTime, endTimeDiff, 0);
        }
      }
    }
    return obj;
  }

  addMissingTimeIntervals(data, timeSlots) {
    const newObjects = [];

    data = data.map((item) => ({
      startTime: this.addLeadingZero(item.startTime),
      endTime: this.addLeadingZero(item.endTime)
    }));

    data = this.sortArray(data, timeSlots);

    if (data[0].startTime !== timeSlots[0]) {
      const newObject = {
        startTime: timeSlots[0],
        endTime: this.subtractTime(data[0].startTime, 0, 1),
        isBook: false
      };
      newObjects.push(newObject);
    }

    for (let i = 0; i < data.length - 1; i++) {
      const currentEndTime = this.addLeadingZero(
        this.addTime(data[i].endTime, 0, 1)
      );
      const nextStartTime = this.addLeadingZero(data[i + 1].startTime);
      if (currentEndTime !== nextStartTime) {
        const newObject = {
          startTime: currentEndTime,
          endTime: nextStartTime,
          isBook: false
        };
        newObjects.push(newObject);
      }
    }
    data.push(...newObjects);
    data = this.sortArray(data, timeSlots);
    return data;
  }

  addLeadingZeroData(timeString) {
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');

    const paddedHours = hours.padStart(2, '0');
    const paddedMinutes = minutes.padStart(2, '0');

    return `${paddedHours}:${paddedMinutes} ${ampm}`;
  }

  hasMinutes(time) {
    const timeParts = time.split(':');
    const minutes = parseInt(timeParts[1], 10);

    return minutes;
  }

  private getDateString(data?: Date): string {
    const currentDate = data ? new Date(data) : new Date();
    const date = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return `${year}-${month}-${date}`;
  }
}
