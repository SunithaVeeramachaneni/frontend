/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Inject
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatCalendar,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  addDays,
  addMonths,
  daysToWeeks,
  differenceInDays,
  format,
  getDay,
  weeksToDays
} from 'date-fns';
import { takeUntil, tap } from 'rxjs/operators';
import { RoundPlanScheduleConfigurationService } from 'src/app/components/operator-rounds/services/round-plan-schedule-configuration.service';
import {
  AssigneeDetails,
  FormScheduleConfiguration,
  RoundPlanScheduleConfiguration,
  RoundPlanScheduleConfigurationObj,
  ScheduleByDate,
  SelectedAssignee,
  ValidationError
} from 'src/app/interfaces';
import { ScheduleSuccessModalComponent } from '../schedule-success-modal/schedule-success-modal.component';
import { FormScheduleConfigurationService } from './../../../../components/race-dynamic-form/services/form-schedule-configuration.service';
import {
  TIME_SLOTS,
  scheduleConfigs,
  shiftDefaultPayload
} from './schedule-configuration.constants';
import { Subject, Subscription } from 'rxjs';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import {
  getDayTz,
  localToTimezoneDate
} from 'src/app/shared/utils/timezoneDate';
import { zonedTimeToUtc } from 'date-fns-tz';
import {
  dateFormat3,
  dateFormat4,
  dateFormat5,
  dateTimeFormat3,
  hourFormat
} from 'src/app/app.constants';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';

export interface ScheduleConfigEvent {
  slideInOut: 'out' | 'in';
  viewRounds?: boolean;
  viewForms?: boolean;
  mode?: 'create' | 'update';
}
export interface ScheduleConfig {
  roundPlanScheduleConfiguration?: RoundPlanScheduleConfiguration;
  formsScheduleConfiguration?: FormScheduleConfiguration;
  mode: 'create' | 'update';
}

