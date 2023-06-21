import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  TimeType,
  shiftDefaultPayload
} from '../schedule-configuration/schedule-configuration.constants';
@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss']
})
export class ShiftChartComponent implements OnInit, OnChanges {
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
  private addForm: FormGroup;
  private itemForm: FormGroup;
  private tableColCount: number | undefined;
  private slotsArray: FormArray;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      items: [null, Validators.required]
    });
    this.slotsArray = this.fb.array([]);
    this.addForm.addControl('slotsArray', this.slotsArray);
    this.shift.valueChanges.subscribe((v) => console.log(v));
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.shift?.value?.null) {
      this.slots = this.generateTimeSlots(
        this.shift.value.null.startTime,
        this.shift.value.null.endTime
      );
    } else if (this.shift?.value?.id) {
      this.slots = this.generateTimeSlots(
        this.shift.value.startTime,
        this.shift.value.endTime
      );
    }
  }

  public onAddSlot(val: string, idx: number): void {
    if (idx === this.slots?.length - 1) {
      return;
    }
    if (this.isTimeSlotPresent(val, this.dataArrays)) {
      const indexOfMatchObject = this.dataArrays.findIndex(
        (x) =>
          x?.startTime ===
          this.getMatchingObject(val, this.dataArrays).startTime
      );
      const matchObject = this.getMatchingObject(val, this.dataArrays);
      let timeDiff = this.getTimeDifference(matchObject?.startTime, val);
      timeDiff = timeDiff === 0 ? 1 : timeDiff;
      const oldIndex = this.dataArrays[indexOfMatchObject]?.index;
      this.dataArrays[indexOfMatchObject].index = Math.abs(timeDiff);
      const lastTIme = this.dataArrays[indexOfMatchObject]?.endTime;
      this.dataArrays[indexOfMatchObject].endTime = this.subtractTime(
        val,
        0,
        1
      );
      const obj = {
        index: Math.abs(oldIndex - timeDiff),
        startTime: this.subtractTime(val, 0, 0),
        endTime: lastTIme
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
      };
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
    }
    this.dataArrays?.sort((a, b) =>
      this.getTime(a?.startTime) > this.getTime(b?.startTime) ? 1 : -1
    );
    this.setShiftDetails();
  }

  public onRemoveRow(rowIndex: number, objValue): void {
    this.slotsArray.removeAt(rowIndex);
    this.dataArrays = this.dataArrays?.filter(
      (obj) => objValue?.index !== obj?.index
    );
    this.setShiftDetails();
    if (this.dataArrays.length === 0) {
      this.col = 0;
    }
  }

  public subtractTime(
    timeString: string,
    subtractHours: number,
    subtractMinutes: number
  ): string {
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
    if (timeType?.toLowerCase() === TimeType.pm) {
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

  get slotsControls(): AbstractControl[] {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }

  private padZero(val: number): string {
    return val?.toString().padStart(2, '0');
  }

  private createItemFormGroup(): FormGroup {
    return this.fb.group({
      startTime: null,
      endTime: null,
      qty: null,
      colspan: null
    });
  }

  private isTimeSlotPresent(timeSlot: string, slots): boolean {
    const time = this.getTime(timeSlot);
    return slots?.some((obj) => {
      const startTime: number = this.getTime(obj?.startTime);
      const endTime: number = this.getTime(obj?.endTime);
      return time >= startTime && time <= endTime;
    });
  }

  private getMatchingObject(timeSlot, arrayOfObjects) {
    const time = this.getTime(timeSlot);
    const matchingObject = arrayOfObjects?.find((obj) => {
      const startTime: number = this.getTime(obj?.startTime);
      const endTime: number = this.getTime(obj?.endTime);
      return time >= startTime && time <= endTime;
    });
    return matchingObject || null;
  }

  private getTime(time: string): number {
    return new Date(`2000-01-01 ${time}`).getTime();
  }

  private getHours(time: string): number {
    return new Date(`2000-01-01 ${time}`).getHours();
  }

  private getTimeDifference(firstTime: string, secondTime: string): number {
    const timeDifference: number =
      this.getHours(secondTime) - this.getHours(firstTime);
    return timeDifference;
  }

  private generateTimeSlots(startTime: string, endTime: string): string[] {
    const timeSlots: string[] = [];
    const start: Date = new Date('2000-01-01 ' + startTime);
    const end: Date = new Date('2000-01-01 ' + endTime);

    // Set the start time as the current time
    const current: Date = new Date(start);

    // Add one hour to the current time until it exceeds the end time
    while (current <= end) {
      const formattedTime = current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      timeSlots.push(formattedTime.toLocaleUpperCase());
      current.setHours(current.getHours() + 1);
    }
    return timeSlots;
  }

  private setShiftDetails(): void {
    if (this.shift?.value?.id) {
      this.updateShiftSlot.emit({
        [this.shift.value.id]: this.dataArrays.map((d) => ({
          startTime: d.startTime,
          endTime: d.endTime
        }))
      });
    }
    if (this.shift?.value?.null) {
      let obj: { [x: string]: any } = shiftDefaultPayload;
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
