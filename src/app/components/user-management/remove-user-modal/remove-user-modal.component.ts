import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-user-modal',
  templateUrl: './remove-user-modal.component.html',
  styleUrls: ['./remove-user-modal.component.scss']
})
export class RemoveUserModalComponent implements OnInit {
  constructor(
    private removeUserModalRef: MatDialogRef<RemoveUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) private removeUserData
  ) {}

  ngOnInit(): void {}
  deleteUser = (data) => {
    this.removeUserModalRef.close(data);
  };
}
