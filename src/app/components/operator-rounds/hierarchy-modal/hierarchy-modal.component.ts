import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from '../../master-configurations/assets/services/assets.service';
import { v4 as uuidv4 } from 'uuid';
import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-modal',
  templateUrl: './hierarchy-modal.component.html',
  styleUrls: ['./hierarchy-modal.component.scss']
})
export class HierarchyModalComponent implements OnInit {
  allLocations$: Observable<any>;
  allLocations = [];
  allAssets$: Observable<any>;
  mode = 'location';
  selectedLocationsHierarchy: HierarchyEntity[];

  constructor(
    private locationService: LocationService,
    private assetService: AssetsService
  ) {}

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$().pipe(
      tap((locations) => {
        this.allLocations = locations.items;
      })
    );
    this.allAssets$ = this.assetService.fetchAllAssets$();
    this.allAssets$.subscribe(console.log);
  }

  prepareHierarchyForSelectedLocations = (event: any) => {
    const { ids } = event;
    this.selectedLocationsHierarchy = ids.map((id) => {
      const location = this.allLocations.find((item) => item.id === id);
      return {
        id: uuidv4(),
        type: 'location',
        name: location.name,
        image: location.image,
        hasChildren: true,
        subFormId: '',
        children: [] as HierarchyEntity[]
      };
    });

    this.mode = 'assets';
  };
}
