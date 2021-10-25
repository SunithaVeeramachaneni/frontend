import { Component, Input, OnInit , ViewChild, ElementRef} from '@angular/core';
import {CommonService}   from '../../services/common.service';

@Component({
  selector: 'app-date-segment',
  templateUrl: './date-segment.component.html',
  styleUrls: ['./date-segment.component.css']
})
export class DateSegmentComponent implements OnInit {
  @Input() selectDate$;
  
  @ViewChild('openbtn') openbtn: ElementRef;
  startDate;
  endDate;
  dateRange;

  constructor(private _commonService:CommonService){}

  ngOnInit() {
    this.selectDate$ = this._commonService.selectedDateAction$;
    console.log(this.selectDate$);
  }

  dateChanged(event){
    if(event.target.value !== 'custom') {
      this._commonService.selectDate(event.target.value)
    }
    else {
      this.openbtn?.nativeElement.click();
    }
  }

  appliedDateRange(start, end) {
    let startDate =  new Date(start).toLocaleDateString();
    let endDate = new Date(end).toLocaleDateString();
    
    console.log(startDate, endDate);
    this.dateRange = startDate + '-' + endDate;
    
  //   let selectedMembers:any[] = [];
  //   if(this.allWorkOrders.inProgress.length !== null) {
  //     for(let i=0; i< this.allWorkOrders.inProgress.length; i++) {
  //       let dd = new Date(this.allWorkOrders.inProgress[i].dueDate).toLocaleDateString();
  //       console.log(dd);
  //       if(dd >= start && dd <= end) {
  //         selectedMembers.push(this.allWorkOrders.inProgress[i]);
  //       }
  //     }
  //   }
  //   console.log(selectedMembers);
  }

}