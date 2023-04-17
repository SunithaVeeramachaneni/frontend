import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-history-bottom-sheet',
  templateUrl: './history-bottom-sheet.component.html',
  styleUrls: ['./history-bottom-sheet.component.scss']
})
export class HistoryBottomSheetComponent {
  constructor(
    private historyBottomSheetRef: MatBottomSheetRef<HistoryBottomSheetComponent>
  ) {}
  openLink(event: MouseEvent): void {
    this.historyBottomSheetRef.dismiss();
    event.preventDefault();
  }
  closeHistoryBottomSheet() {
    this.historyBottomSheetRef.dismiss();
  }
}
