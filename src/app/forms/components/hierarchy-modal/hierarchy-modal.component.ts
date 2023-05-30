import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor(
    private locationService: LocationService,
    private assetService: AssetsService,
    private store: Store<State>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.allAssets$ = this.assetService.fetchAllAssets$();

    combineLatest([
      this.store.select(getMasterHierarchyList),
      this.store.select(getSelectedHierarchyList)
    ])
      .pipe(
        map(([masterHierarchyList, selectedHierarchyList]) => {
          this.masterHierarchyList = masterHierarchyList;
          this.selectedHierarchyList = selectedHierarchyList;
          this.hierarchyLoaded = true;
          this.cdrf.detectChanges();
        })
      )
      .subscribe();
  }

  prepareHierarchyForSelectedLocations = (
    selectedLocations: HierarchyEntity[]
  ) => {
    this.selectedLocationsHierarchy = selectedLocations;
    this.mode = 'assets';
  };
}
