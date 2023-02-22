import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  public hierarchyList: HierarchyEntity[];
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
  }

  handleHierarchyElementChange = (event) => {
    const { id } = event;
    const indexInHierarchy = this.hierarchyList.findIndex(
      (element) => element.id === id
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

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedElementsInHierarchy = () => {
    const cleanedHierarchyList =
      this.assetHierarchyUtil.cleanSelectedHierarchyList(this.hierarchyList);
    this.dialogRef.close(cleanedHierarchyList);
  };
}
