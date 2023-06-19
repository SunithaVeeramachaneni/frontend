/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
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
import {
  AssigneeDetails,
  RoundPlanScheduleConfiguration,
  RoundPlanScheduleConfigurationObj,
  ScheduleByDate,
  SelectedAssignee,
  ValidationError
} from 'src/app/interfaces';
import { UsersService } from '../../user-management/services/users.service';
import { RoundPlanScheduleSuccessModalComponent } from '../round-plan-schedule-success-modal/round-plan-schedule-success-modal.component';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { scheduleConfigs } from './round-plan-schedule-configuration.constants';
import { Subject } from 'rxjs';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import {
  getDayTz,
  localToTimezoneDate
} from 'src/app/shared/utils/timezoneDate';
import { zonedTimeToUtc } from 'date-fns-tz';

export interface ScheduleConfig {
  roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration;
  mode: 'create' | 'update';
}
export interface ScheduleConfigEvent {
  slideInOut: 'out' | 'in';
  viewRounds?: boolean;
  mode?: 'create' | 'update';
}
@Component({
  selector: 'app-round-plan-schedule-configuration',
  templateUrl: './round-plan-schedule-configuration.component.html',
  styleUrls: ['./round-plan-schedule-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanScheduleConfigurationComponent
  implements OnInit, DoCheck, OnDestroy
{
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() set roundPlanDetail(roundPlanDetail: any) {
    this._roundPlanDetail = roundPlanDetail;
    this.setDefaultSchedulerConfigDates();
    if (roundPlanDetail) {
      this.getRoundPlanSchedulerConfigurationByRoundPlanId(roundPlanDetail.id);
    }
  }
  get roundPlanDetail(): any {
    return this._roundPlanDetail;
  }
  @Input() assigneeDetails: AssigneeDetails;
  @Output()
  scheduleConfigEvent: EventEmitter<ScheduleConfigEvent> =
    new EventEmitter<ScheduleConfigEvent>();
  @Output()
  scheduleConfig: EventEmitter<ScheduleConfig> =
    new EventEmitter<ScheduleConfig>();
  scheduleTypes = scheduleConfigs.scheduleTypes;
  scheduleEndTypes = scheduleConfigs.scheduleEndTypes;
  repeatTypes = scheduleConfigs.repeatTypes;
  daysOfWeek = scheduleConfigs.daysOfWeek;
  weeksOfMonth = scheduleConfigs.weeksOfMonth;
  roundPlanSchedulerConfigForm: FormGroup;
  currentDate: Date;
  scheduleByDates: ScheduleByDate[];
  disableSchedule = false;
  roundPlanScheduleConfigurations: RoundPlanScheduleConfigurationObj[];
  assignTypes = scheduleConfigs.assignTypes;
  errors: ValidationError = {};
  roundsGeneration = {
    min: 0,
    max: 30
  };
  dropdownPosition: any;
  plantTimezoneMap: any;
  placeHolder = '_ _';
  private _roundPlanDetail: any;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private userService: UsersService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.plantTimeZoneMapping$.subscribe(
      (data) => (this.plantTimezoneMap = data)
    );
    this.roundPlanSchedulerConfigForm = this.fb.group({
      id: '',
      roundPlanId: this.roundPlanDetail?.id,
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
        type: ['user'],
        value: '',
        displayValue: ''
      }),
      advanceRoundsCount: [
        0,
        [
          Validators.required,
          Validators.min(this.roundsGeneration.min),
          Validators.max(this.roundsGeneration.max)
        ]
      ]
    });
    this.roundPlanSchedulerConfigForm
      .get('scheduleEndType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((scheduleEndType) => {
        switch (scheduleEndType) {
          case 'on':
            this.roundPlanSchedulerConfigForm.get('scheduleEndOn').enable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .disable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrencesText')
              .disable();
            break;
          case 'after':
            this.roundPlanSchedulerConfigForm.get('scheduleEndOn').disable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .enable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrencesText')
              .enable();
            break;
          default:
            this.roundPlanSchedulerConfigForm.get('scheduleEndOn').disable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .disable();
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrencesText')
              .disable();
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('scheduleType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((scheduleType) => {
        switch (scheduleType) {
          case 'byFrequency':
            this.roundPlanSchedulerConfigForm
              .get('repeatEvery')
              .patchValue('day');
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndType')
              .patchValue('on'); // never
            this.scheduleByDates = [];
            break;
          case 'byDate':
            if (!this.scheduleByDates.length) {
              this.scheduleByDates = [
                {
                  date: new Date(
                    localToTimezoneDate(
                      new Date(),
                      this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                      'yyyy-MM-dd 00:00:00'
                    )
                  ),
                  scheduled: false
                }
              ];
            }
            this.roundPlanSchedulerConfigForm
              .get('repeatEvery')
              .patchValue('none');
            this.updateAdvanceRoundsCountValidation(12);
            break;
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('repeatEvery')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((repeatEvery) => {
        switch (repeatEvery) {
          case 'day':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 29),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 29),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'MMM d, yyyy'
                  )
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(30);
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 29),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 29),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'd MMMM yyyy'
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(30);
            break;
          case 'week':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 90),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 90),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'MMM d, yyyy'
                  )
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(daysToWeeks(91));
            this.roundPlanSchedulerConfigForm
              .get('daysOfWeek')
              .patchValue([
                getDayTz(
                  new Date(),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId]
                )
              ]);
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 90),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 90),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'd MMMM yyyy'
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(daysToWeeks(91));
            break;
          case 'month':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 364),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'MMM d, yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOnPicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 364),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'MMM d, yyyy'
                  )
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(12);
            this.setMonthlyDaysOfWeek();
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(
                localToTimezoneDate(
                  addDays(new Date(), 364),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              );
            this.roundPlanSchedulerConfigForm
              .get('endDatePicker')
              .patchValue(
                new Date(
                  localToTimezoneDate(
                    addDays(new Date(), 364),
                    this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                    'd MMMM yyyy'
                  )
                )
              );
            this.updateAdvanceRoundsCountValidation(12);
            break;
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('daysOfWeek')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((daysOfWeek) => {
        if (daysOfWeek.length === 0) {
          this.roundPlanSchedulerConfigForm
            .get('daysOfWeek')
            .patchValue([
              getDayTz(
                new Date(),
                this.plantTimezoneMap[this.roundPlanDetail?.plantId]
              )
            ]);
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('monthlyDaysOfWeek')
      .valueChanges.pipe(takeUntil(this.destroy$))
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

    this.roundPlanSchedulerConfigForm
      .get('scheduleEndOccurrences')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((occurrences) => {
        if (occurrences > 0) {
          let days = 0;
          switch (this.roundPlanSchedulerConfigForm.get('repeatEvery').value) {
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
          this.roundPlanSchedulerConfigForm
            .get('endDate')
            .patchValue(
              localToTimezoneDate(
                addDays(
                  new Date(),
                  days *
                    this.roundPlanSchedulerConfigForm.get('repeatDuration')
                      .value -
                    1
                ),
                this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                'd MMMM yyyy'
              )
            );
          this.roundPlanSchedulerConfigForm
            .get('endDatePicker')
            .patchValue(
              new Date(
                localToTimezoneDate(
                  addDays(
                    new Date(),
                    days *
                      this.roundPlanSchedulerConfigForm.get('repeatDuration')
                        .value -
                      1
                  ),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              )
            );
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('repeatDuration')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.roundPlanSchedulerConfigForm
          .get('scheduleEndOccurrences')
          .patchValue(
            this.roundPlanSchedulerConfigForm.get('scheduleEndOccurrences')
              .value
          );
      });

    this.currentDate = new Date();
    this.setMonthlyDaysOfWeek();
    this.roundPlanSchedulerConfigForm.markAsDirty();
  }

  ngDoCheck(): void {
    const position = document
      .getElementById('assignDropdownPosition')
      ?.getBoundingClientRect();
    this.dropdownPosition = {
      left: `${position?.left - 30}px`,
      top: `${position?.top + 20}px`,
      modalTop: `-${position?.top - 20}px`
    };
  }

  setMonthlyDaysOfWeek() {
    for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
      weekRepeatDays.patchValue([
        getDayTz(
          new Date(),
          this.plantTimezoneMap[this.roundPlanDetail?.plantId]
        )
      ]);
    }
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.roundPlanSchedulerConfigForm.get(
      'monthlyDaysOfWeek'
    ) as FormArray;
  }

  cancel() {
    this.scheduleConfigEvent.emit({ slideInOut: 'out' });
  }

  scheduleConfiguration() {
    if (
      this.roundPlanSchedulerConfigForm.valid &&
      this.roundPlanSchedulerConfigForm.dirty
    ) {
      this.disableSchedule = true;
      const roundPlanSchedulerConfig =
        this.roundPlanSchedulerConfigForm.getRawValue();
      const { id, startDate, endDate, scheduleEndOn } =
        roundPlanSchedulerConfig;
      let time = format(new Date(), 'HH:00:00');
      const {
        startDatePicker,
        scheduleEndOnPicker,
        assignmentDetails: { displayValue, ...restAssignmentDetails },
        ...rest
      } = roundPlanSchedulerConfig;
      const scheduleByDates =
        roundPlanSchedulerConfig.scheduleType === 'byDate'
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
        this.plantTimezoneMap[this.roundPlanDetail?.plantId]?.timeZoneIdentifier
      ) {
        time = localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.roundPlanDetail?.plantId],
          'HH:00:00'
        );

        startDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(startDate), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.roundPlanDetail?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();

        endDateByPlantTimezone = zonedTimeToUtc(
          format(new Date(endDate), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.roundPlanDetail?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();

        scheduleEndOnByPlantTimezone = zonedTimeToUtc(
          format(new Date(scheduleEndOn), 'yyyy-MM-dd') + ` ${time}`,
          this.plantTimezoneMap[this.roundPlanDetail?.plantId]
            ?.timeZoneIdentifier
        ).toISOString();
      }

      if (id) {
        this.rpscService
          .updateRoundPlanScheduleConfiguration$(id, {
            ...rest,
            assignmentDetails: restAssignmentDetails,
            startDate: startDateByPlantTimezone,
            endDate: endDateByPlantTimezone,
            scheduleEndOn: scheduleEndOnByPlantTimezone,
            scheduleByDates
          })
          .pipe(
            tap((scheduleConfig) => {
              this.disableSchedule = false;
              if (scheduleConfig && Object.keys(scheduleConfig).length) {
                this.scheduleConfig.emit({
                  roundPlanScheduleConfiguration: scheduleConfig,
                  mode: 'update'
                });
                this.openRoundPlanScheduleSuccessModal('update');
                this.roundPlanSchedulerConfigForm.markAsPristine();
              }
              this.cdrf.detectChanges();
            })
          )
          .subscribe();
      } else {
        this.rpscService
          .createRoundPlanScheduleConfiguration$({
            ...rest,
            assignmentDetails: restAssignmentDetails,
            startDate: startDateByPlantTimezone,
            endDate: endDateByPlantTimezone,
            scheduleEndOn: scheduleEndOnByPlantTimezone,
            scheduleByDates
          })
          .pipe(
            tap((scheduleConfig) => {
              this.disableSchedule = false;
              if (scheduleConfig && Object.keys(scheduleConfig).length) {
                this.scheduleConfig.emit({
                  roundPlanScheduleConfiguration: scheduleConfig,
                  mode: 'create'
                });
                this.openRoundPlanScheduleSuccessModal('create');
                this.roundPlanSchedulerConfigForm
                  .get('id')
                  .patchValue(scheduleConfig.id);
                this.roundPlanSchedulerConfigForm.markAsPristine();
              }
              this.cdrf.detectChanges();
            })
          )
          .subscribe();
      }
    }
  }

  updateDate(
    event: MatDatepickerInputEvent<Date>,
    formControlDateField: string
  ) {
    this.roundPlanSchedulerConfigForm.patchValue({
      [formControlDateField]:
        formControlDateField !== 'scheduleEndOn'
          ? format(event.value, 'd MMMM yyyy')
          : format(event.value, 'MMM d, yyyy')
    });
    this.roundPlanSchedulerConfigForm.markAsDirty();
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
    this.roundPlanSchedulerConfigForm.markAsDirty();
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
              scheduleByDates,
              assignmentDetails
            } = config;
            config = {
              ...config,
              assignmentDetails: {
                ...assignmentDetails,
                displayValue: this.userService.getUserFullName(
                  assignmentDetails.value
                )
              },
              startDate: localToTimezoneDate(
                new Date(startDate),
                this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                'd MMMM yyyy'
              ),
              endDate: localToTimezoneDate(
                new Date(endDate),
                this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                'd MMMM yyyy'
              ),
              scheduleEndOn: localToTimezoneDate(
                new Date(scheduleEndOn),
                this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                'MMM d, yyyy'
              ),
              startDatePicker: new Date(
                localToTimezoneDate(
                  new Date(startDate),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              endDatePicker: new Date(
                localToTimezoneDate(
                  new Date(endDate),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'd MMMM yyyy'
                )
              ),
              scheduleEndOnPicker: new Date(
                localToTimezoneDate(
                  new Date(scheduleEndOn),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  'MMM d, yyyy'
                )
              )
            };
            this.scheduleByDates = scheduleByDates.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(
                localToTimezoneDate(
                  new Date(scheduleByDate.date),
                  this.plantTimezoneMap[this.roundPlanDetail?.plantId],
                  ''
                )
              )
            }));
            this.roundPlanSchedulerConfigForm.patchValue(config);
            if (scheduledTill !== null) {
              this.roundPlanSchedulerConfigForm.get('startDate').disable();
              this.roundPlanSchedulerConfigForm
                .get('advanceRoundsCount')
                .disable();
            }
            this.roundPlanSchedulerConfigForm.markAsPristine();
            this.calendar?.updateTodaysDate();
          } else {
            this.setDefaultRoundPlanSchedulerConfig(roundPlandId);
          }
        })
      )
      .subscribe();
  }

  setDefaultSchedulerConfigDates() {
    if (
      this.plantTimezoneMap[this.roundPlanDetail?.plantId]?.timeZoneIdentifier
    ) {
      this.currentDate = new Date(
        localToTimezoneDate(
          new Date(),
          this.plantTimezoneMap[this.roundPlanDetail?.plantId],
          'yyyy-MM-dd HH:mm:ss'
        )
      );
      if (this.roundPlanSchedulerConfigForm?.value) {
        this.roundPlanSchedulerConfigForm.patchValue({
          startDate: localToTimezoneDate(
            new Date(),
            this.plantTimezoneMap[this.roundPlanDetail?.plantId],
            'd MMMM yyyy'
          ),
          endDate: localToTimezoneDate(
            addDays(new Date(), 30),
            this.plantTimezoneMap[this.roundPlanDetail?.plantId],
            'd MMMM yyyy'
          ),
          scheduleEndOn: localToTimezoneDate(
            addDays(new Date(), 29),
            this.plantTimezoneMap[this.roundPlanDetail?.plantId],
            'MMM d, yyyy'
          ),
          daysOfWeek: [
            getDayTz(
              new Date(),
              this.plantTimezoneMap[this.roundPlanDetail?.plantId]
            )
          ],
          startDatePicker: new Date(
            localToTimezoneDate(
              new Date(),
              this.plantTimezoneMap[this.roundPlanDetail?.plantId],
              'd MMMM yyyy'
            )
          ),
          endDatePicker: new Date(
            localToTimezoneDate(
              addDays(new Date(), 30),
              this.plantTimezoneMap[this.roundPlanDetail?.plantId],
              'd MMMM yyyy'
            )
          ),
          scheduleEndOnPicker: new Date(
            localToTimezoneDate(
              addDays(new Date(), 29),
              this.plantTimezoneMap[this.roundPlanDetail?.plantId],
              'MMM d, yyyy'
            )
          )
        });
      }
    } else {
      if (this.roundPlanSchedulerConfigForm?.value) {
        this.roundPlanSchedulerConfigForm.patchValue({
          startDate: format(new Date(), 'd MMMM yyyy'),
          endDate: format(addDays(new Date(), 30), 'd MMMM yyyy'),
          scheduleEndOn: format(addDays(new Date(), 29), 'MMM d, yyyy'),
          daysOfWeek: [getDay(new Date())],
          startDatePicker: new Date(),
          endDatePicker: addDays(new Date(), 30),
          scheduleEndOnPicker: addDays(new Date(), 29)
        });
      }
    }
  }

  setDefaultRoundPlanSchedulerConfig(roundPlanId: string) {
    this.roundPlanSchedulerConfigForm.patchValue({
      id: '',
      roundPlanId,
      scheduleType: 'byFrequency',
      repeatDuration: 1,
      repeatEvery: 'day',
      monthlyDaysOfWeek: this.setMonthlyDaysOfWeek(),
      scheduleEndType: 'on', // never
      scheduleEndOccurrences: 30,
      scheduleEndOccurrencesText: 'occurrences',
      scheduledTill: null,
      assignmentDetails: {
        type: this.assignTypes[0],
        value: '',
        displayValue: ''
      },
      advanceRoundsCount: 0
    });
    this.setDefaultSchedulerConfigDates();
    this.roundPlanSchedulerConfigForm.markAsDirty();
  }

  findDate(date: Date): number {
    return this.scheduleByDates
      .map((scheduleByDate) => +scheduleByDate.date)
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
      if (
        this.plantTimezoneMap[this.roundPlanDetail?.plantId]?.timeZoneIdentifier
      ) {
        dateByPlantTimezone = zonedTimeToUtc(
          format(scheduleByDate.date, 'yyyy-MM-dd 00:00:00'),
          this.plantTimezoneMap[this.roundPlanDetail?.plantId]
            ?.timeZoneIdentifier
        );
      }
      return {
        ...scheduleByDate,
        date: dateByPlantTimezone
      };
    });
  }

  openRoundPlanScheduleSuccessModal(dialogMode: 'create' | 'update') {
    const dialogRef = this.dialog.open(RoundPlanScheduleSuccessModalComponent, {
      disableClose: true,
      width: '354px',
      height: '275px',
      backdropClass: 'round-plan-schedule-success-modal',
      data: {
        roundPlanName: this.roundPlanDetail.name,
        mode: dialogMode
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data.redirectToRounds) {
          this.scheduleConfigEvent.emit({
            slideInOut: 'out',
            viewRounds: true
          });
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
    this.roundPlanSchedulerConfigForm
      .get('assignmentDetails')
      .patchValue({ value, displayValue: `${firstName} ${lastName}` });
    this.roundPlanSchedulerConfigForm.markAsDirty();
    this.trigger.closeMenu();
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.roundPlanSchedulerConfigForm.get(controlName).touched;
    const errors = this.roundPlanSchedulerConfigForm.get(controlName).errors;
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
    this.roundPlanSchedulerConfigForm
      .get('advanceRoundsCount')
      .setValidators([
        Validators.required,
        Validators.min(this.roundsGeneration.min),
        Validators.max(this.roundsGeneration.max)
      ]);
    this.roundPlanSchedulerConfigForm
      .get('advanceRoundsCount')
      .updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.plantService.plantTimeZoneMapping$.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
