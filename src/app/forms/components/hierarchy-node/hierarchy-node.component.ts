import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HierarchyEntity } from 'src/app/interfaces';
import {
  AssetHierarchyUtil,
  findNodeByUid
} from 'src/app/shared/utils/assetHierarchyUtil';

@Component({
  selector: 'app-hierarchy-node',
  templateUrl: './hierarchy-node.component.html',
  styleUrls: ['./hierarchy-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyNodeComponent implements OnInit {
  @Output() checkboxToggleHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() hierarchyToggle: EventEmitter<any> = new EventEmitter<any>();

  @Input() set nodeData(data: any) {
    this.masterData = data ? data : ({} as HierarchyEntity);
  }

  @Input() set isMasterChecked(isMasterCheckedData: any) {
    if (
      !Object.keys(this.nodeRefInSelectedHierarchy).length &&
      isMasterCheckedData.masterToggle
    ) {
      this.masterData.isSelected = isMasterCheckedData.checked;
    }
    this.isParentCheckedData = isMasterCheckedData;
    this.allSelected = isMasterCheckedData.checked;
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
  public selectedHierarchyList: HierarchyEntity[] = [];
  public allSelected = false;
  public selectedCount = 0;
  private nodeRefInSelectedHierarchy = {} as HierarchyEntity;

  constructor(private assetHierarchyUtil: AssetHierarchyUtil) {}

  ngOnInit(): void {
    this.nodeRefInSelectedHierarchy = findNodeByUid(
      this.masterData.uid,
      this.selectedHierarchyList
    );
    if (Object.keys(this.nodeRefInSelectedHierarchy).length) {
      this.masterData.isSelected = true;
      this.isAlreadySelected = true;

      if (this.selectionMode === 'selectAssets') {
        const selectedChildrenFlatList =
          this.assetHierarchyUtil.convertHierarchyToFlatList(
            this.nodeRefInSelectedHierarchy.children,
            0
          );

        if (selectedChildrenFlatList.length === this.hierarchyCount())
          this.isAllSelectedToggled({ checked: true });
        this.masterData.children =
          this.assetHierarchyUtil.togglePreviouslySelectedChildren(
            this.masterData.children,
            selectedChildrenFlatList
          );

        this.selectedCount = this.assetHierarchyUtil.getSelectedCount(
          this.masterData.children
        );
      }

      Object.assign(this.masterData, {
        id: this.nodeRefInSelectedHierarchy.id
      });
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

    this.selectedCount = this.assetHierarchyUtil.getSelectedCount(
      this.masterData.children
    );

    if (this.selectedCount === this.hierarchyCount()) this.allSelected = true;
    else this.allSelected = false;

    this.checkboxToggleHandler.emit(this.masterData);
  };

  hierarchyCount = () =>
    this.assetHierarchyUtil.getHierarchyCount([this.masterData]) - 1;

  isAllSelectedToggled = (event: MatCheckboxChange | any) => {
    const { checked } = event;
    this.allSelected = checked;
    this.masterData.isSelected = checked;

    if (checked) {
      this.masterData.children =
        this.assetHierarchyUtil.toggleAllChildrenSelection(
          checked,
          this.masterData.children
        );
      this.selectedCount = this.hierarchyCount();
    } else {
      const selectedChildrenFlatList =
        this.assetHierarchyUtil.convertHierarchyToFlatList(
          this.nodeRefInSelectedHierarchy.children,
          0
        );

      this.masterData.children =
        this.assetHierarchyUtil.togglePreviouslySelectedChildren(
          this.masterData.children,
          selectedChildrenFlatList
        );
      this.selectedCount = this.assetHierarchyUtil.getSelectedCount(
        this.masterData.children
      );
    }

    this.checkboxToggleHandler.emit(this.masterData);

    this.isParentCheckedData = {
      checked,
      masterToggle: true
    };
  };

  multipleSelected = () => {
    if (this.selectedCount > 0 && !this.allSelected) return true;
    return false;
  };
}