export interface IShift {
  id: string;
  name: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  searchTerm: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  _deleted: null | boolean;
  _lastChangedAt: number;
  _version: number;
}
@Component({
  selector: 'app-schedule-configuration',
  templateUrl: './schedule-configuration.component.html',
  styleUrls: ['./schedule-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleConfigurationComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  assigneeDetails: AssigneeDetails;
  moduleName: 'OPERATOR_ROUNDS' | 'RDF';
  plantMapSubscription: Subscription;
  scheduleTypes = scheduleConfigs.scheduleTypes;
  scheduleEndTypes = scheduleConfigs.scheduleEndTypes;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  schedulerConfigForm: FormGroup;
  currentDate: Date;
  startDatePickerMinDate: Date;
  scheduleEndOnPickerMinDate: Date;
  scheduleByDates: ScheduleByDate[];
  disableSchedule = false;
  roundPlanScheduleConfigurations: RoundPlanScheduleConfigurationObj[];
  isFormModule = false;
  formName = '';
  assignTypes = scheduleConfigs.assignTypes;
  errors: ValidationError = {};
  roundsGeneration = {
    min: 0,
    max: 30
  };
  dropdownPosition: any;
  selectedDetails: any = {};
  shiftsSelected = new FormControl('');
  shiftsInformation: IShift[] = [];
  allShifts: IShift[] = [];
  timeSlots = TIME_SLOTS;
  shiftSlotsFormArray = new FormArray([]);
  plantTimezoneMap: any = {};
  placeHolder = '_ _';
  selectedShifts = [];
  selectedShift: any;
  private onDestroy$ = new Subject();
  private shiftDetails: {
    [key: string]: { startTime: string; endTime: string }[];
  } = shiftDefaultPayload;
  private shiftApiResponse: any;
  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private readonly formScheduleConfigurationService: FormScheduleConfigurationService,
    private plantService: PlantService,
    private readonly scheduleConfigurationService: ScheduleConfigurationService,
    private dialogRef: MatDialogRef<ScheduleConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  initDetails(): void {
    if (this.data?.moduleName === 'RDF') {
      this.isFormModule = true;
    } else {
      this.isFormModule = false;
    }
    if (this.isFormModule) {
      this.formName = this.data?.fromDetail?.name || '';
      this.selectedDetails = this.data.formDetail;
    } else {
      this.formName = this.data?.roundPlanDetail?.name || '';
      this.selectedDetails = this.data.roundPlanDetail;
    }
    this.getAllShiftsData();
  }

  getAllShiftsData(): void {
    this.shiftsInformation = this.selectedDetails?.shifts;
    this.allShifts = this.shiftsInformation;
    this.initCreatedSlots();
  }

  initCreatedSlots(): void {
    if (this.shiftApiResponse) {
      this.shiftSlots.clear();
      const shiftsSelected = [];
      Object.entries(this.shiftApiResponse).forEach(([key, value]: any) => {
        if (key === 'null') {
          value = this.scheduleConfigurationService.addMissingTimeIntervals(
            value,
            this.timeSlots
          );
          this.shiftSlots.push(
            this.addShiftDetails(false, {
              null: {
                startTime: shiftDefaultPayload?.null[0]?.startTime,
                endTime: shiftDefaultPayload?.null[0]?.endTime,
                payload: value
              }
            })
          );
        } else {
          shiftsSelected.push(key);
          const foundShift = this.allShifts.find((s) => s.id === key);
          this.selectedShift =
            this.scheduleConfigurationService.generateTimeSlots(
              foundShift?.startTime,
              foundShift?.endTime
            );

          value = this.scheduleConfigurationService.addMissingTimeIntervals(
            value,
            this.selectedShift
          );
          if (foundShift) {
            this.shiftSlots.push(
              this.addShiftDetails(false, {
                id: foundShift?.id,
                name: foundShift?.name,
                startTime: foundShift?.startTime,
                endTime: foundShift?.endTime,
                payload: value
              })
            );
          }
        }
      });
      this.shiftsSelected.patchValue(shiftsSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moduleName?.currentValue === 'RDF') {
      this.isFormModule = true;
    }
    this.initDetails();

    const position = document
      .getElementById('assignDropdownPosition')
      ?.getBoundingClientRect();

    this.dropdownPosition = {
      left: `${position?.left - 30}px`,
      top: `${position?.top + 20}px`,
      modalTop: `-${position?.top - 20}px`
    };
  }

  ngOnInit(): void {
    this.scheduleConfigurationService.getSlotChanged().subscribe((value) => {
      this.markSlotPristine(value);
    });
    this.schedulerConfigForm?.valueChanges.subscribe((value) => {
      this.schedulerConfigForm.markAsDirty();
    });

    if (this.data) {
      const { formDetail, roundPlanDetail, moduleName, assigneeDetails } =
        this.data;
      this.assigneeDetails = assigneeDetails;
      this.moduleName = moduleName;

      // If the module name is RDF
      if (formDetail && moduleName === 'RDF') {
        this.isFormModule = true;
        this.selectedDetails = formDetail;
        if (
          this.plantTimezoneMap[this.selectedDetails?.plantId]
            ?.timeZoneIdentifier
        ) {
          this.currentDate = new Date(
            localToTimezoneDate(
              new Date(),
              this.plantTimezoneMap[this.selectedDetails?.plantId],
              'yyyy-MM-dd HH:mm:ss'
            )
          );
          if (this.schedulerConfigForm?.value) {
            this.schedulerConfigForm.patchValue({
              ...this.getDefaultSchedulerConfigDates()
            });
          }
        }
        this.getFormsSchedulerConfigurationByFormId(formDetail?.id);
      }

      // If moduleName is round-plan
      if (roundPlanDetail && moduleName === 'OPERATOR_ROUNDS') {
        this.selectedDetails = roundPlanDetail;
        this.getRoundPlanSchedulerConfigurationByRoundPlanId(
          roundPlanDetail?.id
        );
      }
    }
    this.initDetails();

    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.schedulerConfigForm = this.fb.group({
      id: '',
      roundPlanId: !this.isFormModule ? this.selectedDetails?.id : '',
      formId: this.isFormModule ? this.selectedDetails?.id : '',
      scheduleType: 'byFrequency',
      repeatDuration: [1, [Validators.required, Validators.min(1)]],
      repeatEvery: 'day',
      daysOfWeek: [[getDay(new Date())]],
      monthlyDaysOfWeek: this.fb.array(
        this.initMonthWiseWeeklyDaysOfWeek(this.weeksOfMonth.length)
      ),
      scheduleEndType: 'on',
      scheduleEndOn: [
        {
          value: format(addDays(new Date(), 29), dateFormat4),
          disabled: true
        }
      ],
      scheduleEndOnPicker: new Date(addDays(new Date(), 29)),
      scheduleEndOccurrences: [
        { value: 30, disabled: true },
        [Validators.required, Validators.min(1)]
      ],
      scheduleEndOccurrencesText: [{ value: 'occurrences', disabled: true }],
      startDate: format(new Date(), dateFormat3),
      startDatePicker: new Date(),
      endDate: [
        {
          value: format(addDays(new Date(), 30), dateFormat3),
          disabled: true
        }
      ],
      endDatePicker: new Date(addDays(new Date(), 30)),
      scheduledTill: null,
      assignmentDetails: this.fb.group({
        type: ['User'],
        value: '',
        displayValue: ''
      }),
      advanceFormsCount: [
        0,
        [
          Validators.required,
          Validators.min(this.roundsGeneration.min),
          Validators.max(this.roundsGeneration.max)
        ]
      ],
      advanceRoundsCount: [
        0,
        [
          Validators.required,
          Validators.min(this.roundsGeneration.min),
          Validators.max(this.roundsGeneration.max)
        ]
      ],
      shiftSlots: this.fb.array([this.addShiftDetails(true)]),
      shiftsSelected: []
    });
    this.schedulerConfigForm
      .get('scheduleEndType')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((scheduleEndType) => {
        switch (scheduleEndType) {
          case 'on':
            this.schedulerConfigForm.get('scheduleEndOn').enable();
            this.schedulerConfigForm.get('scheduleEndOccurrences').disable();
            this.schedulerConfigForm
              .get('scheduleEndOccurrencesText')
              .disable();
            break;
          case 'after':
            this.schedulerConfigForm.get('scheduleEndOn').disable();
            this.schedulerConfigForm.get('scheduleEndOccurrences').enable();
            this.schedulerConfigForm.get('scheduleEndOccurrencesText').enable();
            break;
          default:
            this.schedulerConfigForm.get('scheduleEndOn').disable();
            this.schedulerConfigForm.get('scheduleEndOccurrences').disable();
            this.schedulerConfigForm
              .get('scheduleEndOccurrencesText')
              .disable();
        }
      });

    this.schedulerConfigForm
      .get('scheduleType')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((scheduleType) => {
        switch (scheduleType) {
          case 'byFrequency':
            this.schedulerConfigForm.get('repeatEvery').patchValue('day');
            this.schedulerConfigForm.get('scheduleEndType').patchValue('on'); // never
            this.scheduleByDates = [];
            break;
          case 'byDate':
            if (!this.scheduleByDates?.length) {
              this.scheduleByDates = [
                {
                  date: new Date(
                    localToTimezoneDate(
                      new Date(),
                      this.plantTimezoneMap[this.selectedDetails?.plantId],
                      dateTimeFormat3
                    )
                  ),
                  scheduled: false
                }
              ];
            }
            this.schedulerConfigForm.get('repeatEvery').patchValue('none');
            this.updateAdvanceRoundsCountValidation(12);
            break;
        }
      });

    this.schedulerConfigForm
      .get('repeatEvery')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((repeatEvery) => {
        const startDate = new Date(
          this.schedulerConfigForm.get('startDate').value
        );
        switch (repeatEvery) {
          case 'day':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 29),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat4
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 29),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat4
                  )
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(30);
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(startDate, 29),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(startDate, 29),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat3
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(30);
            break;
          case 'week':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 90),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat4
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 90),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat4
                  )
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(daysToWeeks(91));
            this.schedulerConfigForm
              .get('daysOfWeek')
              .patchValue([
                getDayTz(
                  new Date(),
                  this.plantTimezoneMap[this.selectedDetails?.plantId]
                )
              ]);
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(startDate, 90),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(startDate, 90),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat3
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(30);
            break;
          case 'month':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 364),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat4
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 364),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat4
                  )
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(12);
            this.setMonthlyDaysOfWeek();
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(startDate, 364),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(startDate, 364),
                    this.plantTimezoneMap[this.selectedDetails?.plantId],
                    dateFormat3
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(30);
            break;
        }
      });

    this.schedulerConfigForm
      .get('daysOfWeek')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((daysOfWeek) => {
        if (daysOfWeek?.length === 0) {
          this.schedulerConfigForm
            .get('daysOfWeek')
            .patchValue([
              getDayTz(
                new Date(),
                this.plantTimezoneMap[this.selectedDetails?.plantId]
              )
            ]);
        }
      });

    this.schedulerConfigForm
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
          this.setMonthlyDaysOfWeek();
        }
      });

    this.schedulerConfigForm
      .get('scheduleEndOccurrences')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((occurrences) => {
        if (occurrences > 0) {
          let days = 0;
          switch (this.schedulerConfigForm.get('repeatEvery').value) {
            case 'day':
              days = occurrences;
              break;
            case 'week':
              days = weeksToDays(occurrences);
              break;
            case 'month':
              days = differenceInDays(
                addMonths(new Date(), occurrences),
                new Date()
              );
              break;
          }
          const startDate = new Date(
            this.schedulerConfigForm.get('startDate').value
          );
          this.schedulerConfigForm
            .get('endDate')
            .patchValue(
              localToTimezoneDate(
                addDays(
                  startDate,
                  days * this.schedulerConfigForm.get('repeatDuration').value -
                    1
                ),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat3
              )
            );
          this.schedulerConfigForm
            .get('endDatePicker')
            .patchValue(
              new Date(
                localToTimezoneDate(
                  addDays(
                    startDate,
                    days *
                      this.schedulerConfigForm.get('repeatDuration').value -
                      1
                  ),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              )
            );
        }
      });

    this.schedulerConfigForm
      .get('repeatDuration')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.schedulerConfigForm
          .get('scheduleEndOccurrences')
          .patchValue(
            this.schedulerConfigForm.get('scheduleEndOccurrences').value
          );
      });

    this.schedulerConfigForm
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.schedulerConfigForm
          .get('scheduleEndOccurrences')
          .patchValue(
            this.schedulerConfigForm.get('scheduleEndOccurrences').value
          );
      });

    this.currentDate = new Date();
    this.startDatePickerMinDate = new Date();
    this.scheduleEndOnPickerMinDate = new Date();
    this.setMonthlyDaysOfWeek();
    this.schedulerConfigForm.markAsDirty();
  }

  setMonthlyDaysOfWeek() {
    for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
      weekRepeatDays.patchValue([
        getDayTz(
          new Date(),
          this.plantTimezoneMap[this.selectedDetails?.plantId]
        )
      ]);
    }
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.schedulerConfigForm.get('monthlyDaysOfWeek') as FormArray;
  }

  cancel() {
    this.initShiftStat();
    this.schedulerConfigForm.reset();
    this.dialogRef.close({
      slideInOut: 'out',
      actionType: 'scheduleConfigEvent'
    });
  }

  initShiftStat() {
    this.shiftSlots.clear();
    this.shiftDetails = shiftDefaultPayload;
    this.shiftSlots.push(this.addShiftDetails(true));
  }

  scheduleConfiguration() {
    if (this.schedulerConfigForm.valid && this.schedulerConfigForm.dirty) {
      this.disableSchedule = true;
      const schedularConfigFormValue = this.schedulerConfigForm.getRawValue();
      const { id, startDate, endDate, scheduleEndOn } =
        schedularConfigFormValue;
      let time = format(new Date(), hourFormat);
      const { startDatePicker, endDatePicker, scheduleEndOnPicker, ...rest } =
        schedularConfigFormValue;
      const scheduleByDates =
        schedularConfigFormValue.scheduleType === 'byDate'
          ? this.prepareScheduleByDates()
          : [];

      let startDateByPlantTimezone = new Date(
        `${startDate} ${time}`
      ).toISOString();
      let endDateByPlantTimezone = new Date(`${endDate} ${time}`).toISOString();
      let scheduleEndOnByPlantTimezone = new Date(
        `${scheduleEndOn} ${time}`
      ).toISOString();

      if (
        this.plantTimezoneMap[this.selectedDetails?.plantId]?.timeZoneIdentifier
      ) {
        time = localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          hourFormat
        );

        startDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(startDate), dateFormat5) + ` ${time}`,
          this.plantTimezoneMap[this.selectedDetails?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();

        endDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(endDate), dateFormat5) + ` ${time}`,
          this.plantTimezoneMap[this.selectedDetails?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();

        scheduleEndOnByPlantTimezone = zonedTimeToUtc(
          format(new Date(scheduleEndOn), dateFormat5) + ` ${time}`,
          this.plantTimezoneMap[this.selectedDetails?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();
      }
      if (id) {
        const payload = {
          ...rest,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleEndOn: scheduleEndOnByPlantTimezone,
          scheduleByDates,
          shiftDetails: this.prepareShiftDetailsPayload(this.shiftDetails)
        };
        delete payload.shiftSlots;
        if (this.isFormModule) {
          delete payload.roundPlanId;
          delete payload.advanceRoundsCount;
          this.formScheduleConfigurationService
            .updateFormScheduleConfiguration$(id, payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  // Close popup and pass data through it
                  this.openScheduleSuccessModal('update');
                  this.dialogRef.close({
                    formsScheduleConfiguration: scheduleConfig,
                    mode: 'update',
                    actionType: 'scheduleConfig'
                  });
                  this.schedulerConfigForm.markAsPristine();
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        } else {
          delete payload.formId;
          delete payload.advanceFormsCount;
          this.rpscService
            .updateRoundPlanScheduleConfiguration$(id, payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig).length) {
                  // Close popup and pass data through it
                  this.dialogRef.close({
                    roundPlanScheduleConfiguration: scheduleConfig,
                    mode: 'update',
                    actionType: 'scheduleConfig'
                  });
                  this.openScheduleSuccessModal('update');
                  this.schedulerConfigForm.markAsPristine();
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        }
      } else {
        const payload = {
          ...rest,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleEndOn: scheduleEndOnByPlantTimezone,
          scheduleByDates,
          shiftDetails: this.prepareShiftDetailsPayload(this.shiftDetails)
        };
        delete payload.shiftSlots;
        if (this.isFormModule) {
          delete payload.roundPlanId;
          delete payload.advanceRoundsCount;
          this.formScheduleConfigurationService
            .createFormScheduleConfiguration$(payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  // Close popup and pass data through it
                  this.dialogRef.close({
                    formsScheduleConfiguration: scheduleConfig,
                    mode: 'create',
                    actionType: 'scheduleConfig'
                  });
                  this.openScheduleSuccessModal('create');
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        } else {
          delete payload.formId;
          delete payload.advanceFormsCount;
          this.rpscService
            .createRoundPlanScheduleConfiguration$(payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  // Close popup and pass data through it
                  this.dialogRef.close({
                    roundPlanScheduleConfiguration: scheduleConfig,
                    mode: 'create',
                    actionType: 'scheduleConfig'
                  });
                  this.openScheduleSuccessModal('create');
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        }
      }
    }
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {
    this.schedulerConfigForm.patchValue({
      [formControlDateField]:
        formControlDateField !== 'scheduleEndOn'
          ? format(event.value, dateFormat3)
          : format(event.value, dateFormat4)
    });
    this.schedulerConfigForm.markAsDirty();
  }

  updateScheduleByDates(date: Date) {
    const index = this.findDate(date);
    if (index === -1) {
      this.scheduleByDates = [
        ...this.scheduleByDates,
        { date, scheduled: false }
      ];
    } else {
      this.scheduleByDates.splice(index, 1);
    }
    this.schedulerConfigForm.markAsDirty();
    this.calendar.updateTodaysDate();
  }

  getRoundPlanSchedulerConfigurationByRoundPlanId(roundPlandId: string) {
    this.rpscService
      .fetchRoundPlanScheduleConfigurationByRoundPlanId$(roundPlandId)
      .pipe(
        tap((config) => {
          if (config && Object.keys(config).length) {
            const {
              startDate,
              endDate,
              scheduleEndOn,
              scheduledTill,
              scheduleByDates
            } = config;
            this.startDatePickerMinDate = new Date(startDate);
            this.scheduleEndOnPickerMinDate = new Date(scheduleEndOn);
            config = {
              ...config,
              startDate: localToTimezoneDate(
                new Date(startDate),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat3
              ),
              endDate: localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat3
              ),
              scheduleEndOn: localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat4
              ),
              startDatePicker: new Date(
                localToTimezoneDate(
                  new Date(startDate),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              ),
              endDatePicker: new Date(
                localToTimezoneDate(
                  new Date(endDate),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              ),
              scheduleEndOnPicker: new Date(
                localToTimezoneDate(
                  new Date(scheduleEndOn),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat4
                )
              )
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  ''
                )
              )
            }));
            if (config?.shiftDetails) {
              this.shiftApiResponse = this.prepareShiftDetailsPayload(
                config?.shiftDetails,
                '12'
              );
              this.shiftDetails = {};
              delete config?.shiftDetails;
              this.initCreatedSlots();
            }
            this.schedulerConfigForm.patchValue(config);
            if (scheduledTill !== null) {
              this.schedulerConfigForm.get('startDate').disable();
            }
            this.schedulerConfigForm.markAsPristine();
            this.calendar?.updateTodaysDate();
          } else {
            this.setDefaultSchedulerConfig(roundPlandId);
          }
        })
      )
      .subscribe();
  }

  getDefaultSchedulerConfigDates() {
    if (
      this.plantTimezoneMap[this.selectedDetails?.plantId]?.timeZoneIdentifier
    ) {
      return {
        startDate: localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat3
        ),
        endDate: localToTimezoneDate(
          addDays(new Date(), 30),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat3
        ),
        scheduleEndOn: localToTimezoneDate(
          addDays(new Date(), 29),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat4
        ),
        daysOfWeek: [
          getDayTz(
            new Date(),
            this.plantTimezoneMap[this.selectedDetails?.plantId]
          )
        ],
        startDatePicker: new Date(
          localToTimezoneDate(
            new Date(),
            this.plantTimezoneMap[this.selectedDetails?.plantId],
            dateFormat3
          )
        ),
        endDatePicker: new Date(
          localToTimezoneDate(
            addDays(new Date(), 30),
            this.plantTimezoneMap[this.selectedDetails?.plantId],
            dateFormat3
          )
        ),
        scheduleEndOnPicker: new Date(
          localToTimezoneDate(
            addDays(new Date(), 29),
            this.plantTimezoneMap[this.selectedDetails?.plantId],
            dateFormat4
          )
        )
      };
    } else {
      return {
        startDate: format(new Date(), dateFormat3),
        endDate: format(addDays(new Date(), 30), dateFormat3),
        scheduleEndOn: format(addDays(new Date(), 29), dateFormat4),
        daysOfWeek: [getDay(new Date())],
        startDatePicker: new Date(),
        endDatePicker: addDays(new Date(), 30),
        scheduleEndOnPicker: addDays(new Date(), 29)
      };
    }
  }

  setDefaultSchedulerConfig(id: string) {
    this.schedulerConfigForm.patchValue({
      id: '',
      roundPlanId: !this.isFormModule ? id : null,
      formId: this.isFormModule ? id : null,
      scheduleType: 'byFrequency',
      repeatDuration: 1,
      repeatEvery: 'day',
      monthlyDaysOfWeek: this.setMonthlyDaysOfWeek(),
      scheduleEndType: 'on',
      scheduleEndOccurrences: 30,
      scheduleEndOccurrencesText: 'occurrences',
      startDate: format(new Date(), 'd MMMM yyyy'),
      startDatePicker: new Date(),
      endDate: format(addDays(new Date(), 30), 'd MMMM yyyy'),
      endDatePicker: new Date(addDays(new Date(), 30)),
      scheduledTill: null,
      assignmentDetails: {
        type: this.assignTypes[0],
        value: '',
        displayValue: ''
      },
      advanceFormsCount: 0,
      advanceRoundsCount: 0,
      shiftsSelected: [],
      shiftSlots: [],
      ...this.getDefaultSchedulerConfigDates()
    });

    this.schedulerConfigForm.markAsDirty();
  }

  getFormsSchedulerConfigurationByFormId(formId: string) {
    this.formScheduleConfigurationService
      .fetchFormScheduleConfigurationByFormId$(formId)
      .pipe(
        tap((config) => {
          if (config && Object.keys(config)?.length) {
            const {
              startDate,
              endDate,
              scheduleEndOn,
              scheduledTill,
              scheduleByDates
            } = config;
            this.startDatePickerMinDate = new Date(startDate);
            this.scheduleEndOnPickerMinDate = new Date(scheduleEndOn);
            config = {
              ...config,
              startDate: localToTimezoneDate(
                new Date(startDate),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat3
              ),
              endDate: localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat3
              ),
              scheduleEndOn: localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[this.selectedDetails?.plantId],
                dateFormat4
              ),
              startDatePicker: new Date(
                localToTimezoneDate(
                  new Date(startDate),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              ),
              endDatePicker: new Date(
                localToTimezoneDate(
                  new Date(endDate),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat3
                )
              ),
              scheduleEndOnPicker: new Date(
                localToTimezoneDate(
                  new Date(scheduleEndOn),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateFormat4
                )
              )
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateTimeFormat3
                )
              )
            }));
            if (config?.shiftDetails) {
              this.shiftApiResponse = this.prepareShiftDetailsPayload(
                config?.shiftDetails,
                '12'
              );
              this.shiftDetails = {};
              delete config?.shiftDetails;
              this.initCreatedSlots();
            }
            this.schedulerConfigForm.patchValue(config);
            if (scheduledTill !== null) {
              this.schedulerConfigForm.get('startDate').disable();
            }
            this.schedulerConfigForm.markAsPristine();
            this.calendar?.updateTodaysDate();
          } else {
            this.setDefaultSchedulerConfig(formId);
          }
        })
      )
      .subscribe();
  }

  findDate(date: Date): number {
    return this.scheduleByDates
      ?.map((scheduleByDate) => +scheduleByDate.date)
      .indexOf(+date);
  }

  dateClass = (date: Date) => {
    if (this.findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  };

  prepareScheduleByDates() {
    return this.scheduleByDates.map((scheduleByDate) => {
      let dateByPlantTimezone = new Date(
        format(scheduleByDate.date, dateTimeFormat3)
      );
      if (
        this.plantTimezoneMap[this.selectedDetails?.plantId]?.timeZoneIdentifier
      ) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(scheduleByDate.date, dateTimeFormat3),
          this.plantTimezoneMap[this.selectedDetails?.plantId]
            ?.timeZoneIdentifier
        );
      }
      return {
        ...scheduleByDate,
        date: dateByPlantTimezone
      };
    });
  }

  openScheduleSuccessModal(dialogMode: 'create' | 'update') {
    const dialogRef = this.dialog.open(ScheduleSuccessModalComponent, {
      disableClose: true,
      width: '354px',
      height: '275px',
      backdropClass: 'schedule-success-modal',
      data: {
        name: this.selectedDetails?.name ?? '',
        mode: dialogMode,
        isFormModule: this.isFormModule
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data?.redirect) {
          if (this.isFormModule) {
            this.scheduleConfigurationService.scheduleConfigEvent.next({
              slideInOut: 'out',
              viewForms: true,
              actionType: 'scheduleConfigEvent'
            });
          } else {
            this.scheduleConfigurationService.scheduleConfigEvent.next({
              slideInOut: 'out',
              viewRounds: true,
              actionType: 'scheduleConfigEvent'
            });
          }
        } else {
          this.scheduleConfigurationService.scheduleConfigEvent.next({
            slideInOut: 'out',
            mode: data?.mode,
            actionType: 'scheduleConfigEvent'
          });
        }
      }
    });
  }

  selectedAssigneeHandler({ user }: SelectedAssignee) {
    const { email: value, firstName, lastName } = user;
    this.schedulerConfigForm
      .get('assignmentDetails')
      .patchValue({ value, displayValue: `${firstName} ${lastName}` });
    this.schedulerConfigForm.markAsDirty();
    this.menuTrigger.closeMenu();
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.schedulerConfigForm.get(controlName).touched;
    const errors = this.schedulerConfigForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  updateAdvanceRoundsCountValidation(roundsCount: number) {
    this.roundsGeneration.max = roundsCount;
    const key = this.isFormModule ? 'advanceFormsCount' : 'advanceRoundsCount';
    this.schedulerConfigForm
      .get(key)
      .setValidators([
        Validators.required,
        Validators.min(this.roundsGeneration.min),
        Validators.max(this.roundsGeneration.max)
      ]);
    this.schedulerConfigForm.get(key).updateValueAndValidity();
  }

  get isShiftsSelected(): boolean {
    return this.shiftsSelected?.value?.length > 0;
  }

  get shiftSlots(): FormArray {
    return this.schedulerConfigForm?.get('shiftSlots') as FormArray;
  }

  addShiftDetails(
    isDefault: boolean = false,
    shiftDetails: any = {}
  ): FormGroup {
    const obj = {
      ...(isDefault ? shiftDefaultPayload : { ...shiftDetails }),
      payload: this.fb.array([])
    };
    if (
      !isDefault &&
      shiftDetails?.payload &&
      Array.isArray(shiftDetails?.payload)
    ) {
      const payloadArray = shiftDetails?.payload?.map((payloadItem: any) =>
        this.fb.group(payloadItem)
      );
      obj.payload = this.fb.array(payloadArray);
    }
    return this.fb.group(obj);
  }

  onShiftChange({ value }: { value: string[] }): void {
    if (value?.length > 0) {
      delete this.shiftDetails?.null;
      const nullIdx: number = this.shiftSlots.controls.findIndex(
        (c) => c?.value?.null !== undefined
      );
      if (nullIdx !== -1) {
        this.shiftSlots.removeAt(nullIdx);
      }
      value?.forEach((v) => {
        const foundShift: IShift = this.allShifts.find(
          (shift) => shift?.id === v
        );
        const shiftExistIdx: number = this.shiftSlots.controls.findIndex(
          (ctrl) => ctrl?.value?.id === foundShift?.id
        );
        if (foundShift && shiftExistIdx === -1) {
          this.shiftDetails = {
            ...this.shiftDetails,
            [foundShift?.id]: [
              {
                startTime: foundShift?.startTime,
                endTime: foundShift?.endTime
              }
            ]
          };
          this.shiftSlots.push(
            this.addShiftDetails(false, {
              id: foundShift?.id,
              name: foundShift?.name,
              startTime: foundShift?.startTime,
              endTime: foundShift?.endTime
            })
          );
        }
      });

      // remove old shift which is not selected
      this.shiftSlots?.value
        ?.filter(
          (shift: IShift) => !value?.some((v: string) => v === shift?.id)
        )
        ?.forEach((_shift: IShift) => {
          const idx: number = this.shiftSlots.controls.findIndex(
            (c) => c?.value?.id === _shift?.id
          );
          if (idx !== -1) this.shiftSlots.removeAt(idx);
        });
    } else {
      this.shiftSlots.clear();
      this.shiftApiResponse = null;
      this.shiftDetails = shiftDefaultPayload;
      this.shiftSlots.push(this.addShiftDetails(true));
    }
    this.scheduleConfigurationService.setSlotChanged(true);
  }

  onUpdateShiftSlot(event: {
    [key: string]: { startTime: string; endTime: string }[];
  }): void {
    this.shiftDetails = { ...this.shiftDetails, ...event };
  }

  get plantTimeZone(): string {
    const timeZone = this.plantTimezoneMap[this.selectedDetails?.plantId];
    return timeZone
      ? `${timeZone?.utcOffset ?? '' + ','} ${timeZone?.description ?? ''}`
      : this.placeHolder;
  }

  get initialShiftSelected(): string {
    if (this.shiftSlots?.value?.length > 0) {
      return this.shiftSlots?.value
        ?.slice(0, 3)
        .map((s) => s?.name)
        .join(', ');
    }
    return '';
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.shiftDetails = {};
    this.shiftApiResponse = null;
    this.scheduleConfigurationService.setInitialSlotChanged();
  }

  private prepareShiftDetailsPayload(shiftDetails, type: '24' | '12' = '24') {
    const payload = {};
    if (!shiftDetails) {
      return payload;
    }
    Object.entries(shiftDetails)?.forEach(
      ([key, value]: [string, { startTime: string; endTime: string }[]]) => {
        if (value?.length > 0) {
          payload[key] = value?.map(({ startTime, endTime }) => ({
            startTime:
              type === '24'
                ? this.scheduleConfigurationService.convertTo24Hour(startTime)
                : this.scheduleConfigurationService.convertTo12HourFormat(
                    startTime
                  ),
            endTime:
              type === '24'
                ? this.scheduleConfigurationService.convertTo24Hour(endTime)
                : this.scheduleConfigurationService.convertTo12HourFormat(
                    endTime
                  )
          }));
        }
      }
    );
    return payload;
  }

  private markSlotPristine(value = null): void {
    const shiftSlots = this.schedulerConfigForm?.get('shiftSlots');
    const shiftsSelected = this.schedulerConfigForm?.get('shiftsSelected');
    if (value && (shiftSlots?.pristine || shiftsSelected?.pristine)) {
      shiftSlots.markAsDirty();
      shiftsSelected.markAsDirty();
    }
  }
}
