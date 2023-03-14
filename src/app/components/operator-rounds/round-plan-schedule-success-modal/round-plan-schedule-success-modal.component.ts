import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoundPlanSuccessModalData } from 'src/app/interfaces';

@Component({
  selector: 'app-round-plan-schedule-success-modal',
  templateUrl: './round-plan-schedule-success-modal.component.html',
  styleUrls: ['./round-plan-schedule-success-modal.component.scss']
})
export class RoundPlanScheduleSuccessModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<RoundPlanScheduleSuccessModalComponent>,
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
