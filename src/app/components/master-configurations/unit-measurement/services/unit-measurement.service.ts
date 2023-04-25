/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { groupBy } from 'lodash-es';

import { ErrorInfo, UnitOfMeasurementList } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/shared/toast';

@Injectable({
  providedIn: 'root'
})
export class UnitMeasurementService {
  measurementList = ['Length', 'Area', 'Volume', 'Temperature', 'Mass'];
  constructor(
    private readonly _appService: AppService,
    private toastService: ToastService
  ) {}

  getUnitOfMeasurementList$(queryParams: {
    next?: string;
    limit: any;
    searchKey: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams?.fetchType) ||
      (['infiniteScroll'].includes(queryParams?.fetchType) &&
        queryParams?.next !== null)
    ) {
      const params: URLSearchParams = new URLSearchParams();
      params.set('searchTerm', queryParams?.searchKey);
      params.set('limit', queryParams?.limit);
      params.set('next', queryParams?.next);
      params.set('fetchType', queryParams?.fetchType);
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'unit-of-measurement?' + params.toString()
        )
        .pipe(map((data) => this.formatUnitOfMeasurementResponse(data)));
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  }

  getUnitTypes() {
    return this._appService
      ._getResp(environment.masterConfigApiUrl, 'unit-of-measurement/types')
      .pipe(map((data) => data));
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

  onChangeUomStatus$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/${unitMeasurementId}/status`,
        { ...values },
        info
      )
      .pipe(map((response) => (response === null ? values : response)));
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

  updateUnitType$(
    unitTypeId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/types/${unitTypeId}`,
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

  deleteUnitType$(id: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService
      ._removeData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/types/${id}`,
        info
      )
      .pipe(map((response) => (response === null ? id : response)));
  }

  deleteUnitOfMeasurement$(id: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService
      ._removeData(
        environment.masterConfigApiUrl,
        `unit-of-measurement/types/${id}`,
        info
      )
      .pipe(map((response) => (response === null ? id : response)));
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

  private formatUnitOfMeasurementResponse(resp: UnitOfMeasurementList) {
    const groupedData: any = groupBy(resp?.items, 'unitList.name');
    const rows = resp?.items
      ?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      )
      ?.map((item: any) => ({
        ...item,
        noOfUnits: groupedData[item?.unitList?.name]?.length ?? 0,
        unitType: item?.unitList?.name,
        isDefaultText: item?.isDefault ? 'Default' : ''
      }));
    const count = rows?.length || 0;
    const next = resp?.next;
    return {
      count,
      rows,
      next
    };
  }
}
