import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-user-modal',
  templateUrl: './remove-user-modal.component.html',
  styleUrls: ['./remove-user-modal.component.scss']
})
export class RemoveUserModalComponent implements OnInit {
  selectedUserGroupType: string;
  constructor(
    private removeUserModalRef: MatDialogRef<RemoveUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) private removeUserData
  ) {}

  ngOnInit(): void {
    this.selectedUserGroupType = this.removeUserData.userGroupType;
  }
  deleteUser = (data) => {
    this.removeUserModalRef.close({ response: data });
  };
}
