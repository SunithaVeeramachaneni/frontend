/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
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
import { UsersService } from 'src/app/components/user-management/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  fetchPlants$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);

  plantTimeZoneMapping$ = new BehaviorSubject<any>({});
  plantMasterData$ = new BehaviorSubject<any>({});
  userPlants$ = new BehaviorSubject<string>('');
  private userAssignedPlants$: Observable<any>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private MAX_FETCH_LIMIT = '1000000';

  constructor(
    private _appService: AppService,
    private _usersService: UsersService
  ) {}

  setUserPlantIds(plant: string = null) {
    this.userPlants$.next(plant);
  }

  getUserPlantIds(): string {
    return this.userPlants$.value ?? '';
  }

  fetchAllPlants$ = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('limit', this.MAX_FETCH_LIMIT);
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      'plants/list?' + params.toString()
    );
  };

  fetchLoggedInUserPlants$ = () => {
    if (!this.userAssignedPlants$) {
      this.userAssignedPlants$ = this.fetchAllPlants$().pipe(
        switchMap((plants: any) =>
          this._usersService
            .getLoggedInUser$()
            .pipe(
              map((user: any) =>
                plants.items.filter((item: any) =>
                  user.plantId.split(',').includes(item.id)
                )
              )
            )
        ),
        shareReplay(1)
      );
    }
    return this.userAssignedPlants$;
  };

  getPlantTimeZoneMapping = () => {
    if (!Object.keys(this.plantTimeZoneMapping$.value).length) {
      this.fetchAllPlants$().subscribe((res) => {
        const timeZoneMapping = {};
        if (res?.items?.length > 0) {
          for (const plant of res.items) {
            if (plant.id && plant.timeZone) {
              if (Object.keys(plant.timeZone).length !== 0) {
                timeZoneMapping[plant.id] = plant.timeZone;
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
    next?: string;
    limit: number;
    searchTerm: string;
    fetchType: string;
  }) {
    if (
      ['load', 'search'].includes(queryParams.fetchType) ||
      (['infiniteScroll'].includes(queryParams.fetchType) &&
        queryParams.next !== null)
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
        next: null
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

  verifyPlantId$(plantId: string, info: ErrorInfo = {} as ErrorInfo) {
    return this._appService._getResp(
      environment.masterConfigApiUrl,
      `plants/verify/${plantId}`,
      info
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
    const next = resp?.next;
    rows = rows.filter((o: any) => !o._deleted);
    return {
      count,
      rows,
      next
    };
  }
}
