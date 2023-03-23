/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
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
import { tap } from 'rxjs/operators';
import {
  AssigneeDetails,
  RoundPlanScheduleConfiguration,
  RoundPlanScheduleConfigurationObj,
  ScheduleByDate,
  UserDetails,
  ValidationError
} from 'src/app/interfaces';
import { RoundPlanScheduleSuccessModalComponent } from '../round-plan-schedule-success-modal/round-plan-schedule-success-modal.component';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';
import { scheduleConfigs } from './round-plan-schedule-configuration.constants';

export interface ScheduleConfig {
  roundPlanScheduleConfiguration: RoundPlanScheduleConfiguration;
  mode: 'create' | 'update';
}
@Component({
  selector: 'app-round-plan-schedule-configuration',
  templateUrl: './round-plan-schedule-configuration.component.html',
  styleUrls: ['./round-plan-schedule-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanScheduleConfigurationComponent implements OnInit {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger;
  @Input() set roundPlanDetail(roundPlanDetail: any) {
    this._roundPlanDetail = roundPlanDetail;
    if (roundPlanDetail) {
      this.getRoundPlanSchedulerConfigurationByRoundPlanId(roundPlanDetail.id);
    }
  }
  get roundPlanDetail(): any {
    return this._roundPlanDetail;
  }
  @Input() assigneeDetails: AssigneeDetails;
  @Output()
  scheduleConfigState: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  scheduleConfig: EventEmitter<ScheduleConfig> =
    new EventEmitter<ScheduleConfig>();
  @Output()
  viewRounds: EventEmitter<string> = new EventEmitter<string>();
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
  private _roundPlanDetail: any;

  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private operatorRoundsService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
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
      scheduleEndType: 'never',
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
      .valueChanges.subscribe((scheduleEndType) => {
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
      .valueChanges.subscribe((scheduleType) => {
        switch (scheduleType) {
          case 'byFrequency':
            this.roundPlanSchedulerConfigForm
              .get('repeatEvery')
              .patchValue('day');
            this.scheduleByDates = [];
            break;
          case 'byDate':
            if (!this.scheduleByDates.length) {
              this.scheduleByDates = [
                {
                  date: new Date(format(new Date(), 'yyyy-MM-dd 00:00:00')),
                  scheduled: false
                }
              ];
            }
            break;
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('repeatEvery')
      .valueChanges.subscribe((repeatEvery) => {
        switch (repeatEvery) {
          case 'day':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 29), 'MMM d, yyyy'));
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(30);
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 29), 'd MMMM yyyy'));
            this.roundsGeneration.max = 30;
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
            break;
          case 'week':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 90), 'MMM d, yyyy'));
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(daysToWeeks(91));
            this.roundPlanSchedulerConfigForm
              .get('daysOfWeek')
              .patchValue([getDay(new Date())]);
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 90), 'd MMMM yyyy'));
            this.roundsGeneration.max = daysToWeeks(91);
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
            break;
          case 'month':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 364), 'MMM d, yyyy'));
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(12);
            this.setMonthlyDaysOfWeek();
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 364), 'd MMMM yyyy'));
            this.roundsGeneration.max = 12;
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
            break;
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('daysOfWeek')
      .valueChanges.subscribe((daysOfWeek) => {
        if (daysOfWeek.length === 0) {
          this.roundPlanSchedulerConfigForm
            .get('daysOfWeek')
            .patchValue([getDay(new Date())]);
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('monthlyDaysOfWeek')
      .valueChanges.subscribe((monthlyDaysOfWeek) => {
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
      .valueChanges.subscribe((occurrences) => {
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
              format(
                addDays(
                  new Date(),
                  days *
                    this.roundPlanSchedulerConfigForm.get('repeatDuration')
                      .value -
                    1
                ),
                'd MMMM yyyy'
              )
            );
        }
      });

    this.roundPlanSchedulerConfigForm
      .get('repeatDuration')
      .valueChanges.subscribe(() => {
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

  setMonthlyDaysOfWeek() {
    for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
      weekRepeatDays.patchValue([getDay(new Date())]);
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
    this.scheduleConfigState.emit('out');
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
      const time = format(new Date(), 'HH:00:00');
      const {
        startDatePicker,
        endDatePicker,
        scheduleEndOnPicker,
        assignmentDetails: { displayValue, ...restAssignmentDetails },
        ...rest
      } = roundPlanSchedulerConfig;
      const scheduleByDates =
        roundPlanSchedulerConfig.scheduleType === 'byDate'
          ? this.prepareScheduleByDates()
          : [];

      if (id) {
        this.rpscService
          .updateRoundPlanScheduleConfiguration$(id, {
            ...rest,
            assignmentDetails: restAssignmentDetails,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
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
                this.cdrf.detectChanges();
              }
            })
          )
          .subscribe();
      } else {
        this.rpscService
          .createRoundPlanScheduleConfiguration$({
            ...rest,
            assignmentDetails: restAssignmentDetails,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
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
                this.cdrf.detectChanges();
              }
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
                displayValue: this.operatorRoundsService.getUserFullName(
                  assignmentDetails.value
                )
              },
              startDate: format(new Date(startDate), 'd MMMM yyyy'),
              endDate: format(new Date(endDate), 'd MMMM yyyy'),
              scheduleEndOn: format(new Date(scheduleEndOn), 'MMM d, yyyy'),
              startDatePicker: new Date(startDate),
              endDatePicker: new Date(endDate),
              scheduleEndOnPicker: new Date(scheduleEndOn)
            };
            this.scheduleByDates = scheduleByDates.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(scheduleByDate.date)
            }));
            this.roundPlanSchedulerConfigForm.patchValue(config);
            if (scheduledTill !== null) {
              this.roundPlanSchedulerConfigForm.get('startDate').disable();
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

  setDefaultRoundPlanSchedulerConfig(roundPlanId: string) {
    this.roundPlanSchedulerConfigForm.patchValue({
      id: '',
      roundPlanId,
      scheduleType: 'byFrequency',
      repeatDuration: 1,
      repeatEvery: 'day',
      daysOfWeek: [getDay(new Date())],
      monthlyDaysOfWeek: this.setMonthlyDaysOfWeek(),
      scheduleEndType: 'never',
      scheduleEndOn: format(addDays(new Date(), 29), 'MMM d, yyyy'),
      scheduleEndOnPicker: new Date(addDays(new Date(), 29)),
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
      advanceRoundsCount: 0
    });
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
    return this.scheduleByDates.map((scheduleByDate) => ({
      ...scheduleByDate,
      date: new Date(format(scheduleByDate.date, 'yyyy-MM-dd 00:00:00'))
    }));
  }

  openRoundPlanScheduleSuccessModal(dailodMode: 'create' | 'update') {
    const dialogRef = this.dialog.open(RoundPlanScheduleSuccessModalComponent, {
      disableClose: true,
      width: '354px',
      height: '275px',
      backdropClass: 'round-plan-schedule-success-modal',
      data: {
        roundPlanName: this.roundPlanDetail.name,
        mode: dailodMode
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data.redirectToRounds) {
          this.scheduleConfigState.emit('out');
          this.viewRounds.emit(this.roundPlanDetail.id);
        } else {
          this.scheduleConfigState.emit('out');
        }
      }
    });
  }

  selectedAssigneeHandler(event: UserDetails) {
    const { email: value, firstName, lastName } = event;
    this.roundPlanSchedulerConfigForm
      .get('assignmentDetails')
      .patchValue({ value, displayValue: `${firstName} ${lastName}` });
    this.roundPlanSchedulerConfigForm.markAsDirty();
    this.menuTrigger.closeMenu();
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
}
