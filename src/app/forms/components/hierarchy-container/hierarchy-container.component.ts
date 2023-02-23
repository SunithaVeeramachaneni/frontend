/* eslint-disable @typescript-eslint/dot-notation */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from 'src/app/components/master-configurations/assets/services/assets.service';
import { FormService } from '../../services/form.service';
import { FormMetadata, HierarchyEntity } from 'src/app/interfaces';
import {
  getMasterHierarchyList,
  getSelectedHierarchyList,
  State
} from 'src/app/forms/state';
import { HierarchyModalComponent } from 'src/app/forms/components/hierarchy-modal/hierarchy-modal.component';
import { getTotalTasksCount } from '../../state/builder/builder-state.selectors';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HierarchyDeleteConfirmationDialogComponent } from './hierarchy-delete-dialog/hierarchy-delete-dialog.component';
import { BuilderConfigurationActions } from '../../state/actions';
import { HierarchyActions } from '../../state/actions';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  @Output() hierarchyEvent: EventEmitter<any> = new EventEmitter<any>();

  searchHierarchyKey: FormControl;
  selectedHierarchy$: Observable<any>;
  allLocations$: Observable<any>;
  masterHierarchyList$: Observable<any>;
  allAssets$: Observable<any>;
  formMetadata$: Observable<FormMetadata>;

  filterIcon = 'assets/maintenance-icons/filterIcon.svg';

  masterHierarchyList = [];

  filteredHierarchyList = [];

  hierarchy = [];
  totalAssetsCount = 0;

  hierarchyMode = 'asset_hierarchy';
  flatHierarchyList = [];

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private locationService: LocationService,
    private assetService: AssetsService,
    private formService: FormService,
    public assetHierarchyUtil: AssetHierarchyUtil,
    private store: Store<State>,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef
  ) {
    this.selectedHierarchy$ = this.store.select(getSelectedHierarchyList).pipe(
      tap((selectedHierarchy) => {
        if (selectedHierarchy.length) {
          this.totalAssetsCount =
            assetHierarchyUtil.getTotalAssetCount(selectedHierarchy);
          this.hierarchy = JSON.parse(JSON.stringify(selectedHierarchy));

          const stitchedHierarchy =
            assetHierarchyUtil.prepareAssetHierarchy(selectedHierarchy);

          this.filteredHierarchyList = JSON.parse(
            JSON.stringify(this.hierarchy)
          );
          this.cdrf.detectChanges();
          this.operatorRoundsService.setSelectedNode(selectedHierarchy[0]);
        }
      })
    );
  }

  ngOnInit(): void {
    this.allLocations$ = this.locationService.fetchAllLocations$();
    this.allAssets$ = this.assetService.fetchAllAssets$();

    this.masterHierarchyList$ = combineLatest([
      this.allLocations$,
      this.allAssets$,
      this.store.select(getMasterHierarchyList)
    ]).pipe(
      map(([allLocations, allAssets, masterHierarchy]) => {
        if (masterHierarchy.length)
          return (this.masterHierarchyList = masterHierarchy);

        const hierarchyItems = [
          ...allLocations.items.map((location) => ({
            ...location,
            type: 'location'
          })),
          ...allAssets.items.map((asset) => ({ ...asset, type: 'asset' }))
        ];

        this.masterHierarchyList =
          this.assetHierarchyUtil.prepareHierarchyList(hierarchyItems);

        this.store.dispatch(
          HierarchyActions.setMasterHierarchyList({
            masterHierarchy: this.masterHierarchyList
          })
        );
        this.formService.setMasterHierarchyList(this.masterHierarchyList);
        return this.masterHierarchyList;
      })
    );

    this.masterHierarchyList$.subscribe();

    this.searchHierarchyKey = new FormControl('');
    this.searchHierarchyKey.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchKey) => {
          if (searchKey.length > 3) {
            this.filteredHierarchyList = this.flatHierarchyList.filter((node) =>
              node.name.toLowerCase().includes(searchKey.toLowerCase())
            );
          } else if (searchKey.length < 3) {
            this.filteredHierarchyList = JSON.parse(
              JSON.stringify(this.flatHierarchyList)
            );
          }
          this.cdrf.detectChanges();
        })
      )
      .subscribe();
  }

  getTotalTasksCount() {
    let count = 0;
    this.store.select(getTotalTasksCount()).subscribe((c) => {
      count = c;
    });
    return count;
  }

  removeNodeHandler(event) {
    const deleteConfirmationDialogRef = this.dialog.open(
      HierarchyDeleteConfirmationDialogComponent,
      {
        width: '450px',
        height: '165px',
        disableClose: true,
        data: { node: event }
      }
    );
    deleteConfirmationDialogRef.afterClosed().subscribe((resp) => {
      if (!resp) return;
      const hierarchyUpdated = this.promoteChildren([...this.hierarchy], event);
      this.store.dispatch(
        BuilderConfigurationActions.removeSubForm({
          subFormId: event.id
        })
      );
      this.hierarchyEvent.emit({
        hierarchy: hierarchyUpdated,
        node: event
      });
    });
  }

  promoteChildren(list, node) {
    list = list.map((l) => {
      if (l.children && l.children.length) {
        const index = l.children.findIndex((i) => i.id === node.id);
        if (index > -1) {
          l.children = [
            ...l.children.slice(0, index),
            ...node.children,
            ...l.children.slice(index + 1)
          ];
        } else {
          this.promoteChildren(l.children, node);
        }
      }
      return l;
    });
    return list;
  }

  openHierarchyModal = () => {
    const dialogRef = this.dialog
      .open(HierarchyModalComponent, {})
      .afterClosed()
      .subscribe((selectedHierarchyList: HierarchyEntity[]) => {
        this.store.dispatch(
          HierarchyActions.updateSelectedHierarchyList({
            selectedHierarchy: selectedHierarchyList
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateFormStatuses({
            formStatus: 'Draft',
            formDetailPublishStatus: 'Draft',
            formSaveStatus: 'Saving'
          })
        );
        this.formService.setSelectedHierarchyList(selectedHierarchyList);
      });
  };
}
