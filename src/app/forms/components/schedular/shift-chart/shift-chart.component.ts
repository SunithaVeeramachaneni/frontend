import {
  ChangeDetectionStrategy,
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

import { shiftDefaultPayload } from '../schedule-configuration/schedule-configuration.constants';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';
@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftChartComponent implements OnInit, OnChanges {
  @Input() slots: string[] = [];
  @Input() col = 0;
  @Input() shift: AbstractControl = null;
  @Input() shiftIdx: number;
  @Output() updateShiftSlot: EventEmitter<any> = new EventEmitter<any>();
  dataArrays: {
    index: number;
    startTime: string;
    endTime: string;
    isBook: boolean;
  }[] = [];
  private addForm: FormGroup;
  private itemForm: FormGroup;
  private tableColCount: number | undefined;
  private slotsArray: FormArray;
  constructor(
    private readonly fb: FormBuilder,
    private readonly service: ScheduleConfigurationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    /* TODO document why this method 'ngOnInit' is empty */
  }

  initForm() {
    this.addForm = this.fb.group({
      items: [null, Validators.required]
    });
    this.slotsArray = this.fb.array([]);
    this.addForm.addControl('slotsArray', this.slotsArray);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.shift?.value?.null) {
      this.slots = this.service.generateTimeSlots(
        this.shift.value.null.startTime,
        this.shift.value.null.endTime
      );
      if (this.shift?.value?.null?.payload) {
        this.initEditPayloadForSlots(this.shift.value.null.payload);
      }
    } else if (this.shift?.value?.id) {
      this.slots = this.service.generateTimeSlots(
        this.shift.value.startTime,
        this.shift.value.endTime
      );
      if (this.shift?.value?.payload) {
        this.initEditPayloadForSlots(this.shift.value.payload);
      }
    }
  }

  public onAddSlot(val: string, idx: number): void {
    const checkSlot = this.dataArrays.filter(
      (item) => item.startTime === this.service.addLeadingZero(val)
    );

    // 1. Check if slot is already added
    if (checkSlot.length || checkSlot.length > 0) {
      const checkIsBook = checkSlot.filter((e) => e.isBook === false);
      if (checkIsBook.length) {
        const isBookIndex = this.dataArrays.findIndex(
          (e) => e.isBook === false
        );
        this.dataArrays[isBookIndex].isBook = true;
        this.setShiftDetails();
        return;
      }
      if (checkSlot[0].index === 1 || checkSlot[0].index === 0) {
        this.setShiftDetails();
        return;
      }
      this.setShiftDetails();
      return;
    }
    // 2. If we create slot in already created slot
    if (this.service.isTimeSlotPresent(val, this.dataArrays)) {
      const indexOfMatchObject = this.dataArrays.findIndex(
        (x) =>
          x.startTime ===
          this.service.getMatchingObject(val, this.dataArrays).startTime
      );
      const matchObject: any = this.service.getMatchingObject(
        val,
        this.dataArrays
      );
      let timeDiff: any = this.service.getTimeDifference(
        matchObject?.startTime,
        val
      );
      timeDiff = timeDiff === 0 ? 1 : timeDiff;
      let obj: {
        index: number;
        startTime: string;
        endTime: string;
        isBook: boolean;
      };
      // 2.1 It will run when the slot is removed from the data
      if (matchObject.isBook === false) {
        if (matchObject?.endTime === this.service.addTime(val, 0, 59)) {
          this.dataArrays[indexOfMatchObject].isBook = true;
          const endTime = this.dataArrays[indexOfMatchObject].endTime;
          this.dataArrays[indexOfMatchObject].endTime =
            this.service.subtractTime(endTime, 0, 0);
          this.setShiftDetails();
          return;
        }
        if (matchObject?.endTime === this.service.addTime(val, 0, 1)) {
          this.dataArrays[indexOfMatchObject].isBook = true;
          const endTime = this.dataArrays[indexOfMatchObject].endTime;
          this.dataArrays[indexOfMatchObject].endTime =
            this.service.subtractTime(endTime, 0, 1);
          this.setShiftDetails();
          return;
        }
        const oldIndex = this.dataArrays[indexOfMatchObject].index;
        if (matchObject?.startTime === val && matchObject?.index === 1) {
          this.dataArrays[indexOfMatchObject].isBook = true;
          this.dataArrays[indexOfMatchObject].endTime = this.service.addTime(
            val,
            0,
            59
          );
          this.setShiftDetails();
          return;
        }
        if (matchObject?.startTime === val) {
          if (matchObject?.startTime === val && matchObject?.index === 1) {
            this.dataArrays[indexOfMatchObject].isBook = true;
            const endTime = this.dataArrays[indexOfMatchObject].endTime;
            this.dataArrays[indexOfMatchObject].endTime =
              this.service.subtractTime(endTime, 0, 1);
            this.setShiftDetails();
            return;
          }
          this.dataArrays[indexOfMatchObject].isBook = true;
          this.dataArrays[indexOfMatchObject].endTime = this.service.addTime(
            val,
            0,
            59
          );
          this.dataArrays[indexOfMatchObject].index = timeDiff;
          const diTime = Math.abs(oldIndex - timeDiff);
          obj = {
            index: Math.abs(oldIndex - timeDiff),
            startTime: this.service.addTime(val, 1, 0),
            endTime: this.service.addTime(val, diTime, 0),
            isBook: false
          };
          this.dataArrays.push(obj);
          this.dataArrays = this.service.sortArray(this.dataArrays, this.slots);
          this.slotsArray.push(this.createItemFormGroup());
          this.setShiftDetails();
          return;
        } else {
          this.dataArrays[indexOfMatchObject].endTime =
            this.service.subtractTime(val, 0, 1);
        }
        this.dataArrays[indexOfMatchObject].index = timeDiff;
        this.dataArrays[indexOfMatchObject].isBook = true;
        obj = {
          index: Math.abs(oldIndex - timeDiff),
          startTime: this.service.subtractTime(val, 0, 0),
          endTime: this.service.addTime(val, 1, 0),
          isBook: false
        };
        this.dataArrays.push(obj);
        this.slotsArray.push(this.createItemFormGroup());
      } else {
        // 2.2 If slot is deleted and we are adding a new which is not existing.
        if (this.dataArrays.filter((e) => e.startTime === val).length) {
          const findIndx = this.dataArrays.findIndex(
            (e) => e.startTime === val
          );
          this.dataArrays[findIndx].isBook = true;
          this.dataArrays[findIndx].endTime = this.service.addTime(val, 0, 59);
          this.setShiftDetails();
          return;
        }
        const lastTIme = this.dataArrays[indexOfMatchObject].endTime;
        const oldIndex = this.dataArrays[indexOfMatchObject].index;
        this.dataArrays[indexOfMatchObject].index = Math.abs(timeDiff);
        this.dataArrays[indexOfMatchObject].endTime = this.service.subtractTime(
          val,
          0,
          1
        );
        obj = {
          index: Math.abs(oldIndex - timeDiff),
          startTime: this.service.subtractTime(val, 0, 0),
          endTime: timeDiff === 1 ? this.service.addTime(val, 0, 59) : lastTIme,
          isBook: true
        };
        this.dataArrays.push(obj);
        this.slotsArray.push(this.createItemFormGroup());
      }
    } else {
      // 3. If we a add new slot
      for (const data of this.dataArrays) {
        idx = Math.abs(data.index - idx);
      }
      this.tableColCount = this.slots.indexOf(val);
      this.col = this.slots.length - this.tableColCount;

      const obj = {
        index: idx,
        startTime: idx === 1 ? val : this.service.subtractTime(val, idx, 0),
        endTime:
          idx === 1 || idx === 0
            ? this.service.addTime(val, 0, 59)
            : this.service.subtractTime(val, 0, 1),
        isBook: true
      };
      if (this.dataArrays?.length === 0) {
        obj.startTime = this.slots[0];
        const timeDiff1 = this.service.getTimeDifference(
          obj.startTime,
          this.service.addTime(obj.endTime, 0, 1)
        );
        obj.index = timeDiff1;
      }
      if (
        this.dataArrays.filter((item) => item.endTime === obj.endTime).length
      ) {
        this.setShiftDetails();
        return;
      }
      if (val === this.slots[this.slots.length - 2]) {
        obj.endTime = this.service.addTime(val, 0, 59);
      }
      // If we select last slot then it will work
      if (
        this.shift?.value?.null &&
        val === this.slots[this.slots.length - 2]
      ) {
        obj.index = idx + 1;
        obj.endTime = this.service.addTime(val, 0, 59);
      }
      if (val === this.slots[0]) {
        obj.index = idx + 1;
        obj.endTime = this.service.addTime(val, 0, 59);
      }
      if (val === this.slots[this.slots.length - 2]) {
        obj.index = idx + 1;
      }

      if (
        this.dataArrays.filter(
          (item) =>
            this.service.addLeadingZero(item.startTime) === obj.startTime &&
            obj.index > 1
        ).length
      ) {
        obj.startTime = this.service.addTime(obj.startTime, 1, 0);
        obj.index = obj.index - 1;
      }

      // If we add slot from left to right and endTime and startTime are equal
      if (
        this.dataArrays.filter(
          (item) => item.endTime === this.service.addTime(obj?.startTime, 0, 59)
        ).length
      ) {
        obj.startTime = this.service.addTime(obj.startTime, 1, 0);
        obj.index = obj.index - 1;
      }

      // If we select first slot from two hour duration
      if (
        this.dataArrays?.length === 1 &&
        this.dataArrays[0]?.index === 1 &&
        obj?.index === 1
      ) {
        let timeDiff1: any = this.service.getTimeDifference(
          this.service.addTime(this.dataArrays[0]?.startTime, 0, 1),
          val
        );
        timeDiff1 = timeDiff1 - 1;
        obj.startTime = this.service.subtractTime(obj?.startTime, timeDiff1, 0);
        obj.endTime = this.service.subtractTime(obj?.endTime, timeDiff1, 0);
      }
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
      this.dataArrays = this.service.sortArray(this.dataArrays, this.slots);
    }
    this.dataArrays = this.service.sortArray(this.dataArrays, this.slots);
    this.setShiftDetails();
  }

  public onRemoveRow(rowIndex: number, objVal): void {
    const lastElement = this.dataArrays[this.dataArrays.length - 1];
    const ds = this.dataArrays.lastIndexOf(lastElement);
    if (ds === rowIndex) {
      this.slotsArray.removeAt(rowIndex);
      this.dataArrays.splice(rowIndex, 1);
    } else {
      this.dataArrays[rowIndex].isBook = false;
      const myData = this.dataArrays.filter(
        (e) =>
          (e.startTime === this.service.addTime(objVal.endTime, 0, 1) ||
            this.service.addTime(e.endTime, 0, 1) === objVal.startTime) &&
          e.isBook === false
      );
      const newObject: any = {};
      if (myData.length) {
        newObject.index = objVal.index + myData[0]?.index;
        newObject.startTime =
          this.service.addTime(myData[0].endTime, 0, 1) === objVal.startTime
            ? myData[0]?.startTime
            : objVal?.startTime;
        newObject.endTime =
          this.service.addTime(myData[0].endTime, 0, 1) === objVal.startTime
            ? objVal?.endTime
            : myData[0].endTime;
        newObject.isBook = false;
        this.dataArrays.splice(rowIndex, 1);
        const idx = this.dataArrays.findIndex((e) => e === myData[0]);
        this.dataArrays.splice(idx, 1);
        this.slotsArray.removeAt(idx);
        this.dataArrays.push(newObject);
        this.service.sortArray(this.dataArrays, this.slots);
      } else {
        this.dataArrays[rowIndex].isBook = false;
      }
    }
    this.dataArrays = this.service.sortArray(this.dataArrays, this.slots);
    if (this.dataArrays.length === 0) {
      this.col = 0;
    }
    if (
      this.dataArrays.filter((item) => item.isBook === false).length ===
      this.dataArrays.length
    ) {
      this.col = 0;
      this.dataArrays = [];
      const frmArray = this.addForm.get('slotsArray') as FormArray;
      frmArray.clear();
    }

    this.setShiftDetails();
  }

  public get slotsControls(): AbstractControl[] {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }

  public get getInitialTime(): string {
    if (this.slots?.length > 0) {
      const startTime = this.slots[0];
      const endTime = this.slots[this.slots?.length - 2];
      if (this.shift?.value?.id) {
        return `${startTime} - ${this.service.subtractTime(
          this.slots[this.slots?.length - 1],
          0,
          1
        )}`;
      } else {
        return `${startTime} - ${this.service.addTime(endTime, 0, 59)}`;
      }
    }
    return '';
  }

  private createItemFormGroup(): FormGroup {
    return this.fb.group({
      startTime: null,
      endTime: null
    });
  }

  private setShiftDetails(): void {
    if (this.shift?.value?.id) {
      if (this.dataArrays?.length === 0) {
        this.updateShiftSlot.emit({
          [this.shift.value.id]: [
            {
              startTime: this.service.convertTo12HourFormat(
                this.shift?.value?.startTime
              ),
              endTime: this.service.subtractTime(
                this.service.convertTo12HourFormat(this.shift?.value?.endTime),
                0,
                1
              )
            }
          ]
        });
      } else {
        this.updateShiftSlot.emit({
          [this.shift.value.id]: this.dataArrays
            .filter((d) => d?.isBook)
            .map((d) => ({
              startTime: d?.startTime,
              endTime: d?.endTime
            }))
        });
      }
    }
    if (this.shift?.value?.null) {
      let obj: { [x: string]: { startTime: string; endTime: string }[] } =
        shiftDefaultPayload;
      if (this.dataArrays.length > 0) {
        obj = {
          null: this.dataArrays
            .filter((d) => d?.isBook)
            .map((d) => ({
              startTime: d?.startTime,
              endTime: d?.endTime
            }))
        };
      }
      this.updateShiftSlot.emit(obj);
    }
  }

  private initEditPayloadForSlots(payload) {
    if (Array.isArray(payload)) {
      this.col = payload?.length;
      payload?.forEach((p) => this.prepareSelectedTime(p));
    } else {
      this.col = 1;
      this.prepareSelectedTime(payload);
    }
  }

  private prepareSelectedTime(payload) {
    let timeDiff = this.service.getTimeDifference(
      payload?.startTime,
      this.service.addTime(payload?.endTime, 0, 1)
    );
    timeDiff = timeDiff === 0 ? 1 : timeDiff;
    const obj = {
      index: timeDiff,
      startTime: payload.startTime,
      endTime: payload.endTime,
      isBook: true
    };
    this.dataArrays.push(obj);
    this.slotsArray.push(this.createItemFormGroup());
    this.setShiftDetails();
  }
}
