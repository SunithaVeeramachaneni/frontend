/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo } from 'src/app/interfaces';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanScheduleConfigurationService {
  constructor(private appService: AppService) {}

  createRoundPlanScheduleConfiguration$ = (
    roundPlansScheduleConfiguration: RoundPlanScheduleConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfiguration> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      'round-plan-schedule-configuration',
      roundPlansScheduleConfiguration,
      info
    );

  updateRoundPlanScheduleConfiguration$ = (
    scheduleId: string,
    roundPlansScheduleConfiguration: RoundPlanScheduleConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfiguration> =>
    this.appService
      .patchData(
        environment.operatorRoundsApiUrl,
        `round-plan-schedule-configuration/${scheduleId}`,
        roundPlansScheduleConfiguration,
        info
      )
      .pipe(
        map((resp) => (resp === null ? roundPlansScheduleConfiguration : resp))
      );

  fetchRoundPlanScheduleConfigurationByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfiguration[]> =>
    this.appService._getRespById(
      environment.operatorRoundsApiUrl,
      `round-plan-schedule-configuration/`,
      roundPlanId,
      { displayToast: true, failureResponse: [] }
    );

  deleteRoundPlanScheduleConfigurationByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfiguration> =>
    this.appService._removeData(
      environment.operatorRoundsApiUrl,
      `round-plan-schedule-configuration/${roundPlanId}`,
      info
    );
}
