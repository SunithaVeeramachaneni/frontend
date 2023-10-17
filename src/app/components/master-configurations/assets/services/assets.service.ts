/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../../interfaces';
import { formatDistance } from 'date-fns';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  AssetsResponse,
  CreateAssets,
  DeleteAssets
} from 'src/app/interfaces/master-data-management/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  assetsCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchAssets$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  assetsCreatedUpdated$ = this.assetsCreatedUpdatedSubject.asObservable();

  constructor(private _appService: AppService) {}

  fetchAllAssets$ = (plantId = null, info: ErrorInfo = {} as ErrorInfo) => {
    let queryParamaters = {};
    if (plantId) {
      queryParamaters = { ...queryParamaters, plantId };
    }
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'asset/listAll',
      { displayToast: true, failureResponse: {} },
      queryParamaters
    );
  };

  getAssetsList$(
    queryParams: {
      skip?: number;
      limit: number;
      searchTerm: string;
      fetchType: string;
    },
    filterData: any = {}
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.skip !== null)
    ) {
      const { plant: plantId } = filterData;
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'asset/list',
          { displayToast: true, failureResponse: {} },
          {
            ...queryParams,
            plantId
          }
        )
        .pipe(map((res) => this.formatGraphQAssetsResponse(res)));
    } else {
      return of({
        rows: [],
        skip: null
      });
    }
  }

  createAssets$(
    formAssetsQuery: Pick<
      CreateAssets,
      | 'name'
      | 'image'
      | 'description'
      | 'model'
      | 'assetsId'
      | 'parentId'
      | 'parentType'
      | 'plantsID'
    >
  ) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'asset/create',
      {
        data: {
          ...formAssetsQuery,
          searchTerm: `${formAssetsQuery.name.toLowerCase()} ${
            formAssetsQuery.description?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  updateAssets$(assetData) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `asset/${assetData.id}/update`,
      {
        data: {
          ...assetData,
          searchTerm: `${assetData.name.toLowerCase()} ${
            assetData.description?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  deleteAssets$(values: DeleteAssets) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `asset/${JSON.stringify(values)}/delete`
    );
  }

  downloadSampleAssetTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'assets/download/sample-template',
      info,
      true,
      {}
    );
  }

  downloadFailure(
    body: { rows: any },
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'assets/download/failure',
      info,
      false,
      body
    );
  }

  private formatGraphQAssetsResponse(resp: AssetsResponse) {
    let rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            image:
              p?.image?.length > 0
                ? p?.image
                : 'assets/master-configurations/asset-icon.svg',
            style: {
              width: '40px',
              height: '40px',
              marginRight: '10px'
            },
            condition: true
          },
          archivedAt: p.createdAt
            ? formatDistance(new Date(p.createdAt), new Date(), {
                addSuffix: true
              })
            : ''
        })) || [];
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count: resp?.count,
      rows,
      skip: resp?.skip
    };
  }

  uploadExcel(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'assets/upload',
      form,
      info
    );
  }
}
