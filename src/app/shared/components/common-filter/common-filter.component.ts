import { Component, OnInit ,Input} from '@angular/core';
import { Observable } from "rxjs";
import {CommonService}   from '../../services/common.service';
import { Technician } from '../../../interfaces/technicians';
import { DomSanitizer } from '@angular/platform-browser';
import { MaintenanceService } from '../../../pages/maintenance/maintenance.service';

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
  
  public searchValue="";
  public priority=[];
  public showOverdue="";
  public kitStatus=[];
  public workCenter=[];
  public assign=[];
  public assigneeList: any;
  public displayedAssigneeList: Observable<Technician>;


  constructor(private _commonService:CommonService,
              private _maintenanceSvc: MaintenanceService, 
              private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this._maintenanceSvc.getTechnicians().subscribe(resp => {
      this.assigneeList= resp;
    })
  }

  getImageSrc = (source: string) => {
    let base64Image='data:image/jpeg;base64,'+ source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

  onCenterChange = (event) => {
    let newValue = event.value;
    for(let i=0; i< newValue.length; i++) {
      this.displayedAssigneeList = this.assigneeList[newValue];
    }
  }

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
      search:newValue,
      priority:this.priority,
      showOverdue:this.showOverdue,
      kitStatus:this.kitStatus,
      workCenter:this.workCenter,
      assign:this.assign
    });
  }

}
