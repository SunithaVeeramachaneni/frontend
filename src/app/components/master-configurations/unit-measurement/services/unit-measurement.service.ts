/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { groupBy } from 'lodash-es';

import { ErrorInfo, ListUnitMeasumentsQuery } from 'src/app/interfaces';
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
    nextToken?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams?.fetchType) ||
      (['infiniteScroll'].includes(queryParams?.fetchType) &&
        queryParams?.nextToken !== null)
    ) {
      const isSearch = queryParams?.fetchType === 'search';
      const params = new URLSearchParams();
      if (queryParams?.searchKey) {
        params.set('searchTerm', queryParams.searchKey);
      }
      if (!isSearch) {
        params.set('limit', queryParams.limit.toString());
        params.set('nextToken', queryParams.nextToken);
      }
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'unit-of-measurement?' + params.toString()
        )
        .pipe(map((data) => this.formatGraphQAssetsResponse(data)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  getUnitLists() {
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'unit-of-measurement/types'
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

  onChangeUomStatus$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/${unitMeasurementId}/status`,
      { ...values },
      info
    );
  }

  setAsDefault$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/${unitMeasurementId}/default`,
      { ...values },
      info
    );
  }

  createUOMWithType$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'unit-of-measurement/types',
      { ...values },
      info,
      {}
    );
  }

  updateUOMWithType$(
    unitTypeId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/types/${unitTypeId}`,
      { ...values },
      info
    );
  }

  editUnitOfMeasurement$(
    unitMeasurementId: string,
    values,
    info: ErrorInfo = {} as ErrorInfo
  ) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/${unitMeasurementId}`,
      { ...values },
      info
    );
  }

  deleteUOMWithType$(id: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/types/${id}`,
      info
    );
  }

  deleteUnitOfMeasurement$(id: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `unit-of-measurement/types/${id}`,
      info
    );
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

  private formatGraphQAssetsResponse(resp: ListUnitMeasumentsQuery) {
    const groupedData: any = groupBy(resp?.items, 'unitList.name');
    const rows = resp?.items
      ?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      ?.map((item: any) => ({
        ...item,
        noOfUnits: groupedData[item?.unitList?.name]?.length ?? 0,
        unitType: item?.unitList?.name,
        isDefaultText: item?.isDefault ? 'Default' : ''
      }));
    const count = rows?.length || 0;
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }
}
