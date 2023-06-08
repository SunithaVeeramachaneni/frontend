/* eslint-disable no-underscore-dangle */
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
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
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import {
  RoundPlan,
  RoundPlanScheduleConfiguration,
  RoundPlanDetail,
  RoundDetail
} from 'src/app/interfaces';
import { formConfigurationStatus } from 'src/app/app.constants';
import { scheduleConfigs } from 'src/app/forms/components/schedular/schedule-configuration/schedule-configuration.constants';

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
  @Input() selectedForm: any | RoundPlan | RoundPlanDetail | RoundDetail = null;
  @Input() moduleName = 'RDF';
  @Input() showPDFDownload = false;
  @Input() formStatus = formConfigurationStatus.draft;
  @Input() formDetailType = 'Authored';
  @Input() set scheduleConfiguration(
    scheduleConfiguration: any | RoundPlanScheduleConfiguration
  ) {
    if (scheduleConfiguration) {
      this._scheduleConfiguration = scheduleConfiguration;
    }
  }

  get scheduleConfiguration() {
    return this._scheduleConfiguration;
  }

  currentPage = 1;
  selectedFormDetail$: Observable<any> = null;
  defaultFormName = null;
  pagesCount = 0;
  questionsCount = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(19).fill(0).map((_, i) => i);
  placeHolder = '_ _';
  frequencyDetail = {} as FrequencyDetail;
  pdfButtonDisabled = false;
  readonly formConfigurationStatus = formConfigurationStatus;
  readonly scheduleConfigs = scheduleConfigs;
  private _scheduleConfiguration: RoundPlanScheduleConfiguration;

  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly operatorRoundsService: OperatorRoundsService,
    private readonly store: Store<State>
  ) {}

  ngOnChanges(_: SimpleChanges) {
    if (this.selectedForm) {
      this.toggleLoader(true);

      let formDetail$: any =
        this.raceDynamicFormService.getAuthoredFormDetailByFormId$(
          this.selectedForm.id,
          this.formStatus
        );
      if (this.moduleName === 'OPERATOR_ROUNDS') {
        formDetail$ = this.operatorRoundsService.getAuthoredFormDetailByFormId$(
          this.selectedForm.id,
          this.formStatus
        );
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
                  FormConfigurationActions.initPages({
                    pages: [page]
                  })
                );
              }
              this.questionsCount += page?.questions?.length || 0;
              this.pagesCount += 1;
            });
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
      this.pdfButtonDisabled = false;
      if (this.selectedForm?.status) {
        if (
          this.selectedForm?.status.toLowerCase() === 'open' ||
          this.selectedForm?.status.toLowerCase() === 'to-do'
        ) {
          this.pdfButtonDisabled = true;
        }
      }
    }
  }

  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
    this.selectedFormDetail$ = null;
    this.store.dispatch(FormConfigurationActions.resetPages());
  }

  openMenu(page): void {
    this.selectedFormDetail$.subscribe((form) => {
      const foundPage = form?.pages?.find(
        (p) => p?.position === page?.position
      );
      this.defaultFormName = `${foundPage?.name} ${foundPage?.position}`;
      this.store.dispatch(
        FormConfigurationActions.initPages({
          pages: [foundPage]
        })
      );
    });
  }

  formateDate(date: string) {
    if (!date) {
      return '';
    }
    return format(new Date(date), 'M/d/yy, h:mm a');
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

  private toggleLoader(action: boolean): void {
    this.isLoading$.next(action);
  }
}
