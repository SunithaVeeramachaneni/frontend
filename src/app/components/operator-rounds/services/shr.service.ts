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
