import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { shiftDefaultPayload } from '../schedule-configuration/schedule-configuration.constants';

const enum TimeType {
  am = 'AM',
  pm = 'PM'
}

@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss']
})
export class ShiftChartComponent implements OnInit {
  @Input() slots: string[] = [];
  @Input() col = 0;
  @Input() shift: AbstractControl;
  @Input() shiftIdx: number;
  @Output() updateShiftSlot: EventEmitter<any> = new EventEmitter<any>();
  dataArrays: {
    index: number;
    startTime: string;
    endTime: string;
  }[] = [];
  addForm: FormGroup;
  itemForm: FormGroup;
  tableColCount: number | undefined;
  slotsArray: FormArray;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      items: [null, Validators.required]
    });
    this.slotsArray = this.fb.array([]);
    this.addForm.addControl('slotsArray', this.slotsArray);
    this.shift.valueChanges.subscribe((v) => console.log(v));
  }

  toggleSlot(val: string, idx: number): void {
    if (this.isTimeSlotPresent(val, this.dataArrays)) {
      const indexOfMatchObject: number = this.dataArrays.findIndex(
        (x) =>
          x?.startTime ===
          this.getMatchingObject(val, this.dataArrays)?.startTime
      );
      const matchObject = this.getMatchingObject(val, this.dataArrays);

      let timeDiff = this.getTimeDifference(matchObject?.startTime, val);
      timeDiff = timeDiff === 0 ? 1 : timeDiff;
      const oldIndex: number = this.dataArrays[indexOfMatchObject]?.index;
      this.dataArrays[indexOfMatchObject].index = Math.abs(timeDiff);

      const lastTime: string = this.dataArrays[indexOfMatchObject]?.endTime;
      this.dataArrays[indexOfMatchObject].endTime = this.subtractTime(
        val,
        0,
        1
      );
      const obj = {
        index: Math.abs(oldIndex - timeDiff),
        startTime: this.subtractTime(val, 0, 0),
        endTime: lastTime
      };
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
    } else {
      for (const data of this.dataArrays) {
        idx = Math.abs(data?.index - idx);
      }
      this.tableColCount = this.slots?.indexOf(val);
      this.col = this.slots?.length - this.tableColCount;
      const obj = {
        index: idx,
        startTime: this.subtractTime(val, idx, 0),
        endTime: this.subtractTime(val, 0, 1)
        // isBook: true
      };
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
    }
    this.dataArrays?.sort((a, b) =>
      new Date(`2000-01-01 ${a.startTime}`).getTime() >
      new Date(`2000-01-01 ${b.startTime}`).getTime()
        ? 1
        : -1
    );
    this.setShiftDetails();
  }

  onAddRow(): void {
    this.slotsArray.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number, objValue): void {
    this.slotsArray.removeAt(rowIndex);
    this.dataArrays = this.dataArrays?.filter(
      (obj) => objValue?.index !== obj?.index
    );
    this.setShiftDetails();
    if (this.dataArrays.length === 0) {
      this.col = 0;
    }
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      startTime: null,
      endTime: null,
      qty: null,
      colspan: null
    });
  }

  subtractTime(timeString, subtractHours, subtractMinutes) {
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
    if (timeType.toLowerCase() === TimeType.pm) {
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

  // Helper function to pad single-digit numbers with a leading zero
  padZero(val: number): string {
    return val?.toString().padStart(2, '0');
  }

  get slotsControls() {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }

  isTimeSlotPresent(timeSlot: string, slots): boolean {
    const time = new Date(`2000-01-01 ${timeSlot}`).getTime();
    return slots?.some((obj) => {
      const startTime: number = new Date(
        `2000-01-01 ${obj?.startTime}`
      ).getTime();
      const endTime: number = new Date(`2000-01-01 ${obj?.endTime}`).getTime();
      return time >= startTime && time <= endTime;
    });
  }

  getMatchingObject(timeSlot, arrayOfObjects) {
    const time = new Date(`2000-01-01 ${timeSlot}`).getTime();
    const matchingObject = arrayOfObjects?.find((obj) => {
      const startTime = new Date(`2000-01-01 ${obj.startTime}`).getTime();
      const endTime = new Date(`2000-01-01 ${obj.endTime}`).getTime();
      return time >= startTime && time <= endTime;
    });
    return matchingObject || null;
  }

  subtractTimes(first: string, second: string): string {
    const [hours1, minutes1, period1] =
      first?.match(/(\d+):(\d+) ([APM]{2})/) ?? [];
    const [hours2, minutes2, period2] =
      second?.match(/(\d+):(\d+) ([APM]{2})/) ?? [];

    const totalMinutes1: number = this.convertToMinutes(
      hours1,
      minutes1,
      period1
    );
    const totalMinutes2: number = this.convertToMinutes(
      hours2,
      minutes2,
      period2
    );
    const diffMinutes: number = (totalMinutes1 - totalMinutes2 + 720) % 720;
    const resultHours: number = Math.floor(diffMinutes / 60);
    const resultMinutes: number = diffMinutes % 60;
    const resultTime: string = this.formatTime(resultHours, resultMinutes);

    return resultTime;
  }

  convertToMinutes(hours: string, minutes: string, period: string): number {
    let totalMinutes: number = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    if (period?.toUpperCase() === TimeType.pm) {
      totalMinutes += 12 * 60;
    }
    return totalMinutes;
  }

  formatTime(hours: number, minutes: number): string {
    const period = hours >= 12 ? TimeType.pm : TimeType.am;
    const formattedHours: string = (hours % 12 || 12).toString();
    const formattedMinutes: string = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  getTimeDifference(firstTime: string, secondTime: string): number {
    const timeDifference: number =
      new Date(`2000/01/01 ${secondTime}`).getHours() -
      new Date(`2000/01/01 ${firstTime}`).getHours();
    return timeDifference;
  }

  private setShiftDetails() {
    if (this.shift?.value?.id) {
      this.updateShiftSlot.emit({
        [this.shift.value.id]: this.dataArrays.map((d) => ({
          startTime: d.startTime,
          endTime: d.endTime
        }))
      });
    }
    if (this.shift?.value?.null) {
      let obj: any = shiftDefaultPayload;
      if (this.dataArrays.length > 0) {
        obj = this.dataArrays.map((d) => ({
          startTime: d.startTime,
          endTime: d.endTime
        }));
      }
      this.updateShiftSlot.emit(obj);
    }
  }
}
