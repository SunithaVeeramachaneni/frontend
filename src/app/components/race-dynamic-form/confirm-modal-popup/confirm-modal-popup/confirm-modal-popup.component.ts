import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal-popup',
  templateUrl: './confirm-modal-popup.component.html',
  styleUrls: ['./confirm-modal-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalPopupComponent implements OnInit {
  @Output() outputAction = new EventEmitter<string>();
  constructor(
    private dialogRef: MatDialogRef<ConfirmModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data // data.popupTexts:{title:string,subtitle:string,positiveBtnText:string,negativeBtnText:string}
  ) {}

  ngOnInit(): void {}

  onPositiveAction() {
    this.dialogRef.close('primary');
  }
  onNegativeAction() {
    this.dialogRef.close('secondary');
  }
}
