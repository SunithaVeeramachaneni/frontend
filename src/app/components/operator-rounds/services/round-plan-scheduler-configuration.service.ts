/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorInfo } from 'src/app/interfaces';
import { RoundPlanSchedulerConfiguration } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanSchedulerConfigurationService {
  constructor(private appService: AppService) {}

  createRoundPlanSchedulerConfiguration$ = (
    roundPlansSchedulerConfiguration: RoundPlanSchedulerConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanSchedulerConfiguration> =>
    this.appService._postData(
      environment.operatorRoundsApiUrl,
      'round-plan-scheduler-configuration',
      roundPlansSchedulerConfiguration,
      info
    );

  updateRoundPlanSchedulerConfiguration$ = (
    schedulerId: string,
    roundPlansSchedulerConfiguration: RoundPlanSchedulerConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanSchedulerConfiguration> =>
    this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `round-plan-scheduler-configuration/${schedulerId}`,
      roundPlansSchedulerConfiguration,
      info
    );

  fetchRoundPlanSchedulerConfigurationByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanSchedulerConfiguration[]> =>
    this.appService._getRespById(
      environment.operatorRoundsApiUrl,
      `round-plan-scheduler-configuration/`,
      roundPlanId,
      { displayToast: true, failureResponse: [] }
    );

  deleteRoundPlanSchedulerConfigurationByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanSchedulerConfiguration> =>
    this.appService._removeData(
      environment.operatorRoundsApiUrl,
      `round-plan-scheduler-configuration/${roundPlanId}`,
      info
    );
}
