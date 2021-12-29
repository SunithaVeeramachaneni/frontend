import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { BehaviorSubject, combineLatest, forkJoin, from, Observable, of, Subscription } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { map, startWith, filter, tap, mergeMap, toArray, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { remove } from "lodash";
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { WorkCenter } from '../../interfaces/work-center';
import { DomSanitizer } from '@angular/platform-browser';
import { base64String } from './image'
import { DateSegmentService } from '../../shared/components/date-segment/date-segment.service';
import * as moment from 'moment';
import { CommonFilterService } from '../../shared/components/common-filter/common-filter.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent {

  public workOrderList$: Observable<WorkOrders>;
  public updateWorkOrderList$: Observable<WorkOrders>;
  public combinedWorkOrderList$: Observable<WorkOrders>;
  public combinedWorkOrderList1$: Observable<WorkOrders>;
  public filteredWorkOrderList$: Observable<WorkOrders>;
  public allWorkOrders: WorkOrders;
  public filter: FormControl;
  public filter$: Observable<string>;
  public selectDate$: Observable<string>;
  public putWorkOrder$: BehaviorSubject<WorkOrders> = new BehaviorSubject({ unassigned: [], assigned: [], inProgress: [], completed: [] })
  public overdueFilter: FormControl;
  public overdueFilter$: Observable<string>;
  public filterObj$: Observable<any>;
  public workOrders: Observable<WorkOrder[]>
  public workCenterList: WorkCenter[];
  public workCenterList$: Observable<WorkCenter[]>;
  public technicians: any = {};
  public technicians$: Observable<any> = new Observable;
  public dateRange$: BehaviorSubject<any>;
  public techniciansDisplayList$
  public selectedUser;
  headerTitle = "Maintenance Control Center";
  public newWorkOrderIcon = "../../../assets/maintenance-icons/new-workorderIcon.svg";
  public dataIcon = "../../../assets/maintenance-icons/dataIcon.svg";
  public dateIcon = "../../../assets/maintenance-icons/dateIcon.svg";
  public timeIcon = "../../../assets/maintenance-icons/timeIcon.svg";
  public operationsIcon = "../../../assets/maintenance-icons/operationsIcon.svg";
  public assignIcon = "../../../assets/maintenance-icons/assignIcon.svg";
  public filterIcon = "../../../assets/maintenance-icons/filterIcon.svg";
  public filterArrowIcon = "../../../assets/maintenance-icons/filter-arrow-icon.svg";

  public showOverdue: string = '';
  public showOverdueList: string[] = ['Yes', 'No'];

  public priority: string[] = ['Very High'];
  public priorityList: string[] = ['Very High', 'High', 'Medium', 'Low'];

  public kitStatus: string[] = [];
  public kitStatusList: string[] = ['Kit Ready', 'Parts Available', 'Waiting On Parts'];

  public workCenter: string[] = [];

  public assign: string[] = [];


  public showOperationsList = {};
  public base64Code: any;
  private workCenterSubscription: Subscription
  private technicianSubscription: Subscription
  hideList = true;
  showFilters = false;

  @ViewChild('operatorsList') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService,
    private spinner: NgxSpinnerService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private _commonFilterService: CommonFilterService,
    private _dateSegmentService: DateSegmentService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._commonFilterService.clearFilter();
    this.dateRange$= new BehaviorSubject(this._dateSegmentService.getStartAndEndDate("month"));
    this.workCenterSubscription = this._maintenanceSvc.getAllWorkCenters().subscribe(resp => this.workCenterList = resp);
    this.technicianSubscription = this._maintenanceSvc.getTechnicians().subscribe(resp => {
      this.technicians = resp;
    })
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.filterObj$ = this._commonFilterService.commonFilterAction$;
    this.getWorkOrders();

  }

  ngOnDestroy(){
    this.technicianSubscription.unsubscribe()
    this.workCenterSubscription.unsubscribe()
    this._maintenanceSvc.closeEventSource();
  }

  getImageSrc = (source: string) => {
    let base64Image='data:image/jpeg;base64,'+ source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

  dateRangeEventHandler($event:any) {
    this.dateRange$.next($event);
  }

  applyFilters(workOrders){
    console.time('filter');
    let _workOrders = {...workOrders};
    _workOrders = [..._workOrders.unassigned, ..._workOrders.assigned, ..._workOrders.inProgress, ..._workOrders.completed];
    
    let filtered: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
    let filterObj:any; 
    let filterDate:any;
    this.filterObj$.subscribe(val=> filterObj = val);
    this.dateRange$.subscribe(val=> filterDate = val);

    _workOrders.forEach(workOrder=>{
      if((workOrder.workOrderDesc.toLowerCase().indexOf(filterObj['search'] ? filterObj['search'].toLowerCase() : "") !== -1 ||
      workOrder.workOrderID.toLowerCase().indexOf(filterObj['search'] ? filterObj['search'].toLowerCase() : "") !== -1) &&
      this.filterDate(workOrder.dueDate, filterDate) &&
      this.isOverdue(workOrder.dueDate, filterObj.showOverdue) &&
      this.filterPriority(workOrder.priorityStatus,filterObj.priority) &&
      this.filterWorkCenter(workOrder.workCenter,filterObj.workCenter) &&
      this.filterAssignee(workOrder.technician[0],filterObj.assign)&&
      this.filterKitStatus(workOrder.kitStatus, filterObj.kitStatus)){
        filtered[workOrder.status].push(workOrder);
      }
    });
    return filtered;
  }

  getWorkOrders() {
    this.spinner.show();
    this._maintenanceSvc.getAllWorkOrders().subscribe(res => {
      this.allWorkOrders = this.applyFilters(res);
      this.cd.markForCheck();
      this.spinner.hide();
    });
  }

  combineWorkOrders = (oldWorkOrders$: Observable<WorkOrders>, newWorkOrders$: Observable<WorkOrders>): Observable<WorkOrders> =>{
    return combineLatest([oldWorkOrders$, newWorkOrders$]).pipe(
      map(([oldWorkOrders, newWorkOrders]) => {
        if (newWorkOrders) {
          for (let key in newWorkOrders) {
            if (newWorkOrders[key])
              newWorkOrders[key].forEach(workOrder => {
                let id = workOrder.workOrderID;
                for (let key2 in oldWorkOrders) {
                  oldWorkOrders[key2] = oldWorkOrders[key2].filter(oldWorkOrder => {
                    return !(oldWorkOrder.workOrderID === id)})
                }
              });
            oldWorkOrders[key] = [...newWorkOrders[key], ...oldWorkOrders[key]];
          }
        }
        return oldWorkOrders;
      })
    )
  }

  public filterPriority = (status, priority) => {
    if (priority === null || priority.length == 0) {
      return true;
    }
    else {
      for (let i = 0; i < priority.length; i++) {
        if (priority[i] === status)
          return true;
      }
      return false;
    }
  }

  public filterKitStatus = (workOrderKitStatus, kitStatus) => {
    if (kitStatus === null || kitStatus.length == 0) {
      return true;
    }
    else {
      for (let i = 0; i < kitStatus.length; i++) {
        if (kitStatus[i] === workOrderKitStatus)
          return true;
      }
      return false;
    }
  }

  filterWorkCenter =(workCenter,filter)=>{
    if(filter===null || filter.length==0){
      return true;
    }
    else {
      for(let i=0;i< filter.length;i++) {
        if(filter[i].workCenterKey == workCenter) {
          return true;
        }  
      }
      return false;
    }
  }

  filterAssignee =(technician, assignee)=>{
    if(assignee===null || assignee.length==0){
      return true;
    }
    else {
      for(let i=0;i< assignee.length;i++) {
        if(technician && assignee[i].personName == technician.personName) {
          return true;
        }  
      }
      return false;
    }
  }

  public filterDate(dueDate, filterDate) {
    var sDate = moment(dueDate);
    sDate.set({hour:0,minute:0,second:0,millisecond:0})
    let date = sDate.format('YYYY-MM-DDTHH:mm:ss');
    return date >= filterDate.startDate && date <= filterDate.endDate;
  }


  public isOverdue = (dueDate, overdue) => {
    if (overdue !== 'No') return true;
    else if (overdue === 'No') {
      const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
      let startOfDay = Math.floor(Date.now() / interval) * interval;
      let endOfDay = startOfDay + interval - 1; // 23:59:59:9999
      if (dueDate.getTime() < startOfDay) {
      }
      return dueDate >= startOfDay;
    }
  }

  public myFunction() {
    this.showFilters = !this.showFilters;
  }

  public optionsFn(event, index) {
    if (event.target.value) {
      this.selectedUser = event.target.value;
    }
  }

  public showOperations(woID) {
    this.showOperationsList[`${woID}`] = !this.showOperationsList[`${woID}`];
  }

  async onAssignPress(workOrder: WorkOrder) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        techniciansList: this.technicians,
        workCenterList: this.workCenterList,
        defaultWorkCenter: workOrder.workCenter,
        workOrderID: workOrder.workOrderID,
        priorityNumber: workOrder.priorityNumber,
        priorityStatus: workOrder.priorityStatus
      }
    });

    modal.onDidDismiss()
      .then(async (data) => {
        if (data.data) {
          this.spinner.show();
          const resp = data['data']; // Here's your selected user!
          const workOrderID = resp.workOrderID
          let res = await this._maintenanceSvc.setAssigneeAndWorkCenter(resp);
          res.subscribe(async response => {
            if (response === true) {
              console.log("Put succesful")
              let workOrder$ = await this._maintenanceSvc.getWorkOrderByID(workOrderID);
              workOrder$.subscribe(workOrder => this.putWorkOrder$.next(workOrder))
              // this.spinner.hide();
            } else if (Object.keys(response).length === 0) {
              this.spinner.hide();
            }

          })
        }
      });
    return await modal.present();
  }
}


