/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDialog implements OnInit {
  constructor(private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {}

  confirm() {
    this.dialogRef.close();
  }
}
