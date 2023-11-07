import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { LoadEvent, SearchEvent, TableEvent } from './../../../interfaces';
import { isEmpty, omitBy } from 'lodash-es';
import { DatePipe } from '@angular/common';

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

  constructor(private appService: AppService,private datePipe: DatePipe) {}

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

  private formatSHRResponse(resp: any) {
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
              r.shiftStartDatetime = this.datePipe.transform(r.shiftStartDatetime, 'MMM dd, yyyy');
            } else {
              r.shiftStartDatetime = 'N/A'; // or any other default value
            }
            r.shiftNames = `${r?.shiftStartDatetime} / ${r.shift.name} ${r?.shift?.startTime} - ${r?.shift?.endTime}`;
          }
          if(r.shiftSupervisor !== null){
            r.shiftSupervisor = r?.shiftSupervisor?.firstName + ' ' + r?.shiftSupervisor?.lastName; 
          }else{
            r.shiftSupervisor = '--';
          }
          if(r.incomingSupervisor !== null){
            r.incomingSupervisor = r?.incomingSupervisor?.firstName + ' ' + r?.incomingSupervisor?.lastName; 
          }else{
            r.incomingSupervisor = '--';
          }
          if(r.submittedOn){
            r.submittedOn = this.datePipe.transform(r.submittedOn, 'hh:mm a, MMM dd');
          }else{
            r.submittedOn = '--';
          }
          if(r.acceptedOn){
            r.acceptedOn = this.datePipe.transform(r.acceptedOn, 'hh:mm a, MMM dd');
          }else{
            r.acceptedOn = '--';
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
}
