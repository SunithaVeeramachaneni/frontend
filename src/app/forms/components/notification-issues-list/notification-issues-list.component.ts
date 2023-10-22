import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/components/user-management/services/users.service';

@Component({
  selector: 'app-notification-issues-list',
  templateUrl: './notification-issues-list.component.html',
  styleUrls: ['./notification-issues-list.component.scss']
})
export class NotificationIssuesListComponent implements OnInit {
  users$: Observable<any>;
  moduleName = this.data.moduleName;
  isNotificationAlert = true;
  entityId = this.data.entityId;
  entityType = this.data.entityType;
  entityName = this.data?.locationAsset;
  fromNotificationsList = true;
  constructor(
    public usersService: UsersService,
    public dialogRef: MatDialogRef<NotificationIssuesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.users$ = this.usersService.getUsersInfo$();
  }

  dialogRefClose() {
    this.dialogRef.close({ event: 'close' });
  }
}
