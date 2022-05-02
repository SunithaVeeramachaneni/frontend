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
    this.selectedTab = 'peoples';
  }

  handleTextMessaging(targetUser: any) {
    console.log('text messaging initiated', targetUser);
    this.selectedTab = 'chats';
    this.selectedUser = targetUser;
    this.callType = 'audio';
  }
  handleAudioMessaging(targetUser: any) {
    console.log('audio messaging initiated', targetUser);
    this.selectedTab = 'calls';
    this.selectedUser = targetUser;
    this.callType = 'video';
  }
  handleVideoMessaging(targetUser: any) {
    console.log('video messaging initiated', targetUser);
    this.selectedTab = 'calls';
    this.selectedUser = targetUser;
  }

  onValChange(val: string) {
    this.selectedTab = val;
    console.log(`selected tab: ${this.selectedTab}`);
  }
  closeCollabDialog(): void {
    this.dialogRef.close();
  }
}
