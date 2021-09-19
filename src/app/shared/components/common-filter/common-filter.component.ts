import { Component, OnInit ,Input, Output,EventEmitter} from '@angular/core';
import { of } from "rxjs";
import {CommonService}   from '../../services/common.service';
@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss'],
})
export class CommonFilterComponent implements OnInit {

  public filterIcon = "../../../assets/maintenance-icons/filterIcon.svg";


  @Input() showOverdueList;
  @Input() priorityList;
  @Input() kitStatusList;
  @Input() workCenterList;
  @Input() assignList;
  
  public searchValue="";
  public priority=[];
  public showOverdue="";
  public kitStatus=[];
  public workCenter=[];
  public assign=[];

  constructor(private _commonService:CommonService) { }
  ngOnInit() {}

  searchFilter() {
    this._commonService.searchFilter({
      search:this.searchValue,
      priority:this.priority,
      showOverdue:this.showOverdue,
      kitStatus:this.kitStatus,
      workCenter:this.workCenter,
      assign:this.assign
    });
  }

  searchOrder(newValue){
    this._commonService.searchFilter({
      search:newValue.target.value,
      priority:this.priority,
      showOverdue:this.showOverdue,
      kitStatus:this.kitStatus,
      workCenter:this.workCenter,
      assign:this.assign
    });
  }

}
