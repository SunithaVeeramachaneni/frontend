/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
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

  constructor(private appService: AppService) {}

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

  private formatSHRResponse(resp: any) {
    let rows =
      resp?.items?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
    rows = rows.map((r: any) => {
      try {
        // r.shift = JSON.parse(r.shift);
        if (r.shift !== null) {
          r.shiftNames = r.shift.name + r?.shift?.startTime + r?.shift?.endTime;
        }
        // if(r?.shiftStatus == 'not-started'){
        //   r.style.backgroundColor = 'red'; // Set the background color to red
        // }
        if (r.shiftSupervisor !== null) {
          r.shiftSupervisor =
            r?.shiftSupervisor?.firstName + ' ' + r?.shiftSupervisor?.lastName;
        } else {
          r.shiftSupervisor = '--';
        }
        if (r.incomingSupervisor !== null) {
          r.incomingSupervisor =
            r?.incomingSupervisor?.firstName +
            ' ' +
            r?.incomingSupervisor?.lastName;
        } else {
          r.incomingSupervisor = '--';
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
}
