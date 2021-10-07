import { Component, ViewChild } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { BehaviorSubject, combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { map, startWith, filter, tap, mergeMap, toArray, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { remove } from "lodash";
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { WorkCenter } from '../../interfaces/work-center';
import { DomSanitizer } from '@angular/platform-browser';
import { base64String } from './image'
import { CommonService } from '../../shared/services/common.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css'],
})
export class MaintenanceComponent {

  public workOrderList$: Observable<WorkOrders>;
  public updateWorkOrderList$: Observable<WorkOrders>;
  public combinedWorkOrderList$: Observable<WorkOrders>;
  public filteredWorkOrderList$: Observable<WorkOrders>;
  public filter: FormControl;
  public filter$: Observable<string>;
  public selectDate: FormControl;
  public selectDate$: Observable<string>;
  public overdueFilter: FormControl;
  public overdueFilter$: Observable<string>;
  public filterObj$: Observable<any>;
  public workOrders: Observable<WorkOrder[]>
  public workCenterList: WorkCenter[];
  public workCenterList$: Observable<WorkCenter[]>;
  public technicians: any = {};
  public technicians$: Observable<any> = new Observable;
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
  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  public showOverdue: string = '';
  public showOverdueList: string[] = ['Yes', 'No'];

  public priority: string[] = ['Very High'];
  public priorityList: string[] = ['Very High', 'High', 'Medium', 'Low'];

  public kitStatus: string[] = [];
  public kitStatusList: string[] = ['Kit Ready', 'Parts Available', 'Waiting On Parts'];

  public workCenter: string[] = [];
  public workCenterListDef: string[] = ['Mechanical', 'Electrical'];

  public assign: string[] = [];
  public assignList: string[] = ['Kerry Smith', 'Amy Butcher', 'Carlos Arnal', 'Steve Austin'];


  public showOperationsList = {};
  public base64Code: any;
  hideList = true;
  showFilters = false;

  @ViewChild('operatorsList') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService,
    private spinner: NgxSpinnerService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private _commonService: CommonService
  ) { }

  ngOnInit() {
    this._maintenanceSvc.getAllWorkCenters().subscribe(resp => this.workCenterList = resp);
    this._maintenanceSvc.getTechnicians().subscribe(resp => {
      this.technicians = resp;
    })
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.filterObj$ = this._commonService.commonFilterAction$
    this.getWorkOrders();

  }

  getData = () => {

  }

  getWorkOrders() {
    this.workOrderList$ = this._maintenanceSvc.getAllWorkOrders();
    let base64Image = 'data:image/jpeg;base64,' + base64String;
    this.base64Code = this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    this.updateWorkOrderList$ = this._maintenanceSvc.getServerSentEvent('/updateWorkOrders').pipe(startWith({ unassigned: [], assigned: [], inProgress: [], completed: [] }));
    this.combinedWorkOrderList$ = combineLatest([this.workOrderList$, this.updateWorkOrderList$]).pipe(
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

    this.spinner.show();
    this.filteredWorkOrderList$ = combineLatest([this.combinedWorkOrderList$, this.selectDate$, this.filterObj$]).pipe(
      map(([workOrders, filterDate, filterObj]) => {
        console.log("Worokorders are", workOrders)
        let filtered: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        for (let key in workOrders) {
          filtered[key] = workOrders[key].filter(workOrder => {
            return (
              workOrder.workOrderDesc.toLowerCase().indexOf(filterObj['search'] ? filterObj['search'].toLowerCase() : "") !== -1 ||
              workOrder.workOrderID.toLowerCase().indexOf(filterObj['search'] ? filterObj['search'].toLowerCase() : "") !== -1) &&
              this.filterDate(workOrder.dueDate, filterDate) &&
              this.isOverdue(workOrder.dueDate, filterObj.showOverdue) &&
              this.filterPriority(workOrder.priorityStatus, filterObj.priority)
          }
          )

        }
        this.spinner.hide();
        this.showOperationsList = { 'unassigned': new Array(filtered['unassigned'].length).fill(false), 'assigned': new Array(filtered['assigned'].length).fill(false), 'inProgress': new Array(filtered['inProgress'].length).fill(false), 'completed': new Array(filtered['completed'].length).fill(false) }
        return filtered;
      })
    );
  }

  public filterPriority = (status, priority) => {
    console.log(status)
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


  public filterDate(dueDate, filterDate) {
    if (filterDate === 'today')
      return this.isToday(dueDate)
    if (filterDate === 'month')
      return this.isThisMonth(dueDate)
    if (filterDate === 'week')
      return this.isThisWeek(dueDate)
    return true
  }

  isThisWeek(someDate) {
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();

    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    return someDate >= firstDayOfWeek && someDate <= lastDayOfWeek;
  }


  public isThisMonth = (someDate) => {
    const today = new Date();
    return someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  public isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
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

  public showOperations(status, index) {
    this.showOperationsList[`${status}`][index] = !this.showOperationsList[`${status}`][index];
  }

  async onAssignPress(workOrder: WorkOrder) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        techniciansList: this.technicians,
        workCenterList: this.workCenterList,
        defaultWorkCenter: workOrder.workCenter,
        workOrderID: workOrder.workOrderID
      }
    });

    modal.onDidDismiss()
      .then(async (data) => {
        if (data) {
          const resp = data['data']; // Here's your selected user!
          let res = await this._maintenanceSvc.setAssigneeAndWorkCenter(resp);
          res.subscribe(resp => {
            console.log("Resp from the PUT request is", res)
            if (resp === true) {
              console.log("Put succesful")
              this.getWorkOrders();
            }

          })
        }
      });
    return await modal.present();
  }
}


