import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { HierarchyEntity } from 'src/app/interfaces';

@Component({
  selector: 'app-hierarchy-locations-list',
  templateUrl: './hierarchy-locations-list.component.html',
  styleUrls: ['./hierarchy-locations-list.component.scss']
})
export class HierarchyLocationsListComponent implements OnInit {
  @Output() handleLocationHierarchy: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() set locationsData(data: HierarchyEntity[]) {
    this.allItems = data ? data : ([] as HierarchyEntity[]);
  }
  allLocations: HierarchyEntity[];
  public isMasterChecked: boolean;
  public isMasterCheckedData: any = {
    checked: false,
    masterToggle: false
  };
  public selectedItems = [];
  private allItems = [];
  constructor(
    private dialogRef: MatDialogRef<HierarchyLocationsListComponent>
  ) {}

  ngOnInit(): void {
    this.isMasterChecked = false;
  }

  handleNodeToggle = (event: any) => {
    const { id, isSelected } = event;
    if (isSelected) this.selectedItems = [...this.selectedItems, event];
    else
      this.selectedItems = this.selectedItems.filter((item) => item.id !== id);

    this.isMasterChecked = this.selectedItems.length === this.allItems.length;

    this.isMasterCheckedData = {
      checked: this.isMasterChecked,
      masterToggle: false
    };
  };

  handleMasterToggle = (event: MatCheckboxChange) => {
    const { checked } = event;
    this.isMasterCheckedData = {
      checked,
      masterToggle: true
    };
  };

  cancel = () => {
    this.dialogRef.close();
  };

  submitSelectedLocations = () => {
    this.handleLocationHierarchy.emit(this.selectedItems);
  };
}
