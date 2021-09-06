import { Component, ViewChild } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { combineLatest, Observable } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { map, startWith, filter, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


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

  public workCenter: string[] = ['Mechanical'];
  public workCenterList: string[] = ['Mechanical', 'Medium', 'Low'];

  public assign: string[] = ['Kerry Smith'];
  public assignList: string[] = ['Kerry Smith', 'Amy Butcher', 'Carlos Arnal', 'Steve Austin'];
 public showOperationsList = {};

  hideList = true;
  showFilters = false;

  @ViewChild('operatorsList') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    console.log("Page init")
    this.getWorkOrders();
  }

  getWorkOrders() {
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.overdueFilter = new FormControl('');
    this.overdueFilter$ = this.overdueFilter.valueChanges.pipe(startWith(''));
    this.workOrderList$ = this._maintenanceSvc.getAllWorkOrders();
    this.updateWorkOrderList$ = this._maintenanceSvc.getServerSentEvent('/updateWorkOrders').pipe(startWith({ unassigned: [], assigned: [], inProgress: [], completed: [] }));
    this.combinedWorkOrderList$ = combineLatest([this.workOrderList$, this.updateWorkOrderList$]).pipe(
      map(([oldWorkOrders, newWorkOrders]) => {
        console.log("Inside the mpa")
        if (newWorkOrders) {
          console.log("Entered this", newWorkOrders)
          oldWorkOrders['unassigned'] = [...newWorkOrders['unassigned'], ...oldWorkOrders['unassigned']];
          oldWorkOrders['assigned'] = [...newWorkOrders['assigned'], ...oldWorkOrders['assigned']];
          oldWorkOrders['inProgress'] = [...newWorkOrders['inProgress'], ...oldWorkOrders['inProgress']];
          oldWorkOrders['completed'] = [...newWorkOrders['completed'], ...oldWorkOrders['completed']];
        }
        return oldWorkOrders;
      })
    )
    this.spinner.show();
    this.filteredWorkOrderList$ = combineLatest([this.combinedWorkOrderList$, this.filter$, this.selectDate$, this.overdueFilter$]).pipe(
      map(([workOrders, filterString, filterDate, overdue]) => {
        console.log("This is also being called");
        let filtered: WorkOrders = { unassigned: [], assigned: [], inProgress: [], completed: [] };
        for (let key in workOrders)
          filtered[key] = workOrders[key].filter(workOrder =>
            // (
              // workOrder.workOrderDesc.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
              // workOrder.workOrderID.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) &&
            
            this.filterDate(workOrder.dueDate, filterDate) &&
            this.isOverdue(workOrder.dueDate, overdue)
          )
        this.spinner.hide();
        this.showOperationsList = { 'unassigned': new Array(filtered['unassigned'].length).fill(false), 'assigned': new Array(filtered['assigned'].length).fill(false), 'inProgress': new Array(filtered['inProgress'].length).fill(false), 'completed': new Array(filtered['completed'].length).fill(false) }      
        console.log(filtered)      
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
    if(overdue !== 'No') return true;
    else if(overdue === 'No'){ 
    console.log("Due date", dueDate);
    const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    let startOfDay = Math.floor(Date.now() / interval) * interval;
    let endOfDay = startOfDay + interval - 1; // 23:59:59:9999
    if(dueDate.getTime() < startOfDay){
      console.log("Due date", parseInt(dueDate.getTime()), " endOfDay", endOfDay);
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
    console.log("Status us", status);
    console.log("Index is", index);
    this.showOperationsList[`${status}`][index] = !this.showOperationsList[`${status}`][index];
  }
}

