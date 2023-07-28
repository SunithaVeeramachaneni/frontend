/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/dot-notation */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap
} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { LocationService } from 'src/app/components/master-configurations/locations/services/location.service';
import { AssetsService } from 'src/app/components/master-configurations/assets/services/assets.service';
import { FormService } from '../../services/form.service';
import { HierarchyEntity } from 'src/app/interfaces';
import {
  getMasterHierarchyList,
  getSelectedHierarchyList
} from 'src/app/forms/state';
import { HierarchyModalComponent } from 'src/app/forms/components/hierarchy-modal/hierarchy-modal.component';
import { State } from '../../state/builder/builder-state.selectors';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HierarchyDeleteConfirmationDialogComponent } from './hierarchy-delete-dialog/hierarchy-delete-dialog.component';
import { BuilderConfigurationActions } from '../../state/actions';
import { HierarchyActions } from '../../state/actions';
import { formConfigurationStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  @Output() hierarchyEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() plantId: string;
  @Input() set nodeWiseQuestionsCount(nodeWiseQuestionsCount: any) {
    if (nodeWiseQuestionsCount) {
      this._nodeWiseQuestionsCount = nodeWiseQuestionsCount;
      this.setTasksCount();
    }
  }
  get nodeWiseQuestionsCount() {
    return this._nodeWiseQuestionsCount;
  }

  filteredOptions$: Observable<any[]>;
  searchHierarchyKey: FormControl;
  selectedHierarchy$: Observable<any>;
  allLocations$: Observable<any>;
  masterHierarchyList$: Observable<any>;
  allAssets$: Observable<any>;
  masterHierarchyList = [];
  filteredHierarchyList = [];
  instanceIdMappings = {};
  hierarchy = [];
  totalAssetsLocationsCount = 0;
  hierarchyMode = 'asset_hierarchy';
  flatHierarchyList = [];
  filteredList = [];
  totalTasksCount: number;
  private _nodeWiseQuestionsCount: any = {};

  constructor(
    private operatorRoundsService: OperatorRoundsService,
    private locationService: LocationService,
    private assetService: AssetsService,
    private formService: FormService,
    public assetHierarchyUtil: AssetHierarchyUtil,
    public dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.selectedHierarchy$ = this.store.select(getSelectedHierarchyList).pipe(
      tap((selectedHierarchy) => {
        if (selectedHierarchy) {
          this.totalAssetsLocationsCount =
            this.assetHierarchyUtil.getTotalAssetsLocationsCount(
              selectedHierarchy
            );
          this.hierarchy = JSON.parse(JSON.stringify(selectedHierarchy));
          const { stitchedHierarchy, instanceIdMappings } =
            this.assetHierarchyUtil.prepareAssetHierarchy(selectedHierarchy);
          this.instanceIdMappings = instanceIdMappings;
          this.formService.setInstanceIdMappings(this.instanceIdMappings);
          this.filteredHierarchyList = JSON.parse(
            JSON.stringify(stitchedHierarchy)
          );
          this.cdrf.detectChanges();
          if (selectedHierarchy && selectedHierarchy[0]) {
            this.operatorRoundsService.setSelectedNode(selectedHierarchy[0]);
          }
        }
      })
    );

    this.allLocations$ = this.locationService.fetchAllLocations$(this.plantId);
    this.allAssets$ = this.assetService.fetchAllAssets$(this.plantId);

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

        if (hierarchyItems.length) {
          this.masterHierarchyList =
            this.assetHierarchyUtil.prepareHierarchyList(hierarchyItems);

          this.store.dispatch(
            HierarchyActions.setMasterHierarchyList({
              masterHierarchy: this.masterHierarchyList
            })
          );
        }

        return this.masterHierarchyList;
      })
    );

    this.searchHierarchyKey = new FormControl('');

    this.filteredOptions$ = this.searchHierarchyKey.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map((value) => this.filter(value.trim() || ''))
    );
  }

  setTasksCount() {
    const hierarchy = JSON.parse(JSON.stringify(this.hierarchy));
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      hierarchy,
      0
    );
    const nodeIds = flatHierarchy.map((h) => h.id);
    this.totalTasksCount = nodeIds.reduce(
      (acc, curr) => (acc += this.nodeWiseQuestionsCount[curr] || 0),
      0
    );
  }

  filter(value: string): string[] {
    value = value.trim();
    if (!value.length) {
      return [];
    }
    const filterValue = value.toLowerCase();
    const hierarchyClone = JSON.parse(JSON.stringify(this.hierarchy));
    const flatHierarchy = this.assetHierarchyUtil.convertHierarchyToFlatList(
      hierarchyClone,
      0
    );
    this.filteredList = flatHierarchy.filter(
      (option) =>
        option.name.toLowerCase().includes(filterValue) ||
        option.nodeDescription?.toLowerCase().includes(filterValue)
    );
    if (this.hierarchyMode !== 'asset_hierarchy') {
      this.filteredList = this.filteredList.filter(
        (option) => !option.isDeletedInRoutePlan
      );
    }
    return this.filteredList || [];
  }
  getSearchMatchesLabel() {
    return `${this.filteredList.length} Search matches`;
  }

  searchResultSelected(event) {
    const node = event.option.value;
    const el = document.getElementById(`node-${node.id}`);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    if (node) {
      setTimeout(() => {
        this.searchHierarchyKey.patchValue(node.name);
      }, 0);
      this.operatorRoundsService.setSelectedNode(node);
    }
  }
  clearSearchResults() {
    setTimeout(() => {
      this.searchHierarchyKey.patchValue('');
    }, 0);
  }

  handleCopyNode = (event) => {
    this.store.dispatch(
      HierarchyActions.copyNodeToRoutePlan({
        node: event
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateFormStatuses({
        formStatus: formConfigurationStatus.draft,
        formDetailPublishStatus: formConfigurationStatus.draft,
        formSaveStatus: formConfigurationStatus.saving
      })
    );
  };

  removeNodeHandler(event) {
    const deleteConfirmationDialogRef = this.dialog.open(
      HierarchyDeleteConfirmationDialogComponent,
      {
        width: '450px',
        height: '165px',
        disableClose: true,
        data: { node: event, hierarchyMode: this.hierarchyMode }
      }
    );
    deleteConfirmationDialogRef.afterClosed().subscribe((resp) => {
      if (!resp) return;
      if (this.hierarchyMode === 'asset_hierarchy') {
        const nodeChildrenUIDs = this.getChildrenUIDs(event);

        const instanceIdMappings = this.formService.getInstanceIdMappings();
        let instances = [];
        nodeChildrenUIDs.forEach((uid) => {
          const temp = instanceIdMappings[uid];
          instances = [...instances, ...temp];
        });
        const instanceIds = instances.map((i) => i.id);
        this.store.dispatch(
          BuilderConfigurationActions.removeSubFormInstances({
            subFormIds: instanceIds
          })
        );
        this.store.dispatch(
          HierarchyActions.deleteNodeFromSelectedHierarchy({
            instanceIds
          })
        );
        this.hierarchyEvent.emit({
          node: event,
          hierarchy: this.hierarchy
        });
      } else {
        const hierarchyClone = JSON.parse(JSON.stringify(this.hierarchy));
        const hierarchyUpdated = this.promoteChildren(hierarchyClone, event);
        this.hierarchyEvent.emit({
          hierarchy: hierarchyUpdated,
          node: event
        });
        this.store.dispatch(
          BuilderConfigurationActions.removeSubFormInstances({
            subFormIds: [event.id]
          })
        );
      }

      this.store.dispatch(
        BuilderConfigurationActions.updateFormStatuses({
          formStatus: formConfigurationStatus.draft,
          formDetailPublishStatus: formConfigurationStatus.draft,
          formSaveStatus: formConfigurationStatus.saving
        })
      );
    });
  }

  getChildrenUIDs(root) {
    let uids = [];
    uids.push(root.uid);
    if (root.hasChildren && root.children && root.children.length) {
      root.children.forEach((child) => {
        const recursiveUIDs = this.getChildrenUIDs(child);
        uids = [...uids, ...recursiveUIDs];
      });
    }
    return uids;
  }

  pruneChildren(array, node) {
    for (let i = 0; i < array.length; ++i) {
      const obj = array[i];
      if (obj.id === node.id || obj.uid === node.uid) {
        array.splice(i, 1);
        const index = array.findIndex((c) => c.uid === node.uid);
        if (index > -1) {
          array.splice(index, 1);
        }
        return array;
      }
      if (obj.children) {
        if (this.pruneChildren(obj.children, node)) {
          if (obj.children.length === 0) {
            delete obj.children;
            array.splice(i, 1);
          }
        }
      }
    }
    return array;
  }

  promoteChildren(list, node): HierarchyEntity[] {
    list = list.map((l) => {
      if (l.id === node.id) {
        l.isDeletedInRoutePlan = true;
      }
      if (l.children && l.children.length) {
        const index = l.children.findIndex((i) => i.id === node.id);
        if (index > -1) {
          const { id, isOriginal, ...rest } = l.children[index];
          l.children = [
            ...l.children.slice(0, index),
            ...node.children,
            ...l.children.slice(index + 1)
          ];

          if (isOriginal) {
            l.children.push({
              isOriginal,
              ...rest,
              children: [] as HierarchyEntity[],
              isDeletedInRoutePlan: true
            });
          }
        } else {
          this.promoteChildren(l.children, node);
        }
      }
      return l;
    });
    return list;
  }

  openHierarchyModal = () => {
    const dialogRef = this.dialog.open(HierarchyModalComponent, {
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .subscribe((selectedHierarchyList: HierarchyEntity[]) => {
        if (!selectedHierarchyList) return;
        this.store.dispatch(
          HierarchyActions.updateSelectedHierarchyList({
            selectedHierarchy: selectedHierarchyList || []
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateFormStatuses({
            formStatus: formConfigurationStatus.draft,
            formDetailPublishStatus: formConfigurationStatus.draft,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.formService.setSelectedHierarchyList(selectedHierarchyList);
      });
  };
  getImage = (imageName: string, active: boolean) =>
    active ? `icon-${imageName}-white` : `icon-${imageName}-gray`;

  toggleHierarchyMode(event) {
    this.hierarchyMode = event.value;
    this.operatorRoundsService.setHierarchyMode(event.value);
    this.cdrf.detectChanges();
  }
}
