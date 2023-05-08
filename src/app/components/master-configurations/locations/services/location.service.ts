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
  GetLocations,
  CreateLocation,
  DeleteLocation,
  LocationsResponse
} from 'src/app/interfaces/master-data-management/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locationCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchLocations$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  locationCreatedUpdated$ = this.locationCreatedUpdatedSubject.asObservable();
  // this fetch limit is limited by DynamoDB's 1 MB query size limit.
  private MAX_FETCH_LIMIT: string = '1000000';

  constructor(private _appService: AppService) {}

  setFormCreatedUpdated(data: any) {
    this.locationCreatedUpdatedSubject.next(data);
  }

  fetchAllLocations$ = (plantsID = null) => {
    const params: URLSearchParams = new URLSearchParams();
    if (plantsID) {
      const filter = {
        plantsID: {
          eq: plantsID
        }
      };
      params.set('filter', JSON.stringify(filter));
    }
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'location/listAll?' + params.toString(),
      { displayToast: true, failureResponse: {} }
    );
  };
  getLocationCount$(info: ErrorInfo = {} as ErrorInfo): Observable<number> {
    return this._appService
      ._getResp(environment.masterConfigApiUrl, 'location/count', info, {
        limit: this.MAX_FETCH_LIMIT
      })
      .pipe(map((res) => res?.count || 0));
  }

  getLocationsList$(
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
        const filter: GetLocations = {
          searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
        };
        params.set('filter', JSON.stringify(filter));
      }
      if (filterData.plant) {
        let filter = JSON.parse(params.get('filter'));
        filter = { ...filter, plantsID: { eq: filterData.plant } };
        params.set('filter', JSON.stringify(filter));
      }

      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'location/list?' + params.toString()
        )
        .pipe(map((res) => this.formatGraphQLocationResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        next: null
      });
    }
  }

  createLocation$(
    formLocationQuery: Pick<
      CreateLocation,
      | 'name'
      | 'image'
      | 'description'
      | 'model'
      | 'locationId'
      | 'parentId'
      | 'plantsID'
    >
  ) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      `location/create`,
      {
        data: {
          ...formLocationQuery,
          searchTerm: `${formLocationQuery.name.toLowerCase()} ${
            formLocationQuery.description?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  updateLocation$(locationData) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `location/${locationData.id}/update`,
      {
        data: {
          ...locationData,
          searchTerm: `${locationData.name.toLowerCase()} ${
            locationData.description?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  deleteLocation$(values: DeleteLocation) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `location/${JSON.stringify(values)}/delete`
    );
  }

  downloadSampleLocationTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'location/download/sample-template',
      info,
      true,
      {}
    );
  }

  uploadExcel(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      'location/upload',
      form,
      info
    );
  }

  downloadFailure(
    body: { rows: any },
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'location/download/failure',
      info,
      false,
      body
    );
  }

  getFilter(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this._appService._getLocal(
      '',
      'assets/json/master-configuration-locations-filter.json',
      info
    );
  }

  private formatGraphQLocationResponse(resp: LocationsResponse) {
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
                : 'assets/master-configurations/locationIcon.svg',
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
