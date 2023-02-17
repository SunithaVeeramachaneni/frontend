import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State } from 'src/app/forms/state';
import { HierarchyActions } from '../../state/actions';

import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from 'src/app/components/master-configurations/assets/services/assets.service';
import { HierarchyEntity } from 'src/app/interfaces';

import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { hierarchyMock } from 'src/app/forms/components/utils/utils';

@Component({
  selector: 'app-hierarchy-modal',
  templateUrl: './hierarchy-modal.component.html',
  styleUrls: ['./hierarchy-modal.component.scss']
})
export class HierarchyModalComponent implements OnInit {
  allLocations$: Observable<any>;
  allLocations = [];
  allAssets$: Observable<any>;
  allHierarchyItems$: Observable<any>;
  mode = 'location';
  selectedLocationsHierarchy: HierarchyEntity[];

  constructor(
    private locationService: LocationService,
    private assetService: AssetsService,
    private assetHierarchyUtil: AssetHierarchyUtil,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.allAssets$ = this.assetService.fetchAllAssets$();
    this.allHierarchyItems$ = combineLatest([
      this.allLocations$,
      this.allAssets$
    ]).pipe(
      map(([allLocations, allAssets]) => {
        const hierarchyItems = [...allLocations.items, ...allAssets.items];
        this.store.dispatch(
          HierarchyActions.setMasterHierarchyList({
            masterHierarchy:
              this.assetHierarchyUtil.prepareHierarchyList(hierarchyMock)
          })
        );
        return this.assetHierarchyUtil.prepareHierarchyList(hierarchyMock);
      })
    );

    this.allHierarchyItems$.subscribe();
  }

  prepareHierarchyForSelectedLocations = (
    selectedLocations: HierarchyEntity[]
  ) => {
    this.selectedLocationsHierarchy = selectedLocations;
    this.mode = 'assets';
  };
}
