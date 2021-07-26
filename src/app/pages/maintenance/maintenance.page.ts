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
    unassigned:[],
    assigned:[],
    inProgress:[],
    completed:[]
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

  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  private statusMap = {
    "CRTD": "unassigned",
    "REL": "assigned",
    "PCNF": "inProgress",
    "CNF": "completed"
  }

  hideList = true;

  @ViewChild('select1') selectRef: IonSelect;

  constructor(
    private _maintenanceSvc: MaintenanceService
  ) { }

  ngOnInit() {
    this.testData = data.data;
    this.getWorkOrders();
  }

  getWorkOrders() {
    this._maintenanceSvc.getAllWorkOrders().subscribe((resp) => {
      if (resp && resp.length > 0) {
        resp.forEach((workOrder) => {
            let status = this.statusMap[`${workOrder.WorkOrderOperationSet.results['0'].STATUS}`];
            console.log("Status", status)
            console.log("workOrders", this.workOrders)
            this.workOrders[`${status}`].push({
              status: workOrder['WorkOrderOperationSet']['STATUS'],
              personDetails: workOrder['PARNR'],
              priorityNumber: workOrder['PRIOK'],
              priorityStatus: workOrder['PRIOKX'],
              colour: workOrder['COLOUR'],
              workOrderID: workOrder['AUFNR'],
              workOrderDesc: workOrder['AUFTEXT'],
              equipmentID: workOrder['ARBPL'],
              equipmentName: workOrder['KTEXT'],
            })
        })
      }
    });
    console.log(this.workOrders);
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

