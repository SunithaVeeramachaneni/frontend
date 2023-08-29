import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
  getMasterHierarchyList,
  getSelectedHierarchyList,
  State
} from '../../state';

import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from 'src/app/components/master-configurations/assets/services/assets.service';
import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-modal',
  templateUrl: './hierarchy-modal.component.html',
  styleUrls: ['./hierarchy-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyModalComponent implements OnInit {
  allLocations$: Observable<any>;
  allLocations = [];
  allAssets$: Observable<any>;
  hierarchyLoaded = false;
  masterHierarchyList = [];
  selectedHierarchyList = [];
  mode = 'location';
  selectedLocationsHierarchy: HierarchyEntity[];
  hierarchy$: Observable<any>;

  constructor(
    private locationService: LocationService,
    private assetService: AssetsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.allAssets$ = this.assetService.fetchAllAssets$();

    this.hierarchy$ = combineLatest([
      this.store.select(getMasterHierarchyList),
      this.store.select(getSelectedHierarchyList)
    ]).pipe(
      tap(([masterHierarchyList, selectedHierarchyList]) => {
        this.masterHierarchyList = masterHierarchyList;
        this.selectedHierarchyList = selectedHierarchyList;
        this.hierarchyLoaded = true;
      })
    );
  }

  prepareHierarchyForSelectedLocations = (
    selectedLocations: HierarchyEntity[]
  ) => {
    this.selectedLocationsHierarchy = selectedLocations;
    this.mode = 'assets';
  };
}
