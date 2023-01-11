import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() questionForm;
  @Input() fieldTypes;
  tabs = [];
  selected = new FormControl(0);

  ngOnInit() {}

  addTab() {
    this.tabs.push(`Column${this.tabs.length + 1}`);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
