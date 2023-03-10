import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { APIService, CreatePlantInput } from 'src/app/API.service';
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
export class PlantService {
  fetchPlants$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(private readonly awsApiService: APIService) {}
  fetchAllPlants$ = () =>
    from(this.awsApiService.ListLocations({}, 2000000, ''));

  createPlant$(
    formPlantQuery: Pick<
      CreatePlantInput,
      'name' | 'image' | 'description' | 'model' | 'plantId'
    >
  ) {
    return from(
      this.awsApiService.CreateLocation({
        name: formPlantQuery.name,
        image: formPlantQuery.image,
        description: formPlantQuery.description,
        model: formPlantQuery.model,
        locationId: formPlantQuery.plantId,
        // parentId: formPlantQuery.parentId,
        searchTerm: formPlantQuery.name.toLowerCase()
      })
    );
  }

  updatePlant$(locationDetails) {
    return from(
      this.awsApiService.UpdateLocation({
        ...locationDetails.data,
        _version: locationDetails.version
      })
    );
  }
}
