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
import { RoundPlanScheduleConfigurationService } from '../services/round-plan-schedule-configuration.service';

@Component({
  selector: 'app-round-plan-schedule-configuration',
  templateUrl: './round-plan-schedule-configuration.component.html',
  styleUrls: ['./round-plan-schedule-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanScheduleConfigurationComponent implements OnInit {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Input() set roundPlanDetail(roundPlanDetail: any) {
    this._roundPlanDetail = roundPlanDetail;
    if (roundPlanDetail) {
      this.getRoundPlanSchedulerConfiguration(roundPlanDetail.id);
    }
  }
  get roundPlanDetail(): any {
    return this._roundPlanDetail;
  }
  @Output() scheduleConfigState: EventEmitter<string> =
    new EventEmitter<string>();
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
  private _roundPlanDetail: any;

  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private toastService: ToastService
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
      scheduledTill: null
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
            break;
          case 'month':
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 364), 'MMM d, yyyy'));
            this.roundPlanSchedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(12);
            this.roundPlanSchedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 364), 'd MMMM yyyy'));
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
      const scheduleByDates =
        roundPlanSchedulerConfig.scheduleType === 'byDate'
          ? this.prepareScheduleByDates()
          : [];

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
                this.roundPlanSchedulerConfigForm
                  .get('id')
                  .patchValue(scheduleConfig.id);
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
    this.rpscService
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
    this.scheduleByDates = [
      {
        date: new Date(format(new Date(), 'yyyy-MM-dd 00:00:00')),
        scheduled: false
      }
    ];
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
      scheduledTill: null
    });
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
