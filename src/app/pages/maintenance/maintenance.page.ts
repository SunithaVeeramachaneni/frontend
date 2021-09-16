import { Component, ViewChild } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { map, startWith, filter, tap, mergeMap, toArray, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { remove } from "lodash";
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { WorkCenter } from '../../interfaces/work-center';


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
  public assignIcon = "../../../assets/maintenance-icons/assignIcon.svg";
  public filterIcon = "../../../assets/maintenance-icons/filterIcon.svg";
  public filterArrowIcon = "../../../assets/maintenance-icons/filter-arrow-icon.svg";
  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  public showOverdue: string = 'Yes';
  public showOverdueList: string[] = ['Yes', 'No'];

  public priority: string[] = ['High', 'Medium'];
  public priorityList: string[] = ['High', 'Medium', 'Low'];

  public kitStatus: string[] = ['Kit Ready', 'Parts Available'];
  public kitStatusList: string[] = ['Kit Ready', 'Parts Available', 'Waiting On Parts'];

  public showOperationsList = {};

  hideList = true;
  showFilters = false;

  @ViewChild('operatorsList') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService,
    private spinner: NgxSpinnerService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this._maintenanceSvc.getAllWorkCenters().subscribe(resp => this.workCenterList = resp);
    this._maintenanceSvc.getTechnicians().subscribe(resp=> {
    this.technicians = resp;
    console.log("Technicians assiged as", resp)
      })
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.getWorkOrders();
  }

  getData = () =>{

  }

  getWorkOrders() {
    this.workOrderList$ = this._maintenanceSvc.getAllWorkOrders();
    this.updateWorkOrderList$ = this._maintenanceSvc.getServerSentEvent('/updateWorkOrders').pipe(startWith({ unassigned: [], assigned: [], inProgress: [], completed: [] }));
    this.combinedWorkOrderList$ = combineLatest([this.workOrderList$, this.updateWorkOrderList$]).pipe(
      map(([oldWorkOrders, newWorkOrders]) => {
        if (newWorkOrders) {
          for (let key in newWorkOrders) {
            oldWorkOrders[key] = [...newWorkOrders[key], ...oldWorkOrders[key]];
          }
        }
        return oldWorkOrders;
      })
    )
    console.log("hi")


    this.spinner.show();
    this.filteredWorkOrderList$ = combineLatest([this.combinedWorkOrderList$, this.filter$, this.selectDate$, this.overdueFilter$]).pipe(
      map(([workOrders, filterString, filterDate, overdue]) => {
        let filtered: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        for (let key in workOrders) {
          filtered[key] = workOrders[key].filter(workOrder => {
            return (workOrder.workOrderDesc.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
              workOrder.workOrderID.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) &&
              this.filterDate(workOrder.dueDate, filterDate) &&
              this.isOverdue(workOrder.dueDate, overdue)
          }
          )

        }
        this.spinner.hide();
        this.showOperationsList = { 'unassigned': new Array(filtered['unassigned'].length).fill(false), 'assigned': new Array(filtered['assigned'].length).fill(false), 'inProgress': new Array(filtered['inProgress'].length).fill(false), 'completed': new Array(filtered['completed'].length).fill(false) }
        return filtered;
      })
    );
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
    console.log("This . technicians is", this.technicians)
     const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        techniciansList: this.technicians,
        workCenterList: this.workCenterList,
        defaultWorkCenter: workOrder.workCenter,
        workOrder: workOrder
      }
    });

    modal.onDidDismiss()
      .then(async (data) => {
        if(data){
        const resp = data['data']; // Here's your selected user!
        const workOrderID = resp.workOrderID;
        console.log("Saving", resp)
        let res = await this._maintenanceSvc.setAssigneeAndWorkCenter(resp);
        res.subscribe(resp => {
          if(resp === true){
            this.getWorkOrders();
          }
          
        })
        }
    });
    return await modal.present();
  }
}


