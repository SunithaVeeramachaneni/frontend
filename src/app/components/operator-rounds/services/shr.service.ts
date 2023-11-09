/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription,Observable } from 'rxjs';
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
import {
  localToTimezoneDate
} from 'src/app/shared/utils/timezoneDate';
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

  constructor(
    private appService: AppService, 
    private datePipe: DatePipe,
    private plantService: PlantService
  ) {}

  getShiftHandOverList$(
    queryParams: {
      // next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
      // isArchived:string;
      // incomingSupervisorId: string;
    },
    filterData: any = null
  ) {
    const rawParams = {
      searchTerm: queryParams?.searchKey,
      limit: queryParams?.limit.toString(),
      // isArchived: queryParams?.isArchived,
      // incomingSupervisorId: queryParams?.incomingSupervisorId,
      ...(filterData ? { plantId: filterData?.plant } : {})
    };
    const params = new URLSearchParams({
      // next: queryParams.next,
      // isArchived: queryParams.isArchived,
      ...omitBy(rawParams, isEmpty)
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

  getSHRDetailsId$(id, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this.appService._getResp(
      environment.operatorRoundsApiUrl,
      `shr/current/${id}`,
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
          
          // r.shift = JSON.parse(r.shift);
          if(r.shift !== null){
            
            if (r.shiftStartDatetime) {              
              r.shiftStartDatetime = localToTimezoneDate(
                r.shiftStartDatetime,
                this.plantTimezoneMap[r?.plantId],
                'MMM dd, yyyy'
              )
            } else {
              r.shiftStartDatetime = 'N/A'; // or any other default value
            }
            r.shiftNames = `${r?.shiftStartDatetime} / ${r.shift.name} ${r?.shift?.startTime} - ${r?.shift?.endTime}`;
          }else{
            r.shiftNames = ' ';
          }
          if(r.shiftSupervisor !== null){
            r.shiftSupervisor = r?.shiftSupervisor?.firstName + ' ' + r?.shiftSupervisor?.lastName; 
          }else{
            r.shiftSupervisor = ' ';
          }
          if(r.incomingSupervisor !== null){
            r.incomingSupervisor = r?.incomingSupervisor?.firstName + ' ' + r?.incomingSupervisor?.lastName; 
          }else{
            r.incomingSupervisor = ' ';
          }
          if(r.submittedOn){
            r.submittedOn = this.datePipe.transform(r.submittedOn, 'hh:mm a, MMM dd');
          }else{
            r.submittedOn = ' ';
          }
          if(r.acceptedOn){
            r.acceptedOn = this.datePipe.transform(r.acceptedOn, 'hh:mm a, MMM dd');
          }else{
            r.acceptedOn = ' ';
          }
        } catch (err) {
          console.log("err", err);
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

  getSHRConfiugration$() {
    return this.appService
      ._getResp(environment.operatorRoundsApiUrl, 'shr/config')
      .pipe(map((res) => this.formatSHRConfiguration(res)));
  }

  private formatSHRConfiguration(res): SHRColumnConfiguration[] {
    let data: SHRColumnConfiguration[] = SHR_CONFIGURATION_DATA.map(
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
}
