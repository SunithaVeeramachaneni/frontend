import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  constructor(public alertDialogRef: MatDialogRef<AlertModalComponent>) {}

  ngOnInit(): void {}

  close() {
    this.alertDialogRef.close(false);
  }

  yes() {
    this.alertDialogRef.close(true);
  }
}
