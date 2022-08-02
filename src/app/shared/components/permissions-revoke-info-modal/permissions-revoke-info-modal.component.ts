import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-permissions-revoke-info-modal',
  templateUrl: './permissions-revoke-info-modal.component.html',
  styleUrls: ['./permissions-revoke-info-modal.component.scss']
})
export class PermissionsRevokeInfoModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PermissionsRevokeInfoModalComponent>
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
