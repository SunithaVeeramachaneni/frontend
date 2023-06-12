import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FilterSidePanelComponent } from '../filter-side-panel/filter-side-panel.component';
import { DatePipeDateAdapter } from '../../utils/DatePipeDateAdapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: DatePipeDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      // Pass any format string you would pass to DatePipe
      useValue: DatePipeDateAdapter.createCustomMatDateFormats('dd/MM/yyyy')
    }
  ]
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
      if (item?.hasOwnProperty('startDate')) {
        item.startDate = '';
      }
      if (item?.hasOwnProperty('endDate')) {
        item.endDate = '';
      }
      if (item.itemValue) {
        item.itemValue = '';
      }
    }
    this.reset.emit(this.json);
  }

  checkState() {
    let status = true;
    for (const item of this.json) {
      if (item.value || item.itemValue) {
        if (typeof item.value === 'string') status = false;
        else if (typeof item.value === 'object' && item.value.length !== 0)
          status = false;
      }
    }
    return status;
  }

  dateRangeSelect(item: any) {
    if (item.startDate && item.endDate) {
      const startDate = new Date(item.startDate).toISOString();
      const endDate = new Date(item.endDate).toISOString();
      item.value = [startDate, endDate];
    }
  }

  closeSelect(select: MatSelect): void {
    select.close();
  }
}
