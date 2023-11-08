/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { LoadEvent, SearchEvent, TableEvent } from './../../../interfaces';
import { isEmpty, omitBy } from 'lodash-es';
@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  fetchPositions$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  attachmentsMapping$ = new BehaviorSubject<any>({});
  pdfMapping$ = new BehaviorSubject<any>({});
  redirectToFormsList$ = new BehaviorSubject<boolean>(false);
  embeddedFormId;

  constructor(private appService: AppService) {}

  /**
   * Get event source (SSE)
   */

  getPositionsList$(
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    filterData: any = {}
  ) {
    const { plant: plantsID } = filterData;
    const rawParams = {
      searchTerm: queryParams?.searchKey,
      limit: queryParams?.limit.toString(),
      ...(filterData ? { plantsID: filterData?.plant } : {})
    };
    const params = new URLSearchParams({
      next: queryParams.next,
      plantsID,
      ...omitBy(rawParams, isEmpty)
    });
    return this.appService
      ._getResp(
        environment.userRoleManagementApiUrl,
        'positions?' + params.toString(),
        {
          displayToast: true,
          failureResponse: {}
        }
      )
      .pipe(map((res) => this.formatPositionResponse(res)));
  }

  createPositions$ = (payload: any): Observable<any> => {
    return this.appService._postData(
      environment.userRoleManagementApiUrl,
      'position/create',
      payload
    );
  };

  updatePositions$ = (id: string, payload: any): Observable<any> => {
    return this.appService.patchData(
      environment.userRoleManagementApiUrl,
      `position/${id}/update`,
      payload
    );
  };

  private formatPositionResponse(resp: any) {
    const rows =
      resp?.items?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
    return {
      count: resp?.count,
      rows,
      next: resp?.next
    };
  }
}
