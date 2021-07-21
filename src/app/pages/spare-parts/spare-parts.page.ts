import { Component, ViewChild} from '@angular/core';

import { IonSelect } from '@ionic/angular';
import * as data from './spare-parts.json';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.page.html',
  styleUrls: ['./spare-parts.page.css'],
})
export class SparePartsComponent{

  public testData: any[] = [];

  public testData1 = [];

  public selectedUser = '';
  headerTitle = "Spare Parts Control Center";
  public dateIcon = "../../../assets/spare-parts-icons/date.svg";
  public partsIcon = "../../../assets/spare-parts-icons/parts.svg";
  public priorityIcon = "../../../assets/spare-parts-icons/priority.svg";
  public assignIcon = "../../../assets/spare-parts-icons/assign.svg";
  public filterIcon = "../../../assets/spare-parts-icons/filter.svg";
  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  hideList = true;

  @ViewChild('select1') selectRef: IonSelect ;

  constructor() {}

  ngOnInit() {
    this.testData = data.data;
  }


openSelect(){
  this.selectRef.open()
}

optionsFn(event, index) {
  console.log(event.target.value)
  console.log(index)
  this.selectedUser= event.target.value;
  if(event.target.value) {
    this.testData1.push(this.testData.splice(index, 1));
    console.log(this.testData);
    console.log(this.testData1);
  }
}


}

