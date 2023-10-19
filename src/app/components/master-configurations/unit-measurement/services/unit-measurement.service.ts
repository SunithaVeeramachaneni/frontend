/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { groupBy } from 'lodash-es';

import { ErrorInfo } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/shared/toast';

@Injectable({
  providedIn: 'root'
})
export class UnitMeasurementService {
  measurementList = ['Length', 'Area', 'Volume', 'Temperature', 'Mass'];
  unitTypes$ = new BehaviorSubject<
    {
      id: string;
      name: string;
      isDeleted: boolean;
      _version: number;
      createdAt: string;
      updatedAt: string;
    }[]
  >([]);
  constructor(
    private readonly _appService: AppService,
    private toastService: ToastService
  ) {}

  getUnitOfMeasurementList$(
    queryParams: {
      next?: string;
      limit?: any;
      searchTerm?: string;
    },
    filter?: { [x: string]: string },
    info: ErrorInfo = {} as ErrorInfo
  ) {
    if (queryParams?.next !== null) {
      const { displayToast = true, failureResponse = {} } = info;
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'unit-of-measurement',
          {
            displayToast,
            failureResponse
          },
          {
            ...queryParams,
            ...filter
          }
        )
        .pipe(map((data) => this.formatUnitOfMeasurementResponse(data)));
    } else {
      return of({
        filters: {},
        count: 0,
        rows: [],
        next: null
      });
    }
  }

  getUnitTypes() {
    return this._appService
      ._getResp(environment.masterConfigApiUrl, 'unit-of-measurement/types')
      .pipe(
        map((data) => {
          this.unitTypes$.next(data ?? []);
          return data;
        })
      );
  }

  uploadExcel(form: FormData, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'unit-of-measurement/upload',
      form,
      info
    );
  }

  downloadSampleUomTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'unit-of-measurement/download/sample-template',
      info,
      true,
      {}
    );
  }

  setAsDefault$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/${unitMeasurementId}/default`,
        { ...values },
        info
      )
      .pipe(map((response) => (response === null ? values : response)));
  }

  createUnitType$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'unit-of-measurement/types',
      { ...values },
      info,
      {}
    );
  }

  updateUnitType$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/types`,
        { ...values },
        info
      )
      .pipe(map((response) => (response === null ? values : response)));
  }

  editUnitOfMeasurement$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/${unitMeasurementId}`,
        { ...values },
        info
      )
      .pipe(map((response) => (response === null ? values : response)));
  }

  deleteUnitType$(unitType: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService
      ._removeData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/types/${unitType}`,
        info
      )
      .pipe(map((response) => (response === null ? unitType : response)));
  }

  deleteUnitOfMeasurement$(id: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService
      ._removeData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/${id}`,
        info
      )
      .pipe(map((response) => (response === null ? id : response)));
  }

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<
    {
      label: string;
      items: string[];
      column: string;
      type: string;
      value: string;
    }[]
  > {
    return this._appService._getLocal('', '/assets/json/uom-filter.json', info);
  }

  handleError(error: any) {
    const message = error.errors?.length
      ? error.errors[0].message.split(':')[0]
      : error.message;
    this.toastService.show({
      type: 'warning',
      text: message
    });
  }

  formatUOMByOrder(rows) {
    let order = 0;
    const formattedRows = [];
    const groupedData = groupBy(rows, 'unitType');
    Object.values(groupedData).forEach((value) => {
      if (value?.length > 0) {
        const sortedRows = value
          .sort(
            (a, b) =>
              new Date(b?.createdAt).getTime() -
              new Date(a?.createdAt).getTime()
          )
          .map((row) => ({
            ...row,
            order: order++,
            noOfUnits: groupedData[row?.unitType]?.length ?? 0,
            unitType: row?.unitType,
            isDefaultText: row?.isDefault ? 'Default' : ''
          }));
        formattedRows.push(...sortedRows);
      }
    });
    return formattedRows.sort((a, b) => a.order - b.order);
  }

  private formatUnitOfMeasurementResponse(resp) {
    const rows = this.formatUOMByOrder(resp?.items);
    const count = rows?.length || 0;
    const next = resp?.next;
    const filters = resp?.filters;
    return {
      count,
      rows,
      next,
      filters
    };
  }
}
