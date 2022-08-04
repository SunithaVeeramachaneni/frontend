import { Component, ElementRef, Inject, OnInit } from '@angular/core';

import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface DialogData {
  name: string;
  animal: string;
}

@Component({
  selector: 'app-collab-dialog',
  templateUrl: 'collab-dialog.html',
  styleUrls: ['./collab-dialog.scss']
})
export class CollabDialogComponent implements OnInit {
  public selectedTab: string;
  public selectedUser: any;
  public callType: string;

  isMaximized: boolean;
  hideButtonGroup = false;

  private positionRelativeToElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CollabDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public options: { positionRelativeToElement: ElementRef }
  ) {
    this.positionRelativeToElement = options.positionRelativeToElement;
  }

  ngOnInit() {
    const matDialogConfig = new MatDialogConfig();
    const rect: DOMRect =
      this.positionRelativeToElement.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { right: `180px`, top: `${rect.bottom + 2}px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
    this.selectedTab = 'chats';
    this.isMaximized = false;
  }
  handleViewChange(event) {
    if (event.hideButtonGroup && event.hideButtonGroup === true) {
      this.hideButtonGroup = true;
    } else {
      this.hideButtonGroup = false;
    }
  }

  handleTextMessaging(targetUser: any) {
    this.selectedTab = 'chats';
    this.selectedUser = targetUser;
    this.callType = 'audio';
  }
  handleAudioMessaging(targetUser: any) {
    this.selectedTab = 'calls';
    this.selectedUser = targetUser;
    this.callType = 'video';
  }
  handleVideoMessaging(targetUser: any) {
    this.selectedTab = 'calls';
    this.selectedUser = targetUser;
  }

  onValChange(val: string) {
    this.selectedTab = val;
  }
  closeCollabDialog(): void {
    this.dialogRef.close();
  }
  maximizeCollabDialog(): void {
    this.isMaximized = true;
    this.dialogRef.updateSize('100vw', '100vh');
    this.dialogRef.removePanelClass('overlay-min');
    this.dialogRef.addPanelClass('overlay-max');
  }
  minimizeCollabDialog(): void {
    this.isMaximized = false;
    this.dialogRef.updateSize('750px', 'auto');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.addPanelClass('overlay-min');
  }
}
