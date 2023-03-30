/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo, FormScheduleConfigurationObj } from 'src/app/interfaces';
import { FormScheduleConfiguration } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormScheduleConfigurationService {
  constructor(private appService: AppService) {}

  createFormScheduleConfiguration$ = (
    formScheduleConfiguration: FormScheduleConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FormScheduleConfiguration> =>
    this.appService._postData(
      environment.rdfApiUrl,
      'form-schedule-configuration',
      formScheduleConfiguration,
      info
    );

  updateFormScheduleConfiguration$ = (
    scheduleId: string,
    formsScheduleConfiguration: FormScheduleConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FormScheduleConfiguration> =>
    this.appService
      .patchData(
        environment.rdfApiUrl,
        `form-schedule-configuration/${scheduleId}`,
        formsScheduleConfiguration,
        info
      )
      .pipe(map((resp) => (resp === null ? formsScheduleConfiguration : resp)));

  fetchFormScheduleConfigurations$ = (
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FormScheduleConfigurationObj> =>
    this.appService
      ._getResp(environment.rdfApiUrl, `form-schedule-configuration/`, info)
      .pipe(
        map((configs: FormScheduleConfiguration[]) =>
          configs.reduce((acc: FormScheduleConfigurationObj, val) => {
            acc[val?.formId] = val;
            return acc;
          }, {})
        )
      );

  fetchFormScheduleConfigurationByFormId$ = (
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FormScheduleConfiguration> =>
    this.appService._getRespById(
      environment.rdfApiUrl,
      `form-schedule-configuration/`,
      formId,
      info
    );

  deleteFormsScheduleConfigurationByFormId$ = (
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FormScheduleConfiguration> =>
    this.appService._removeData(
      environment.rdfApiUrl,
      `form-schedule-configuration/${formId}`,
      info
    );
}
