import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hierarchy-delete-dialog',
  templateUrl: './hierarchy-delete-dialog.component.html',
  styleUrls: ['./hierarchy-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyDeleteConfirmationDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<HierarchyDeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {}

  confirmDelete() {
    this.dialogRef.close(true);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
