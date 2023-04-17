import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
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
    private historyBottomSheet: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  closeBottomSheet() {
    this.bottomSheetRef.dismiss();
  }
  openHistoryBottomSheet() {
    this.closeBottomSheet();
    this.historyBottomSheet.open(HistoryBottomSheetComponent, {
      panelClass: `${
        this.data.moduleType === 'operator-rounds'
          ? 'preview-history-menu-operator-rounds'
          : 'preview-history-menu'
      }`,
      hasBackdrop: true,
      backdropClass: `${
        this.data.moduleType === 'operator-rounds'
          ? 'preview-backdrop-operator-rounds'
          : 'preview-backdrop'
      }`
    });
  }
}
