import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<AlertModalComponent>) {}

  ngOnInit(): void {}

  cancelRole = (data) => {
    this.dialogRef.close(data);
  };
}
