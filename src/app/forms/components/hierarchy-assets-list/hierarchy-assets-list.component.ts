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
  }
  @Input() set selectedList(data) {
    this.selectedHierarchyList = data;
  }

  public hierarchyList: HierarchyEntity[];
  public selectedHierarchyList: HierarchyEntity[];
  public selectedHierarchyFlatList: HierarchyEntity[];
  public searchedList: any = [];
  public searchMasterData: FormControl;
  public filteredOptions$: Observable<any>;
  public locationsCount: number;
  public assetsCount: number;

  constructor(
    private assetHierarchyUtil: AssetHierarchyUtil,
    private dialogRef: MatDialogRef<HierarchyAssetsListComponent>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.locationsCount = this.hierarchyList.length;
    this.assetsCount = 0;
    this.selectedHierarchyFlatList =
      this.assetHierarchyUtil.convertHierarchyToFlatList(
        this.selectedHierarchyList,
        0
      );

    this.searchMasterData = new FormControl('');
    this.filteredOptions$ = this.searchMasterData.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm: string) => {
        this.filterList(searchTerm.trim() || '');
        //   const term = searchTerm.trim();
        //   if (!term.length) this.searchedList = [];
        //   else {
        //     this.searchedList = this.selectedHierarchyFlatList.filter(
        //       (item) =>
        //         item.name.includes(term) || item.nodeDescription?.includes(term)
        //     );
        //   }

        //   console.log(this.searchedList);
      })
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

  filterList = (searchInput: string): any[] => {
    if (!searchInput.length) return [];
  };

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedElementsInHierarchy = () => {
    const cleanedHierarchyList =
      this.assetHierarchyUtil.cleanSelectedHierarchyList(this.hierarchyList);
    this.dialogRef.close(cleanedHierarchyList);
  };
}
