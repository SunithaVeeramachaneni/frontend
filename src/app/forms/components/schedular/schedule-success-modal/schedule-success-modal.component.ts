import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';

@Component({
  selector: 'app-schedule-success-modal',
  templateUrl: './schedule-success-modal.component.html',
  styleUrls: ['./schedule-success-modal.component.scss']
})
export class ScheduleSuccessModalComponent implements OnInit {
  scheduleLoading$: Observable<boolean>;
  constructor(
    private dialogRef: MatDialogRef<ScheduleSuccessModalComponent>,
    private operatorRoundService: OperatorRoundsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      isFormModule: boolean;
      mode: 'create' | 'update';
    }
  ) {}

  ngOnInit(): void {
    this.scheduleLoading$ = this.operatorRoundService.scheduleLoader$;
  }

  goToList() {
    this.dialogRef.close({
      redirect: true,
      mode: this.data.mode
    });
  }

  close() {
    this.dialogRef.close({
      redirect: false,
      mode: this.data.mode
    });
  }
}
