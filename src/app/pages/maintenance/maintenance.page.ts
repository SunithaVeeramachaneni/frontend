import { Component, ViewChild } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';
import { combineLatest, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, filter, tap } from 'rxjs/operators';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css'],
})
export class MaintenanceComponent {


  public workOrderList$: Observable<WorkOrders>;
  public filteredWorkOrderList$: Observable<WorkOrders>;
  public filter: FormControl;
  public filter$: Observable<string>;
  public selectDate: FormControl;
  public selectDate$: Observable<string>;

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

  hideList = true;

  @ViewChild('select1') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService
  ) { }

  ngOnInit() {
    this.getWorkOrders();
  }

  getWorkOrders() {
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.workOrderList$ = this._maintenanceSvc.getAllWorkOrders();
    this.filteredWorkOrderList$ = combineLatest([this.workOrderList$, this.filter$, this.selectDate$]).pipe(
      map(([workOrders, filterString, filterDate]) => {
        let filtered: WorkOrders = {unassigned:[], assigned:[], inProgress:[], completed:[]};
        for (let key in workOrders)
          filtered[key] = workOrders[key].filter(workOrder =>
            workOrder.workOrderDesc.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 &&
            this.filterDate(workOrder.dueDate, filterDate)
            ) 
        return filtered;
      })
    );
  }

  public filterDate(dueDate, filterDate){
    if(filterDate === 'today')
    return this.isToday(dueDate)
    if(filterDate === 'month')
    return this.isThisMonth(dueDate)
    if(filterDate === 'week')
    return this.isThisWeek(dueDate)
  }

  isThisWeek(someDate) {
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();
  
    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
  
    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  
    // if date is equal or within the first and last dates of the week
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

  public optionsFn(event, index) {
    if (event.target.value) {
      this.selectedUser = event.target.value;
<<<<<<< HEAD
      this.testData1.push(this.testData.splice(index, 1));
=======
>>>>>>> 6f790b73041a3e4d6bd90784779f785dd3a9b041
    }
  }


}

