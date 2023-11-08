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
  Inject,
  Output,
  EventEmitter
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
  isBefore,
  weeksToDays
} from 'date-fns';
import {
  distinctUntilChanged,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { RoundPlanScheduleConfigurationService } from 'src/app/components/operator-rounds/services/round-plan-schedule-configuration.service';
import {
  AssigneeDetails,
  ErrorInfo,
  FormScheduleConfiguration,
  RoundPlanScheduleConfiguration,
  RoundPlanScheduleConfigurationObj,
  ScheduleByDate,
  ValidationError
} from 'src/app/interfaces';
import { ScheduleSuccessModalComponent } from '../schedule-success-modal/schedule-success-modal.component';
import { FormScheduleConfigurationService } from './../../../../components/race-dynamic-form/services/form-schedule-configuration.service';
import {
  TIME_SLOTS,
  scheduleConfigs,
  shiftDefaultPayload
} from './schedule-configuration.constants';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
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
  hourFormat,
  dateTimeFormat5,
  dateTimeFormat3
} from 'src/app/app.constants';
import { ScheduleConfigurationService } from 'src/app/forms/services/schedule.service';
import { isEqual } from 'lodash-es';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler/error-handler.service';
import { TranslateService } from '@ngx-translate/core';

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
  @Output() gotoNextStep = new EventEmitter<void>();
  @Output() payloadEmitter = new EventEmitter<any>();
  payloadSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
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
  scheduleByDatePicker: String[] = [];
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
  isTaskLevel: any;
  payload: any = {};
  selectedShift: any;
  private onDestroy$ = new Subject();
  private shiftDetails: {
    [key: string]: { startTime: string; endTime: string }[];
  } = JSON.parse(JSON.stringify(shiftDefaultPayload));
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
    private operatorRoundService: OperatorRoundsService,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private errorHandlerService: ErrorHandlerService,
    private translateService: TranslateService
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
    this.operatorRoundService.setShiftInformation(this.shiftsInformation);
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
      const {
        formDetail,
        roundPlanDetail,
        moduleName,
        isTaskLevel,
        assigneeDetails
      } = this.data;
      const plantId =
        moduleName === 'RDF' ? formDetail.plantId : roundPlanDetail.plantId;
      this.assigneeDetails = {
        users: assigneeDetails.users?.filter((user) =>
          user.plantId?.includes(plantId)
        ),
        userGroups: assigneeDetails.userGroups?.filter((userGroup) =>
          userGroup.plantId?.includes(plantId)
        ),
        unit: assigneeDetails.unit?.filter((unit) =>
          unit?.isUnit && unit.plantsID === plantId
        ),
        position: assigneeDetails.position?.filter((pos) =>
          pos.plantId?.includes(plantId)
        )
      };
      this.moduleName = moduleName;
      this.isTaskLevel = isTaskLevel;

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
    const initialShiftDetails = this.shiftDetails || shiftDefaultPayload;
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
      startDate: localToTimezoneDate(
        new Date(),
        this.plantTimezoneMap[this.selectedDetails?.plantId],
        dateFormat3
      ),

      startDatePicker: new Date(
        localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat3
        )
      ),
      endDate: [
        {
          value: localToTimezoneDate(
            addDays(new Date(), 29),
            this.plantTimezoneMap[this.selectedDetails?.plantId],
            dateFormat3
          ),
          disabled: true
        }
      ],
      endDateDisplay: localToTimezoneDate(
        addDays(new Date(), 29),
        this.plantTimezoneMap[this.selectedDetails?.plantId],
        dateFormat3
      ),
      endDatePicker: new Date(
        localToTimezoneDate(
          new Date(addDays(new Date(), 29)),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat3
        )
      ),
      scheduledTill: null,
      assignmentDetails: this.fb.group({
        type: ['plant'],
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
      shiftSlots: this.fb.array([
        this.addShiftDetails(false, {
          null: {
            startTime: initialShiftDetails?.null[0]?.startTime,
            endTime: initialShiftDetails?.null[0]?.endTime,
            payload: [
              {
                startTime: initialShiftDetails?.null[0]?.startTime,
                endTime: initialShiftDetails?.null[0]?.endTime
              }
            ]
          }
        })
      ]),
      shiftsSelected: []
    });

    this.schedulerConfigForm
      .get('assignmentDetails')
      .valueChanges.pipe(
        startWith({}),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        pairwise(),
        tap(([prev, curr]) => {
          if (!isEqual(prev, curr)) {
            if (prev.type && prev.type !== '' && prev.type !== curr.type) {
              this.schedulerConfigForm.get('assignmentDetails').patchValue({
                type: curr.type,
                value: '',
                displayValue: ''
              });
            }
          }
        })
      )
      .subscribe();

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
                  date: new Date(new Date().setHours(0, 0, 0, 0)),
                  scheduled: false
                }
              ];
              this.scheduleByDatePicker.push(
                format(new Date(), dateTimeFormat3)
              );
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
              format(
                addDays(
                  startDate,
                  days * this.schedulerConfigForm.get('repeatDuration').value -
                    1
                ),
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

    this.currentDate = new Date(
      localToTimezoneDate(
        new Date(),
        this.plantTimezoneMap[this.selectedDetails?.plantId],
        dateFormat3
      )
    );
    this.startDatePickerMinDate = new Date(
      localToTimezoneDate(
        new Date(),
        this.plantTimezoneMap[this.selectedDetails?.plantId],
        dateFormat3
      )
    );
    this.scheduleEndOnPickerMinDate = new Date(
      localToTimezoneDate(
        new Date(),
        this.plantTimezoneMap[this.selectedDetails?.plantId],
        dateFormat3
      )
    );

    this.schedulerConfigForm
      .get('scheduleEndOnPicker')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((scheduleEndOnPicker) => {
        const { roundCount } =
          this.getAdvanceAllowedRoundCount(scheduleEndOnPicker);
        const thirty = 30;
        const twentyNine = 29;
        const count =
          roundCount >= thirty
            ? thirty
            : roundCount >= twentyNine
            ? twentyNine
            : roundCount;
        this.updateAdvanceRoundsCountValidation(count);
      });

    this.setMonthlyDaysOfWeek();
    this.schedulerConfigForm.markAsDirty();
  }

  getAdvanceRoundCountError(key: 'min' | 'max') {
    const { roundCount } = this.getAdvanceAllowedRoundCount();
    const countLookup = {
      min: this.roundsGeneration.min,
      max: this.roundsGeneration.max
    };
    const count = countLookup[key] || 0;
    const thirty = 30;
    const twentyNine = 29;
    const result =
      key === 'max'
        ? roundCount >= thirty || roundCount >= twentyNine
          ? 'maxDate'
          : 'validEndDate'
        : key;
    return this.translateService.instant(result, {
      count,
      name: 'Days'
    });
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

  prepareScheduleConfigurationDetail() {
    const schedularConfigFormValue = this.schedulerConfigForm.getRawValue();

    const {
      startDate,
      endDate,
      scheduleEndOn,
      startDatePicker,
      endDatePicker,
      scheduleEndOnPicker,
      scheduleType,
      scheduleEndType
    } = schedularConfigFormValue;

    const scheduleByDates =
      scheduleType === 'byDate' ? this.scheduleByDates : [];

    const formatedEndDate =
      scheduleEndType === scheduleConfigs.scheduleEndTypes[0]
        ? format(scheduleEndOnPicker, dateFormat4)
        : format(endDatePicker, dateFormat4);

    const formatedEndDate2 =
      scheduleEndType === scheduleConfigs.scheduleEndTypes[0]
        ? format(scheduleEndOnPicker, dateFormat3)
        : format(endDatePicker, dateFormat3);

    this.payload = {
      ...schedularConfigFormValue,
      startDate: format(startDatePicker, dateFormat4),
      endDate: formatedEndDate,
      endDatePicker:
        scheduleEndType === scheduleConfigs.scheduleEndTypes[0]
          ? scheduleEndOnPicker
          : endDatePicker,
      scheduleByDates,
      shiftDetails: this.prepareShiftDetailsPayload(this.shiftDetails)
    };
    this.payloadEmitter.emit({
      payload: this.payload,
      plantTimezoneMap: this.plantTimezoneMap,
      scheduleConfig: {
        startDate,
        shiftDetails: this.payload.shiftDetails,
        scheduleType,
        scheduleByDates: scheduleByDates.map((scheduleByDate) => ({
          date: scheduleByDate.date
        })),
        endDate: formatedEndDate2,
        scheduleEndOn
      }
    });
    this.gotoNextStep.emit();
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
      if (rest.assignmentDetails.type === 'plant') {
        rest.assignmentDetails.type = 'user';
      }
      const info: ErrorInfo = {
        displayToast: false,
        failureResponse: 'throwError'
      };

      if (id) {
        const dates =
          schedularConfigFormValue.scheduleType === 'byDate'
            ? scheduleByDates.map((s) => ({
                ...s,
                scheduled: false
              }))
            : [];
        const payload = {
          ...rest,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleEndOn: scheduleEndOnByPlantTimezone,
          scheduleByDates: dates,
          scheduledTill: null,
          shiftDetails: this.prepareShiftDetailsPayload(this.shiftDetails)
        };
        delete payload.shiftSlots;
        if (this.isFormModule) {
          delete payload.roundPlanId;
          delete payload.advanceRoundsCount;
          this.openScheduleSuccessModal('update');
          this.operatorRoundService.setScheduleStatus('loading');
          this.formScheduleConfigurationService
            .updateFormScheduleConfiguration$(id, payload, info)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  // Close popup and pass data through it
                  this.dialogRef.close({
                    formsScheduleConfiguration: scheduleConfig,
                    mode: 'update',
                    actionType: 'scheduleConfig'
                  });
                  this.schedulerConfigForm.markAsPristine();
                  this.operatorRoundService.setScheduleStatus('scheduled');
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe({
              error: (error) => {
                this.operatorRoundService.setScheduleError(
                  this.errorHandlerService.getErrorMessage(error)
                );
                this.operatorRoundService.setScheduleStatus('failed');
                this.dialogRef.close({
                  formsScheduleConfiguration: payload,
                  mode: 'update',
                  actionType: 'scheduleFailure'
                });
              }
            });
        } else {
          delete payload.formId;
          delete payload.advanceFormsCount;
          this.openScheduleSuccessModal('update');
          this.operatorRoundService.setScheduleStatus('loading');
          this.rpscService
            .updateRoundPlanScheduleConfiguration$(id, payload, info)
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
                  this.schedulerConfigForm.markAsPristine();
                  this.operatorRoundService.setScheduleStatus('scheduled');
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe({
              error: (error) => {
                this.operatorRoundService.setScheduleError(
                  this.errorHandlerService.getErrorMessage(error)
                );
                this.operatorRoundService.setScheduleStatus('failed');
                this.dialogRef.close({
                  roundPlanScheduleConfiguration: payload,
                  mode: 'update',
                  actionType: 'scheduleFailure'
                });
              }
            });
        }
      } else {
        const payload = {
          ...rest,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleEndOn: scheduleEndOnByPlantTimezone,
          scheduleByDates,
          shiftDetails: this.prepareShiftDetailsPayload(this.shiftDetails),
          isTaskLevel: false
        };
        delete payload.shiftSlots;
        if (this.isFormModule) {
          delete payload.roundPlanId;
          delete payload.advanceRoundsCount;
          this.openScheduleSuccessModal('create');
          this.operatorRoundService.setScheduleStatus('loading');
          this.formScheduleConfigurationService
            .createFormScheduleConfiguration$(payload, info)
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
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                  this.operatorRoundService.setScheduleStatus('scheduled');
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe({
              error: (error) => {
                this.operatorRoundService.setScheduleError(
                  this.errorHandlerService.getErrorMessage(error)
                );
                this.operatorRoundService.setScheduleStatus('failed');
                this.dialogRef.close({
                  formsScheduleConfiguration: payload,
                  mode: 'create',
                  actionType: 'scheduleFailure'
                });
              }
            });
        } else {
          delete payload.formId;
          delete payload.advanceFormsCount;
          this.openScheduleSuccessModal('create');
          this.operatorRoundService.setScheduleStatus('loading');
          this.rpscService
            .createRoundPlanScheduleConfiguration$(payload, info)
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
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                  this.operatorRoundService.setScheduleStatus('scheduled');
                }
                this.initShiftStat();
                this.cdrf.detectChanges();
              })
            )
            .subscribe({
              error: (error) => {
                this.operatorRoundService.setScheduleError(
                  this.errorHandlerService.getErrorMessage(error)
                );
                this.operatorRoundService.setScheduleStatus('failed');
                this.dialogRef.close({
                  roundPlanScheduleConfiguration: payload,
                  mode: 'create',
                  actionType: 'scheduleFailure'
                });
              }
            });
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
    const index = this.findDate(format(date, dateTimeFormat3));
    if (index === -1) {
      this.scheduleByDates = [
        ...this.scheduleByDates,
        {
          date: date,
          scheduled: false
        }
      ];
      this.scheduleByDatePicker.push(format(date, dateTimeFormat3));
    } else {
      this.scheduleByDates.splice(index, 1);
      this.scheduleByDatePicker.splice(index, 1);
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
            this.scheduleEndOnPickerMinDate = isBefore(
              new Date(),
              new Date(startDate)
            )
              ? new Date(startDate)
              : isBefore(new Date(), new Date(scheduleEndOn))
              ? new Date()
              : new Date(scheduleEndOn);
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
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => {
              this.scheduleByDatePicker.push(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateTimeFormat3
                )
              );
              return {
                ...scheduleByDate,
                date: localToTimezoneDate(
                  scheduleByDate.date,
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateTimeFormat3
                )
              };
            });
            if (config?.shiftDetails) {
              if (Object.keys(config.shiftDetails)[0] !== 'null') {
                config['shiftsSelected'] = Object.keys(config.shiftDetails);
              }
              this.shiftApiResponse = this.prepareShiftDetailsPayload(
                config?.shiftDetails,
                '12'
              );
              if (Object.keys(config.shiftDetails)[0] !== 'null') {
                config['shiftsSelected'] = Object.keys(config.shiftDetails);
              }
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
          addDays(new Date(), 29),
          this.plantTimezoneMap[this.selectedDetails?.plantId],
          dateFormat3
        ),
        endDateDisplay: localToTimezoneDate(
          addDays(new Date(), 29),
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
            addDays(new Date(), 29),
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
        endDate: format(addDays(new Date(), 29), dateFormat3),
        scheduleEndOn: format(addDays(new Date(), 29), dateFormat4),
        daysOfWeek: [getDay(new Date())],
        startDatePicker: new Date(),
        endDatePicker: addDays(new Date(), 29),
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
      endDate: format(addDays(new Date(), 29), 'd MMMM yyyy'),
      endDatePicker: new Date(addDays(new Date(), 29)),
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
            this.scheduleEndOnPickerMinDate = isBefore(
              new Date(),
              new Date(startDate)
            )
              ? new Date(startDate)
              : isBefore(new Date(), new Date(scheduleEndOn))
              ? new Date()
              : new Date(scheduleEndOn);
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

            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => {
              this.scheduleByDatePicker.push(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateTimeFormat3
                )
              );

              return {
                ...scheduleByDate,
                date: localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.selectedDetails?.plantId],
                  dateTimeFormat3
                )
              };
            });
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

  findDate(date: String): number {
    return this.scheduleByDatePicker
      ?.map((scheduleByDate) => scheduleByDate)
      .indexOf(date);
  }

  dateClass = (date: Date) => {
    if (this.findDate(format(date, dateTimeFormat3)) !== -1) {
      return ['selected'];
    }
    return [];
  };

  prepareScheduleByDates() {
    return this.scheduleByDates.map((scheduleByDate) => {
      let dateByPlantTimezone = new Date(
        format(new Date(scheduleByDate.date), dateTimeFormat5)
      );
      if (
        this.plantTimezoneMap[this.selectedDetails?.plantId]?.timeZoneIdentifier
      ) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(new Date(scheduleByDate.date), dateTimeFormat5),
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
      height: 'max-content',
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

  selectedAssigneeHandler(selectedAssignee: any) {
    if (selectedAssignee.assigneeType === 'user') {
      const { email: value, firstName, lastName } = selectedAssignee.user;
      this.schedulerConfigForm
        .get('assignmentDetails')
        .patchValue({ value, displayValue: `${firstName} ${lastName}` });
    }
    if (selectedAssignee.assigneeType === 'userGroup') {
      const { id: value, name: displayValue } = selectedAssignee.userGroup;
      this.schedulerConfigForm
        .get('assignmentDetails')
        .patchValue({ value, displayValue });
    }
    if (selectedAssignee.assigneeType === 'unit') {
      const { id: value, name: displayValue } = selectedAssignee.unit;
      this.schedulerConfigForm
        .get('assignmentDetails')
        .patchValue({ value, displayValue });
    }
    if (selectedAssignee.assigneeType === 'position') {
      const { id: value, name: displayValue } = selectedAssignee.position;
      this.schedulerConfigForm
        .get('assignmentDetails')
        .patchValue({ value, displayValue });
    }
    this.schedulerConfigForm.markAsDirty();
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
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
    return (
      this.shiftSlots?.value?.length > 0 && !this.shiftSlots?.value[0].null
    );
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
              endTime: foundShift?.endTime,
              payload: [
                {
                  startTime:
                    this.scheduleConfigurationService.convertTo12HourFormat(
                      foundShift?.startTime
                    ),
                  endTime:
                    this.scheduleConfigurationService.convertTo12HourFormat(
                      foundShift?.endTime
                    )
                }
              ]
            })
          );
        }
      });

      for (const key in this.shiftDetails) {
        if (!value.includes(key)) {
          delete this.shiftDetails[key];
        }
      }
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
      if (this.shiftDetails) {
        this.shiftSlots.push(
          this.addShiftDetails(false, {
            null: {
              startTime: this.shiftDetails?.null[0]?.startTime,
              endTime: this.shiftDetails?.null[0]?.endTime,
              payload: [
                {
                  startTime: this.shiftDetails?.null[0]?.startTime,
                  endTime: this.shiftDetails?.null[0]?.endTime
                }
              ]
            }
          })
        );
      }
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

  headerLevelScheduling() {
    this.prepareScheduleConfigurationDetail();
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.shiftDetails = {};
    this.shiftApiResponse = null;
    this.scheduleConfigurationService.setInitialSlotChanged();
  }

  onChangeScheduleType() {
    this.schedulerConfigForm.get('advanceRoundsCount').setValue(0);
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

  private getAdvanceAllowedRoundCount(scheduleEndOnPicker = null) {
    const startDate = localToTimezoneDate(
      new Date(this.schedulerConfigForm.value.startDatePicker),
      this.plantTimezoneMap[this.selectedDetails?.plantId],
      dateTimeFormat5
    );
    const endDate = localToTimezoneDate(
      new Date(
        scheduleEndOnPicker ||
          this.schedulerConfigForm.value.scheduleEndOnPicker
      ),
      this.plantTimezoneMap[this.selectedDetails?.plantId],
      dateTimeFormat5
    );
    const roundCount = differenceInDays(new Date(endDate), new Date(startDate));
    return { roundCount };
  }
}
