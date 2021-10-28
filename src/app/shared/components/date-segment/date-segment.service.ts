import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateSegmentService {

  constructor() { }

  getStartAndEndDate=(date)=>{
    console.log(date);
    if(date === 'today')
    return this.todayStartAndEndDate();
    if(date === 'month')
    return this.monthStartAndEndDate()
    if(date === 'week')
    return this.weekStartAndEndDate()
  }

  todayStartAndEndDate=() =>{
    var sDate = moment().utcOffset(0);
    sDate.set({hour:0,minute:0,second:0,millisecond:0})
    var eDate = moment().utcOffset(0);
    eDate.set({hour:23,minute:59,second:59,millisecond:0})
    return {
      startDate:sDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate:eDate.format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  weekStartAndEndDate=() =>{
    var sDate = moment().startOf('week').utcOffset(0);
    sDate.set({hour:0,minute:0,second:0,millisecond:0})

    var eDate = moment().endOf('week').utcOffset(0);
    eDate.set({hour:23,minute:59,second:59,millisecond:0})
    return {
      startDate:sDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate:eDate.format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  monthStartAndEndDate=() =>{
    var sDate = moment().startOf('month').utcOffset(0);
    sDate.set({hour:0,minute:0,second:0,millisecond:0})

    var eDate = moment().endOf('month').utcOffset(0);
    eDate.set({hour:23,minute:59,second:59,millisecond:0})

    return {
      startDate:sDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate:eDate.format('YYYY-MM-DDTHH:mm:ss')
    };
  }


}
