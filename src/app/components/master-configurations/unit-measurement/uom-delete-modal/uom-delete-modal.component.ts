import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-uom-delete-modal',
  templateUrl: './uom-delete-modal.component.html',
  styleUrls: ['./uom-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitOfMeasurementDeleteModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<UnitOfMeasurementDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public formData
  ) {}

  ngOnInit(): void {}

  deleteForm(data) {
    this.dialogRef.close(data);
  }
}
