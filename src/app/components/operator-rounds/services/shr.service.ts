/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../interfaces';
import { isEmpty, omitBy } from 'lodash-es';
import { DatePipe } from '@angular/common';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { localToTimezoneDate } from 'src/app/shared/utils/timezoneDate';
import { SHRColumnConfiguration } from 'src/app/interfaces/shr-column-configuration';
import { SHR_CONFIGURATION_DATA } from '../operator-rounds.constants';

@Injectable({
  providedIn: 'root'
})
export class ShrService {
  fetchShr$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  attachmentsMapping$ = new BehaviorSubject<any>({});
  pdfMapping$ = new BehaviorSubject<any>({});
  redirectToFormsList$ = new BehaviorSubject<boolean>(false);
  embeddedFormId;
  plantTimezoneMap: any = {};
  plantMapSubscription: Subscription;
  placeHolder = '_ _';

  constructor(
    private appService: AppService,
    private datePipe: DatePipe,
    private plantService: PlantService
  ) {}

  getShiftHandOverList$(queryParams: {
    next?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
    createdOn: string;
    plantId: string;
    unitId: string;
  }) {
    const rawParams = {
      searchTerm: queryParams?.searchKey,
      limit: queryParams?.limit.toString(),
      createdOn: queryParams?.createdOn,
      plantId: queryParams?.plantId,
      unitId: queryParams?.unitId
    };
    const params = new URLSearchParams({
      searchTerm: rawParams?.searchTerm,
      next: '',
      limit: rawParams?.limit,
      createdOn: rawParams?.createdOn,
      plantId: rawParams?.plantId,
      unitId: rawParams?.unitId
    });
    return this.appService
      ._getResp(
        environment.operatorRoundsApiUrl,
        'shr/list?' + params.toString(),
        {
          displayToast: true,
          failureResponse: {}
        }
      )
      .pipe(map((res) => this.formatSHRResponse(res)));
  }

  getCurrentSHRDetailsId$(
    id,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `shr/current/${id}`,
      info
    );
  }

  getSHRDetailsId$(id, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `shr/${id}`,
      info
    );
  }

  updateNotes$(id, body, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/update/notes/${id}`,
      body,
      info
    );
  }

  uploadAttachments$(file, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      `shr/upload-attachments`,
      file,
      info
    );
  }
  getAttachmentsById$(id, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `shr/upload-attachments/${id}`,
      info
    );
  }

  submitSHRReport(
    id,
    body,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/${id}`,
      body,
      info
    );
  }

  updateSHRDetails(
    id,
    body,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/details/${id}`,
      body,
      info
    );
  }

  updateSupervisorLogs$(
    id,
    body,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/update/supervisor-logs/${id}`,
      body,
      info
    );
  }

  deleteSHRNotes$(
    id,
    body,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/delete/notes/${id}`,
      body,
      info
    );
  }

  deleteSupervisorLogs$(
    id,
    body,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/delete/supervisor-logs/${id}`,
      body,
      info
    );
  }
  updateSHRList$(id, body, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService.patchData(
      environment.operatorRoundsApiUrl,
      `shr/${id}`,
      body,
      info
    );
  }

  getSHRFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this.appService._getLocal(
      '',
      '/assets/json/shift-handover-round-filter.json',
      info
    );
  }

  getSHRConfiugration$() {
    return this.appService
      ._getResp(environment.operatorRoundsApiUrl, 'shr-current/config')
      .pipe(map((res) => this.formatSHRConfiguration(res)));
  }

  updateSHRConfiguration$ = (
    shrDetails: SHRColumnConfiguration[]
  ): Observable<any> => {
    const jsonRes = {};
    for (const data of shrDetails) {
      if (data.content) {
        for (const value of data.content) {
          jsonRes[value.columnId] = value.selected;
        }
      } else {
        jsonRes[data.columnId] = data.selected;
      }
    }

    return this.appService._postData(
      environment.operatorRoundsApiUrl,
      'shr/update-config',
      jsonRes
    );
  };

  private formatSHRResponse(resp: any) {
    this.plantMapSubscription =
      this.plantService.plantTimeZoneMapping$.subscribe(
        (data) => (this.plantTimezoneMap = data)
      );
    let rows =
      resp?.items?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
    rows = rows.map((r: any) => {
      try {
        if (r.shift !== null) {
          if (r.shiftStartDatetime) {
            r.shiftStartDatetime = localToTimezoneDate(
              r.shiftStartDatetime,
              this.plantTimezoneMap[r?.plantId],
              'MMM dd, yyyy'
            );
          } else {
            r.shiftStartDatetime = 'N/A'; // or any other default value
          }
          r.shiftNames = `${r?.shiftStartDatetime} / ${r.shift.name} ${r?.shift?.startTime} - ${r?.shift?.endTime}`;
        } else {
          r.shiftNames = this.placeHolder;
        }
        if (r.shiftSupervisor !== null) {
          r.shiftSupervisor =
            r?.shiftSupervisor?.firstName + ' ' + r?.shiftSupervisor?.lastName;
        } else {
          r.shiftSupervisor = this.placeHolder;
        }
        if (r.incomingSupervisor !== null) {
          r.incomingSupervisor =
            r?.incomingSupervisor?.firstName +
            ' ' +
            r?.incomingSupervisor?.lastName;
        } else {
          r.incomingSupervisor = this.placeHolder;
        }
        if (r.submittedOn) {
          r.submittedOn = this.datePipe.transform(
            r.submittedOn,
            'hh:mm a, MMM dd'
          );
        } else {
          r.submittedOn = this.placeHolder;
        }
        if (r.acceptedOn) {
          r.acceptedOn = this.datePipe.transform(
            r.acceptedOn,
            'hh:mm a, MMM dd'
          );
        } else {
          r.acceptedOn = this.placeHolder;
        }
      } catch (err) {
        r.shiftSupervisor = [];
        r.incomingSupervisor = [];
        r.shiftNames = [];
      }
      return r;
    });

    return {
      count: resp?.count,
      rows,
      next: resp?.next
    };
  }

  private formatSHRConfiguration(res): SHRColumnConfiguration[] {
    const data: SHRColumnConfiguration[] = SHR_CONFIGURATION_DATA.map(
      (column) => ({ ...column })
    );
    for (const column of data) {
      if (res[column.columnId] !== undefined) {
        column.selected = res[column.columnId];
      }
      if (column.content && Array.isArray(column.content)) {
        let selected = true;
        for (const subColumn of column.content) {
          if (res[subColumn.columnId] !== undefined) {
            subColumn.selected = res[subColumn.columnId];
            if (!subColumn.selected) selected = false;
          }
          column.selected = selected;
        }
      }
    }
    return data;
  }
}
