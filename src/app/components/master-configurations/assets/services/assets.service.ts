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
  DeleteAssets,
  GetAssets
} from 'src/app/interfaces/master-data-management/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  assetsCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchAssets$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  assetsCreatedUpdated$ = this.assetsCreatedUpdatedSubject.asObservable();

  private MAX_FETCH_LIMIT: string = '1000000';

  constructor(private _appService: AppService) {}

  setFormCreatedUpdated(data: any) {
    this.assetsCreatedUpdatedSubject.next(data);
  }

  fetchAllAssets$ = (info: ErrorInfo = {} as ErrorInfo) => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', this.MAX_FETCH_LIMIT);
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'asset/list?' + params.toString(),
      { displayToast: true, failureResponse: {} }
    );
  };

  getAssetCount$(): Observable<number> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', this.MAX_FETCH_LIMIT);
    return this._appService
      ._getResp(
        environment.masterConfigApiUrl,
        'asset/count?' + params.toString()
      )
      .pipe(map((res) => res.count || 0));
  }

  getAssetsList$(
    queryParams: {
      next?: string;
      limit: number;
      searchKey: string;
      fetchType: string;
    },
    filterData: any = null
  ) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
    ) {
      const params: URLSearchParams = new URLSearchParams();

      params.set('limit', `${queryParams.limit}`);
      params.set('next', queryParams.next);

      if (queryParams.searchKey) {
        const filter: GetAssets = {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        };
        params.set('filter', JSON.stringify(filter));
      }

      if (filterData.plant) {
        params.set('limit', this.MAX_FETCH_LIMIT);
        let filter = JSON.parse(params.get('plantsID'));
        filter = { ...filter, plantsID: { eq: filterData.plant } };
        params.set('filter', JSON.stringify(filter));
      }

      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'asset/list?' + params.toString()
        )
        .pipe(map((res) => this.formatGraphQAssetsResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
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

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this._appService._getLocal(
      '',
      'assets/json/master-configuration-assets-filter.json',
      info
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
              p?.image.length > 0
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
    const count = resp?.items.length || 0;
    const next = resp?.next;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      next
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
