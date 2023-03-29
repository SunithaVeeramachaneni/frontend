import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-success-modal',
  templateUrl: './schedule-success-modal.component.html',
  styleUrls: ['./schedule-success-modal.component.scss']
})
export class ScheduleSuccessModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ScheduleSuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      isFormModule: boolean;
      mode: 'create' | 'update';
    }
  ) {}

  ngOnInit(): void {}

  goToList() {
    this.dialogRef.close({ redirect: true });
  }

  close() {
    this.dialogRef.close({ redirect: false });
  }
}
