import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HierarchyEntity } from 'src/app/interfaces';
import {
  AssetHierarchyUtil,
  findNodeByUid
} from 'src/app/shared/utils/assetHierarchyUtil';

@Component({
  selector: 'app-hierarchy-node',
  templateUrl: './hierarchy-node.component.html',
  styleUrls: ['./hierarchy-node.component.scss']
})
export class HierarchyNodeComponent implements OnInit {
  @Output() checkboxToggleHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() hierarchyToggle: EventEmitter<any> = new EventEmitter<any>();

  @Input() set nodeData(data: any) {
    this.masterData = data ? data : ({} as HierarchyEntity);
  }

  @Input() set isMasterChecked(isMasterCheckedData: any) {
    if (isMasterCheckedData.masterToggle) {
      this.masterData.isSelected = isMasterCheckedData.checked;
    }
  }

  @Input() set selectedList(data) {
    this.selectedHierarchyList = data;
  }

  @Input() set mode(modeType: string) {
    this.selectionMode = modeType;
  }

  @Input() set displayMode(type: boolean) {
    this.viewMode = type;
  }

  public selectionMode: string;
  public masterData: HierarchyEntity;
  public isParentCheckedData = {
    checked: false,
    masterToggle: true
  };
  public isChecked = false;
  public isTreeViewToggled = false;
  public viewMode = false;
  public isAlreadySelected = false;
  public selectedHierarchyList: HierarchyEntity[];

  constructor(private assetHierarchyUtil: AssetHierarchyUtil) {}

  ngOnInit(): void {
    const nodeRefInSelectedHierarchy = findNodeByUid(
      this.masterData.uid,
      this.selectedHierarchyList
    );

    if (Object.keys(nodeRefInSelectedHierarchy).length) {
      this.isAlreadySelected = true;
      this.masterData.isSelected = true;
      Object.assign(this.masterData, { id: nodeRefInSelectedHierarchy.id });
      this.checkboxToggleHandler.emit(this.masterData);
    }
  }

  nodeCheckboxToggled = (event: MatCheckboxChange | any) => {
    const { checked } = event;
    this.isParentCheckedData = {
      masterToggle: true,
      checked
    };
    this.checkboxToggleHandler.emit({
      ...this.masterData,
      isSelected: checked
    });
  };

  handleChildEntityToggle = (event) => {
    const { uid, isSelected } = event;
    const childIdx = this.masterData.children.findIndex(
      (child) => child.uid === uid
    );

    if (childIdx > -1) this.masterData.children[childIdx] = event;

    if (isSelected) {
      this.masterData.isSelected = isSelected;
      this.isParentCheckedData.masterToggle = false;
    }
    this.checkboxToggleHandler.emit(this.masterData);
  };

  hierarchyCount = (data) =>
    this.assetHierarchyUtil.getHierarchyCount([data]) - 1;

  isParentToggled = (event: MatCheckboxChange) => {
    const { checked } = event;
    // this.isParentCheckedData = {
    //   checked,
    //   masterToggle: true
    // };
  };
}
