import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-assets-list',
  templateUrl: './hierarchy-assets-list.component.html',
  styleUrls: ['./hierarchy-assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyAssetsListComponent implements OnInit {
  @Input() set hierarchyData(data: HierarchyEntity[]) {
    this.hierarchyList = data ? data : ([] as HierarchyEntity[]);
    this.unsearchedHierarchyList = this.hierarchyList;
  }
  @Input() set selectedList(data) {
    this.selectedHierarchyList = data;
  }

  public unsearchedHierarchyList: HierarchyEntity[];
  public hierarchyList: HierarchyEntity[];
  public selectedHierarchyList: HierarchyEntity[];
  public selectedLocationHierarchyFlatList: HierarchyEntity[];
  public filteredList: any[] = [];
  public searchMasterData: FormControl;
  public filteredOptions$: Observable<any>;
  public locationsCount: number;
  public assetsCount: number;
  public searchedNode;

  constructor(
    private assetHierarchyUtil: AssetHierarchyUtil,
    private dialogRef: MatDialogRef<HierarchyAssetsListComponent>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.locationsCount = this.hierarchyList.length;
    this.assetsCount = 0;
    this.selectedLocationHierarchyFlatList =
      this.assetHierarchyUtil.convertHierarchyToFlatList(this.hierarchyList, 0);

    this.searchMasterData = new FormControl('');
    this.filteredOptions$ = this.searchMasterData.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm: string) =>
        this.filterList(searchTerm.trim()?.toLowerCase() || '')
      )
    );
  }

  handleHierarchyElementChange = (event) => {
    const { uid } = event;
    const indexInHierarchy = this.hierarchyList.findIndex(
      (element) => element.uid === uid
    );
    if (indexInHierarchy > -1) {
      this.hierarchyList[indexInHierarchy] = event;
      this.locationsCount = this.assetHierarchyUtil.getCountByNodeType(
        this.hierarchyList,
        'location'
      );
      this.assetsCount = this.assetHierarchyUtil.getCountByNodeType(
        this.hierarchyList,
        'asset'
      );

      this.cdrf.markForCheck();
    }
  };

  searchResultSelected(event) {
    const node = event.option.value;

    if (node) {
      setTimeout(() => {
        this.searchMasterData.patchValue(node.name);
      }, 0);

      const tempHierarchyList = cloneDeep(this.hierarchyList);
      this.assetHierarchyUtil.toggleSearchSelectedNode(
        node.uid,
        tempHierarchyList
      );
      this.cdrf.detectChanges();

      this.searchedNode = node.uid;
    }

    const searchedElement = document.getElementById(`Node-${node.uid}`);
    searchedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  getSearchMatchesLabel() {
    return `${this.filteredList.length} Search matches`;
  }

  filterList = (searchInput: string): any[] => {
    if (!searchInput.length) {
      return [];
    }

    this.filteredList = this.selectedLocationHierarchyFlatList.filter(
      (node) =>
        node.name.toLowerCase().includes(searchInput) ||
        node?.nodeDescription.toLowerCase().includes(searchInput) ||
        node.nodeId.toLowerCase().includes(searchInput)
    );
    return this.filteredList.length ? this.filteredList : ['No Data'];
  };

  clearSearchResults() {
    setTimeout(() => {
      this.searchMasterData.patchValue('');
    }, 0);
  }

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedElementsInHierarchy = () => {
    const selectedFlatHierarchy =
      this.assetHierarchyUtil.convertHierarchyToFlatList(
        this.selectedHierarchyList,
        0
      );
    const hierarchyListWithId = this.assetHierarchyUtil.addIdToExistingChild(
      this.hierarchyList,
      selectedFlatHierarchy
    );
    const cleanedHierarchyList =
      this.assetHierarchyUtil.cleanSelectedHierarchyList(hierarchyListWithId);
    this.dialogRef.close(cleanedHierarchyList);
  };
}
