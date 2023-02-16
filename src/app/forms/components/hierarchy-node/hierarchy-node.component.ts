import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HierarchyEntity } from 'src/app/interfaces';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';

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

  @Input() set mode(modeType: string) {
    this.selectionMode = modeType;
  }

  public selectionMode: string;
  public masterData: HierarchyEntity;
  public isChecked = false;
  public isTreeViewToggled = false;

  constructor(private assetHierarchyUtil: AssetHierarchyUtil) {}

  ngOnInit(): void {}

  nodeCheckboxToggled = (event: MatCheckboxChange) => {
    const { checked } = event;
    this.checkboxToggleHandler.emit({
      ...this.masterData,
      isSelected: checked
    });
  };

  handleChildEntityToggle = (event) => {
    const { id } = event;
    const childIdx = this.masterData.children.findIndex(
      (child) => child.id === id
    );
    if (childIdx > -1) this.masterData.children[childIdx] = event;
    this.checkboxToggleHandler.emit(this.masterData);
  };

  hierarchyCount = (data) => this.assetHierarchyUtil.getHierarchyCount([data]);
}
