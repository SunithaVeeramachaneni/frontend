import { Component, OnInit } from '@angular/core';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

import { hierarchyMock } from 'src/app/forms/components/utils/utils';
import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-show-hierarchy-popup',
  templateUrl: './show-hierarchy-popup.component.html',
  styleUrls: ['./show-hierarchy-popup.component.scss']
})
export class ShowHierarchyPopupComponent implements OnInit {
  public hierarchyList: any[];
  public hierarchyToBeDisplayed = {} as HierarchyEntity;

  constructor(private assetHierarchyUtil: AssetHierarchyUtil) {}

  ngOnInit(): void {
    this.hierarchyList =
      this.assetHierarchyUtil.prepareHierarchyList(hierarchyMock);

    this.hierarchyToBeDisplayed = this.assetHierarchyUtil.getHierarchyByNodeId(
      this.hierarchyList,
      'Subchild Node 1'
    );
  }
}
