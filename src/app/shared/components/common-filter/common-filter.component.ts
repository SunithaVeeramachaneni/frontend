import { Component, OnInit ,Input} from '@angular/core';
import { uniqBy } from 'lodash';
import {CommonFilterService}  from './common-filter.service'
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
  @Input() technicians;
  
  public searchValue="";
  public priority=[];
  public showOverdue="";
  public kitStatus=[];
  public workCenter=[];
  public assign=[];
  public displayedAssigneeList: any[];



  constructor(private _commonFilterService:CommonFilterService,
              private _maintenanceSvc: MaintenanceService, 
              private sanitizer:DomSanitizer) { }

  ngOnInit() {}

  getImageSrc = (source: string) => {
    let base64Image='data:image/jpeg;base64,'+ source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

  onCenterChange = (event) => {
    let workCenters = event.value;
    this.displayedAssigneeList = []
    workCenters.forEach(workCenter =>{
      this.displayedAssigneeList = this.arrayUnion(this.technicians[workCenter.workCenterKey], this.displayedAssigneeList, 'personName')
    });
  }

  searchFilter() {
    this._commonFilterService.searchFilter({
      search:this.searchValue,
      priority:this.priority,
      showOverdue:this.showOverdue,
      kitStatus:this.kitStatus,
      workCenter:this.workCenter,
      assign:this.assign
    });
  }

  searchOrder(newValue){
    this._commonFilterService.searchFilter({
      search:newValue,
      priority:this.priority,
      showOverdue:this.showOverdue,
      kitStatus:this.kitStatus,
      workCenter:this.workCenter,
      assign:this.assign
    });
  }

  arrayUnion = (arr1, arr2, identifier) => {
    const array = [...arr1, ...arr2]
    return uniqBy(array, identifier)
   }

}
