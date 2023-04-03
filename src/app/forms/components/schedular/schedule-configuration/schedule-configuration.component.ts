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
  SimpleChanges
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
import { RoundPlanScheduleConfigurationService } from 'src/app/components/operator-rounds/services/round-plan-schedule-configuration.service';
import {
  AssigneeDetails,
  FormScheduleConfiguration,
  RoundPlanScheduleConfiguration,
  RoundPlanScheduleConfigurationObj,
  ScheduleByDate,
  UserDetails,
  ValidationError
} from 'src/app/interfaces';
import { ScheduleSuccessModalComponent } from '../schedule-success-modal/schedule-success-modal.component';
import { FormScheduleConfigurationService } from './../../../../components/race-dynamic-form/services/form-schedule-configuration.service';
import { scheduleConfigs } from './schedule-configuration.constants';

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
export class ScheduleConfigurationComponent implements OnInit, OnChanges {
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
  private _roundPlanDetail: any;
  private _formDetail: any;
  constructor(
    private fb: FormBuilder,
    private rpscService: RoundPlanScheduleConfigurationService,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private readonly formScheduleConfigurationService: FormScheduleConfigurationService
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
  }

  ngOnInit(): void {
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
        type: ['user'],
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
      .valueChanges.subscribe((scheduleEndType) => {
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
      .valueChanges.subscribe((scheduleType) => {
        switch (scheduleType) {
          case 'byFrequency':
            this.schedulerConfigForm.get('repeatEvery').patchValue('day');
            this.scheduleByDates = [];
            break;
          case 'byDate':
            if (!this.scheduleByDates?.length) {
              this.scheduleByDates = [
                {
                  date: new Date(format(new Date(), 'yyyy-MM-dd 00:00:00')),
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
      .valueChanges.subscribe((repeatEvery) => {
        switch (repeatEvery) {
          case 'day':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 29), 'MMM d, yyyy'));
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(30);
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 29), 'd MMMM yyyy'));
            this.updateAdvanceRoundsCountValidation(30);
            break;
          case 'week':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 90), 'MMM d, yyyy'));
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(daysToWeeks(91));
            this.schedulerConfigForm
              .get('daysOfWeek')
              .patchValue([getDay(new Date())]);
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 90), 'd MMMM yyyy'));
            this.updateAdvanceRoundsCountValidation(30);
            break;
          case 'month':
            this.schedulerConfigForm
              .get('scheduleEndOn')
              .patchValue(format(addDays(new Date(), 364), 'MMM d, yyyy'));
            this.schedulerConfigForm
              .get('scheduleEndOccurrences')
              .patchValue(12);
            this.setMonthlyDaysOfWeek();
            this.schedulerConfigForm
              .get('endDate')
              .patchValue(format(addDays(new Date(), 364), 'd MMMM yyyy'));
            this.updateAdvanceRoundsCountValidation(30);
            break;
        }
      });

    this.schedulerConfigForm
      .get('daysOfWeek')
      .valueChanges.subscribe((daysOfWeek) => {
        if (daysOfWeek?.length === 0) {
          this.schedulerConfigForm
            .get('daysOfWeek')
            .patchValue([getDay(new Date())]);
        }
      });

    this.schedulerConfigForm
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

    this.schedulerConfigForm
      .get('scheduleEndOccurrences')
      .valueChanges.subscribe((occurrences) => {
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
              format(
                addDays(
                  new Date(),
                  days * this.schedulerConfigForm.get('repeatDuration').value -
                    1
                ),
                'd MMMM yyyy'
              )
            );
        }
      });

    this.schedulerConfigForm
      .get('repeatDuration')
      .valueChanges.subscribe(() => {
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
      weekRepeatDays.patchValue([getDay(new Date())]);
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
      const time = format(new Date(), 'HH:00:00');
      const { startDatePicker, endDatePicker, scheduleEndOnPicker, ...rest } =
        schedularConfigFormValue;
      const scheduleByDates =
        schedularConfigFormValue.scheduleType === 'byDate'
          ? this.prepareScheduleByDates()
          : [];

      if (id) {
        const payload = {
          ...rest,
          startDate: new Date(`${startDate} ${time}`).toISOString(),
          endDate: new Date(`${endDate} ${time}`).toISOString(),
          scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
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
          startDate: new Date(`${startDate} ${time}`).toISOString(),
          endDate: new Date(`${endDate} ${time}`).toISOString(),
          scheduleEndOn: new Date(`${scheduleEndOn} ${time}`).toISOString(),
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
              startDate: format(new Date(startDate), 'd MMMM yyyy'),
              endDate: format(new Date(endDate), 'd MMMM yyyy'),
              scheduleEndOn: format(new Date(scheduleEndOn), 'MMM d, yyyy'),
              startDatePicker: new Date(startDate),
              endDatePicker: new Date(endDate),
              scheduleEndOnPicker: new Date(scheduleEndOn)
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(scheduleByDate.date)
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

  setDefaultSchedulerConfig(id: string) {
    this.schedulerConfigForm.patchValue({
      id: '',
      roundPlanId: !this.isFormModule ? id : null,
      formId: this.isFormModule ? id : null,
      scheduleType: 'byFrequency',
      repeatDuration: 1,
      repeatEvery: 'day',
      daysOfWeek: [getDay(new Date())],
      monthlyDaysOfWeek: this.setMonthlyDaysOfWeek(),
      scheduleEndType: 'on',
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
              startDate: format(new Date(startDate), 'd MMMM yyyy'),
              endDate: format(new Date(endDate), 'd MMMM yyyy'),
              scheduleEndOn: format(new Date(scheduleEndOn), 'MMM d, yyyy'),
              startDatePicker: new Date(startDate),
              endDatePicker: new Date(endDate),
              scheduleEndOnPicker: new Date(scheduleEndOn)
            };
            this.scheduleByDates = scheduleByDates?.map((scheduleByDate) => ({
              ...scheduleByDate,
              date: new Date(scheduleByDate.date)
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
    return this.scheduleByDates.map((scheduleByDate) => ({
      ...scheduleByDate,
      date: new Date(format(scheduleByDate.date, 'yyyy-MM-dd 00:00:00'))
    }));
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

  selectedAssigneeHandler(event: UserDetails) {
    const { email: value, firstName, lastName } = event;
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
}
