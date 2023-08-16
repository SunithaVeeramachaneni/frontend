import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlantTechnician } from 'src/app/interfaces/plant_technician';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public saveDisabled = true;
  public workCenter: string;
  public plant: string;
  public workCenterList: any[];
  public assignee = '';
  public assigneeList: any;
  public displayedAssigneeList: PlantTechnician[];
  public base64Code;
  private workOrderID;
  private defaultWorkCenter;
  private priorityNumber;
  private priorityText;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.assigneeList = this.data.techniciansList;
    this.plant = this.data.plant;
    this.workCenterList = this.data.workCenterList.find(
      (item) => item.plantId === this.plant
    ).workCenters;
    this.defaultWorkCenter = this.data.defaultWorkCenter;
    this.workOrderID = this.data.workOrderID;
    this.priorityNumber = this.data.priorityNumber;
    this.priorityText = this.data.priorityText;
    this.workCenter = this.defaultWorkCenter;
  }

  onCenterChange = ($event) => {
    const newValue = $event.value;
    this.displayedAssigneeList = this.assigneeList[newValue.workCenterKey];
    const base64Image =
      'data:image/jpeg;base64,' + this.displayedAssigneeList[0].image;
    this.base64Code =
      this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  onAssigneeChange = ($event) => {
    this.saveDisabled = false;
  };

  getImageSrc = (source: string) => {
    const base64Image = 'data:image/jpeg;base64,' + source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  dismiss() {
    this.dialogRef.close();
  }

  onSave() {
    const resp = {
      assignee: this.assignee,
      workCenter: this.workCenter,
      workOrderID: this.workOrderID,
      priorityStatus: this.priorityText,
      priorityNumber: this.priorityNumber
    };
    this.dialogRef.close(resp);
  }
}
