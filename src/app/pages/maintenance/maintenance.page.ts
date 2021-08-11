import { Component, ViewChild } from '@angular/core';
import { MaintenanceService } from './maintenance.service';

import { IonSelect } from '@ionic/angular';
import * as data from './maintenance.json';
import { WorkOrder, WorkOrders } from '../../interfaces/work-order';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css'],
})
export class MaintenanceComponent {



  public testData: any[] = [];

  public workOrders: WorkOrders = {
    unassigned: [],
    assigned: [],
    inProgress: [],
    completed: []
  };

  public testData1 = [];

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

  private statusMap = {
    "CRTD": "assigned",
    "REL": "inProgress",
    "TECO": "completed"
  }

  hideList = true;

  @ViewChild('select1') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService
  ) { }

  ngOnInit() {
    this.testData = data.data;
    this.getWorkOrders();
    // this.getAllWorkOrders();
  }

  formatTime = (inputHours) => { //move to utils directory
    const minutes = Math.floor(inputHours % 1 * 60);
    const hours = Math.floor(inputHours);
    if (minutes !== 0)
      return `${hours} hrs ${minutes} min`
    else
      return `${hours} hrs`
  }

  getEstimatedTime = (workOrder) => {
    let time =0
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      time += operation.ARBEI
    });
    return time;
  }

  getActualTime = (workOrder) => {
    let time =0
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      time += operation.ISMNW
    });
    return time;
  }

  getProgress = (workOrder) => {
    let totalNoOfOperations = 0;
    let noOfCompletedOperations = 0;
    workOrder.WorkOrderOperationSet.results.forEach(operation => {
      totalNoOfOperations +=1;
      if (operation.STATUS === 'cnf')
        noOfCompletedOperations += 1;
    });
    return [noOfCompletedOperations, totalNoOfOperations]
  }

  getWorkOrders() {
    this._maintenanceSvc.getAllWorkOrders().subscribe((resp) => {
      console.log("Resp is", resp)
      if (resp && resp.length > 0) {
        const workOrderList = resp;
        workOrderList.forEach((workOrder) => {
          let order: WorkOrder = {
            status: workOrder['IPHAS'],
            personDetails: workOrder['PARNR'],
            priorityNumber: workOrder['PRIOK'],
            priorityStatus: workOrder['PRIOKX'],
            colour: workOrder['COLOUR'],
            workOrderID: workOrder['AUFNR'],
            workOrderDesc: workOrder['AUFTEXT'],
            equipmentID: workOrder['ARBPL'],
            equipmentName: workOrder['KTEXT'],
            kitStatus: workOrder['TXT04'],
            estimatedTime: this.formatTime(this.getEstimatedTime(workOrder)),
            actualTime: this.formatTime(this.getActualTime(workOrder)),
            progress: this.getProgress(workOrder)
          }
          if(!order.personDetails) this.workOrders.unassigned.push(order)
          else {
            let status = this.statusMap[`${order.status}`]
            this.workOrders[`${status}`].push(order)
          }

        }
        )
        }
      })
    }

  public openSelect() {
    this.selectRef.open()
  }

  public optionsFn(event, index) {
    console.log(event.target.value)
    console.log(index)
    if (event.target.value) {
      this.selectedUser = event.target.value;
      this.testData1.push(this.testData.splice(index, 1));
      console.log(this.testData);
      console.log(this.testData1);
    }
  }


}

