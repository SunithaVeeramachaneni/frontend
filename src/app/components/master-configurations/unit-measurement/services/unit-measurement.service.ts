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
      return this._appService
        ._postData(environment.masterConfigApiUrl, 'uom/unit-measurement', {
          filter: {
            isDeleted: {
              eq: false
            },
            ...(queryParams?.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            })
          },
          limit: isSearch ? null : queryParams?.limit,
          nextToken: isSearch ? null : queryParams?.nextToken
          // limit: queryParams?.limit,
          // nextToken: queryParams?.nextToken,
          // fetchType: queryParams?.fetchType
        })
        .pipe(map(({ data }) => this.formatGraphQAssetsResponse(data)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  getUnitLists() {
    return this._appService
      ._postData(environment.masterConfigApiUrl, 'uom/unit-lists', {
        filter: {
          isDeleted: {
            eq: false
          }
        }
      })
      .pipe(map(({ data }) => data));
  }

  uploadExcel(form: FormData, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'uom/upload',
      form,
      info
    );
  }

  downloadSampleUomTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'uom/download/sample-template',
      info,
      true,
      {}
    );
  }

  onChangeUomStatus$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'uom/unit-measurement/status',
      {
        ...values
      },
      info,
      {}
    );
  }

  setAsDefault$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'uom/unit-measurement/default',
      {
        ...values
      },
      info,
      {}
    );
  }

  createUOMWithType$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'uom/create',
      { ...values },
      info,
      {}
    );
  }

  updateUOMWithType$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._updateData(
      environment.masterConfigApiUrl,
      'uom/update',
      { ...values },
      info
    );
  }

  editUnitOfMeasurement$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._updateData(
      environment.masterConfigApiUrl,
      'uom/unit-measurement/edit',
      { ...values },
      info
    );
  }

  deleteUOMWithType$(id, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `uom/delete/${id}`,
      info
    );
  }

  deleteUnitOfMeasurement$(id, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `uom/unit-measurement/delete/${id}`,
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
