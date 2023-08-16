import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-group-delete-modal',
  templateUrl: './user-group-delete-modal.component.html',
  styleUrls: ['./user-group-delete-modal.component.scss']
})
export class UserGroupDeleteModalComponent implements OnInit {
  userGroupName: string;
  constructor(
    private userGroupDeleteModalRef: MatDialogRef<UserGroupDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public userGroupdata
  ) {}

  ngOnInit(): void {
    this.userGroupName = this.userGroupdata.userGroupData.name;
  }
  deleteUserGroup = (data) => {
    this.userGroupDeleteModalRef.close(data);
  };
}
