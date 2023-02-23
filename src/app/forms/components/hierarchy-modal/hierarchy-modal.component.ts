import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { getMasterHierarchyList, State } from '../../state';

import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from 'src/app/components/master-configurations/assets/services/assets.service';
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
  masterHierarchyList$: Observable<any>;
  masterHierarchyList = [];
  mode = 'location';
  selectedLocationsHierarchy: HierarchyEntity[];

  constructor(
    private locationService: LocationService,
    private assetService: AssetsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.allAssets$ = this.assetService.fetchAllAssets$();

    this.masterHierarchyList$ = this.store.select(getMasterHierarchyList).pipe(
      map((masterHierarchyList) => {
        this.masterHierarchyList = masterHierarchyList;
      })
    );

    this.masterHierarchyList$.subscribe();
  }

  prepareHierarchyForSelectedLocations = (
    selectedLocations: HierarchyEntity[]
  ) => {
    this.selectedLocationsHierarchy = selectedLocations;
    this.mode = 'assets';
  };
}
