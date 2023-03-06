import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hierarchy-assets-list',
  templateUrl: './hierarchy-assets-list.component.html',
  styleUrls: ['./hierarchy-assets-list.component.scss']
})
export class HierarchyAssetsListComponent implements OnInit {
  @Input() set hierarchyData(data: any) {
    this.hierarchyList = data ? data : [];
  }

  public hierarchyList = [];

  constructor() {}

  ngOnInit(): void {}

  handle = () => {};
}
