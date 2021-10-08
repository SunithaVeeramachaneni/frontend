import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { flatMap, toArray } from 'rxjs/operators';
import { Technician, Technicians } from '../../../interfaces/technicians';
import { WorkCenter } from '../../../interfaces/work-center';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {


   private workOrderID;
   private defaultWorkCenter;
   public saveDisabled= true;

   public workCenter: string;
   public workCenterList: string[];

   public assignee: string = '';
   public assigneeList: any;
   public displayedAssigneeList: Observable<Technician>;

   public base64Code;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, 
    private sanitizer:DomSanitizer,) {
   }

  ngOnInit() {
    // console.log("Modal opened!");
    this.assigneeList = this.navParams.get('techniciansList')
    this.workCenterList = this.navParams.get('workCenterList')
    this.defaultWorkCenter = this.navParams.get('defaultWorkCenter');
    this.workOrderID = this.navParams.get('workOrderID');
    this.workCenter = this.defaultWorkCenter;

    // console.log("Technicians list is", this.assigneeList);
    // console.log("Work center list is", this.workCenterList);
  }

  onCenterChange = ($event) => {
    let newValue = $event.value;
    console.log("New vlaue", newValue.workCenterKey);
    console.log("The assignee list is", this.assigneeList);
    this.displayedAssigneeList = this.assigneeList[newValue.workCenterKey];
    console.log("Is this an observable even")
    console.log("The displayed assignee list is," ,this.displayedAssigneeList)
    let base64Image='data:image/jpeg;base64,'+ this.displayedAssigneeList[0].image;
    console.log(base64Image);
    this.base64Code = this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    console.log(this.base64Code);
    console.log("now", this.workCenter);
  }

  onAssigneeChange = ($event) =>{
    this.saveDisabled = false;
  }

  getImageSrc = (source: string) => {
    let base64Image='data:image/jpeg;base64,'+ source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

dismiss() {
    this.modalCtrl.dismiss(null);
  }

  onSave(){
    let resp = {
      assignee: this.assignee,
      workCenter: this.workCenter,
      workOrderID: this.workOrderID
    }
    console.log(resp)
    this.modalCtrl.dismiss(resp);
  }
}