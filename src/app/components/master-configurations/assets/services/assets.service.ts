import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import {
  APIService,
  CreateAssetsInput,
  DeleteAssetsInput,
  ListAssetsQuery
} from 'src/app/API.service';
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

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  assetsCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchAssets$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  assetsCreatedUpdated$ = this.assetsCreatedUpdatedSubject.asObservable();

  constructor(
    private _appService: AppService,
    private readonly awsApiService: APIService
  ) {}

  setFormCreatedUpdated(data: any) {
    this.assetsCreatedUpdatedSubject.next(data);
  }

  fetchAllAssets$ = () => from(this.awsApiService.ListAssets({}, 2000000, ''));

  getAssetsList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      return from(
        this.awsApiService.ListAssets(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            })
          },
          !isSearch && queryParams.limit,
          !isSearch && queryParams.nextToken
        )
      ).pipe(map((res) => this.formatGraphQAssetsResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  getAssetsById$(id: string) {
    return from(this.awsApiService.GetAssets(id));
  }

  createAssets$(
    formAssetsQuery: Pick<
      CreateAssetsInput,
      | 'name'
      | 'image'
      | 'description'
      | 'model'
      | 'assetsId'
      | 'parentId'
      | 'parentType'
    >
  ) {
    return from(
      this.awsApiService.CreateAssets({
        name: formAssetsQuery.name,
        image: formAssetsQuery.image,
        description: formAssetsQuery.description,
        model: formAssetsQuery.model,
        assetsId: formAssetsQuery.assetsId,
        parentType: formAssetsQuery.parentType,
        parentId: formAssetsQuery.parentId,
        searchTerm: formAssetsQuery.name.toLowerCase()
      })
    );
  }

  updateAssets$(assetDetails) {
    return from(
      this.awsApiService.UpdateAssets({
        ...assetDetails.data,
        _version: assetDetails.version
      })
    );
  }

  deleteAssets$(values: DeleteAssetsInput) {
    return from(this.awsApiService.DeleteAssets({ ...values }));
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

  private formatGraphQAssetsResponse(resp: ListAssetsQuery) {
    let rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            image: p?.image,
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
    const nextToken = resp?.nextToken;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      nextToken
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
