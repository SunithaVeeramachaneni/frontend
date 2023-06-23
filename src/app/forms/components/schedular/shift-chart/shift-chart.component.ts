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

import { shiftDefaultPayload } from '../schedule-configuration/schedule-configuration.constants';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';
@Component({
  selector: 'app-shift-chart',
  templateUrl: './shift-chart.component.html',
  styleUrls: ['./shift-chart.component.scss']
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
      if (matchObject.isBook === false) {
        if (matchObject?.endTime === this.service.addTime(val, 0, 59)) {
          this.dataArrays[indexOfMatchObject].isBook = true;
          this.setShiftDetails();
          return;
        }
        const oldIndex = this.dataArrays[indexOfMatchObject].index;
        if (matchObject?.startTime === val && matchObject?.index === 1) {
          this.dataArrays[indexOfMatchObject].isBook = true;
          this.setShiftDetails();
          return;
        }
        if (matchObject?.startTime === val) {
          alert(matchObject?.startTime === val);
          if (matchObject?.startTime === val && matchObject?.index === 1) {
            this.dataArrays[indexOfMatchObject].isBook = true;
            this.setShiftDetails();
            return;
          }
          this.dataArrays[indexOfMatchObject].isBook = true;
          this.dataArrays[indexOfMatchObject].endTime = this.service.addTime(
            val,
            1,
            0
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
          this.dataArrays = this.service.sortArray(this.dataArrays);
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
        if (this.dataArrays.filter((e) => e.startTime === val).length) {
          alert(this.dataArrays.filter((e) => e.startTime === val).length);
          const findIndx = this.dataArrays.findIndex(
            (e) => e.startTime === val
          );
          this.dataArrays[findIndx].isBook = true;
          this.dataArrays[findIndx].endTime = this.service.addTime(val, 1, 0);
          this.setShiftDetails();
          return;
        }
        const lastTIme = this.dataArrays[indexOfMatchObject].endTime;
        this.dataArrays[indexOfMatchObject].index = Math.abs(timeDiff);
        const oldIndex = this.dataArrays[indexOfMatchObject].index;
        this.dataArrays[indexOfMatchObject].endTime = this.service.subtractTime(
          val,
          0,
          1
        );
        obj = {
          index: Math.abs(oldIndex - timeDiff),
          startTime: this.service.subtractTime(val, 0, 0),
          endTime: lastTIme,
          isBook: true
        };
        this.dataArrays.push(obj);
        this.slotsArray.push(this.createItemFormGroup());
      }
    } else {
      for (const data of this.dataArrays) {
        idx = Math.abs(data.index - idx);
      }
      this.tableColCount = this.slots.indexOf(val);
      this.col = this.slots.length - this.tableColCount;
      const obj = {
        index: idx,
        startTime: this.service.subtractTime(val, idx, 0),
        endTime: this.service.subtractTime(val, 0, 1),
        isBook: true
      };
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
    }
    this.dataArrays = this.service.sortArray(this.dataArrays);
    this.setShiftDetails();
  }

  public onRemoveRow(rowIndex: number, _): void {
    const lastElement = this.dataArrays[this.dataArrays.length - 1];
    const ds = this.dataArrays.lastIndexOf(lastElement);
    if (ds === rowIndex) {
      this.slotsArray.removeAt(rowIndex);
      this.dataArrays.splice(rowIndex, 1);
    } else {
      this.dataArrays[rowIndex].isBook = false;
    }
    if (this.dataArrays.length === 0) {
      this.col = 0;
    }
    this.setShiftDetails();
  }

  public get slotsControls(): AbstractControl[] {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }

  public get getInitialTime(): string {
    if (this.slots?.length > 0) {
      return `${this.slots[0]} - ${this.service.addTime(
        this.slots[this.slots?.length - 1],
        0,
        59
      )}`;
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
      this.updateShiftSlot.emit({
        [this.shift.value.id]: this.dataArrays
          .filter((d) => d?.isBook)
          .map((d) => ({
            startTime: d?.startTime,
            endTime: d?.endTime
          }))
      });
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
      payload?.endTime
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
