import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDetails } from 'src/app/interfaces';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDeleteModalComponent implements OnInit {
  firstName;
  lastName;
  multiple;
  selctedUsersList;

  constructor(
    private dialogRef: MatDialogRef<UserDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: UserDetails; multiDeactivate }
  ) {}

  ngOnInit() {
    if (this.data.multiDeactivate) {
      this.multiple = true;
      this.selctedUsersList = this.data.multiDeactivate.selctedUsers;
    }
    if (this.data.user) {
      const { firstName, lastName } = this.data.user;
      this.firstName = firstName;
      this.lastName = lastName;
    }
  }

  deleteUser() {
    this.dialogRef.close(true);
  }
}
