import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-hierarchy-node',
  templateUrl: './hierarchy-node.component.html',
  styleUrls: ['./hierarchy-node.component.scss']
})
export class HierarchyNodeComponent implements OnInit {
  @Output() checkboxToggleHandler: EventEmitter<any> = new EventEmitter<any>();

  @Input() set nodeData(data: any) {
    this.masterData = data ? data : ({} as any);
  }

  @Input() set isMasterChecked(isMasterCheckedData: any) {
    if (isMasterCheckedData.masterToggle) {
      this.isChecked = isMasterCheckedData.checked;
    }
  }
  public masterData: any;
  public isChecked = false;

  constructor() {}

  ngOnInit(): void {}

  clicked = (event: MatCheckboxChange) => {
    const { checked } = event;
    this.checkboxToggleHandler.emit({
      masterDataId: this.masterData.id,
      isChecked: checked
    });
  };
}
