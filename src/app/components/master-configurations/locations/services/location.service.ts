import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import {
  APIService,
  CreateLocationInput,
  DeleteLocationListInput,
  ListLocationsQuery
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
export class LocationService {
  locationCreatedUpdatedSubject = new BehaviorSubject<any>({});

  fetchLocations$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  locationCreatedUpdated$ = this.locationCreatedUpdatedSubject.asObservable();

  constructor(
    private _appService: AppService,
    private readonly awsApiService: APIService
  ) {}

  setFormCreatedUpdated(data: any) {
    this.locationCreatedUpdatedSubject.next(data);
  }

  fetchAllLocations$ = () =>
    from(this.awsApiService.ListLocations({}, 20000, ''));

  getLocationsList$(queryParams: {
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
        this.awsApiService.ListLocations(
          {
            ...(queryParams.searchKey && {
              searchTerm: { contains: queryParams?.searchKey.toLowerCase() }
            })
          },
          !isSearch && queryParams.limit,
          !isSearch && queryParams.nextToken
        )
      ).pipe(map((res) => this.formatGraphQLocationResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        nextToken: null
      });
    }
  }

  getLocationById$(id: string) {
    return from(this.awsApiService.GetLocation(id));
  }

  createLocation$(
    formLocationQuery: Pick<
      CreateLocationInput,
      'name' | 'image' | 'description' | 'model' | 'locationId' | 'parentId'
    >
  ) {
    return from(
      this.awsApiService.CreateLocation({
        name: formLocationQuery.name,
        image: formLocationQuery.image,
        description: formLocationQuery.description,
        model: formLocationQuery.model,
        locationId: formLocationQuery.locationId,
        parentId: formLocationQuery.parentId,
        searchTerm: formLocationQuery.name.toLowerCase()
      })
    );
  }

  updateLocation$(locationDetails) {
    return from(
      this.awsApiService.UpdateLocation({
        ...locationDetails.data,
        _version: locationDetails.version
      })
    );
  }

  deleteLocation$(values: DeleteLocationListInput) {
    return from(this.awsApiService.DeleteLocation({ ...values }));
  }

  downloadSampleLocationTemplate(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.masterConfigApiUrl,
      'download-sample-location',
      info,
      true,
      {}
    );
  }

  private formatGraphQLocationResponse(resp: ListLocationsQuery) {
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
      'location-excel-upload',
      form,
      info
    );
  }
}
