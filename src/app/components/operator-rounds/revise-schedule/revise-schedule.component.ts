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
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { scheduleConfigs } from '../../../forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import {
  MatCalendar,
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
import { takeUntil, tap } from 'rxjs/operators';
import { cloneDeep, isEqual } from 'lodash-es';
import { dateFormat4, dateTimeFormat3 } from 'src/app/app.constants';
import { ScheduleByDate, TaskLevelScheduleSubForm } from 'src/app/interfaces';
import { Observable, Subject } from 'rxjs';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-revise-schedule',
  templateUrl: './revise-schedule.component.html',
  styleUrls: ['./revise-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviseScheduleComponent implements OnInit, OnDestroy {
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
      if (
        this.reviseScheduleConfig &&
        !isEqual(reviseSchedule, this.reviseScheduleConfig)
      ) {
        this.cancel();
      }
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
  taskLevelScheduleByDatesPicker: String[] = [];
  _nodeIdToNodeName: any;
  scheduleConfig: any;
  configurations = [];
  revisedInfo = {};
  taskLevelScheduleByDates: ScheduleByDate[];
  revisedInfo$: Observable<any>;
  allPageCheckBoxStatus$: Observable<TaskLevelScheduleSubForm>;
  subForms: TaskLevelScheduleSubForm = {};
  placeholder = '_ _';
  minDate: Date;
  maxDate: Date;
  readonly scheduleConfigs = scheduleConfigs;
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.allPageCheckBoxStatus$ =
      this.operatorRoundService.allPageCheckBoxStatus$.pipe(
        tap((subForms) => {
          this.subForms = subForms;
          this.setCommonConfig();
        })
      );

    this.locationListToTask$ = this.operatorRoundService.checkboxStatus$.pipe(
      tap((data) => {
        const selectedPage = data.selectedPage || [];
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

        if (this.locationIdToTaskcountArr.length === 0) {
          this.openCloseRightPanelEvent.emit(false);
        } else {
          this.openCloseRightPanelEvent.emit(true);
        }
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
      this.taskLevelScheduleByDates = cloneDeep(
        this.reviseScheduleConfig.scheduleByDates
      );
      const scheduleDate = this.reviseScheduleConfig.scheduleByDates;
      this.reviseScheduleConfig.scheduleByDates.forEach((scheduleByDate) =>
        this.taskLevelScheduleByDatesPicker.push(
          format(new Date(scheduleByDate.date), dateTimeFormat3)
        )
      );
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

    this.reviseScheduleConfigForm
      .get('repeatEvery')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((repeatEvery) => {
        switch (repeatEvery) {
          case 'week':
            this.reviseScheduleConfigForm.patchValue({
              daysOfWeek: this.reviseScheduleConfig.daysOfWeek
            });
            break;
          case 'month':
            this.reviseScheduleConfigForm.patchValue({
              monthlyDaysOfWeek: this.reviseScheduleConfig.monthlyDaysOfWeek
            });
            break;
          default:
          // do nothing
        }
      });

    this.reviseScheduleConfigForm
      .get('daysOfWeek')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((daysOfWeek) => {
        if (daysOfWeek?.length === 0) {
          this.reviseScheduleConfigForm
            .get('daysOfWeek')
            .patchValue(this.reviseScheduleConfig.daysOfWeek);
        }
      });

    this.reviseScheduleConfigForm
      .get('monthlyDaysOfWeek')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((monthlyDaysOfWeek) => {
        const monthlyDaysOfWeekCount = monthlyDaysOfWeek.reduce(
          (acc: number, curr: number[]) => {
            acc += curr?.length;
            return acc;
          },
          0
        );
        if (monthlyDaysOfWeekCount === 0) {
          this.reviseScheduleConfigForm
            .get('monthlyDaysOfWeek')
            .patchValue(this.reviseScheduleConfig.monthlyDaysOfWeek);
        }
      });
  }

  getMontlyDaysOfWeekCount(monthlyDaysOfWeek) {
    const monthlyDaysOfWeekCount = monthlyDaysOfWeek.reduce(
      (acc: number, curr: number[]) => {
        acc += curr?.length;
        return acc;
      },
      0
    );
    return monthlyDaysOfWeekCount;
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

  dateClass = (date: Date) => {
    if (this.findDate(format(date, dateTimeFormat3)) !== -1) {
      return ['selected'];
    }
    return [];
  };

  dateFilter = (date: Date) =>
    this.reviseScheduleConfig.scheduleByDates.some(
      ({ date: sDate }) => +sDate === +date
    );

  findDate(date: String): number {
    return this.taskLevelScheduleByDatesPicker
      ?.map((scheduleByDate) => scheduleByDate)
      .indexOf(date);
  }

  updateScheduleByDates(date: Date) {
    const index = this.findDate(format(date, dateTimeFormat3));
    if (index === -1) {
      this.taskLevelScheduleByDates = [
        ...this.taskLevelScheduleByDates,
        {
          date: date,
          scheduled: false
        }
      ];
      this.taskLevelScheduleByDatesPicker.push(format(date, dateTimeFormat3));
    } else {
      this.taskLevelScheduleByDates.splice(index, 1);
      this.taskLevelScheduleByDatesPicker.splice(index, 1);
    }
    this.reviseScheduleConfigForm.markAsDirty();
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
    this.reviseScheduleConfigForm.markAsDirty();
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
      this.uniqueConfigurations.push(currentConfig);
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

  getDefaultSlots() {
    return [
      {
        null: { startTime: '12:00 AM', endTime: '11:59 PM' },
        payload: [{ startTime: '00:00', endTime: '23:59', checked: true }]
      }
    ];
  }

  setShiftAndSlotDetails(shiftDetails) {
    this.allSlots.forEach((allSlot) => {
      const { payload, ...shiftInfo } = allSlot;
      payload.forEach((slotInfo) => {
        if (
          shiftDetails[shiftInfo.id ? shiftInfo.id : 'null']?.find(
            (selectedSlotInfo) => isEqual(slotInfo, selectedSlotInfo)
          )
        ) {
          return slotInfo;
        }

        if (isEqual(this.allSlots, this.getDefaultSlots())) {
          this.allSlots.forEach((slot) => {
            if (shiftDetails[shiftInfo.id ? shiftInfo.id : 'null']) {
              slot[shiftInfo.id ? shiftInfo.id : 'null'].payload =
                shiftDetails[shiftInfo.id ? shiftInfo.id : 'null'];
              slot.payload = shiftDetails[shiftInfo.id ? shiftInfo.id : 'null'];
            } else {
              const [shiftId] = Object.keys(shiftDetails);
              const { id, name, startTime, endTime } = this.allShifts.find(
                (shift) => shift.id === shiftId
              );
              slot.id = id;
              slot.name = name;
              slot.startTime = startTime;
              slot.endTime = endTime;
              slot.payload = shiftDetails[shiftId];
              delete slot[shiftInfo.id ? shiftInfo.id : 'null'];
            }
          });
        } else {
          slotInfo.checked = shiftDetails[
            shiftInfo.id ? shiftInfo.id : 'null'
          ]?.some(
            (slotInfo2) =>
              slotInfo2.checked &&
              isEqual(slotInfo2.startTime, slotInfo.startTime) &&
              isEqual(slotInfo2.endTime, slotInfo.endTime)
          )
            ? true
            : false;
        }
      });
    });
    this.allSlots = this.allSlots.filter(({ payload }) =>
      payload.some(({ checked }) => checked)
    );
    this.shiftsSelected.patchValue(this.allSlots);
    if (this.allSlots.length === 0) {
      this.allSlots = this.getDefaultSlots();
    }
    if (this.shiftSelect) {
      this.shiftSelect.value = this.allSlots;
    }
  }

  setCommonConfig() {
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

    const { commonConfig } = this.operatorRoundService.findCommonConfigurations(
      this.revisedInfo,
      questionKeys
    );

    if (!Object.keys(commonConfig).length) {
      return;
    }

    this.reviseScheduleConfigForm.patchValue(
      {
        repeatDuration: '',
        repeatEvery: '',
        ...commonConfig,
        startDate: commonConfig.startDate ? commonConfig.startDate : '',
        startDatePicker: commonConfig.startDatePicker
          ? commonConfig.startDatePicker
          : this.reviseScheduleConfig.startDatePicker,
        endDate: commonConfig.endDate ? commonConfig.endDate : '',
        endDatePicker: commonConfig.endDatePicker
          ? commonConfig.endDatePicker
          : this.reviseScheduleConfig.endDatePicker
      },
      { emitEvent: false }
    );
    this.taskLevelScheduleByDates = commonConfig.scheduleByDates;
    if (
      this.reviseScheduleConfig.scheduleType ===
      scheduleConfigs.scheduleTypes[1]
    ) {
      this.calendar.updateTodaysDate();
    }
    this.setShiftAndSlotDetails(commonConfig.shiftDetails);
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
      this.taskLevelScheduleByDates
    );
    const sameConfigAsHeader =
      this.operatorRoundService.compareConfigWithHeader(
        this.reviseScheduleConfig,
        this.reviseScheduleConfigForm.value,
        this.taskLevelScheduleByDates
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
    this.operatorRoundService.setIsRevised(true);
    this.operatorRoundService.setRevisedInfo(this.revisedInfo);
    this.toast.show({
      text: 'Schedule Revised Successfully',
      type: 'success'
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
