import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { groupBy, map, shareReplay } from 'rxjs/operators';
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
export class PlantService {
  plantCreatedUpdatedSubject = new BehaviorSubject<any>({});
  fetchPlants$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  plantCreatedUpdated$ = this.plantCreatedUpdatedSubject.asObservable();

  private MAX_FETCH_LIMIT: string = '1000000';

  constructor(private _appService: AppService) {}

  setFormCreatedUpdated(data: any) {
    this.plantCreatedUpdatedSubject.next(data);
  }

  fetchAllPlants$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', this.MAX_FETCH_LIMIT);
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'plants/list?' + params.toString()
    );
  };

  getPlantsList$(queryParams: {
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
      const params: URLSearchParams = new URLSearchParams();

      if (!isSearch) {
        params.set('limit', `${queryParams.limit}`);
      }
      if (!isSearch && queryParams.nextToken) {
        params.set('nextToken', queryParams.nextToken);
      }
      if (queryParams.searchKey) {
        const filter: any = {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        };
        params.set('filter', JSON.stringify(filter));
      }

      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'plants/list?' + params.toString()
        )
        .pipe(map((res) => this.formatPlantResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  createPlant$(values, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'plants/create',
      { ...values },
      info,
      {}
    );
  }

  updatePlant$(plantData) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `plants/${plantData.id}/update`,
      {
        data: {
          ...plantData,
          searchTerm: `${plantData.name.toLowerCase()} ${
            plantData.description?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  deletePlant$(values: any) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `plant/${JSON.stringify(values)}/delete`
    );
  }

  private formatPlantResponse(resp: any) {
    const groupedData: any = groupBy(resp?.items);
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
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }
}
