import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-shift-change-warning-modal',
  templateUrl: './shift-change-warning-modal.component.html',
  styleUrls: ['./shift-change-warning-modal.component.scss']
})
export class ShiftChangeWarningModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ShiftChangeWarningModalComponent>,
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
