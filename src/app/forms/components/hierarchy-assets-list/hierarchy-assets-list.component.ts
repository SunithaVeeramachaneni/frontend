import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-assets-list',
  templateUrl: './hierarchy-assets-list.component.html',
  styleUrls: ['./hierarchy-assets-list.component.scss']
})
export class HierarchyAssetsListComponent implements OnInit {
  @Input() set hierarchyData(data: HierarchyEntity[]) {
    this.hierarchyList = data ? data : ([] as HierarchyEntity[]);
  }

  public hierarchyList: HierarchyEntity[];

  constructor(
    private assetHierarchyUtil: AssetHierarchyUtil,
    private dialogRef: MatDialogRef<HierarchyAssetsListComponent>
  ) {}

  ngOnInit(): void {}

  handleHierarchyElementChange = (event) => {
    const { id } = event;
    const indexInHierarchy = this.hierarchyList.findIndex(
      (element) => element.id === id
    );
    if (indexInHierarchy > -1) this.hierarchyList[indexInHierarchy] = event;

    /// Fix get selected count by node
  };

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedElementsInHierarchy = () => {
    console.log(this.hierarchyList);
  };
}
