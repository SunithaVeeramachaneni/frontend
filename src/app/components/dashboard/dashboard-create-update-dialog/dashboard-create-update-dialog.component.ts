import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Dashboard } from 'src/app/interfaces';

export interface DashboardCreateUpdateDialogData {
  dialogMode: string;
  data: Dashboard;
}

@Component({
  selector: 'app-create-dashboard-dialog',
  templateUrl: 'dashboard-create-update-dialog.html',
  styleUrls: ['./dashboard-create-update-dialog.scss']
})
export class CreateUpdateDashboardDialogComponent implements OnInit {
  name: string;
  isDefault: boolean | false;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateDashboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DashboardCreateUpdateDialogData
  ) {}

  ngOnInit(): void {
    if (this.dialogData.dialogMode === 'EDIT') {
      this.name = this.dialogData.data.name;
      this.isDefault = this.dialogData.data.isDefault;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  createDashboard(event: any) {
    event.stopPropagation();
    this.dialogRef.close({ name: this.name, isDefault: this.isDefault });
  }
}
