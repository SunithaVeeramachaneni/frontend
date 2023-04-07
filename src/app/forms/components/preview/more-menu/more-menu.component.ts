import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { HistoryBottomSheetComponent } from '../history-bottom-sheet/history-bottom-sheet.component';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.component.html',
  styleUrls: ['./more-menu.component.scss']
})
export class MoreMenuComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<MoreMenuComponent>,
    private historyBottomSheet: MatBottomSheet
  ) {}
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  closeBottomSheet() {
    this.bottomSheetRef.dismiss();
  }
  openHistoryBottomSheet() {
    this.historyBottomSheet.open(HistoryBottomSheetComponent, {
      panelClass: 'preview-menu'
    });
  }
}
