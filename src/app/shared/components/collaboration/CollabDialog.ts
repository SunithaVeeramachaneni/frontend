import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ChatService } from './chats/chat.service';

export interface DialogData {
  name: string;
  animal: string;
}

@Component({
  selector: 'app-collab-dialog',
  templateUrl: 'collab-dialog.html',
  styleUrls: ['./collab-dialog.scss']
})
export class CollabDialogComponent implements OnInit, OnDestroy {
  public selectedTab: string;
  public selectedUser: any;
  public callType: string;

  isMaximized: boolean;
  hideButtonGroup = false;
  dialogCollapsed = false;

  private positionRelativeToElement: ElementRef;

  private collaborationWindowActionSubscription: Subscription;

  constructor(
    private chatService: ChatService,
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
    matDialogConfig.position = { right: `100px`, top: `${rect.bottom + 2}px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
    this.selectedTab = 'chats';
    this.isMaximized = false;

    this.collaborationWindowActionSubscription =
      this.chatService.collabWindowCollapseExpandAction$.subscribe((event) => {
        const collaborationWindowStatus =
          this.chatService.getCollaborationWindowStatus();
        if (event.expand && collaborationWindowStatus.isOpen) {
          this.minimizeCollabDialog();
        }
      });
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

  setSelectedTab(val: string) {
    this.selectedTab = val;
  }
  closeCollabDialog(): void {
    this.dialogRef.close();
  }
  collapseCollabDialog(): void {
    this.isMaximized = false;
    this.dialogCollapsed = true;
    this.dialogRef.updateSize('200px', '100px');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('overlay-min');
    const avConfWindowStatus = this.chatService.getAVConfWindowStatus();
    const isAVConfWindowCollapsed = avConfWindowStatus.isCollapsed;
    if (isAVConfWindowCollapsed) {
      this.dialogRef.addPanelClass('bottomRightAVConfCollapsed');
    } else {
      this.dialogRef.addPanelClass('bottomRight');
    }
    this.chatService.collaborationWindowAction({
      isOpen: true,
      isCollapsed: true
    });
  }
  maximizeCollabDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = true;
    this.dialogRef.updateSize('100vw', '100vh');
    this.dialogRef.removePanelClass('overlay-min');
    this.dialogRef.removePanelClass('bottomRight');
    this.dialogRef.removePanelClass('bottomRightAVConfCollapsed');
    this.dialogRef.addPanelClass('overlay-max');
    this.chatService.collaborationWindowAction({
      isOpen: true,
      isCollapsed: false
    });
  }
  minimizeCollabDialog(): void {
    this.dialogCollapsed = false;
    this.isMaximized = false;
    this.dialogRef.updateSize('750px', 'auto');
    this.dialogRef.removePanelClass('overlay-max');
    this.dialogRef.removePanelClass('bottomRight');
    this.dialogRef.removePanelClass('bottomRightAVConfCollapsed');
    this.dialogRef.addPanelClass('overlay-min');
    this.chatService.collaborationWindowAction({
      isOpen: true,
      isCollapsed: false
    });
  }

  ngOnDestroy(): void {
    if (this.collaborationWindowActionSubscription) {
      this.collaborationWindowActionSubscription.unsubscribe();
    }
  }
}
