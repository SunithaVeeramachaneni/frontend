/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { scheduleConfigs } from '../../../forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import {
  MatCalendarCellCssClasses,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { format } from 'date-fns';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { tap } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { transferQuestionFromSection } from 'src/app/forms/state/builder/builder.actions';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviseScheduleComponent implements OnInit {
  @ViewChild('shiftSelect') shiftSelect: MatSelect;
  @Output() openCloseRightPanelEvent = new EventEmitter<boolean>();
  @Input() set nodeIdToNodeName(nodeIdToNodeName: any) {
    this._nodeIdToNodeName = nodeIdToNodeName;
  }
  get nodeIdToNodeName() {
    return this._nodeIdToNodeName;
  }
  @Input() set reviseSchedule(reviseSchedule: any) {
    this.reviseScheduleConfig = reviseSchedule;
    this.shiftsSelected.patchValue(this.reviseScheduleConfig.shiftSlots);
  }
  get reviseSchedule() {
    return this.reviseScheduleConfig;
  }
  locations = {};
  showLocations = true;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  resviseScheduleConfigForm: FormGroup;
  shiftsSelected = new FormControl('');
  allSlots = [];
  allShifts = [];
  reviseScheduleConfig;
  locationListToTask$: any;
  locationIdToTaskcount = new Map<string, string>();
  locationIdToTaskcountArr: [string, string][] = [];
  _nodeIdToNodeName: any;
  scheduleConfig: any;
  configuarations = [];
  revisedInfo = {};

  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.locationListToTask$ = this.operatorRoundService.checkboxStatus$.pipe(
      tap((data) => {
        console.log(data);
        const selectedPage = data.selectedPage;
        const nodeId = data.nodeId;
        if (!this.locationIdToTaskcount.has(nodeId)) {
          this.locationIdToTaskcount.set(nodeId, '0');
        }
        let taskCount = 0;
        let totalTaskCount = 0;
        selectedPage.forEach((page) => {
          page.questions.forEach((question) => {
            if (question.complete) taskCount++;
            totalTaskCount++;
          });
        });
        if (totalTaskCount === taskCount)
          this.locationIdToTaskcount.set(nodeId, 'All ');
        else this.locationIdToTaskcount.set(nodeId, taskCount.toString());
        this.locationIdToTaskcountArr = Array.from(this.locationIdToTaskcount);
      })
    );
    this.resviseScheduleConfigForm = this.fb.group({
      scheduleType: [''],
      repeatDuration: ['', [Validators.required, Validators.min(1)]],
      repeatEvery: [''],
      daysOfWeek: [[]],
      monthlyDaysOfWeek: this.fb.array(
        this.initMonthWiseWeeklyDaysOfWeek(this.weeksOfMonth.length)
      ),
      startDate: [''],
      startDatePicker: [''],
      endDate: [''],
      endDatePicker: ['']
    });

    if (this.reviseScheduleConfig) {
      this.resviseScheduleConfigForm.patchValue({
        scheduleType: this.reviseScheduleConfig.scheduleType,
        repeatDuration: this.reviseScheduleConfig.repeatDuration,
        repeatEvery: this.reviseScheduleConfig.repeatEvery,
        daysOfWeek: this.reviseScheduleConfig.daysOfWeek,
        monthlyDaysOfWeek: this.reviseScheduleConfig.monthlyDaysOfWeek,
        startDate: format(
          new Date(this.reviseScheduleConfig.startDate),
          'd MMM yyyy'
        ),
        startDatePicker: new Date(this.reviseScheduleConfig.startDate),
        endDate: format(
          new Date(this.reviseScheduleConfig.endDate),
          'd MMM yyyy'
        ),
        endDatePicker: new Date(this.reviseScheduleConfig.endDate)
      });

      this.allSlots = this.prepareShiftAndSlot(
        this.reviseScheduleConfig.shiftSlots,
        this.reviseScheduleConfig.shiftDetails
      );
      this.allShifts = this.reviseScheduleConfig.shiftSlots;
    }
  }

  prepareShiftAndSlot(shiftSlot, shiftDetails) {
    if (Object.keys(shiftDetails)[0] === 'null') {
      return shiftSlot;
    } else {
      shiftSlot.forEach((data) => {
        data.payload = shiftDetails[data.id].map((pLoad) => {
          pLoad.checked = true;
          return pLoad;
        });
      });
      return shiftSlot;
    }
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.resviseScheduleConfigForm.get('monthlyDaysOfWeek') as FormArray;
  }

  get selectedShiftData(): string {
    if (this.allSlots.length > 0) {
      return this.allSlots
        ?.slice(0, 3)
        .map((s) => s?.name)
        .join(', ');
    }
    return '';
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {
    if (formControlDateField === 'startDate') {
      this.resviseScheduleConfigForm.patchValue(
        { startDate: format(new Date(event.target.value), 'd MMM yyyy') },
        { emitEvent: false }
      );
    } else if (formControlDateField === 'endDate') {
      this.resviseScheduleConfigForm.patchValue(
        { endDate: format(new Date(event.target.value), 'd MMM yyyy') },
        { emitEvent: false }
      );
    }
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.reviseScheduleConfig?.scheduleByDates
        .map((strDate) => new Date(strDate.date))
        .some(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );
      if (highlightDate) {
        return ['selected'];
      }
    };
  }

  updateScheduleByDates(event: MatDatepickerInputEvent<Date>) {}

  onShiftChange(event) {
    if (event.value.length !== 0) {
      event.value.forEach((shift) => {
        shift.payload.forEach((slot) => {
          slot.checked = true;
        });
      });
      this.allSlots = event.value;
    } else {
      this.allSlots = [{ null: { startTime: '00:00', endTime: '23:59' } }];
      this.shiftsSelected['controls'].value = this.allSlots;
    }
  }

  cancel() {
    this.openCloseRightPanelEvent.emit(false);
  }

  compareFn(o1: any, o2: any) {
    if (o1.id === o2.id) return true;
    else return false;
  }

  checkboxEventSlots(checked, selectedShift, slotSelected) {
    let uncheckedCount = 0;
    selectedShift.payload.forEach((slot) => {
      if (
        slot.startTime === slotSelected.startTime &&
        slot.endTime === slotSelected.endTime
      ) {
        checked ? (slot.checked = true) : (slot.checked = false);
      }
      if (!slot.checked) uncheckedCount++;
    });
    if (uncheckedCount === selectedShift.payload.length) {
      this.allSlots = this.allSlots.filter(
        (shifts) => shifts.id !== selectedShift.id
      );
    }
    if (this.allSlots.length === 0) {
      this.allSlots = [{ null: { startTime: '00:00', endTime: '23:59' } }];
    }
    this.shiftSelect.value = this.allSlots;
  }

  filterConfig(config) {
    if (config.scheduleType) {
      if (config.repeatTypes === 'day') {
        config.daysToWeeks = [1];
        config.monthlyDaysOfWeek = [[1], [1], [1], [1], [1]];
      } else if (config.repeatTypes === 'week') {
        config.monthlyDaysOfWeek = [[1], [1], [1], [1], [1]];
      } else {
        config.daysToWeeks = [1];
      }
    } else {
      config.daysToWeeks = [1];
      config.monthlyDaysOfWeek = [[1], [1], [1], [1], [1]];
    }
  }

  comparingConfig(newConfig) {
    // newConfig.shiftDetails = JSON.parse(
    //   JSON.stringify(this.prepareShiftSlot(this.allSlots))
    // );
    newConfig.shiftDetails = { ...this.prepareShiftSlot(this.allSlots) };
    this.filterConfig(newConfig);
    console.log('newConfig', newConfig);

    let configIndex = 0;
    let configFound = false;
    if (!this.configuarations) {
      this.configuarations.push(JSON.parse(JSON.stringify(newConfig)));
      this.operatorRoundService.setuniqueConfiguration(this.configuarations);
      return 0;
    }
    this.configuarations.forEach((config, index) => {
      if (isEqual(newConfig, config)) {
        console.log('isEqual', config);
        configFound = true;
        configIndex = index;
      }
    });
    if (!configFound) {
      this.configuarations.push(JSON.parse(JSON.stringify(newConfig)));
      this.operatorRoundService.setuniqueConfiguration(this.configuarations);
      return this.configuarations.length - 1;
    } else {
      return configIndex;
    }
  }

  prepareShiftSlot(shiftSlotDetail) {
    if (shiftSlotDetail[0].null) {
      return shiftSlotDetail[0];
    } else {
      const shiftData = {};
      shiftSlotDetail.forEach((detail) => {
        if (detail.payload) {
          shiftData[detail.id] = detail.payload.filter((pLoad) => {
            if (pLoad.checked === true) return true;
            else return false;
          });
        } else {
          shiftData[detail.id] = [
            { startTime: detail.startTiem, endTime: detail.endTime }
          ];
        }
      });
      return shiftData;
    }
  }

  onRevise() {
    const configPosition = this.comparingConfig(
      this.resviseScheduleConfigForm.value
    );
    this.operatorRoundService.allPageCheckBoxStatus$.subscribe((pages) => {
      Object.keys(pages).forEach((key) => {
        pages[key].forEach((page) => {
          const nodeId = key.split('_')[1];
          page.questions.forEach((question) => {
            if (question.complete) {
              if (!this.revisedInfo[nodeId]) this.revisedInfo[nodeId] = {};
              this.revisedInfo[nodeId][question.id] =
                this.configuarations[configPosition];
            }
          });
        });
      });
    });
    this.operatorRoundService.setRevisedInfo(this.revisedInfo);
    console.log('revisedInfo:', this.revisedInfo);
    console.log('configurations:', this.configuarations);
  }
}