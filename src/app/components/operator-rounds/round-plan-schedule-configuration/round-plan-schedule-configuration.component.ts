/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatCalendar,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
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
import { ScheduleByDate } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';

@Component({
  selector: 'app-round-plan-schedule-configuration',
  templateUrl: './round-plan-schedule-configuration.component.html',
  styleUrls: ['./round-plan-schedule-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanScheduleConfigurationComponent implements OnInit {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Input() set roundPlanDetails(roundPlanDetails: any) {
    this._roundPlanDetails = roundPlanDetails;
    if (roundPlanDetails) {
      this.getRoundPlanSchedulerConfiguration(roundPlanDetails.id);
    }
  }
  get roundPlanDetails(): any {
    return this._roundPlanDetails;
  }
  scheduleTypes: string[] = ['byFrequency', 'byDate'];
  scheduleEndTypes: string[] = ['never', 'on', 'after'];
  repeatTypes: string[] = ['day', 'week', 'month'];
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeksOfMonth: string[] = [
    '1st Week',
    '2nd Week',
    '3rd Week',
    '4th Week',
    '5th Week'
  ];
  roundPlanSchedulerConfigForm: FormGroup;
  currentDate: Date;
  scheduleByDates: ScheduleByDate[] = [
    {
      date: new Date(format(new Date(), 'yyyy-MM-dd 00:00:00')),
      scheduled: false
    }
  ];
  disableSchedule = false;
  private _roundPlanDetails: any;

  constructor(
    private operatorRoundService: OperatorRoundsService,
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.roundPlanSchedulerConfigForm = this.fb.group({
      id: '',
      roundPlanId: this.roundPlanDetails.id,
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
      scheduledTill: null
    });

    this.form.scheduleEndType.valueChanges.subscribe((scheduleEndType) => {
      switch (scheduleEndType) {
        case 'on':
          this.form.scheduleEndOn.enable();
          this.form.scheduleEndOccurrences.disable();
          this.form.scheduleEndOccurrencesText.disable();
          break;
        case 'after':
          this.form.scheduleEndOn.disable();
          this.form.scheduleEndOccurrences.enable();
          this.form.scheduleEndOccurrencesText.enable();
          break;
        default:
          this.form.scheduleEndOn.disable();
          this.form.scheduleEndOccurrences.disable();
          this.form.scheduleEndOccurrencesText.disable();
      }
    });

    this.form.repeatEvery.valueChanges.subscribe((repeatEvery) => {
      switch (repeatEvery) {
        case 'day':
          this.form.scheduleEndOn.patchValue(
            format(addDays(new Date(), 29), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(30);
          this.form.endDate.patchValue(
            format(addDays(new Date(), 29), 'd MMMM yyyy')
          );
          break;
        case 'week':
          this.form.scheduleEndOn.patchValue(
            format(addDays(new Date(), 90), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(daysToWeeks(91));
          this.form.daysOfWeek.patchValue([getDay(new Date())]);
          this.form.endDate.patchValue(
            format(addDays(new Date(), 90), 'd MMMM yyyy')
          );
          break;
        case 'month':
          this.form.scheduleEndOn.patchValue(
            format(addDays(new Date(), 364), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(12);
          this.form.endDate.patchValue(
            format(addDays(new Date(), 364), 'd MMMM yyyy')
          );
          break;
      }
    });

    this.form.daysOfWeek.valueChanges.subscribe((daysOfWeek) => {
      if (daysOfWeek.length === 0) {
        this.form.daysOfWeek.patchValue([getDay(new Date())]);
      }
    });

    this.form.monthlyDaysOfWeek.valueChanges.subscribe((monthlyDaysOfWeek) => {
      const monthlyDaysOfWeekCount = monthlyDaysOfWeek.reduce(
        (acc: number, curr: number[]) => {
          acc += curr.length;
          return acc;
        },
        0
      );
      if (monthlyDaysOfWeekCount === 0) {
        for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
          weekRepeatDays.patchValue([getDay(new Date())]);
        }
      }
    });

    this.form.scheduleEndOccurrences.valueChanges.subscribe((occurrences) => {
      if (occurrences > 0) {
        let days = 0;
        switch (this.form.repeatEvery.value) {
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
        this.form.endDate.patchValue(
          format(
            addDays(new Date(), days * this.form.repeatDuration.value - 1),
            'd MMMM yyyy'
          )
        );
      }
    });

    this.form.repeatDuration.valueChanges.subscribe(() => {
      this.form.scheduleEndOccurrences.patchValue(
        this.form.scheduleEndOccurrences.value
      );
    });

    this.currentDate = new Date();

    for (const weekRepeatDays of this.monthlyDaysOfWeek.controls) {
      weekRepeatDays.patchValue([getDay(new Date())]);
    }

    this.roundPlanSchedulerConfigForm.markAsDirty();
  }

  get form() {
    return this.roundPlanSchedulerConfigForm.controls;
  }

  initMonthWiseWeeklyDaysOfWeek(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  get monthlyDaysOfWeek(): FormArray {
    return this.form.monthlyDaysOfWeek as FormArray;
  }

  cancel() {
    this.operatorRoundService.openRoundPlanSchedulerConfiguration(false);
  }

  scheduleConfiguration() {
    if (
      this.roundPlanSchedulerConfigForm.valid &&
      this.roundPlanSchedulerConfigForm.valid
    ) {
      this.disableSchedule = true;
      const roundPlanSchedulerConfig =
        this.roundPlanSchedulerConfigForm.getRawValue();
      const { id, startDate, endDate, scheduleEndOn } =
        roundPlanSchedulerConfig;
      const time = format(new Date(), 'HH:00:00');
      const { startDatePicker, endDatePicker, scheduleEndOnPicker, ...rest } =
        roundPlanSchedulerConfig;
      const scheduleByDates = this.prepareScheduleByDates();

      if (id) {
        this.rpscService
          .updateRoundPlanScheduleConfiguration$(id, {
            ...rest,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
            scheduleByDates
          })
          .pipe(
            tap((scheduleConfig) => {
              this.disableSchedule = false;
              if (scheduleConfig && Object.keys(scheduleConfig).length) {
                this.toastService.show({
                  text: 'Round plan schedule updated sucessfully',
                  type: 'success'
                });
                this.roundPlanSchedulerConfigForm.markAsPristine();
                this.cdrf.markForCheck();
              }
            })
          )
          .subscribe();
      } else {
        this.rpscService
          .createRoundPlanScheduleConfiguration$({
            ...rest,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
            scheduleByDates
          })
          .pipe(
            tap((scheduleConfig) => {
              this.disableSchedule = false;
              if (scheduleConfig && Object.keys(scheduleConfig).length) {
                this.toastService.show({
                  text: 'Round plan schedule created sucessfully',
                  type: 'success'
                });
                this.form.id.patchValue(scheduleConfig.id);
                this.roundPlanSchedulerConfigForm.markAsPristine();
                this.cdrf.markForCheck();
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

  getRoundPlanSchedulerConfiguration(roundPlandId: string) {
    return this.rpscService
      .fetchRoundPlanScheduleConfigurationByRoundPlanId$(roundPlandId)
      .pipe(
        tap(([config]) => {
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
              this.form.startDate.disable();
            }
            this.roundPlanSchedulerConfigForm.markAsPristine();
          }
        })
      )
      .subscribe();
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
}
