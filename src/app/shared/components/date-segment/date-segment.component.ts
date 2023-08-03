import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DateSegmentService } from './date-segment.service';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { format } from 'date-fns';

@Component({
  selector: 'app-date-segment',
  templateUrl: './date-segment.component.html',
  styleUrls: ['./date-segment.component.scss']
})
export class DateSegmentComponent implements OnInit {
  @Output() dateRangeEvent = new EventEmitter<any>();
  public selectDate: string;
  startDate: any;
  endDate: any;
  dateRange: any;
  customText = 'Custom';

  constructor(
    private dateSegmentService: DateSegmentService,
    private dateAdapter: DateAdapter<Date>,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.selectDate = 'month';
    this.dateRangeEvent.emit(
      this.dateSegmentService.getStartAndEndDate(this.selectDate)
    );
    this.dateAdapter.setLocale(this.translateService.currentLang);
    this.translateService.store.onLangChange.subscribe((translate) => {
      this.dateAdapter.setLocale(translate.lang);
    });
  }

  dateChanged(event) {
    if (event.value !== 'custom') {
      this.selectDate = event.value;
      this.startDate = '';
      this.endDate = '';
      this.customText = 'Custom';
      this.dateRangeEvent.emit(
        this.dateSegmentService.getStartAndEndDate(this.selectDate)
      );
    }
  }

  appliedDateRange(start, end) {
    this.dateRange = {
      startDate: `${format(start, 'yyyy-MM-dd')}T00:00:00`,
      endDate: end
        ? `${format(end, 'yyyy-MM-dd')}T23:59:59`
        : `${format(start, 'yyyy-MM-dd')}T23:59:59`
    };
    this.customText = `${this.datePipe.transform(
      `${start}`,
      'dd MMM YYYY',
      '',
      this.translateService.currentLang
    )}`;
    if (end)
      this.customText += `- ${this.datePipe.transform(
        `${end}`,
        'dd MMM YYYY',
        '',
        this.translateService.currentLang
      )}`;

    this.dateRangeEvent.emit(this.dateRange);
  }
}
