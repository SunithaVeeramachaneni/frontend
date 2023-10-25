/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { exhaustMap, map, pluck, reduce, scan, switchMap, tap } from 'rxjs/operators';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../../interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  GetPlants,
  CreatePlants,
  DeletePlants,
  PlantsResponse
} from 'src/app/interfaces/master-data-management/plants';
import { formatDistance } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  fetchPlants$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  plantTimeZoneMapping$ = new BehaviorSubject<any>({});
  plantMasterData$ = new BehaviorSubject<any>({});
  allPlants$ = new BehaviorSubject<any>({});

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private MAX_FETCH_LIMIT = '1000000';

  constructor(private _appService: AppService) {}

  fetchAllPlants$ = () => {
    if(!Object.keys(this.allPlants$.value).length) {
      const params: URLSearchParams = new URLSearchParams();
      params.set('limit', this.MAX_FETCH_LIMIT);
      return this._appService._getResp(
        environment.masterConfigApiUrl,
        'plants/list?' + params.toString()
      ).pipe(exhaustMap(res => {
        return res.items;
      }), reduce((allPlants, plant: any) => {
        allPlants[plant.id] = plant;
        return allPlants;
      }, {}));
    }else {
      return of(this.allPlants$.value);
    }
  };

  getPlantTimeZoneMapping = () => {
    if (!Object.keys(this.plantTimeZoneMapping$.value).length) {
      this.fetchAllPlants$().subscribe((res) => {
        const timeZoneMapping = {};
        if (Object.keys(res).length) {
          for (const key in res) {
            if (res[key]?.id && res[key]?.timeZone) {
              if (Object.keys(res[key].timeZone).length !== 0) {
                timeZoneMapping[res[key].id] = res[key].timeZone;
              }
            }
          }
        }
        this.plantTimeZoneMapping$.next(timeZoneMapping);
      });
    }
  };

  getPlantMasterData = () => {
    if (!Object.keys(this.plantMasterData$.value).length) {
      this._appService
        ._getResp(environment.masterConfigApiUrl, 'plants/masterdata')
        .subscribe((res) => {
          this.plantMasterData$.next(res.plantMasterData);
        });
    }
  };

  getPlantsList$(queryParams: {
    skip?: number;
    limit: number;
    searchTerm: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.skip !== null)
    ) {
      return this._appService
        ._getResp(
          environment.masterConfigApiUrl,
          'plants/list',
          {} as ErrorInfo,
          queryParams
        )
        .pipe(map((res) => this.formatPlantResponse(res)));
    } else {
      return of({
        count: 0,
        rows: [],
        skip: null
      });
    }
  }

  createPlant$(
    formPlantQuery: Pick<
      CreatePlants,
      | 'name'
      | 'image'
      | 'country'
      | 'zipCode'
      | 'timeZone'
      | 'plantId'
      | 'state'
    >
  ) {
    return this._appService._postData(
      environment.masterConfigApiUrl,
      `plants/create`,
      {
        data: {
          ...formPlantQuery,
          searchTerm: `${formPlantQuery.name.toLowerCase()} ${formPlantQuery.country?.toLowerCase()} ${
            formPlantQuery.plantId?.toLowerCase() || ''
          }`
        }
      }
    );
  }

  updatePlant$(plantData) {
    return this._appService.patchData(
      environment.masterConfigApiUrl,
      `plants/${plantData.id}/update`,
      {
        data: {
          ...plantData,
          searchTerm: `${plantData.name.toLowerCase()} ${plantData.plantId?.toLowerCase()} ${
            plantData.country?.toLowerCase() || ''
          }
          `
        }
      }
    );
  }

  deletePlant$(values: DeletePlants) {
    return this._appService._removeData(
      environment.masterConfigApiUrl,
      `plants/${JSON.stringify(values)}/delete`
    );
  }

  private formatPlantResponse(resp: PlantsResponse) {
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
                : 'assets/master-configurations/default-plant.svg',
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

    rows = rows.map((r: any) => {
      try {
        r.shifts = JSON.parse(r.shifts);
        r.shiftNames = r.shifts.map((s) => s.name);
      } catch (err) {
        r.shiftNames = [];
      }
      return r;
    });
    const count = resp?.items.length || 0;
    const skip = resp?.skip;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      skip
    };
  }
}
