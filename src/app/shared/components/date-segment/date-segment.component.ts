import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { DateSegmentService } from './date-segment.service';
import * as moment from 'moment';


@Component({
  selector: 'app-date-segment',
  templateUrl: './date-segment.component.html',
  styleUrls: ['./date-segment.component.css']
})
export class DateSegmentComponent implements OnInit {

  public selectDate:string;
  @Output() dateRangeEvent = new EventEmitter<any>();
  startDate;
  endDate;
  dateRange;
  customText:string = "Custom";

  constructor(private _dateSegmentService:DateSegmentService){}

  ngOnInit() {
    this.selectDate = "month"
    this.dateRangeEvent.emit(this._dateSegmentService.getStartAndEndDate(this.selectDate))
  }

  dateChanged(event){
    if(event.target.value !== 'custom') {
      this.selectDate = event.target.value;
      this.dateRangeEvent.emit(this._dateSegmentService.getStartAndEndDate(this.selectDate))
    }
  }

  appliedDateRange(start, end) {
    var sDate = moment(start);
    sDate.set({hour:0,minute:0,second:0,millisecond:0})

    var eDate = moment(end);
    eDate.set({hour:23,minute:59,second:59,millisecond:0})

    this.dateRange = {
      startDate:sDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate:eDate.format('YYYY-MM-DDTHH:mm:ss')
    };
    this.customText = sDate.format('YYYY-MM-DD') + ' / ' + eDate.format('YYYY-MM-DD');
    
    this.dateRangeEvent.emit(this.dateRange)
  }

}