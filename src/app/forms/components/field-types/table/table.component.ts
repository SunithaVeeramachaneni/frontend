import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
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
