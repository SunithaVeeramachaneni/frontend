/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shift-date-change-warning-modal',
  templateUrl: './shift-date-change-warning-modal.component.html',
  styleUrls: ['./shift-date-change-warning-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftDateChangeWarningModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ShiftDateChangeWarningModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type }
  ) {}

  ngOnInit(): void {}
  onClick(data) {
    data ? this.dialogRef.close(true) : this.dialogRef.close(false);
  }
  onSubmit() {
    this.dialogRef.close(true);
  }
}
