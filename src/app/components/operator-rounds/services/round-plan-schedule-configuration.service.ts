/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorInfo,
  RoundPlanScheduleConfigurationObj
} from 'src/app/interfaces';
import { RoundPlanScheduleConfiguration } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoundPlanScheduleConfigurationService {
  userGroups = new BehaviorSubject<any>({});
  constructor(private appService: AppService) {}

  listAllUserGroups$ = (info = {} as ErrorInfo) =>
    this.appService._getResp(
      environment.userRoleManagementApiUrl,
      `user-groups/all`,
      info
    );

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

  fetchRoundPlanScheduleConfigurations$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfigurationObj> =>
    this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        `round-plan-schedule-configuration/`,
        info
      )
      .pipe(
        map((configs: RoundPlanScheduleConfiguration[]) =>
          configs.reduce((acc: RoundPlanScheduleConfigurationObj, val) => {
            acc[val.roundPlanId] = val;
            return acc;
          }, {})
        )
      );

  fetchRoundPlanScheduleConfigurationByRoundPlanId$ = (
    roundPlanId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RoundPlanScheduleConfiguration> =>
    this.appService._getRespById(
      environment.operatorRoundsApiUrl,
      `round-plan-schedule-configuration/`,
      roundPlanId,
      info
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
