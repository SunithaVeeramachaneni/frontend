import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styleUrls: ['./cancel-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<CancelModalComponent>) {}

  ngOnInit(): void {}

  cancelRole = (data) => {
    this.dialogRef.close(data);
  };
}
