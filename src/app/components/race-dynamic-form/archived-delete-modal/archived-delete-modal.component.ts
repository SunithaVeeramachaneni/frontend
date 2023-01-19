import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-archived-delete-modal',
  templateUrl: './archived-delete-modal.component.html',
  styleUrls: ['./archived-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedDeleteModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ArchivedDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public formData
  ) {}

  ngOnInit(): void {}

  deleteForm(data) {
    this.dialogRef.close(data);
  }
}
