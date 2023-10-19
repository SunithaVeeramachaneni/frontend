/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { Shift } from 'src/app/interfaces/master-data-management/shifts';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  constructor(private _appService: AppService) {}

  fetchAllShifts$ = () => {
    const apiUrl = environment.masterConfigApiUrl;
    const urlString = 'shifts';
    const info: ErrorInfo = { displayToast: true, failureResponse: {} };
    return this._appService._getResp(apiUrl, urlString, info, {
      isActive: true
    });
  };

  getShiftsList$(queryParams: {
    next?: string;
    limit: any;
    searchTerm?: string;
    isActive?: boolean;
  }) {
    if (queryParams.next !== null) {
      const apiUrl = environment.masterConfigApiUrl;
      const urlString = 'shifts';
      const info: ErrorInfo = { displayToast: true, failureResponse: {} };

      const queryParameters = {
        limit: `${queryParams.limit}`,
        next: queryParams?.next,
        ...(queryParams.searchTerm && {
          searchTerm: queryParams?.searchTerm.toLocaleLowerCase()
        }),
        ...(queryParams.isActive && {
          isActive: queryParams?.isActive
        })
      };
      return this._appService
        ._getResp(apiUrl, urlString, info, queryParameters)
        .pipe(
          tap((res) => {
            res.items =
              res?.items?.map((item) => ({
                ...item,
                startAndEndTime: `${item?.startTime} - ${item?.endTime}`
              })) ?? [];
            return res;
          })
        );
    } else {
      return of({
        items: [],
        next: null
      });
    }
  }

  createShift$(
    formShiftQuery: Pick<Shift, 'name' | 'startTime' | 'endTime' | 'isActive'>
  ) {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    return this._appService._postData(
      environment.masterConfigApiUrl,
      `shifts`,
      {
        ...formShiftQuery,
        searchTerm: `${formShiftQuery.name.toLowerCase()} ${formShiftQuery.startTime?.toLowerCase()} ${
          formShiftQuery.endTime?.toLowerCase() || ''
        }`
      },
      info
    );
  }

  updateShift$(shiftData, shiftId: string) {
    const { id: _, ...payload } = shiftData;
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `shifts/${shiftId}`,
        {
          ...payload,
          searchTerm: `${payload.name.toLowerCase()} ${payload.startTime?.toLowerCase()} ${
            payload.endTime?.toLowerCase() || ''
          }
        `
        },
        info
      )
      .pipe(map((response) => (response === null ? shiftData : response)));
  }
}
