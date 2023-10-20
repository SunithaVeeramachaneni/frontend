import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { NotificationIssuesListComponent } from '../notification-issues-list/notification-issues-list.component';
@Component({
  selector: 'app-notification-alert-dialog',
  templateUrl: './notification-alert-dialog.component.html',
  styleUrls: ['./notification-alert-dialog.component.scss']
})
export class NotificationAlertDialogComponent implements OnInit {
  notificationCount = this.data?.notificationsCount;
  moduleName = this.data.moduleName;

  constructor(
    public dialogRef: MatDialogRef<NotificationAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  dialogClose(): void {
    this.dialogRef.close();
  }
  createNotification() {
    this.dialogRef.close({ createNotification: true });
  }
  viewIssuesList() {
    const issuesListDialogRef = this.matDialog.open(
      NotificationIssuesListComponent,
      {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        data: {
          moduleName: this.moduleName,
          entityId: this.data?.entityId,
          entityType: this.data?.entityType,
          locationAsset: this.data?.locationAsset
        }
      }
    );
    issuesListDialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'close') {
        this.dialogRef.close();
      }
    });
  }
}