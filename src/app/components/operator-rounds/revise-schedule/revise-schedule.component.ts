/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
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
  MatCalendar,
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
import { cloneDeep, isEqual } from 'lodash-es';
import { dateFormat4 } from 'src/app/app.constants';
import { ScheduleByDate, TaskLevelScheduleSubForm } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviseScheduleComponent implements OnInit {
  @ViewChild('shiftSelect') shiftSelect: MatSelect;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Output() openCloseRightPanelEvent = new EventEmitter<boolean>();
  @Output() resetTaskLevelConfigurationSelectionsEvenet =
    new EventEmitter<boolean>();
  @Input() roundPlanData: any;
  @Input() plantTimezoneMap: any;
  @Input() set nodeIdToNodeName(nodeIdToNodeName: any) {
    this._nodeIdToNodeName = nodeIdToNodeName;
  }
  get nodeIdToNodeName() {
    return this._nodeIdToNodeName;
  }
  @Input() set reviseSchedule(reviseSchedule: any) {
    if (reviseSchedule) {
      this.reviseScheduleConfig = reviseSchedule;
      this.shiftsSelected.patchValue(this.reviseScheduleConfig.shiftSlots);
      this.allSlots = this.prepareShiftAndSlot(
        this.reviseScheduleConfig.shiftSlots,
        this.reviseScheduleConfig.shiftDetails
      );
      this.allShifts = this.reviseScheduleConfig.shiftSlots;
    }
  }
  get reviseSchedule() {
    return this.reviseScheduleConfig;
  }
  @Input() uniqueConfigurations;

  locations = {};
  showLocations = true;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  reviseScheduleConfigForm: FormGroup;
  shiftsSelected = new FormControl('');
  allSlots = [];
  allShifts = [];
  reviseScheduleConfig;
  locationListToTask$: any;
  locationIdToTaskcount = new Map<string, string>();
  locationIdToTaskcountArr: [string, string][] = [];
  _nodeIdToNodeName: any;
  scheduleConfig: any;
  configurations = [];
  revisedInfo = {};
  scheduleByDates: ScheduleByDate[];
  revisedInfo$: Observable<any>;
  allPageCheckBoxStatus$: Observable<TaskLevelScheduleSubForm>;
  subForms: TaskLevelScheduleSubForm = {};
  placeHolder = '_ _';
  minDate: Date;
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.allPageCheckBoxStatus$ =
      this.operatorRoundService.allPageCheckBoxStatus$.pipe(
        tap((subForms) => {
          this.subForms = subForms;
          this.setCommonConfig(true);
        })
      );

    this.locationListToTask$ = this.operatorRoundService.checkboxStatus$.pipe(
      tap((data) => {
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
        else if (taskCount === 0) this.locationIdToTaskcount.delete(nodeId);
        else this.locationIdToTaskcount.set(nodeId, taskCount.toString());
        this.locationIdToTaskcountArr = Array.from(this.locationIdToTaskcount);

        if (this.locationIdToTaskcountArr.length === 0)
          this.openCloseRightPanelEvent.emit(false);
        this.setCommonConfig();
      })
    );
    this.reviseScheduleConfigForm = this.fb.group({
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
      this.resetReviseScheduleConfigForm();
      this.scheduleByDates = this.reviseScheduleConfig.scheduleByDates;
      const scheduleDate = this.reviseScheduleConfig.scheduleByDates;
      this.minDate = new Date(
        Math.min(...scheduleDate.map((item) => item.date))
      );
      this.maxDate = new Date(
        Math.max(...scheduleDate.map((item) => item.date))
      );
    }
    this.revisedInfo$ = this.operatorRoundService.revisedInfo$.pipe(
      tap((revisedInfo) => {
        this.revisedInfo = revisedInfo;
      })
    );
  }

  prepareShiftAndSlot(shiftSlot, shiftDetails) {
    if (Object.keys(shiftDetails)[0] === 'null') {
      shiftSlot.forEach((data) => {
        data.payload = shiftDetails.null.map((pLoad) => {
          pLoad.checked = true;
          return pLoad;
        });
      });
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
    return this.reviseScheduleConfigForm.get('monthlyDaysOfWeek') as FormArray;
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
      this.reviseScheduleConfigForm.patchValue(
        { startDate: format(new Date(event.target.value), dateFormat4) },
        { emitEvent: false }
      );
    } else if (formControlDateField === 'endDate') {
      this.reviseScheduleConfigForm.patchValue(
        { endDate: format(new Date(event.target.value), dateFormat4) },
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

  findDate(date: Date): number {
    return this.scheduleByDates
      ?.map((scheduleByDate) => +scheduleByDate.date)
      .indexOf(+date);
  }

  updateScheduleByDates(date: Date) {
    const index = this.findDate(date);
    if (index === -1) {
      this.scheduleByDates = [
        ...this.scheduleByDates,
        {
          date: new Date(
            localToTimezoneDate(
              new Date(date),
              this.plantTimezoneMap[this.roundPlanData.plantId],
              ''
            )
          ),
          scheduled: false
        }
      ];
    } else {
      this.scheduleByDates.splice(index, 1);
    }
    this.calendar.updateTodaysDate();
  }

  onShiftChange(event) {
    if (event.value.length !== 0) {
      event.value.forEach((shift) => {
        shift.payload.forEach((slot) => {
          slot.checked = true;
        });
      });
      this.allSlots = event.value;
    } else {
      this.allSlots = [
        {
          null: { startTime: '12:00 AM', endTime: '11:59 PM' },
          payload: [{ startTime: '00:00', endTime: '23:59', checked: true }]
        }
      ];
      this.shiftsSelected.patchValue(this.allSlots);
    }
  }

  cancel() {
    this.openCloseRightPanelEvent.emit(false);
    this.resetTaskLevelConfigurationSelectionsEvenet.emit(true);
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
      this.allSlots = [
        {
          null: { startTime: '12:00 AM', endTime: '11:59 PM' },
          payload: [{ startTime: '00:00', endTime: '23:59', checked: true }]
        }
      ];
    }
    this.shiftSelect.value = this.allSlots;
  }

  comparingConfig(newConfig, scheduleByDates) {
    newConfig.shiftDetails = {
      ...this.prepareShiftSlot(this.allSlots)
    };
    let configIndex = 0;
    let configFound = false;
    const currentConfig = cloneDeep({ ...newConfig, scheduleByDates });
    if (!this.uniqueConfigurations.length) {
      this.uniqueConfigurations.push(currentConfig);
      this.operatorRoundService.setuniqueConfiguration(
        this.uniqueConfigurations
      );
      return 0;
    }
    this.uniqueConfigurations.forEach((config, index) => {
      if (
        this.operatorRoundService.comapreConfigurations(currentConfig, config)
      ) {
        configFound = true;
        configIndex = index;
      }
    });
    if (!configFound) {
      this.uniqueConfigurations.push(cloneDeep(currentConfig));
      this.operatorRoundService.setuniqueConfiguration(
        this.uniqueConfigurations
      );
      return this.uniqueConfigurations.length - 1;
    } else {
      return configIndex;
    }
  }

  prepareShiftSlot(shiftSlotDetail) {
    return shiftSlotDetail.reduce((acc, curr) => {
      acc[curr.id ? curr.id : 'null'] = curr.payload
        .map((pLoad) => {
          if (pLoad.checked === true) {
            return pLoad;
          }
        })
        .filter((value) => value);
      return acc;
    }, {});
  }

  setCommonConfig(initial = false) {
    // Common Config for Shifts is Left
    const questionKeys = [];
    if (Object.keys(this.revisedInfo).length === 0) return;

    let nodeId: string;
    Object.keys(this.subForms).forEach((subFormId) => {
      this.subForms[subFormId].forEach((page) => {
        page.questions.forEach((question) => {
          if (question.complete) {
            nodeId = subFormId.split('_')[1];
            questionKeys.push(question.id);
          }
        });
      });
    });

    if (
      questionKeys.length === 1 &&
      this.revisedInfo[nodeId] &&
      this.revisedInfo[nodeId][questionKeys[0]]
    ) {
      const { scheduleByDates, ...taskLevelScheduleConfig } =
        this.revisedInfo[nodeId][questionKeys[0]];
      this.reviseScheduleConfigForm.patchValue(taskLevelScheduleConfig);
      this.allSlots.forEach((allSlot) => {
        const { payload, ...shiftInfo } = allSlot;
        payload.forEach((slotInfo) => {
          if (
            taskLevelScheduleConfig.shiftDetails[
              shiftInfo.id ? shiftInfo.id : 'null'
            ] &&
            taskLevelScheduleConfig.shiftDetails[
              shiftInfo.id ? shiftInfo.id : 'null'
            ].find((selectedSlotInfo) => isEqual(slotInfo, selectedSlotInfo))
          ) {
            return slotInfo;
          }
          slotInfo.checked = false;
          return slotInfo;
        });
      });
      this.allSlots = this.allSlots.filter(({ payload }) =>
        payload.some(({ checked }) => checked)
      );
      this.shiftsSelected.patchValue(this.allSlots);
      if (this.allSlots.length === 0) {
        this.allSlots = [
          {
            null: { startTime: '12:00 AM', endTime: '11:59 PM' },
            payload: [{ startTime: '00:00', endTime: '23:59', checked: true }]
          }
        ];
      }
      if (this.shiftSelect) {
        this.shiftSelect.value = this.allSlots;
      }
      return;
    }

    if (initial) {
      return;
    }

    const { commonConfig, isQuestionNotIncluded } =
      this.operatorRoundService.findCommonConfigurations(
        this.revisedInfo,
        questionKeys
      );
    if (questionKeys.length > 1 && isQuestionNotIncluded) {
      this.resetReviseScheduleConfigForm();
      return;
    }
    this.reviseScheduleConfigForm.patchValue({
      repeatDuration: '',
      repeatEvery: '',
      ...commonConfig,
      startDate: commonConfig?.startDate
        ? format(new Date(commonConfig?.startDate), dateFormat4)
        : '',
      startDatePicker: new Date(commonConfig?.startDate),
      endDate: commonConfig?.endDate
        ? format(new Date(commonConfig?.endDate), dateFormat4)
        : '',
      endDatePicker: new Date(commonConfig?.endDate)
    });
  }
  resetReviseScheduleConfigForm() {
    this.reviseScheduleConfigForm.patchValue({
      scheduleType: this.reviseScheduleConfig.scheduleType,
      repeatDuration: this.reviseScheduleConfig.repeatDuration,
      repeatEvery: this.reviseScheduleConfig.repeatEvery,
      daysOfWeek: this.reviseScheduleConfig.daysOfWeek,
      monthlyDaysOfWeek: this.reviseScheduleConfig.monthlyDaysOfWeek,
      startDate: this.reviseScheduleConfig.startDate,
      startDatePicker: this.reviseScheduleConfig.startDatePicker,
      endDate: this.reviseScheduleConfig.endDate,
      endDatePicker: this.reviseScheduleConfig.endDatePicker
    });
  }

  onRevise() {
    const configPosition = this.comparingConfig(
      this.reviseScheduleConfigForm.value,
      this.scheduleByDates
    );
    const sameConfigAsHeader =
      this.operatorRoundService.compareConfigWithHeader(
        this.reviseScheduleConfig,
        this.reviseScheduleConfigForm.value,
        this.scheduleByDates
      );
    Object.keys(this.subForms).forEach((subFormId) => {
      this.subForms[subFormId].forEach((page) => {
        const nodeId = subFormId.split('_')[1];
        for (const question of page.questions) {
          if (sameConfigAsHeader && question.complete) {
            if (
              this.revisedInfo[nodeId] &&
              this.revisedInfo[nodeId][question.id]
            ) {
              delete this.revisedInfo[nodeId][question.id];
              if (Object.keys(this.revisedInfo[nodeId]).length === 0)
                delete this.revisedInfo[nodeId];
            }
            continue;
          }
          if (question.complete) {
            if (!this.revisedInfo[nodeId]) this.revisedInfo[nodeId] = {};
            this.revisedInfo[nodeId][question.id] =
              this.uniqueConfigurations[configPosition];
          }
        }
      });
    });
    this.operatorRoundService.setRevisedInfo(this.revisedInfo);
  }
}
