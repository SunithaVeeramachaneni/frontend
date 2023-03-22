import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoundPlanSuccessModalData } from 'src/app/interfaces';

@Component({
  selector: 'app-forms-plan-schedule-success-modal',
  templateUrl: './forms-schedule-success-modal.component.html',
  styleUrls: ['./forms-schedule-success-modal.component.scss']
})
export class FormsScheduleSuccessModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<FormsScheduleSuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: RoundPlanSuccessModalData
  ) {}

  ngOnInit(): void {}

  viewRounds() {
    this.dialogRef.close({ redirectToRounds: true });
  }

  close() {
    this.dialogRef.close({ redirectToRounds: false });
  }
}
