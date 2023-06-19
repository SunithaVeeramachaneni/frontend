/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadEvent, SearchEvent, TableEvent } from '../../../../interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  CreateShifts,
  ShiftsResponse
} from 'src/app/interfaces/master-data-management/shifts';
import { graphQLDefaultMaxLimit } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  fetchShifts$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  constructor(private _appService: AppService) {}

  fetchAllShifts$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', graphQLDefaultMaxLimit.toString());
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'shifts?' + params.toString()
    );
  };

  getShiftsList$(
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    filter?: { [x: string]: string }
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
    ) {
      const params: URLSearchParams = new URLSearchParams();
      params.set('limit', `${queryParams.limit}`);
      params.set('next', queryParams.next);
      params.set('searchTerm', queryParams?.searchKey.toLocaleLowerCase());

      const activeFilter = {
        isActive: {
          eq: filter?.isActive
        }
      };
      params.set('filter', JSON.stringify(activeFilter));

      return this._appService
        ._getResp(environment.masterConfigApiUrl, 'shifts?' + params.toString())
        .pipe(
          map((res) => {
            res.startAndEndTime = `${res.startTime} - ${res.endTime}`;
            res.items = res.items.map((r) => {
              r.startAndEndTime = `${r.startTime} - ${r.endTime}`;
              return r;
            });
            return this.formatShiftResponse(res);
          })
        );
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  }

  createShift$(
    formShiftQuery: Pick<
      CreateShifts,
      'name' | 'startTime' | 'endTime' | 'isActive'
    >
  ) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      `shifts`,
      {
        data: {
          ...formShiftQuery,
          searchTerm: `${formShiftQuery.name.toLowerCase()} ${formShiftQuery.startTime?.toLowerCase()} ${
            formShiftQuery.endTime?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  updateShift$(shiftData) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `shifts/${shiftData.id}`,
      {
        data: {
          ...shiftData,
          searchTerm: `${shiftData.name.toLowerCase()} ${shiftData.startTime?.toLowerCase()} ${
            shiftData.endTime?.toLowerCase() || ''
          }
          `
        }
      }
    );
  }

  private formatShiftResponse(resp: ShiftsResponse) {
    let rows =
      resp.items.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
    const count = resp?.items.length || 0;
    const next = resp?.next;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      next
    };
  }
}
