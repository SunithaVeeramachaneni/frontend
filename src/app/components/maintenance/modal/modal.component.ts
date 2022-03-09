import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, toArray } from 'rxjs/operators';
import {
  WarehouseTechnician,
  WarehouseTechnicians
} from '../../../interfaces/warehouse_technicians';
import { WorkCenter } from '../../../interfaces/work-center';

import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlantTechnician } from 'src/app/interfaces/plant_technician';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  private workOrderID;
  private defaultWorkCenter;
  private priorityNumber;
  private priorityText;
  public saveDisabled = true;

  public workCenter: string;
  public workCenterList: any[];

  public assignee: string = '';
  public assigneeList: any;
  public displayedAssigneeList: PlantTechnician[];

  public base64Code;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sanitizer: DomSanitizer
  ) {}

  // constructor(
  //   // private modalCtrl: ModalController, private navParams: NavParams,
  //   private sanitizer:DomSanitizer,) {
  //  }

  ngOnInit() {
    this.assigneeList = this.data.techniciansList;
    this.workCenterList = this.data.workCenterList;
    this.defaultWorkCenter = this.data.defaultWorkCenter;
    this.workOrderID = this.data.workOrderID;
    this.priorityNumber = this.data.priorityNumber;
    this.priorityText = this.data.priorityText;
    this.workCenter = this.defaultWorkCenter;
  }

  onCenterChange = ($event) => {
    let newValue = $event.value;
    this.displayedAssigneeList = this.assigneeList[newValue.workCenterKey];
    let base64Image =
      'data:image/jpeg;base64,' + this.displayedAssigneeList[0].image;
    this.base64Code =
      this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  onAssigneeChange = ($event) => {
    this.saveDisabled = false;
  };

  getImageSrc = (source: string) => {
    let base64Image = 'data:image/jpeg;base64,' + source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  dismiss() {
    this.dialogRef.close();
  }

  onSave() {
    let resp = {
      assignee: this.assignee,
      workCenter: this.workCenter,
      workOrderID: this.workOrderID,
      priorityStatus: this.priorityText,
      priorityNumber: this.priorityNumber
    };
    this.dialogRef.close(resp);
  }
}
