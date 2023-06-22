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
  }[] = [];
  private addForm: FormGroup;
  private itemForm: FormGroup;
  private tableColCount: number | undefined;
  private slotsArray: FormArray;
  constructor(
    private readonly fb: FormBuilder,
    private readonly scheduleConfigurationService: ScheduleConfigurationService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      items: [null, Validators.required]
    });
    this.slotsArray = this.fb.array([]);
    this.addForm.addControl('slotsArray', this.slotsArray);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.shift?.value?.null) {
      this.slots = this.scheduleConfigurationService.generateTimeSlots(
        this.shift.value.null.startTime,
        this.shift.value.null.endTime
      );
    } else if (this.shift?.value?.id) {
      this.slots = this.scheduleConfigurationService.generateTimeSlots(
        this.shift.value.startTime,
        this.shift.value.endTime
      );
    }
  }

  public onAddSlot(val: string, idx: number): void {
    if (idx === this.slots?.length - 1) {
      return;
    }
    if (
      this.scheduleConfigurationService.isTimeSlotPresent(val, this.dataArrays)
    ) {
      const indexOfMatchObject = this.dataArrays.findIndex(
        (x) =>
          x?.startTime ===
          this.scheduleConfigurationService.getMatchingObject(
            val,
            this.dataArrays
          ).startTime
      );
      const matchObject = this.scheduleConfigurationService.getMatchingObject(
        val,
        this.dataArrays
      );
      let timeDiff = this.scheduleConfigurationService.getTimeDifference(
        matchObject?.startTime,
        val
      );
      timeDiff = timeDiff === 0 ? 1 : timeDiff;
      const oldIndex = this.dataArrays[indexOfMatchObject]?.index;
      this.dataArrays[indexOfMatchObject].index = Math.abs(timeDiff);
      const lastTIme = this.dataArrays[indexOfMatchObject]?.endTime;
      this.dataArrays[indexOfMatchObject].endTime =
        this.scheduleConfigurationService.subtractTime(val, 0, 1);
      const obj = {
        index: Math.abs(oldIndex - timeDiff),
        startTime: this.scheduleConfigurationService.subtractTime(val, 0, 0),
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
        startTime: this.scheduleConfigurationService.subtractTime(val, idx, 0),
        endTime: this.scheduleConfigurationService.subtractTime(val, 0, 1)
      };
      this.dataArrays.push(obj);
      this.slotsArray.push(this.createItemFormGroup());
    }
    this.dataArrays?.sort((a, b) =>
      this.scheduleConfigurationService.getTime(a?.startTime) >
      this.scheduleConfigurationService.getTime(b?.startTime)
        ? 1
        : -1
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

  public get slotsControls(): AbstractControl[] {
    return (this.addForm.get('slotsArray') as FormArray)?.controls;
  }

  public get getInitialTime(): string {
    if (this.slots?.length > 0) {
      return `${this.slots[0]} - ${this.scheduleConfigurationService.addTime(
        this.slots[this.slots?.length - 1],
        0,
        59
      )}`;
    }
    return;
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
        [this.shift.value.id]: this.dataArrays.map((d) => ({
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
          ['null']: this.dataArrays.map((d) => ({
            startTime: d?.startTime,
            endTime: d?.endTime
          }))
        };
      }
      this.updateShiftSlot.emit(obj);
    }
  }
}
