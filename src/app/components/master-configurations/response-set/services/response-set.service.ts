import { Injectable } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

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
  UserDetails
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

  fetchAllGlobalResponses$ = () => {
    const params = new URLSearchParams();
    params.set('limit', this.maxLimit);
    return this._appService
      ._getResp(
        environment.masterConfigApiUrl,
        'response-set/list?' + params.toString()
      )
      .pipe(shareReplay(1));
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

  setUsers(users: UserDetails[]) {
    this.usersInfoByEmail = users.reduce((acc, curr) => {
      acc[curr.email] = { fullName: `${curr.firstName} ${curr.lastName}` };
      return acc;
    }, {});
  }

  getUserFullName(email: string): string {
    return this.usersInfoByEmail[email]?.fullName;
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
    const nextToken = resp?.nextToken;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      nextToken
    };
  }
}
