import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DateSegmentService } from './date-segment.service';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-segment',
  templateUrl: './date-segment.component.html',
  styleUrls: ['./date-segment.component.css']
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
    const sDate = moment(start);
    let eDate;
    sDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    if (!end) {
      eDate = moment(start);
      eDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    } else {
      eDate = moment(end);
      eDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    }

    this.dateRange = {
      startDate: sDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate: eDate.format('YYYY-MM-DDTHH:mm:ss')
    };
    this.customText = `${this.datePipe.transform(
      `${sDate}`,
      'dd MMM YYYY',
      '',
      this.translateService.currentLang
    )}`;
    if (end)
      this.customText += `- ${this.datePipe.transform(
        `${eDate}`,
        'dd MMM YYYY',
        '',
        this.translateService.currentLang
      )}`;

    this.dateRangeEvent.emit(this.dateRange);
  }
}
