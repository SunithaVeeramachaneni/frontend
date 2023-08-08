/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-output-native */
/* eslint-disable @typescript-eslint/member-ordering */
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
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatOption
} from '@angular/material/core';
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
      let sOffset = new Date(item.startDate).getTimezoneOffset() * 60 * 1000;
      let eOffset = new Date(item.endDate).getTimezoneOffset() * 60 * 1000;
      sOffset > 0 ? (sOffset = -sOffset) : (sOffset = Math.abs(sOffset));
      eOffset > 0 ? (eOffset = -eOffset) : (eOffset = Math.abs(eOffset));
      const startDate = new Date(
        new Date(item.startDate).getTime() + sOffset
      ).toISOString();
      const endDate = new Date(
        new Date(item.endDate).getTime() + eOffset
      ).toISOString();
      item.value = [startDate, endDate];
    } else {
      item.value = [];
    }
  }

  closeSelect(select: MatSelect): void {
    select.openedChange.subscribe((isOpened: boolean) => {
      if (
        !isOpened &&
        (select.value === null || this.isOptionArrayEmpty(select.value))
      ) {
        this.resetSelector();
      }
    });
    select.close();
  }

  resetSelector(): void {
    for (const item of this.json) {
      if (item.itemValue) {
        item.itemValue = '';
      }
    }
    this.reset.emit(this.json);
  }

  isOptionArrayEmpty(options: MatOption[] | any[]): boolean {
    return Array.isArray(options) && options.length === 0;
  }
}
