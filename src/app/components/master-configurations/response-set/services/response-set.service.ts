import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { formatDistance } from 'date-fns';

import { environment } from 'src/environments/environment';

import { AppService } from 'src/app/shared/services/app.services';

import {
  LoadEvent,
  SearchEvent,
  TableEvent,
  CreateResponseSet,
  UpdateResponseSet,
  DeleteResponseSet,
  UserDetails,
  ErrorInfo
} from '../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResponseSetService {
  fetchResponses$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  addOrEditResponseSet$: BehaviorSubject<any> = new BehaviorSubject<any>({
    data: {} as UpdateResponseSet,
    actionType: '' as string
  });
  usersInfoByEmail = {};

  private maxLimit = '1000000';

  constructor(private _appService: AppService) {}

  uploadExcel(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'response-set/upload',
      form,
      info
    );
  }

  fetchAllGlobalResponses$ = () => {
    const params = new URLSearchParams();
    params.set('limit', this.maxLimit);
    params.set('next', '');
    const info: ErrorInfo = {} as ErrorInfo;
    const { displayToast, failureResponse = {} } = info;
    return this._appService
      ._getResp(
        environment.masterConfigApiUrl,
        'response-set/list?' + params.toString(),
        { displayToast, failureResponse }
      )
      .pipe(shareReplay(1));
  };

  fetchResponseSetList$ = (queryParams: {
    next?: string;
    limit: number;
    searchKey?: string;
    fetchType: string;
  }) => {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
    ) {
      const params: URLSearchParams = new URLSearchParams();

      params.set('limit', `${queryParams.limit}`);

      params.set('next', queryParams.next);
      if (queryParams.searchKey) {
        const filter = {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        };
        params.set('filter', JSON.stringify(filter));
      }

      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'response-set/list?' + params.toString()
        )
        .pipe(map((res) => this.formatGraphQLocationResponse(res)));
    }
  };

  createResponseSet$ = (responseSet: CreateResponseSet) =>
    this._appService._postData(
      environment.masterConfigApiUrl,
      'response-set/create',
      {
        name: responseSet.name,
        description: responseSet?.description,
        refCount: responseSet.refCount,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values
      }
    );

  updateResponseSet$ = (responseSet: UpdateResponseSet) => {
    const updatePayload = {
      id: responseSet.id,
      name: responseSet.name,
      description: responseSet.description,
      refCount: responseSet.refCount,
      isMultiColumn: responseSet.isMultiColumn,
      values: responseSet.values,
      createdBy: responseSet.createdBy,
      _version: responseSet.version
    };
    return this._appService
      .patchData(
        environment.masterConfigApiUrl,
        `response-set/update/${responseSet.id}`,
        updatePayload
      )
      .pipe(map((response) => (response === null ? updatePayload : {})));
  };

  deleteResponseSet$ = (deleteResponsePayload: DeleteResponseSet) =>
    this._appService._removeData(
      environment.masterConfigApiUrl,
      `response-set/delete/${JSON.stringify(deleteResponsePayload)}`
    );

  downloadSampleResponseSetTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'response-set/download/sample-template',
      info,
      true,
      {}
    );
  }
  getResponseSetCount$(): Observable<number> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', this.maxLimit);
    return this._appService
      ._getResp(
        environment.masterConfigApiUrl,
        'response-set/list?' + params.toString()
      )
      .pipe(map((res) => res.items.length || 0));
  }

  downloadFailure(
    body: { rows: any },
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'response-set/download/failure',
      info,
      false,
      body
    );
  }

  private formatGraphQLocationResponse(resp) {
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
    const next = resp?.next;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      next
    };
  }
}
