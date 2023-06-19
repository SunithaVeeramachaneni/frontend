/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatCalendar,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
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
  UserDetails,
  ValidationError
} from 'src/app/interfaces';
import { ScheduleSuccessModalComponent } from '../schedule-success-modal/schedule-success-modal.component';
import { FormScheduleConfigurationService } from './../../../../components/race-dynamic-form/services/form-schedule-configuration.service';
import { scheduleConfigs } from './schedule-configuration.constants';
import { Subject, Subscription } from 'rxjs';
import { PlantService } from 'src/app/components/master-configurations/plants/services/plant.service';
import {
  getDayTz,
  localToTimezoneDate
} from 'src/app/shared/utils/timezoneDate';
import { zonedTimeToUtc, formatInTimeZone } from 'date-fns-tz';

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
  @Input() assigneeDetails: AssigneeDetails;
  @Input() moduleName: 'OPERATOR_ROUNDS' | 'RDF';
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Input() set roundPlanDetail(roundPlanDetail: any) {
    this._roundPlanDetail = roundPlanDetail;
    if (roundPlanDetail) {
      this.getRoundPlanSchedulerConfigurationByRoundPlanId(roundPlanDetail.id);
    }
  }
  get roundPlanDetail(): any {
    return this._roundPlanDetail;
  }
  @Input() set formDetail(formDetail) {
    this._formDetail = formDetail;
    if (this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier) {
      this.currentDate = new Date(
        localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.formDetail?.plantId],
          'yyyy-MM-dd HH:mm:ss'
        )
      );
      if (this.schedulerConfigForm?.value) {
        this.schedulerConfigForm.patchValue({
          ...this.getDefaultSchedulerConfigDates()
        });
      }
    }
    if (formDetail) {
      this.getFormsSchedulerConfigurationByFormId(formDetail?.id);
    }
  }
  get formDetail(): any {
    return this._formDetail;
  }
  @Output()
  scheduleConfigEvent: EventEmitter<ScheduleConfigEvent> =
    new EventEmitter<ScheduleConfigEvent>();
  @Output()
  scheduleConfig: EventEmitter<ScheduleConfig> =
    new EventEmitter<ScheduleConfig>();
  @Output()
  plantMapSubscription: Subscription;
  scheduleTypes = scheduleConfigs.scheduleTypes;
  scheduleEndTypes = scheduleConfigs.scheduleEndTypes;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  schedulerConfigForm: FormGroup;
  currentDate: Date;
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
  plantTimezoneMap: any = {};
  placeHolder = '_ _';
  private _roundPlanDetail: any;
  private _formDetail: any;
  private onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private readonly formScheduleConfigurationService: FormScheduleConfigurationService,
    private plantService: PlantService
  ) {
    if (this.isFormModule) {
      this.formName = this.formDetail?.name || '';
    } else {
      this.formName = this.roundPlanDetail?.name || '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moduleName?.currentValue === 'RDF') {
      this.isFormModule = true;
    }

    if (this.isFormModule) {
      this.formName = this.formDetail?.name || '';
    } else {
      this.formName = this.roundPlanDetail?.name || '';
    }
  }

  ngOnInit(): void {
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    this.schedulerConfigForm = this.fb.group({
      id: '',
      roundPlanId: this.roundPlanDetail?.id,
      formId: this.formDetail?.id,
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
          value: format(addDays(new Date(), 29), 'MMM d, yyyy'),
          disabled: true
        }
      ],
      scheduleEndOnPicker: new Date(addDays(new Date(), 29)),
      scheduleEndOccurrences: [
        { value: 30, disabled: true },
        [Validators.required, Validators.min(1)]
      ],
      scheduleEndOccurrencesText: [{ value: 'occurrences', disabled: true }],
      startDate: format(new Date(), 'd MMMM yyyy'),
      startDatePicker: new Date(),
      endDate: [
        {
          value: format(addDays(new Date(), 30), 'd MMMM yyyy'),
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
      ]
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
            this.scheduleByDates = [];
            break;
          case 'byDate':
            if (!this.scheduleByDates?.length) {
              this.scheduleByDates = [
                {
                  date: new Date(
                    localToTimezoneDate(
                      new Date(),
                      this.plantTimezoneMap[this.formDetail?.plantId],
                      'yyyy-MM-dd 00:00:00'
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
        switch (repeatEvery) {
          case 'day':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 29),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 29),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'MMM d, yyyy'
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
                  addDays(new Date(), 29),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 29),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'd MMMM yyyy'
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
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 90),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'MMM d, yyyy'
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
                  this.plantTimezoneMap[this.formDetail?.plantId]
                )
              ]);
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 90),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 90),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'd MMMM yyyy'
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
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.schedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 364),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'MMM d, yyyy'
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
                  addDays(new Date(), 364),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.schedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 364),
                    this.plantTimezoneMap[this.formDetail?.plantId],
                    'd MMMM yyyy'
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
                this.plantTimezoneMap[this.formDetail?.plantId]
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
            acc += curr.length;
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
          this.schedulerConfigForm
            .get('endDate')
            .patchValue(
              localToTimezoneDate(
                addDays(
                  new Date(),
                  days * this.schedulerConfigForm.get('repeatDuration').value -
                    1
                ),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'd MMMM yyyy'
              )
            );
          this.schedulerConfigForm
            .get('endDatePicker')
            .patchValue(
              new Date(
                localToTimezoneDate(
                  addDays(
                    new Date(),
                    days *
                      this.schedulerConfigForm.get('repeatDuration').value -
                      1
                  ),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
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

    this.currentDate = new Date();
    this.setMonthlyDaysOfWeek();
    this.schedulerConfigForm.markAsDirty();
  }

  setMonthlyDaysOfWeek() {
    for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
      weekRepeatDays.patchValue([
        getDayTz(new Date(), this.plantTimezoneMap[this.formDetail?.plantId])
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
    this.scheduleConfigEvent.emit({ slideInOut: 'out' });
  }

  scheduleConfiguration() {
    if (this.schedulerConfigForm.valid && this.schedulerConfigForm.dirty) {
      this.disableSchedule = true;
      const schedularConfigFormValue = this.schedulerConfigForm.getRawValue();
      const { id, startDate, endDate, scheduleEndOn } =
        schedularConfigFormValue;
      let time = format(new Date(), 'HH:00:00');
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

      if (this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier) {
        time = localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.formDetail?.plantId],
          'HH:00:00'
        );

        startDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(startDate), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier
        ).toISOString();

        endDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(endDate), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier
        ).toISOString();

        scheduleEndOnByPlantTimezone = zonedTimeToUtc(
          format(new Date(scheduleEndOn), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier
        ).toISOString();
      }

      if (id) {
        const payload = {
          ...rest,
          startDate: startDateByPlantTimezone,
          endDate: endDateByPlantTimezone,
          scheduleEndOn: scheduleEndOnByPlantTimezone,
          scheduleByDates
        };
        if (this.isFormModule) {
          delete payload.roundPlanId;
          this.formScheduleConfigurationService
            .updateFormScheduleConfiguration$(id, payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  this.scheduleConfig.emit({
                    formsScheduleConfiguration: scheduleConfig,
                    mode: 'update'
                  });
                  this.openScheduleSuccessModal('update');
                  this.schedulerConfigForm.markAsPristine();
                }
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        } else {
          delete payload.formId;
          this.rpscService
            .updateRoundPlanScheduleConfiguration$(id, payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig).length) {
                  this.scheduleConfig.emit({
                    roundPlanScheduleConfiguration: scheduleConfig,
                    mode: 'update'
                  });
                  this.openScheduleSuccessModal('update');
                  this.schedulerConfigForm.markAsPristine();
                }
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
          scheduleByDates
        };
        if (this.isFormModule) {
          delete payload.roundPlanId;
          this.formScheduleConfigurationService
            .createFormScheduleConfiguration$(payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  this.scheduleConfig.emit({
                    formsScheduleConfiguration: scheduleConfig,
                    mode: 'create'
                  });
                  this.openScheduleSuccessModal('create');
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                }
                this.cdrf.detectChanges();
              })
            )
            .subscribe();
        } else {
          delete payload.formId;
          this.rpscService
            .createRoundPlanScheduleConfiguration$(payload)
            .pipe(
              tap((scheduleConfig) => {
                this.disableSchedule = false;
                if (scheduleConfig && Object.keys(scheduleConfig)?.length) {
                  this.scheduleConfig.emit({
                    roundPlanScheduleConfiguration: scheduleConfig,
                    mode: 'create'
                  });
                  this.openScheduleSuccessModal('create');
                  this.schedulerConfigForm
                    .get('id')
                    .patchValue(scheduleConfig.id);
                  this.schedulerConfigForm.markAsPristine();
                }
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
          ? format(event.value, 'd MMMM yyyy')
          : format(event.value, 'MMM d, yyyy')
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
            config = {
              ...config,
              startDate: localToTimezoneDate(
                new Date(startDate),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'd MMMM yyyy'
              ),
              endDate: localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'd MMMM yyyy'
              ),
              scheduleEndOn: localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'MMM d, yyyy'
              ),
              startDatePicker: new Date(
                localToTimezoneDate(
                  new Date(startDate),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              endDatePicker: new Date(
                localToTimezoneDate(
                  new Date(endDate),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              scheduleEndOnPicker: new Date(
                localToTimezoneDate(
                  new Date(scheduleEndOn),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'MMM d, yyyy'
                )
              )
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  ''
                )
              )
            }));
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
    if (this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier) {
      return {
        startDate: localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.formDetail?.plantId],
          'd MMMM yyyy'
        ),
        endDate: localToTimezoneDate(
          addDays(new Date(), 30),
          this.plantTimezoneMap[this.formDetail?.plantId],
          'd MMMM yyyy'
        ),
        scheduleEndOn: localToTimezoneDate(
          addDays(new Date(), 29),
          this.plantTimezoneMap[this.formDetail?.plantId],
          'MMM d, yyyy'
        ),
        daysOfWeek: [
          getDayTz(new Date(), this.plantTimezoneMap[this.formDetail?.plantId])
        ],
        startDatePicker: new Date(
          localToTimezoneDate(
            new Date(),
            this.plantTimezoneMap[this.formDetail?.plantId],
            'd MMMM yyyy'
          )
        ),
        endDatePicker: new Date(
          localToTimezoneDate(
            addDays(new Date(), 30),
            this.plantTimezoneMap[this.formDetail?.plantId],
            'd MMMM yyyy'
          )
        ),
        scheduleEndOnPicker: new Date(
          localToTimezoneDate(
            addDays(new Date(), 29),
            this.plantTimezoneMap[this.formDetail?.plantId],
            'MMM d, yyyy'
          )
        )
      };
    } else {
      return {
        startDate: format(new Date(), 'd MMMM yyyy'),
        endDate: format(addDays(new Date(), 30), 'd MMMM yyyy'),
        scheduleEndOn: format(addDays(new Date(), 29), 'MMM d, yyyy'),
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
      scheduledTill: null,
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

            config = {
              ...config,
              startDate: localToTimezoneDate(
                new Date(startDate),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'd MMMM yyyy'
              ),
              endDate: localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'd MMMM yyyy'
              ),
              scheduleEndOn: localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[this.formDetail?.plantId],
                'MMM d, yyyy'
              ),
              startDatePicker: new Date(
                localToTimezoneDate(
                  new Date(startDate),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              endDatePicker: new Date(
                localToTimezoneDate(
                  new Date(endDate),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              scheduleEndOnPicker: new Date(
                localToTimezoneDate(
                  new Date(scheduleEndOn),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'MMM d, yyyy'
                )
              )
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.formDetail?.plantId],
                  'yyyy-MM-dd 00:00:00'
                )
              )
            }));
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
        format(scheduleByDate.date, 'yyyy-MM-dd 00:00:00')
      );
      if (this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(scheduleByDate.date, 'yyyy-MM-dd 00:00:00'),
          this.plantTimezoneMap[this.formDetail?.plantId]?.timeZoneIdentifier
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
        name: this.isFormModule
          ? this.formDetail?.name
          : this.roundPlanDetail.name,
        mode: dialogMode,
        isFormModule: this.isFormModule
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data?.redirect) {
          if (this.isFormModule) {
            this.scheduleConfigEvent.emit({
              slideInOut: 'out',
              viewForms: true
            });
          } else {
            this.scheduleConfigEvent.emit({
              slideInOut: 'out',
              viewRounds: true
            });
          }
        } else {
          this.scheduleConfigEvent.emit({
            slideInOut: 'out',
            mode: data.mode
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
    this.schedulerConfigForm
      .get('advanceFormsCount')
      .setValidators([
        Validators.required,
        Validators.min(this.roundsGeneration.min),
        Validators.max(this.roundsGeneration.max)
      ]);
    this.schedulerConfigForm.get('advanceFormsCount').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
