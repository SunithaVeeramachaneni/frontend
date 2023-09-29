/* eslint-disable no-underscore-dangle */
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { format } from 'date-fns';
import { Store } from '@ngrx/store';

import { State } from 'src/app/forms/state';
import { RaceDynamicFormService } from '../services/rdf.service';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import {
  RoundPlan,
  RoundPlanScheduleConfiguration,
  RoundPlanDetail,
  RoundDetail
} from 'src/app/interfaces';
import { scheduleConfigs } from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.constants';
import {
  formConfigurationStatus,
  dateFormat2,
  dateTimeFormat2,
  dateTimeFormat4
} from 'src/app/app.constants';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';

interface FrequencyDetail {
  info: string;
  more: string;
  data: any;
  repeatEvery: string;
  scheduleType: string;
}

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() formDetailAction: EventEmitter<any> = new EventEmitter();
  @Output() scheduleRoundPlan: EventEmitter<RoundPlanDetail> =
    new EventEmitter();
  @Output() showAffectedForms: EventEmitter<any> = new EventEmitter();
  @Input() selectedForm: any | RoundPlan | RoundPlanDetail | RoundDetail = null;
  @Input() moduleName = 'RDF';
  @Input() showPDFDownload = false;
  @Input() formStatus = formConfigurationStatus.draft;
  @Input() formDetailType = 'Authored';
  @Input() shiftObj: any;
  @Input() isTemplate: boolean;
  @Input() set scheduleConfiguration(
    scheduleConfiguration: any | RoundPlanScheduleConfiguration
  ) {
    this._scheduleConfiguration = scheduleConfiguration;
  }

  get scheduleConfiguration() {
    return this._scheduleConfiguration;
  }
  plantMapSubscription: Subscription;
  currentPage = 1;
  selectedFormDetail$: Observable<any> = null;
  operatorRoundsModule = 'OPERATOR_ROUNDS';
  defaultFormName = null;
  pagesCount = 0;
  questionsCount = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(19).fill(0).map((_, i) => i);
  placeHolder = '_ _';
  frequencyDetail = {} as FrequencyDetail;
  pdfButtonDisabled = false;
  plantTimezoneMap: any;
  slotArr = [];
  templatesUsed = [];
  readonly dateTimeFormat = dateTimeFormat2;
  readonly dateFormat = dateFormat2;
  readonly formConfigurationStatus = formConfigurationStatus;
  readonly scheduleConfigs = scheduleConfigs;
  private _scheduleConfiguration: RoundPlanScheduleConfiguration;

  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly operatorRoundsService: OperatorRoundsService,
    private readonly store: Store<State>,
    private readonly plantService: PlantService
  ) {}

  ngOnChanges(_: SimpleChanges) {
    if (this.scheduleConfiguration && this.scheduleConfiguration.shiftDetails) {
      this.slotArr = Object.entries(this._scheduleConfiguration.shiftDetails);
    } else {
      this.slotArr = [];
    }

    if (this.selectedForm) {
      if (this.selectedForm?.status === 'skipped') {
        this.selectedForm.isViewPdf = false;
      }
      this.toggleLoader(true);
      let formDetail$: any;
      if (this.moduleName === 'RDF') {
        if (!this.selectedForm.formId)
          this.selectedForm.formId = this.selectedForm.id;
        formDetail$ =
          this.raceDynamicFormService.getAuthoredFormDetailByFormId$(
            this.selectedForm.formId,
            this.formStatus
          );
      } else if (this.moduleName === 'OPERATOR_ROUNDS') {
        if (!this.selectedForm.roundPlanId)
          this.selectedForm.roundPlanId = this.selectedForm.id;
        formDetail$ = this.operatorRoundsService.getAuthoredFormDetailByFormId$(
          this.selectedForm.roundPlanId,
          this.formStatus
        );
      }
      if (this.isTemplate) {
        formDetail$ = of(this.selectedForm.authoredFormTemplateDetails[0]);
      }
      this.selectedFormDetail$ = formDetail$.pipe(
        map((formDetail: any) => {
          this.pagesCount = 0;
          this.questionsCount = 0;
          let data: any;
          if (formDetail) {
            const pages =
              formDetail && formDetail.pages
                ? JSON.parse(formDetail?.pages)
                : [];
            data = { ...formDetail, pages };
            data.pages?.forEach((page, pIdx) => {
              if (pIdx === 0) {
                this.defaultFormName = `${page.name} ${page.position}`;
                this.store.dispatch(
                  BuilderConfigurationActions.initPages({
                    pages: [page],
                    subFormId: null
                  })
                );
              }
              this.questionsCount += page?.questions?.length || 0;
              this.pagesCount += 1;
            });
            this.templatesUsed = [];
            if (formDetail?.templatesUsed?.length) {
              this.templatesUsed = formDetail.templatesUsed;
            }
          }
          return data;
        })
      );
      this.selectedFormDetail$?.subscribe(
        () => {
          this.toggleLoader(false);
        },
        () => {
          this.toggleLoader(false);
        }
      );

      this.setFrequencyInfo();
      this.pdfButtonDisabled = true;
      if (this.selectedForm?.isViewPdf === true) {
        this.pdfButtonDisabled = false;
      }
    }
  }

  ngOnInit(): void {
    this.plantService.getPlantTimeZoneMapping();
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe((data) => {
        this.plantTimezoneMap = data;
      });
  }

  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':');

    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';

    if (hours12 === 0) {
      hours12 = 12;
    } else if (hours12 > 12) {
      hours12 -= 12;
    }

    const time12 = `${hours12}:${minutes} ${suffix}`;
    return time12;
  }

  cancelForm() {
    this.slideInOut.emit('in');
    this.selectedFormDetail$ = null;
  }

  openMenu(page): void {
    this.selectedFormDetail$.subscribe((form) => {
      const foundPage = form?.pages?.find(
        (p) => p?.position === page?.position
      );
      this.defaultFormName = `${foundPage?.name} ${foundPage?.position}`;
      this.store.dispatch(
        BuilderConfigurationActions.initPages({
          pages: [foundPage],
          subFormId: null
        })
      );
    });
  }

  formatDate(date, plantId, dateFormat) {
    if (!date) return '';
    if (this.plantTimezoneMap[plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[plantId],
        dateFormat
      );
    }

    return format(new Date(date), dateFormat);
  }

  formatDateTime(date, plantId) {
    if (!date) return '';
    if (this.plantTimezoneMap[plantId]?.timeZoneIdentifier) {
      return localToTimezoneDate(
        date,
        this.plantTimezoneMap[plantId],
        dateTimeFormat4
      );
    }
    return format(new Date(date), dateTimeFormat4);
  }

  onNavigateToDetailPage() {
    this.formDetailAction.emit({ type: 'edit' });
  }
  viewPDF() {
    this.formDetailAction.emit({ type: 'VIEW_PDF' });
  }
  downloadPDF() {
    this.formDetailAction.emit({ type: 'DOWNLOAD_PDF' });
  }

  ngOnDestroy(): void {
    this.plantMapSubscription.unsubscribe();
    this.selectedForm = null;
    this.toggleLoader(false);
  }

  scheduleRoundPlanEvent() {
    this.scheduleRoundPlan.emit(this.selectedForm as RoundPlanDetail);
  }

  setFrequencyInfo() {
    if (this.scheduleConfiguration) {
      const {
        repeatEvery,
        daysOfWeek,
        monthlyDaysOfWeek,
        scheduleType,
        scheduleByDates
      } = this.scheduleConfiguration;
      if (scheduleType === 'byFrequency') {
      }
      this.frequencyDetail =
        scheduleType === 'byFrequency'
          ? repeatEvery === 'week'
            ? { ...this.getWeeklyDays(daysOfWeek), repeatEvery, scheduleType }
            : repeatEvery === 'month'
            ? {
                ...this.getMontlyWeeks(monthlyDaysOfWeek),
                repeatEvery,
                scheduleType
              }
            : ({} as FrequencyDetail)
          : {
              ...this.getScheduleByDates(scheduleByDates),
              repeatEvery,
              scheduleType
            };
    }
  }

  getWeeklyDays(daysOfWeek: number[] = []) {
    return {
      info: scheduleConfigs.daysOfWeek[daysOfWeek[0]],
      more: daysOfWeek.length > 1 ? `+ ${daysOfWeek.length - 1} more` : '',
      data: daysOfWeek
    };
  }

  getMontlyWeeks(monthlyDaysOfWeek: any = []) {
    const filteredWeeks = monthlyDaysOfWeek
      .map((week: number[], index: number) => {
        if (week.length) {
          return { index, week };
        }
      })
      .filter((data) => data);

    return {
      info: scheduleConfigs.weeksOfMonth[filteredWeeks[0].index],
      more:
        filteredWeeks.length > 1 ? `+ ${filteredWeeks.length - 1} more` : '',
      data: filteredWeeks
    };
  }

  getScheduleByDates(scheduleByDates) {
    return {
      info: scheduleByDates[0].date,
      more:
        scheduleByDates.length > 1
          ? `+ ${scheduleByDates.length - 1} more`
          : '',
      data: scheduleByDates
    };
  }

  isDayOfWeekSelected(daysOfWeek, dayIndex) {
    return daysOfWeek.includes(dayIndex);
  }

  showAffectedTemplateForms() {
    if (this.selectedForm?.formsUsageCount)
      this.showAffectedForms.emit(this.selectedForm);
  }

  private toggleLoader(action: boolean): void {
    this.isLoading$.next(action);
  }
}
