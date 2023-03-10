import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterSidePanelComponent } from '../filter-side-panel/filter-side-panel.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  readonly FilterSidePanelComponent = FilterSidePanelComponent;
  @Input()
  json: any[] = [];

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  reset: EventEmitter<any> = new EventEmitter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.json && changes.json.currentValue) {
      this.json = changes.json.currentValue;
    }
  }

  ngOnInit(): void {}

  closeFilter() {
    this.close.emit();
  }

  applyFilter() {
    this.apply.emit(this.json);
  }
  resetFilter() {
    for (const item of this.json) {
      item.value = '';
    }
    this.reset.emit(this.json);
  }

  checkState() {
    let status = true;
    for (const item of this.json) {
      if (item.value) {
        status = false;
      }
    }
    return status;
  }

  dateRangeSelect(item: any) {
    const startDate = new Date(item.startDate).toISOString();
    const endDate = new Date(item.endDate).toISOString();
    item.value = [startDate, endDate];
  }
}
