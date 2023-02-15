/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays, daysToWeeks, format, getDay } from 'date-fns';
import { tap } from 'rxjs/operators';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { RoundPlanSchedulerConfigurationService } from '../services/round-plan-scheduler-configuration.service';

@Component({
  selector: 'app-round-plan-scheduler-configuration',
  templateUrl: './round-plan-scheduler-configuration.component.html',
  styleUrls: ['./round-plan-scheduler-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanSchedulerConfigurationComponent implements OnInit {
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
  scheduleEndTypeValue: string[] = ['', 'date', 'occurrences'];
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
  selected: Date | null;
  private _roundPlanDetails: any;

  constructor(
    private operatorRoundService: OperatorRoundsService,
    private fb: FormBuilder,
    private rpscService: RoundPlanSchedulerConfigurationService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.roundPlanSchedulerConfigForm = this.fb.group({
      id: '',
      roundPlanId: this.roundPlanDetails.id,
      scheduleType: 'byFrequency',
      repeatDuration: [1, [Validators.required, Validators.min(1)]],
      repeatEvery: 'day',
      repeatDays: [[getDay(new Date())]],
      weekWiseRepeatDays: this.fb.array(
        this.initWeekWiseRepeatDays(this.weeksOfMonth.length)
      ),
      scheduleEndType: 'never',
      scheduleEndOn: [
        {
          value: format(addDays(new Date(), 30), 'MMM d, yyyy'),
          disabled: true
        }
      ],
      scheduleEndOccurrences: [
        { value: 30, disabled: true },
        [Validators.required, Validators.min(1)]
      ],
      scheduleEndOccurrencesText: [{ value: 'occurrences', disabled: true }],
      startDate: format(new Date(), 'd MMMM yyyy'),
      endDate: [
        {
          value: format(addDays(new Date(), 30), 'd MMMM yyyy'),
          disabled: true
        }
      ],
      scheduleByDate: format(new Date(), 'yyyy-MM-dd')
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
            format(addDays(new Date(), 30), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(30);
          this.form.endDate.patchValue(
            format(addDays(new Date(), 30), 'd MMMM yyyy')
          );
          break;
        case 'week':
          this.form.scheduleEndOn.patchValue(
            format(addDays(new Date(), 91), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(daysToWeeks(91));
          this.form.repeatDays.patchValue([getDay(new Date())]);
          this.form.endDate.patchValue(
            format(addDays(new Date(), 91), 'd MMMM yyyy')
          );
          break;
        case 'month':
          this.form.scheduleEndOn.patchValue(
            format(addDays(new Date(), 365), 'MMM d, yyyy')
          );
          this.form.scheduleEndOccurrences.patchValue(daysToWeeks(365));
          this.form.endDate.patchValue(
            format(addDays(new Date(), 365), 'd MMMM yyyy')
          );
          break;
      }
    });

    this.form.repeatDays.valueChanges.subscribe((repeatDays) => {
      if (repeatDays.length === 0) {
        this.form.repeatDays.patchValue([getDay(new Date())]);
      }
    });

    this.form.weekWiseRepeatDays.valueChanges.subscribe(
      (weekWiseRepeatDays) => {
        const weekWiseRepeatDaysCount = weekWiseRepeatDays.reduce(
          (acc: number, curr: number[]) => {
            acc += curr.length;
            return acc;
          },
          0
        );
        if (weekWiseRepeatDaysCount === 0) {
          for (const weekRepeatDays of this.weekWiseRepeatDays.controls) {
            weekRepeatDays.patchValue([getDay(new Date())]);
          }
        }
      }
    );

    this.form.scheduleEndOccurrences.valueChanges.subscribe((occurrences) => {
      if (occurrences > 0) {
        switch (this.form.repeatEvery.value) {
          case 'week':
            if (occurrences > 13) {
              occurrences = 91 + (occurrences - 13) * 7;
            } else if (occurrences < 13) {
              occurrences = 91 - (13 - occurrences) * 7;
            } else {
              occurrences = 91;
            }
            break;
          case 'month':
            if (occurrences > 52) {
              occurrences = 365 + (occurrences - 52) * 7;
            } else if (occurrences < 52) {
              occurrences = 365 - (52 - occurrences) * 7;
            } else {
              occurrences = 365;
            }
            break;
        }
        this.form.endDate.patchValue(
          format(addDays(new Date(), occurrences), 'd MMMM yyyy')
        );
      }
    });

    this.currentDate = new Date();
    this.selected = new Date();

    for (const weekRepeatDays of this.weekWiseRepeatDays.controls) {
      weekRepeatDays.patchValue([getDay(new Date())]);
    }

    this.roundPlanSchedulerConfigForm.markAsDirty();
  }

  get form() {
    return this.roundPlanSchedulerConfigForm.controls;
  }

  initWeekWiseRepeatDays(weeksCount: number) {
    return new Array(weeksCount).fill(0).map((v, i) => this.fb.control([[]]));
  }

  get weekWiseRepeatDays(): FormArray {
    return this.form.weekWiseRepeatDays as FormArray;
  }

  cancel() {
    this.operatorRoundService.openRoundPlanSchedulerConfiguration(false);
  }

  scheduleRounds() {
    if (
      this.roundPlanSchedulerConfigForm.valid &&
      this.roundPlanSchedulerConfigForm.valid
    ) {
      const roundPlanSchedulerConfig =
        this.roundPlanSchedulerConfigForm.getRawValue();
      const { id, startDate, endDate, scheduleEndOn, scheduleByDate } =
        roundPlanSchedulerConfig;
      const time = format(new Date(), 'HH:mm:ss');
      if (id) {
        this.rpscService
          .updateRoundPlanSchedulerConfiguration$(id, {
            ...roundPlanSchedulerConfig,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
            scheduleByDate: new Date(`${scheduleByDate} ${time}`).toISOString()
          })
          .pipe(
            tap(() => {
              this.roundPlanSchedulerConfigForm.markAsPristine();
              this.cdrf.markForCheck();
            })
          )
          .subscribe();
      } else {
        this.rpscService
          .createRoundPlanSchedulerConfiguration$({
            ...roundPlanSchedulerConfig,
            startDate: new Date(`${startDate} ${time}`).toISOString(),
            endDate: new Date(`${endDate} ${time}`).toISOString(),
            scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
            scheduleByDate: new Date(`${scheduleByDate} ${time}`).toISOString()
          })
          .pipe(
            tap((config) => {
              this.form.id.patchValue(config.id);
              this.roundPlanSchedulerConfigForm.markAsPristine();
              this.cdrf.markForCheck();
            })
          )
          .subscribe();
      }
    }
  }

  updateDate(event: any, formControlDateField: string) {
    this.roundPlanSchedulerConfigForm.patchValue({
      [formControlDateField]:
        formControlDateField !== 'scheduleEndOn'
          ? format(event.value, 'd MMMM yyyy')
          : format(event.value, 'MMM d, yyyy')
    });
    this.roundPlanSchedulerConfigForm.markAsDirty();
  }

  updateScheduleByDate(date: Date) {
    this.form.scheduleByDate.patchValue(format(date, 'yyyy-MM-dd'));
  }

  getRoundPlanSchedulerConfiguration(roundPlandId: string) {
    return this.rpscService
      .fetchRoundPlanSchedulerConfigurationByRoundPlanId$(roundPlandId)
      .pipe(
        tap(([config]) => {
          if (config && Object.keys(config).length) {
            const { startDate, endDate, scheduleEndOn, scheduleByDate } =
              config;
            config = {
              ...config,
              startDate: format(new Date(startDate), 'd MMMM yyyy'),
              endDate: format(new Date(endDate), 'd MMMM yyyy'),
              scheduleEndOn: format(new Date(scheduleEndOn), 'MMM d, yyyy'),
              scheduleByDate: format(new Date(scheduleByDate), 'yyyy-MM-dd')
            };
            this.selected = new Date(scheduleByDate);
            this.roundPlanSchedulerConfigForm.patchValue(config);
            this.roundPlanSchedulerConfigForm.markAsPristine();
          }
        })
      )
      .subscribe();
  }
}
