import { Component, ViewChild} from '@angular/core';

import { IonSelect } from '@ionic/angular';
import * as data from './maintenance.json';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css'],
})
export class MaintenanceComponent{

  public testData: any[] = [];

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

  hideList = true;

  showFilters = false;
  @ViewChild('select1') selectRef: IonSelect;

  constructor() {}

  ngOnInit() {
    this.testData = data.data;
  }

  showOverdue: string = 'Yes';
  showOverdueList: string[] = ['Yes', 'No'];

  priority: string[] = ['High','Medium'];
  priorityList: string[] = ['High', 'Medium','Low'];

  kitStatus: string[] = ['Kit Ready','Parts Available'];
  kitStatusList: string[] = ['Kit Ready', 'Parts Available','Waiting On Parts'];

  workCenter: string[] = ['Mechanical'];
  workCenterList: string[] = ['Mechanical', 'Medium','Low'];

  assign: string[] = ['Kerry Smith'];
  assignList: string[] = ['Kerry Smith', 'Amy Butcher','Carlos Arnal', 'Steve Austin'];




  public openSelect(){
    this.selectRef.open()
  }

  public myFunction() {
    this.showFilters = !this.showFilters;
  }

  public optionsFn(event, index) {
      console.log(event.target.value)
      console.log(index)
      if(event.target.value) {
        this.selectedUser= event.target.value;
        this.testData1.push(this.testData.splice(index, 1));
        console.log(this.testData);
        console.log(this.testData1);
      }
    }


}

