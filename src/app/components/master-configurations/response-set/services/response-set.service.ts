import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { formatDistance } from 'date-fns';

import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/shared/services/app.services';

import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent,
  CreateResponseSet,
  UpdateResponseSet,
  DeleteResponseSet
} from '../../../../interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponseSetService {
  fetchResponses$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  private maxLimit = '1000000';

  constructor(private _appService: AppService) {}

  fetchAllGlobalResponses$ = () => {
    const params = new URLSearchParams();
    params.set('limit', this.maxLimit);
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'response-set/list' + params.toString()
    );
  };

  fetchResponseSetList$ = (queryParams: {
    nextToken?: string;
    limit: number;
    searchKey?: string;
    fetchType: string;
  }) => {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.nextToken !== null)
    ) {
      const isSearch = queryParams.fetchType === 'search';
      const params: URLSearchParams = new URLSearchParams();

      if (!isSearch) {
        params.set('limit', `${queryParams.limit}`);
      }
      if (!isSearch && queryParams.nextToken) {
        params.set('nextToken', queryParams.nextToken);
      }
      if (queryParams.searchKey) {
        const filter = {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        };
        params.set('filter', JSON.stringify(filter));
      }

      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'location/list?' + params.toString()
        )
        .pipe(map((res) => this.formatGraphQLocationResponse(res)));
    }
  };

  createResponseSet$ = (responseSet: CreateResponseSet) =>
    this._appService._postData(
      environment.masterConfigApiUrl,
      'response-set/create',
      {
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet?.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values
      }
    );

  updateResponseSet$ = (responseSet: UpdateResponseSet) =>
    this._appService.patchData(
      environment.masterConfigApiUrl,
      `response-set/update/${responseSet.id}`,
      {
        id: responseSet.id,
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values,
        _version: responseSet.version
      }
    );

  deleteResponseSet$ = (deleteResponsePayload: DeleteResponseSet) =>
    this._appService._removeData(
      environment.masterConfigApiUrl,
      `response-set/delete/${JSON.stringify(deleteResponsePayload)}`
    );

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
    const nextToken = resp?.nextToken;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      nextToken
    };
  }
}
